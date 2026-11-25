// Prüfregeln für die Nebenkostenabrechnung (Wohnraummiete, Deutschland).
// Stand: November 2026. Jede Regel nennt ihre Rechtsgrundlage; Änderungen hier zentral pflegen.
"use strict";

const SPIEGEL = { // Betriebskostenspiegel Deutscher Mieterbund, Abrechnungsjahr 2024 (veröffentlicht 12/2025), €/m²/Monat
  quelle: "Betriebskostenspiegel des Deutschen Mieterbundes (Abrechnungsjahr 2024)",
  gesamt: 2.67, heizung: 1.32, wasser: 0.29, grundsteuer: 0.18,
};

// Posten, die nach Betriebskostenverordnung bzw. Rechtsprechung nicht (oder nur eingeschränkt) umlagefähig sind.
// stufe "stark": in der Regel nicht umlagefähig → Betrag wird beanstandet.
// stufe "pruefen": kann teilweise unzulässig sein → Hinweis, Beleg anfordern.
const POSTEN_REGELN = [
  { muster: /verwalt/i, stufe: "stark", titel: "Verwaltungskosten",
    text: "Kosten der Verwaltung (z. B. Hausverwaltung) sind keine Betriebskosten und dürfen nicht umgelegt werden.",
    grundlage: "§ 1 Abs. 2 Nr. 1 BetrKV" },
  { muster: /instandhalt|instandsetz|reparatur|erneuerung|r(ü|ue)cklage/i, stufe: "stark", titel: "Instandhaltung / Reparaturen",
    text: "Kosten für Instandhaltung, Instandsetzung, Reparaturen und Rücklagen trägt der Vermieter.",
    grundlage: "§ 1 Abs. 2 Nr. 2 BetrKV" },
  { muster: /notdienst|rufbereitschaft|bereitschaftsdienst/i, stufe: "stark", titel: "Notdienst-Pauschale",
    text: "Eine Notdienst- bzw. Rufbereitschaftspauschale ist nach dem Bundesgerichtshof Verwaltungsaufwand und nicht umlagefähig.",
    grundlage: "BGH, Urteil vom 18.12.2019, VIII ZR 62/19" },
  { muster: /bank|kontof(ü|ue)hr|porto|zinsen|mahngeb/i, stufe: "stark", titel: "Bank-, Porto- oder Zinskosten",
    text: "Kontoführungs-, Bank-, Porto- und Zinskosten sind Verwaltungskosten des Vermieters.",
    grundlage: "§ 1 Abs. 2 Nr. 1 BetrKV" },
  { muster: /mietausfall|rechtsschutz|reparaturversich/i, stufe: "stark", titel: "Nicht umlagefähige Versicherung",
    text: "Umlagefähig sind nur Sach- und Haftpflichtversicherungen für das Gebäude. Mietausfall-, Rechtsschutz- oder Reparaturversicherungen gehören nicht dazu.",
    grundlage: "§ 2 Nr. 13 BetrKV" },
  { muster: /leerstand/i, stufe: "stark", titel: "Leerstandskosten",
    text: "Kosten für leerstehende Wohnungen trägt der Vermieter, nicht die übrigen Mieter.",
    grundlage: "§ 556a BGB, ständige Rechtsprechung" },
  { muster: /(rauch\w*melder|rauchwarn)\w*.*(miete|leasing|kauf|anschaff)|(miete|leasing|kauf|anschaff)\w*.*(rauch\w*melder|rauchwarn)/i, stufe: "stark", titel: "Miete oder Kauf von Rauchwarnmeldern",
    text: "Kauf- und Mietkosten für Rauchwarnmelder sind nicht umlagefähig. Umgelegt werden darf nur die Wartung.",
    grundlage: "BGH, Urteil vom 11.05.2022, VIII ZR 379/20" },
  { muster: /anschaff|neukauf/i, stufe: "stark", titel: "Anschaffungskosten",
    text: "Anschaffungen (z. B. neue Geräte, Mülltonnen, Werkzeug) sind keine laufenden Betriebskosten.",
    grundlage: "§ 1 Abs. 1 BetrKV (nur laufende Kosten)" },
  { muster: /hausmeist|hauswart/i, stufe: "pruefen", titel: "Hausmeister",
    text: "Hausmeisterkosten sind umlagefähig, aber nicht der Anteil für Reparaturen und Verwaltungsarbeiten. Fordern Sie die Leistungsbeschreibung bzw. den Vertrag an.",
    grundlage: "§ 2 Nr. 14 BetrKV" },
  { muster: /sonstig/i, stufe: "pruefen", titel: "Sonstige Betriebskosten",
    text: "„Sonstige Betriebskosten“ dürfen nur umgelegt werden, wenn sie im Mietvertrag einzeln benannt sind.",
    grundlage: "§ 2 Nr. 17 BetrKV" },
];

function monateZwischen(von, bis) {
  return (bis.getFullYear() - von.getFullYear()) * 12 + (bis.getMonth() - von.getMonth()) + (bis.getDate() >= von.getDate() ? 1 : 0);
}
function plusMonate(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
const eur = (n) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const datum = (d) => d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

// eingabe: { von, bis, zugang (Date), flaeche, posten:[{name, betrag}], vorauszahlung, ergebnis (+ Nachzahlung / − Guthaben),
//            heizungVerbrauch: "ja"|"nein"|"?", brennstoff: "gas"|"oel"|"fern"|"andere", co2Angabe: "ja"|"nein"|"?",
//            funk: "ja"|"nein"|"?", monatsinfo: "ja"|"nein"|"?" }
function pruefe(e) {
  const funde = []; // {stufe: "stark"|"pruefen"|"info", titel, text, grundlage, betrag?}
  const heute = new Date();
  const summe = e.posten.reduce((s, p) => s + (p.betrag || 0), 0);
  const heizPosten = e.posten.filter((p) => /heiz|warmwasser|fernw(ä|ae)rme/i.test(p.name));
  const heizSumme = heizPosten.reduce((s, p) => s + p.betrag, 0);

  // 1. Fristen
  if (e.von && e.bis) {
    const m = monateZwischen(e.von, e.bis);
    if (m > 12) funde.push({ stufe: "stark", titel: "Abrechnungszeitraum länger als 12 Monate",
      text: `Der Zeitraum umfasst ${m} Monate. Abgerechnet werden muss jährlich. Die Abrechnung ist in dieser Form formell angreifbar.`,
      grundlage: "§ 556 Abs. 3 Satz 1 BGB" });
    const frist = plusMonate(new Date(e.bis.getFullYear(), e.bis.getMonth() + 1, 0), 12); // 12 Monate nach Ende des Zeitraums
    frist.setDate(new Date(frist.getFullYear(), frist.getMonth() + 1, 0).getDate());
    if (e.zugang && e.zugang > frist) {
      const nach = Math.max(0, e.ergebnis || 0);
      funde.push({ stufe: "stark", titel: "Abrechnung zu spät zugestellt",
        text: `Die Abrechnung hätte Ihnen spätestens am ${datum(frist)} zugehen müssen, kam aber am ${datum(e.zugang)}. ` +
              "Eine Nachzahlung darf der Vermieter dann grundsätzlich nicht mehr verlangen (außer er war unverschuldet verhindert). " +
              "Ein Guthaben muss er Ihnen trotzdem auszahlen.",
        grundlage: "§ 556 Abs. 3 Satz 2 und 3 BGB", betrag: nach, frist: true });
    }
    if (e.zugang) {
      const einw = plusMonate(e.zugang, 12);
      funde.push({ stufe: "info", titel: "Ihre Frist für Einwände",
        text: `Einwände müssen Sie dem Vermieter bis spätestens ${datum(einw)} mitteilen.` +
              (einw < heute ? " Diese Frist ist bereits abgelaufen: Einwände sind grundsätzlich ausgeschlossen." : ""),
        grundlage: "§ 556 Abs. 3 Satz 5 BGB" });
    }
  }

  // 2. Einzelne Posten
  for (const p of e.posten) {
    const r = POSTEN_REGELN.find((r) => r.muster.test(p.name));
    if (!r) continue;
    funde.push({ stufe: r.stufe, titel: `${r.titel}: „${p.name}“`, text: r.text, grundlage: r.grundlage,
                 betrag: r.stufe === "stark" ? p.betrag : 0, posten: p.name });
  }

  // 3. Heizkosten
  if (heizSumme > 0) {
    if (e.heizungVerbrauch === "nein") {
      funde.push({ stufe: "stark", titel: "Heizkosten nicht nach Verbrauch abgerechnet",
        text: "Heiz- und Warmwasserkosten müssen zu 50–70 % nach Verbrauch abgerechnet werden. Ist das nicht der Fall, dürfen Sie Ihren Heizkostenanteil um 15 % kürzen.",
        grundlage: "§§ 7, 8, 12 Abs. 1 HeizkostenV", betrag: heizSumme * 0.15, heiz: true });
    }
    if ((e.brennstoff === "gas" || e.brennstoff === "oel" || e.brennstoff === "fern") && e.co2Angabe === "nein") {
      funde.push({ stufe: "stark", titel: "CO₂-Kostenaufteilung fehlt",
        text: "Seit 2023 muss der Vermieter bei Gas, Öl und Fernwärme die CO₂-Kosten aufteilen und in der Heizkostenabrechnung ausweisen (u. a. CO₂-Ausstoß und Einstufung des Gebäudes). Fehlt das, dürfen Sie Ihren Heizkostenanteil um 3 % kürzen. Zusätzlich muss der Vermieter je nach Energiezustand des Gebäudes einen Teil der CO₂-Kosten selbst tragen.",
        grundlage: "§ 7 Abs. 3 und 4 CO2KostAufG", betrag: heizSumme * 0.03, heiz: true });
    }
    if (e.funk === "ja" && e.monatsinfo === "nein") {
      funde.push({ stufe: "pruefen", titel: "Keine monatliche Verbrauchsinformation",
        text: "Bei funkablesbaren Zählern muss der Vermieter Ihnen monatlich Verbrauchsinformationen zukommen lassen. Fehlen diese, besteht nach der Heizkostenverordnung ein Kürzungsrecht von 3 %.",
        grundlage: "§§ 6a, 12 HeizkostenV", betrag: heizSumme * 0.03, heiz: true });
    }
    if (e.funk === "nein" && e.bis && e.bis > new Date(2026, 11, 31)) {
      funde.push({ stufe: "pruefen", titel: "Zähler noch nicht fernablesbar",
        text: "Bis Ende 2026 mussten Heizkostenzähler grundsätzlich auf Fernablesung umgerüstet werden. Ist das nicht geschehen, kommt ein Kürzungsrecht von 3 % in Betracht.",
        grundlage: "§§ 5, 12 HeizkostenV", betrag: heizSumme * 0.03, heiz: true });
    }
  }

  // 4. Vergleich mit dem Betriebskostenspiegel
  if (e.flaeche > 0 && e.von && e.bis) {
    const monate = Math.max(1, Math.min(24, monateZwischen(e.von, e.bis)));
    const proQm = (b) => b / e.flaeche / monate;
    const vergleiche = [
      ["Gesamtkosten", summe, SPIEGEL.gesamt],
      ["Heizung und Warmwasser", heizSumme, SPIEGEL.heizung],
      ["Wasser und Abwasser", e.posten.filter((p) => /wasser|abwasser|entw(ä|ae)sser|kanal/i.test(p.name) && !/warmwasser/i.test(p.name)).reduce((s, p) => s + p.betrag, 0), SPIEGEL.wasser],
      ["Grundsteuer", e.posten.filter((p) => /grundsteuer/i.test(p.name)).reduce((s, p) => s + p.betrag, 0), SPIEGEL.grundsteuer],
    ];
    for (const [name, betrag, schnitt] of vergleiche) {
      if (!betrag) continue;
      const wert = proQm(betrag);
      if (wert > schnitt * 1.5) funde.push({ stufe: "pruefen", titel: `${name} deutlich über dem Durchschnitt`,
        text: `Sie zahlen ${wert.toFixed(2).replace(".", ",")} € pro m² und Monat, der Durchschnitt liegt bei ${schnitt.toFixed(2).replace(".", ",")} €. ` +
              "Das ist kein Beweis für einen Fehler, aber ein guter Grund, die Belege anzusehen. Der Vermieter muss wirtschaftlich handeln.",
        grundlage: `§ 556 Abs. 3 Satz 1 BGB (Wirtschaftlichkeitsgebot); Vergleich: ${SPIEGEL.quelle}` });
    }
  }

  // 5. Rechenprüfung
  if (e.vorauszahlung != null && e.ergebnis != null && e.posten.length) {
    const soll = summe - e.vorauszahlung;
    if (Math.abs(soll - e.ergebnis) > 1) funde.push({ stufe: "pruefen", titel: "Die Summe geht nicht auf",
      text: `Ihre Posten ergeben ${eur(summe)}, abzüglich ${eur(e.vorauszahlung)} Vorauszahlungen sind das ${eur(soll)}. In der Abrechnung steht ${eur(e.ergebnis)}. Prüfen Sie, ob alle Posten erfasst sind, sonst den Vermieter um Erklärung bitten.`,
      grundlage: "§ 259 BGB (geordnete Zusammenstellung)" });
  }

  // Ersparnis: Fristverstoß deckt die ganze Nachzahlung; sonst Summe der starken Posten + größte Heizkostenkürzung
  const fristFund = funde.find((f) => f.frist);
  const postenErsparnis = funde.filter((f) => f.stufe === "stark" && f.posten).reduce((s, f) => s + f.betrag, 0);
  const heizErsparnis = Math.max(0, ...funde.filter((f) => f.heiz && f.stufe === "stark").map((f) => f.betrag));
  let ersparnis = postenErsparnis + heizErsparnis;
  if (fristFund) ersparnis = Math.max(ersparnis, fristFund.betrag);
  const reihenfolge = { stark: 0, pruefen: 1, info: 2 };
  funde.sort((a, b) => reihenfolge[a.stufe] - reihenfolge[b.stufe]);
  return { funde, summe, heizSumme, ersparnis };
}

if (typeof module !== "undefined") module.exports = { pruefe, POSTEN_REGELN, SPIEGEL, monateZwischen };
