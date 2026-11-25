// Laufbild – Routen-Engine: legt eine Form (Linienzug) auf das echte Straßennetz.
// 1. Straßennetz aus OpenStreetMap (Overpass-JSON) → Graph in Metern (lokale Projektion)
// 2. Platzierung: Verschiebung/Drehung/Größe so wählen, dass die Form nahe an Wegen liegt
// 3. Routing: A* zwischen Stützpunkten der Form, Kosten = Länge · (1 + (Abstand zur Form / λ)²)
// 4. Bewertung: mittlere Abweichung zwischen Route und Form → „Ähnlichkeit“
"use strict";
(function (root) {
  const R = {};

  R.projektion = (lat0, lon0) => {
    const kx = Math.cos(lat0 * Math.PI / 180) * 111320, ky = 110540;
    return { hin: (lat, lon) => [(lon - lon0) * kx, (lat - lat0) * ky], zurueck: (x, y) => [lat0 + y / ky, lon0 + x / kx] };
  };

  R.overpassAbfrage = (s, w, n, e, sport) => {
    const typen = sport === "rad"
      ? "residential|living_street|unclassified|tertiary|tertiary_link|secondary|secondary_link|primary|primary_link|service|cycleway|track|road"
      : "residential|living_street|unclassified|tertiary|tertiary_link|secondary|secondary_link|primary|primary_link|service|pedestrian|footway|path|cycleway|track|road|steps";
    return `[out:json][timeout:60];(way["highway"~"^(${typen})$"]["access"!~"^(private|no)$"]["area"!="yes"](${s},${w},${n},${e}););out body;>;out skel qt;`;
  };

  // ---------- Graph ----------
  R.graph = (json, proj) => {
    const idx = new Map(), xs = [], ys = [], lat = [], lon = [];
    for (const el of json.elements) if (el.type === "node") {
      idx.set(el.id, xs.length); const [x, y] = proj.hin(el.lat, el.lon);
      xs.push(x); ys.push(y); lat.push(el.lat); lon.push(el.lon);
    }
    const adj = xs.map(() => []);
    for (const el of json.elements) if (el.type === "way" && el.nodes) {
      for (let i = 1; i < el.nodes.length; i++) {
        const a = idx.get(el.nodes[i - 1]), b = idx.get(el.nodes[i]);
        if (a === undefined || b === undefined || a === b) continue;
        const l = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
        adj[a].push(b, l); adj[b].push(a, l); // flach: [nachbar, länge, nachbar, länge, …]
      }
    }
    // nur die größte zusammenhängende Komponente behalten (sonst landet man auf abgeschnittenen Wegstücken)
    const komp = new Int32Array(xs.length).fill(-1); let beste = -1, besteGroesse = 0, k = 0;
    for (let s = 0; s < xs.length; s++) {
      if (komp[s] !== -1 || adj[s].length === 0) continue;
      const stack = [s]; komp[s] = k; let gr = 0;
      while (stack.length) { const u = stack.pop(); gr++; const a = adj[u];
        for (let j = 0; j < a.length; j += 2) if (komp[a[j]] === -1) { komp[a[j]] = k; stack.push(a[j]); } }
      if (gr > besteGroesse) { besteGroesse = gr; beste = k; } k++;
    }
    const aktiv = new Uint8Array(xs.length); for (let i = 0; i < xs.length; i++) aktiv[i] = komp[i] === beste ? 1 : 0;
    const g = { xs, ys, lat, lon, adj, aktiv, anzahl: besteGroesse, zelle: 60, raster: new Map() };
    for (let i = 0; i < xs.length; i++) if (aktiv[i]) {
      const key = Math.floor(xs[i] / g.zelle) + "," + Math.floor(ys[i] / g.zelle);
      let z = g.raster.get(key); if (!z) g.raster.set(key, (z = [])); z.push(i);
    }
    return g;
  };

  R.naechster = (g, x, y, maxRing = 40) => {
    const cx = Math.floor(x / g.zelle), cy = Math.floor(y / g.zelle);
    let best = -1, bd = Infinity;
    for (let r = 0; r <= maxRing; r++) {
      for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const z = g.raster.get((cx + dx) + "," + (cy + dy)); if (!z) continue;
        for (const i of z) { const d = (g.xs[i] - x) ** 2 + (g.ys[i] - y) ** 2; if (d < bd) { bd = d; best = i; } }
      }
      if (best >= 0 && r * g.zelle > Math.sqrt(bd) + g.zelle) break;
    }
    return { knoten: best, abstand: Math.sqrt(bd) };
  };

  // ---------- Form ----------
  R.laenge = (p) => { let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return l; };

  R.normieren = (p) => { // Mittelpunkt auf 0, größte Ausdehnung = 1
    const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
    const mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2;
    const s = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
    return p.map(([x, y]) => [(x - mx) / s, (y - my) / s]);
  };

  R.transformieren = (p, { skala, winkel, dx, dy }) => {
    const c = Math.cos(winkel), s = Math.sin(winkel);
    return p.map(([x, y]) => [skala * (x * c - y * s) + dx, skala * (x * s + y * c) + dy]);
  };

  R.verdichten = (p, schritt) => {
    const out = [p[0]];
    for (let i = 1; i < p.length; i++) {
      const [ax, ay] = p[i - 1], [bx, by] = p[i]; const l = Math.hypot(bx - ax, by - ay);
      const n = Math.max(1, Math.ceil(l / schritt));
      for (let j = 1; j <= n; j++) out.push([ax + (bx - ax) * j / n, ay + (by - ay) * j / n]);
    }
    return out;
  };

  function abstandSegment(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
    let t = l2 ? ((px - ax) * vx + (py - ay) * vy) / l2 : 0; t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - ax - t * vx, py - ay - t * vy);
  }
  R.abstandZuLinie = (px, py, p) => {
    let d = Infinity;
    for (let i = 1; i < p.length; i++) d = Math.min(d, abstandSegment(px, py, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]));
    return d;
  };

  // Empfohlene Mindestlänge: das kleinste Detail der Form (z. B. Buchstabenhöhe) soll mindestens ~5 Häuserblocks groß sein.
  // detail = Größe des kleinsten Details in normierten Einheiten (Text: ≈ halbe Buchstabenhöhe).
  R.mindestLaenge = (formNorm, detail, block = 100) => R.laenge(formNorm) * 1.12 * (5 * block / detail);

  // ---------- Platzierung ----------
  // Sucht Verschiebung/Drehung/Größe, bei der die Form am dichtesten an Wegen liegt.
  R.platzieren = (g, formNorm, { zielLaenge, mitte = [0, 0], drehen = true, radius }) => {
    const grundSkala = zielLaenge / (R.laenge(formNorm) * 1.12); // Routen sind etwas länger als die Form
    radius = radius ?? grundSkala * 0.35;
    const winkel = drehen ? [-10, -5, 0, 5, 10].map((w) => w * Math.PI / 180) : [0];
    const skalen = [0.9, 1, 1.1].map((f) => f * grundSkala);
    const proben = R.verdichten(formNorm, R.laenge(formNorm) / 120);
    let best = null;
    const schritte = 5;
    for (let i = -schritte; i <= schritte; i++) for (let j = -schritte; j <= schritte; j++) {
      if (i * i + j * j > schritte * schritte) continue;
      const dx = mitte[0] + radius * i / schritte, dy = mitte[1] + radius * j / schritte;
      for (const winkel_ of winkel) for (const skala of skalen) {
        const t = { skala, winkel: winkel_, dx, dy };
        const pts = R.transformieren(proben, t);
        let summe = 0;
        for (const [x, y] of pts) summe += Math.min(R.naechster(g, x, y, 6).abstand, 150);
        // leichte Strafe für Abweichung von der Wunschgröße und Wunschmitte
        const wert = summe / pts.length + Math.abs(skala / grundSkala - 1) * 15 + Math.hypot(dx - mitte[0], dy - mitte[1]) / radius * 4;
        if (!best || wert < best.wert) best = { ...t, wert };
      }
    }
    return best;
  };

  // ---------- Routing ----------
  class Heap {
    constructor() { this.k = []; this.p = []; }
    push(k, p) { const a = this.k, b = this.p; let i = a.length; a.push(k); b.push(p);
      while (i > 0) { const j = (i - 1) >> 1; if (b[j] <= p) break; a[i] = a[j]; b[i] = b[j]; i = j; } a[i] = k; b[i] = p; }
    pop() { const a = this.k, b = this.p, top = a[0], lk = a.pop(), lp = b.pop(); const n = a.length;
      if (n) { let i = 0; while (true) { let c = 2 * i + 1; if (c >= n) break; if (c + 1 < n && b[c + 1] < b[c]) c++;
        if (b[c] >= lp) break; a[i] = a[c]; b[i] = b[c]; i = c; } a[i] = lk; b[i] = lp; } return top; }
    get size() { return this.k.length; }
  }

  // A* von s nach t; Kosten bestrafen Abstand zum Formsegment (ax,ay)-(bx,by)
  R.weg = (g, s, t, seg, lambda) => {
    if (s === t) return [s];
    const n = g.xs.length, dist = new Map(), vor = new Map(), heap = new Heap();
    const tx = g.xs[t], ty = g.ys[t];
    dist.set(s, 0); heap.push(s, Math.hypot(g.xs[s] - tx, g.ys[s] - ty));
    let schritte = 0;
    while (heap.size) {
      const u = heap.pop();
      if (u === t) break;
      if (++schritte > 60000) return null;
      const du = dist.get(u), a = g.adj[u];
      for (let j = 0; j < a.length; j += 2) {
        const v = a[j]; if (!g.aktiv[v]) continue;
        const mx = (g.xs[u] + g.xs[v]) / 2, my = (g.ys[u] + g.ys[v]) / 2;
        const d = seg ? abstandSegment(mx, my, seg[0], seg[1], seg[2], seg[3]) : 0;
        const kosten = a[j + 1] * (1 + Math.min(40, (d / lambda) ** 2));
        const nd = du + kosten;
        if (nd < (dist.get(v) ?? Infinity)) {
          dist.set(v, nd); vor.set(v, u);
          heap.push(v, nd + Math.hypot(g.xs[v] - tx, g.ys[v] - ty));
        }
      }
    }
    if (!vor.has(t)) return null;
    const pfad = [t]; let c = t; while (c !== s) { c = vor.get(c); pfad.push(c); }
    return pfad.reverse();
  };

  R.route = (g, form, { schritt = 70, lambda = 30 } = {}) => {
    const wp = R.verdichten(form, schritt);
    const knoten = []; const formSeg = [];
    for (let i = 0; i < wp.length; i++) {
      const k = R.naechster(g, wp[i][0], wp[i][1]).knoten;
      if (k < 0) continue;
      if (knoten.length && knoten[knoten.length - 1] === k) continue;
      knoten.push(k); formSeg.push(wp[i]);
    }
    const pfad = [knoten[0]];
    for (let i = 1; i < knoten.length; i++) {
      const seg = [formSeg[i - 1][0], formSeg[i - 1][1], formSeg[i][0], formSeg[i][1]];
      const teil = R.weg(g, knoten[i - 1], knoten[i], seg, lambda) || R.weg(g, knoten[i - 1], knoten[i], null, 1);
      if (!teil) continue;
      for (let j = 1; j < teil.length; j++) pfad.push(teil[j]);
    }
    // kurze Hin-und-zurück-Zipfel entfernen (A → B → A)
    const glatt = [];
    for (const k of pfad) {
      const b = glatt[glatt.length - 1];
      if (glatt.length >= 2 && glatt[glatt.length - 2] === k && Math.hypot(g.xs[b] - g.xs[k], g.ys[b] - g.ys[k]) < 60) { glatt.pop(); continue; }
      if (glatt[glatt.length - 1] !== k) glatt.push(k);
    }
    const pts = glatt.map((k) => [g.xs[k], g.ys[k]]);
    return { knoten: glatt, punkte: pts, latlon: glatt.map((k) => [g.lat[k], g.lon[k]]), laenge: R.laenge(pts) };
  };

  // Komplett: platzieren → routen → Länge messen → Größe korrigieren → nochmal routen
  R.erstelle = (g, formNorm, { zielLaenge, mitte, drehen, istText }) => {
    const opt = istText ? { lambda: 18, schritt: 45 } : { lambda: 25, schritt: 60 };
    let ziel = zielLaenge, bestes = null;
    for (let versuch = 0; versuch < 3; versuch++) {
      const p = R.platzieren(g, formNorm, { zielLaenge: ziel, mitte, drehen });
      const form = R.transformieren(formNorm, p);
      const r = R.route(g, form, opt);
      const a = R.aehnlichkeit(r.punkte, form);
      const erg = { ...r, form, platz: p, aehnlichkeit: a.prozent };
      const fehler = Math.abs(r.laenge / zielLaenge - 1);
      if (!bestes || fehler < bestes.fehler - 0.03 || (Math.abs(fehler - bestes.fehler) <= 0.03 && a.prozent > bestes.aehnlichkeit)) bestes = { ...erg, fehler };
      if (fehler < 0.1) break;
      ziel = ziel * zielLaenge / r.laenge;
    }
    return bestes;
  };

  R.aehnlichkeit = (routePts, form) => {
    if (routePts.length < 2) return 0;
    const a = R.verdichten(routePts, 25), b = R.verdichten(form, 25);
    let s1 = 0; for (const [x, y] of a) s1 += R.abstandZuLinie(x, y, form);
    let s2 = 0; for (const [x, y] of b) s2 += R.abstandZuLinie(x, y, routePts);
    const mittel = (s1 / a.length + s2 / b.length) / 2;
    const xs = form.map((p) => p[0]), ys = form.map((p) => p[1]);
    const groesse = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    return { prozent: Math.round(100 * Math.exp(-mittel / (0.06 * groesse))), abweichung: mittel };
  };

  R.gpx = (latlon, name) => {
    const esc = (s) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Laufbild" xmlns="http://www.topografix.com/GPX/1/1">\n` +
      `<metadata><name>${esc(name)}</name></metadata>\n<trk><name>${esc(name)}</name><trkseg>\n` +
      latlon.map(([la, lo]) => `<trkpt lat="${la.toFixed(6)}" lon="${lo.toFixed(6)}"></trkpt>`).join("\n") +
      `\n</trkseg></trk>\n</gpx>\n`;
  };

  root.LB_ROUTE = R;
  if (typeof module !== "undefined") module.exports = R;
})(typeof window !== "undefined" ? window : globalThis);
