"use strict";
(function () {
  const CFG = window.NK_CONFIG || {};
  const form = document.getElementById("f");
  const postenBox = document.getElementById("posten");
  const ergebnisBox = document.getElementById("ergebnis");
  const briefBox = document.getElementById("brief");
  const SPEICHER = "nk-check-v1";
  const HAEUFIG = ["Grundsteuer", "Wasser / Abwasser", "Heizung und Warmwasser", "Müllabfuhr", "Hausmeister", "Treppenhausreinigung",
    "Gartenpflege", "Allgemeinstrom", "Gebäudeversicherung", "Haftpflichtversicherung", "Schornsteinfeger", "Aufzug",
    "Straßenreinigung / Winterdienst", "Rauchwarnmelder", "Verwaltungskosten", "Sonstige Kosten"];

  const zahl = (v) => { const n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? null : n; };
  const eur = (n) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function zeile(name = "", betrag = "") {
    const d = document.createElement("div"); d.className = "row";
    d.innerHTML = `<input class="pn" placeholder="Bezeichnung, z. B. Müllabfuhr" value="${esc(name)}">` +
      `<input class="pb" type="number" step="0.01" inputmode="decimal" placeholder="€" value="${esc(betrag)}">` +
      `<button type="button" class="x" aria-label="Posten entfernen">×</button>`;
    d.querySelector(".x").onclick = () => { d.remove(); summe(); };
    d.querySelector(".pb").oninput = summe;
    postenBox.appendChild(d); return d;
  }
  function summe() {
    const s = [...postenBox.querySelectorAll(".pb")].reduce((t, i) => t + (zahl(i.value) || 0), 0);
    document.getElementById("summe").textContent = eur(s);
  }
  const chips = document.getElementById("chips");
  HAEUFIG.forEach((h) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = "+ " + h;
    b.onclick = () => { const leer = [...postenBox.querySelectorAll(".row")].find((r) => !r.querySelector(".pn").value);
      const r = leer || zeile(); r.querySelector(".pn").value = h; r.querySelector(".pb").focus(); };
    chips.appendChild(b);
  });
  document.getElementById("plus").onclick = () => zeile().querySelector(".pn").focus();

  function lesen() {
    const fd = new FormData(form); const d = (k) => fd.get(k) ? new Date(fd.get(k) + "T12:00:00") : null;
    return {
      von: d("von"), bis: d("bis"), zugang: d("zugang"), flaeche: zahl(fd.get("flaeche")),
      posten: [...postenBox.querySelectorAll(".row")].map((r) => ({ name: r.querySelector(".pn").value.trim(), betrag: zahl(r.querySelector(".pb").value) || 0 }))
        .filter((p) => p.name || p.betrag),
      vorauszahlung: zahl(fd.get("vorauszahlung")), ergebnis: zahl(fd.get("ergebnis")),
      brennstoff: fd.get("brennstoff"), heizungVerbrauch: fd.get("heizungVerbrauch"), co2Angabe: fd.get("co2Angabe"),
      funk: fd.get("funk"), monatsinfo: fd.get("monatsinfo"),
    };
  }
  function speichern() {
    const roh = Object.fromEntries(new FormData(form));
    roh.posten = [...postenBox.querySelectorAll(".row")].map((r) => [r.querySelector(".pn").value, r.querySelector(".pb").value]);
    try { localStorage.setItem(SPEICHER, JSON.stringify(roh)); } catch (e) {}
  }
  function laden() {
    let roh; try { roh = JSON.parse(localStorage.getItem(SPEICHER) || "null"); } catch (e) {}
    if (!roh) { ["Grundsteuer", "Wasser / Abwasser", "Heizung und Warmwasser", "Müllabfuhr"].forEach((n) => zeile(n)); return false; }
    for (const [k, v] of Object.entries(roh)) if (k !== "posten" && form.elements[k]) form.elements[k].value = v;
    (roh.posten || []).forEach(([n, b]) => zeile(n, b)); summe(); return true;
  }

  const STUFE = { stark: ["Fehler", "rot"], pruefen: ["Prüfen", "gelb"], info: ["Info", "blau"] };
  let letzt = null;

  function zeigen(e, r) {
    letzt = { e, r };
    const stark = r.funde.filter((f) => f.stufe === "stark").length, pruef = r.funde.filter((f) => f.stufe === "pruefen").length;
    let kopf;
    if (r.ersparnis > 0) kopf = `<div class="score rot"><span>Mögliche Ersparnis</span><b>${eur(r.ersparnis)}</b><small>${stark} Fehler, ${pruef} Punkte zum Prüfen</small></div>`;
    else if (pruef) kopf = `<div class="score gelb"><span>Keine eindeutigen Fehler</span><b>${pruef} Punkt${pruef > 1 ? "e" : ""} prüfen</b><small>Fordern Sie für diese Punkte die Belege an.</small></div>`;
    else kopf = `<div class="score gruen"><span>Gute Nachricht</span><b>Keine typischen Fehler gefunden</b><small>Die Abrechnung wirkt in den geprüften Punkten in Ordnung.</small></div>`;
    ergebnisBox.innerHTML = `<h2>Ihr Ergebnis</h2>${kopf}` + r.funde.map((f) => `
      <article class="fund ${STUFE[f.stufe][1]}"><span class="tag">${STUFE[f.stufe][0]}</span>
        <h3>${esc(f.titel)}${f.betrag ? ` <em>${eur(f.betrag)}</em>` : ""}</h3><p>${esc(f.text)}</p><small>${esc(f.grundlage)}</small></article>`).join("") +
      (r.funde.some((f) => f.stufe !== "info") ? `
      <div class="cta"><h3>Fertiges Widerspruchsschreiben</h3>
        <p>Mit allen gefundenen Punkten, den Rechtsgrundlagen und der Bitte um Belegeinsicht. Sie müssen nur noch Namen und Adresse eintragen, ausdrucken und unterschreiben.</p>
        <button class="btn" id="kaufen">${CFG.ZAHLUNGS_LINK ? "Schreiben erstellen – " + CFG.PREIS : "Schreiben erstellen"}</button>
        ${CFG.ZAHLUNGS_LINK ? '<p class="fine">Sichere Zahlung über Stripe (Karte, PayPal, Apple Pay, Google Pay). Danach kommen Sie automatisch hierher zurück.</p>' : ""}</div>` : "");
    ergebnisBox.hidden = false; ergebnisBox.scrollIntoView({ behavior: "smooth" });
    const k = document.getElementById("kaufen");
    if (k) k.onclick = () => {
      speichern();
      if (CFG.ZAHLUNGS_LINK) location.href = CFG.ZAHLUNGS_LINK; else brief();
    };
  }

  function brief() {
    const { e, r } = letzt; const heute = new Date().toLocaleDateString("de-DE");
    const zeitraum = `${e.von.toLocaleDateString("de-DE")} bis ${e.bis.toLocaleDateString("de-DE")}`;
    const punkte = r.funde.filter((f) => f.stufe !== "info").map((f, i) =>
      `${i + 1}. ${f.titel}${f.betrag ? ` (${eur(f.betrag)})` : ""}\n   ${f.text} (${f.grundlage})`).join("\n\n");
    const nach = e.ergebnis > 0;
    const text =
`[Ihr Name]
[Ihre Straße und Hausnummer]
[PLZ Ort]

[Name des Vermieters / der Hausverwaltung]
[Straße und Hausnummer]
[PLZ Ort]

${"[Ort]"}, ${heute}

Einwendungen gegen die Betriebskostenabrechnung für den Zeitraum ${zeitraum}
Wohnung: [Adresse der Wohnung, Lage]

Sehr geehrte Damen und Herren,

zu der oben genannten Abrechnung, die mir am ${e.zugang.toLocaleDateString("de-DE")} zugegangen ist, erhebe ich fristgerecht folgende Einwendungen:

${punkte}

Bitte korrigieren Sie die Abrechnung entsprechend und übersenden Sie mir eine berichtigte Fassung.

Gleichzeitig mache ich von meinem Recht auf Belegeinsicht Gebrauch (§ 259 BGB). Bitte teilen Sie mir mit, wann und wo ich die Originalbelege einsehen kann, oder senden Sie mir Kopien der Rechnungen und Verträge zu den genannten Positionen zu.
${nach ? `
Bis zur Klärung zahle ich die Nachforderung nur unter Vorbehalt bzw. behalte den beanstandeten Betrag ein.
` : ""}
Ich bitte um Antwort bis zum ${new Date(Date.now() + 21 * 864e5).toLocaleDateString("de-DE")}.

Mit freundlichen Grüßen


[Unterschrift]`;
    briefBox.innerHTML = `<h2>Ihr Widerspruchsschreiben</h2>
      <p>Ersetzen Sie die Angaben in [eckigen Klammern], drucken Sie das Schreiben aus und schicken Sie es unterschrieben
         per Post (am besten als Einwurf-Einschreiben). Bewahren Sie eine Kopie auf.</p>
      <textarea id="brieftext" rows="24">${esc(text)}</textarea>
      <div class="aktionen"><button class="btn" id="drucken">Drucken / als PDF speichern</button>
        <button class="ghost" id="kopieren">Text kopieren</button></div>`;
    briefBox.hidden = false; briefBox.scrollIntoView({ behavior: "smooth" });
    document.getElementById("kopieren").onclick = async (ev) => {
      try { await navigator.clipboard.writeText(document.getElementById("brieftext").value); ev.target.textContent = "Kopiert ✓"; }
      catch (e) { document.getElementById("brieftext").select(); }
    };
    document.getElementById("drucken").onclick = () => {
      const w = window.open("", "_blank");
      if (!w) return window.print();
      w.document.write(`<pre style="font:11pt/1.5 Georgia,serif;white-space:pre-wrap;margin:2.5cm 2cm">${esc(document.getElementById("brieftext").value)}</pre>`);
      w.document.close(); w.focus(); w.print();
    };
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const e = lesen();
    if (!e.posten.length) { alert("Bitte tragen Sie mindestens einen Posten ein."); return; }
    if (e.bis < e.von) { alert("Das Ende des Zeitraums liegt vor dem Anfang."); return; }
    speichern(); zeigen(e, pruefe(e));
  });

  const hatteDaten = laden();
  if (/[?&]bezahlt=1/.test(location.search) && hatteDaten) {
    const e = lesen(); if (e.von && e.bis && e.zugang) { zeigen(e, pruefe(e)); brief(); }
  }
})();
