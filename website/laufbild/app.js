"use strict";
(function () {
  const CFG = window.LB_CONFIG, R = window.LB_ROUTE, M = window.LB_MOTIVE;
  const $ = (id) => document.getElementById(id);
  const status = (t, fehler) => { $("status").textContent = t || ""; $("status").classList.toggle("fehler", !!fehler); };

  // ---------- Karte ----------
  const karte = L.map("karte", { zoomControl: true }).setView([51.16, 10.45], 6);
  L.tileLayer(CFG.KACHELN, { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(karte);
  let mitte = null, mitteMarker = null, formLayer = null, routeLayer = null, letzte = null;
  let motiv = "herz", gezeichnet = null, variante = 0;

  function setzeMitte(lat, lon, zoom) {
    mitte = [lat, lon];
    if (!mitteMarker) mitteMarker = L.circleMarker(mitte, { radius: 7, color: "#fc4c02", weight: 3, fillOpacity: 0.9 }).addTo(karte);
    else mitteMarker.setLatLng(mitte);
    if (zoom) karte.setView(mitte, zoom);
    variante = 0;
  }
  karte.on("click", (e) => { if (motiv !== "zeichnen") setzeMitte(e.latlng.lat, e.latlng.lng); });

  $("suche").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const q = $("ort").value.trim(); if (!q) return;
    status("Suche …");
    try {
      const r = await fetch(`${CFG.NOMINATIM}?format=json&limit=1&countrycodes=de,at,ch&q=${encodeURIComponent(q)}`, { headers: { "Accept-Language": "de" } });
      const d = await r.json();
      if (!d.length) return status("Ort nicht gefunden.", true);
      setzeMitte(+d[0].lat, +d[0].lon, 14); status("");
    } catch (e) { status("Suche gerade nicht erreichbar. Tipp stattdessen auf die Karte.", true); }
  });
  $("standort").onclick = () => {
    if (!navigator.geolocation) return status("Dein Browser kann keinen Standort liefern.", true);
    status("Standort wird ermittelt …");
    navigator.geolocation.getCurrentPosition((p) => { setzeMitte(p.coords.latitude, p.coords.longitude, 14); status(""); },
      () => status("Standort nicht freigegeben. Tipp einfach auf die Karte.", true), { enableHighAccuracy: true, timeout: 10000 });
  };

  // ---------- Motive ----------
  function formNorm() {
    if (motiv === "text") {
      const t = $("text").value.trim(); if (!t) return null;
      return R.normieren(M.text(t));
    }
    if (motiv === "zeichnen") return gezeichnet ? R.normieren(gezeichnet.punkte) : null;
    return R.normieren(M.MOTIVE[motiv].punkte);
  }
  function detailGroesse() {
    if (motiv === "text") { const n = Math.max(1, $("text").value.trim().length); return 0.5 / Math.max(1, n * 0.8); }
    return motiv === "zeichnen" ? 0.2 : 0.25;
  }
  function empfehlung() {
    const f = formNorm(); if (!f) { $("empfehlung").textContent = ""; return; }
    const km = Math.ceil(R.mindestLaenge(f, detailGroesse()) / 1000);
    const akt = +$("km").value;
    $("empfehlung").textContent = akt < km ? `Für ein gut erkennbares Bild empfehlen wir mindestens ${km} km.` : `Gute Wahl, ab ${km} km ist das Motiv gut erkennbar.`;
    $("empfehlung").classList.toggle("warn", akt < km);
  }
  $("motive").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-m]"); if (!b) return;
    motiv = b.dataset.m;
    document.querySelectorAll("#motive button").forEach((x) => x.classList.toggle("an", x === b));
    $("text").hidden = motiv !== "text"; $("zeichenhilfe").hidden = motiv !== "zeichnen";
    if (motiv === "text") $("text").focus();
    zeichenModus(motiv === "zeichnen");
    variante = 0; empfehlung();
  });
  $("text").addEventListener("input", () => {
    const sauber = $("text").value.split("").filter((c) => M.erlaubt(c)).join("");
    if (sauber !== $("text").value) $("text").value = sauber;
    empfehlung();
  });
  $("km").addEventListener("input", () => { $("kmWert").textContent = $("km").value + " km"; empfehlung(); });

  // ---------- Selbst zeichnen ----------
  let zeichnet = false, zugLinie = null, zug = [];
  function zeichenModus(an) {
    const el = karte.getContainer();
    if (an) { karte.dragging.disable(); el.classList.add("zeichnen"); } else { karte.dragging.enable(); el.classList.remove("zeichnen"); }
  }
  const kc = karte.getContainer();
  kc.addEventListener("pointerdown", (e) => {
    if (motiv !== "zeichnen" || e.target.closest(".leaflet-control")) return;
    zeichnet = true; zug = []; kc.setPointerCapture(e.pointerId);
    if (zugLinie) zugLinie.remove();
    zugLinie = L.polyline([], { color: "#2563eb", weight: 4, dashArray: "6 6" }).addTo(karte);
  });
  kc.addEventListener("pointermove", (e) => {
    if (!zeichnet) return;
    const ll = karte.mouseEventToLatLng(e); zug.push([ll.lat, ll.lng]); zugLinie.addLatLng(ll);
  });
  kc.addEventListener("pointerup", () => {
    if (!zeichnet) return; zeichnet = false;
    if (zug.length < 5) return;
    const la = zug.reduce((s, p) => s + p[0], 0) / zug.length, lo = zug.reduce((s, p) => s + p[1], 0) / zug.length;
    const pr = R.projektion(la, lo);
    const pts = zug.map(([a, b]) => pr.hin(a, b));
    // vereinfachen: Punkte mit < 2 % der Größe Abstand weglassen
    const groesse = Math.max(...pts.map((p) => Math.abs(p[0])), ...pts.map((p) => Math.abs(p[1])));
    const einfach = [pts[0]]; for (const p of pts) { const q = einfach[einfach.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) > groesse * 0.02) einfach.push(p); }
    gezeichnet = { punkte: einfach, laenge: R.laenge(einfach) };
    setzeMitte(la, lo);
    $("km").value = Math.max(3, Math.min(80, Math.round(gezeichnet.laenge * 1.1 / 1000))); $("kmWert").textContent = $("km").value + " km";
    empfehlung();
  });

  // ---------- Straßendaten ----------
  const cache = new Map();
  async function strassen(bbox, sport) {
    const key = bbox.map((x) => x.toFixed(3)).join(",") + sport;
    if (cache.has(key)) return cache.get(key);
    const q = R.overpassAbfrage(...bbox, sport);
    let letzterFehler;
    for (const url of CFG.OVERPASS) {
      try {
        const r = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const d = await r.json(); cache.set(key, d); return d;
      } catch (e) { letzterFehler = e; }
    }
    throw letzterFehler;
  }
  const pause = () => new Promise((r) => setTimeout(r, 30));

  async function erstellen() {
    if (!mitte) return status("Bitte zuerst einen Ort wählen (Suche, Standort oder auf die Karte tippen).", true);
    const f = formNorm();
    if (!f) return status(motiv === "text" ? "Bitte einen Text eingeben." : "Bitte zuerst eine Form auf die Karte zeichnen.", true);
    const sport = document.querySelector("input[name=sport]:checked").value;
    const ziel = +$("km").value * 1000;
    const skala = ziel / (R.laenge(f) * 1.12);
    const halb = Math.min(7000, skala * 0.9 + 400);
    const pr = R.projektion(mitte[0], mitte[1]);
    const [s, w] = pr.zurueck(-halb, -halb), [n, e] = pr.zurueck(halb, halb);
    $("los").disabled = true;
    try {
      status("Lade Straßen und Wege …"); await pause();
      const json = await strassen([s, w, n, e], sport);
      status("Suche die beste Route …"); await pause();
      const g = R.graph(json, pr);
      if (g.anzahl < 50) throw new Error("zu wenige Wege");
      // Varianten: leicht verschobene Mitte für „Andere Variante“
      const ver = variante === 0 ? [0, 0] : [Math.cos(variante * 2.4) * skala * 0.3, Math.sin(variante * 2.4) * skala * 0.3];
      const erg = R.erstelle(g, f, { zielLaenge: ziel, mitte: ver, drehen: motiv !== "text", istText: motiv === "text" });
      letzte = { ...erg, sport, name: titel() };
      zeigen(erg);
      status(erg.aehnlichkeit < 60 ? "Hier passt das Motiv nicht so gut ins Straßennetz. Probier mehr Kilometer, eine andere Variante oder einen anderen Ort." : "");
    } catch (e) {
      status("Straßendaten konnten nicht geladen werden. Bitte gleich nochmal versuchen. (" + (e.message || e) + ")", true);
    } finally { $("los").disabled = false; }
  }
  function titel() {
    return motiv === "text" ? $("text").value.trim().toUpperCase() : motiv === "zeichnen" ? "Mein Laufbild" : M.MOTIVE[motiv].name;
  }

  function zeigen(erg) {
    if (formLayer) formLayer.remove(); if (routeLayer) routeLayer.remove();
    const pr = R.projektion(mitte[0], mitte[1]);
    formLayer = L.polyline(erg.form.map(([x, y]) => pr.zurueck(x, y)), { color: "#2563eb", weight: 3, opacity: 0.5, dashArray: "6 8" }).addTo(karte);
    routeLayer = L.polyline(erg.latlon, { color: "#fc4c02", weight: 5, opacity: 0.95, lineJoin: "round" }).addTo(karte);
    karte.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });
    $("eKm").textContent = (erg.laenge / 1000).toFixed(1).replace(".", ",");
    $("eAehn").textContent = erg.aehnlichkeit + " %";
    $("gpx").textContent = CFG.ZAHLUNGS_LINK ? `GPX für Uhr & App – ${CFG.PREIS}` : "GPX für Uhr & App";
    $("ergebnis").hidden = false;
    if (window.matchMedia("(max-width: 800px)").matches) $("ergebnis").scrollIntoView({ behavior: "smooth" });
  }

  $("los").onclick = () => { variante = 0; erstellen(); };
  $("nochmal").onclick = () => { variante++; erstellen(); };

  // ---------- GPX & Bezahlung ----------
  function gpxHerunterladen(gpx, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([gpx], { type: "application/gpx+xml" }));
    a.download = "laufbild-" + name.toLowerCase().replace(/[^a-z0-9äöü]+/g, "-") + ".gpx";
    document.body.appendChild(a); a.click(); a.remove();
  }
  $("gpx").onclick = () => {
    if (!letzte) return;
    const gpx = R.gpx(letzte.latlon, "Laufbild: " + letzte.name);
    if (!CFG.ZAHLUNGS_LINK) return gpxHerunterladen(gpx, letzte.name);
    try { localStorage.setItem("laufbild-gpx", JSON.stringify({ gpx, name: letzte.name, zeit: Date.now() })); } catch (e) {}
    location.href = CFG.ZAHLUNGS_LINK;
  };
  if (/[?&]bezahlt=1/.test(location.search)) {
    try {
      const d = JSON.parse(localStorage.getItem("laufbild-gpx") || "null");
      if (d) { gpxHerunterladen(d.gpx, d.name); status("Danke! Deine GPX-Datei wurde heruntergeladen. Viel Spaß beim Laufen! 🧡"); }
    } catch (e) {}
  }

  // ---------- Teilbild ----------
  $("bild").onclick = () => {
    if (!letzte) return;
    const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d");
    x.fillStyle = "#111827"; x.fillRect(0, 0, c.width, c.height);
    const pts = letzte.punkte, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
    const s = Math.min(900 / (maxx - minx || 1), 900 / (maxy - miny || 1));
    const ox = (1080 - (maxx - minx) * s) / 2, oy = 220 + (900 - (maxy - miny) * s) / 2;
    x.lineJoin = "round"; x.lineCap = "round";
    for (const [b, a, col] of [[22, 0.25, "#fc4c02"], [9, 1, "#fc4c02"]]) {
      x.strokeStyle = col; x.globalAlpha = a; x.lineWidth = b; x.beginPath();
      pts.forEach(([px, py], i) => { const X = ox + (px - minx) * s, Y = oy + (maxy - py) * s; i ? x.lineTo(X, Y) : x.moveTo(X, Y); });
      x.stroke();
    }
    x.globalAlpha = 1; x.fillStyle = "#fff"; x.textAlign = "center";
    x.font = "800 72px Inter, system-ui, sans-serif"; x.fillText(letzte.name, 540, 140);
    x.font = "500 40px Inter, system-ui, sans-serif"; x.fillStyle = "#cbd5e1";
    x.fillText(`${(letzte.laenge / 1000).toFixed(1).replace(".", ",")} km ${letzte.sport === "rad" ? "Rad" : "Laufen"}`, 540, 1215);
    x.font = "700 34px Inter, system-ui, sans-serif"; x.fillStyle = "#fc4c02"; x.fillText("gemalt mit Laufbild", 540, 1285);
    c.toBlob(async (blob) => {
      const datei = new File([blob], "laufbild.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [datei] })) {
        try { await navigator.share({ files: [datei], title: "Mein Laufbild" }); return; } catch (e) {}
      }
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "laufbild.png"; a.click();
    }, "image/png");
  };

  empfehlung();
})();
