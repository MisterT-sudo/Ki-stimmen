// Teilfrieden – Teilungsverfahren nach Knaster (1946) mit Gewichten (z. B. Erbquoten).
//
// Jede Person i nennt für jeden Gegenstand k einen Geldwert v[i][k] ("so viel wäre er mir wert").
// 1. Jeder Gegenstand geht an die Person mit dem höchsten Gebot.
// 2. Gerechter Anteil von i (in i's eigener Bewertung): F_i = w_i · Σ_k v[i][k]
// 3. Vorläufiger Ausgleich: d_i = F_i − (Wert der Gegenstände, die i bekommt, nach i's Bewertung)
// 4. Überschuss S = −Σ d_i ≥ 0 wird nach Gewichten verteilt: Zahlung_i = d_i + w_i · S
// Ergebnis: Σ Zahlungen = 0, und jede Person erhält nach ihrer eigenen Bewertung mindestens ihren Anteil F_i.
"use strict";

function teile(personen, gegenstaende, gebote) {
  // personen: [{name, anteil}] (anteil beliebig skaliert, wird normiert); gegenstaende: [{name}]
  // gebote: Array je Person mit Zahlen je Gegenstand
  const n = personen.length, m = gegenstaende.length;
  const summeAnteile = personen.reduce((s, p) => s + (p.anteil || 0), 0);
  const w = personen.map((p) => (summeAnteile > 0 ? (p.anteil || 0) / summeAnteile : 1 / n));
  const v = gebote.map((g) => g.map((x) => Math.max(0, Number(x) || 0)));

  const zuteilung = [];
  const zaehler = new Array(n).fill(0);
  for (let k = 0; k < m; k++) {
    let best = -1, bestWert = -1;
    for (let i = 0; i < n; i++) {
      const x = v[i][k];
      // Gleichstand: wer bisher weniger Gegenstände hat, dann größerer Anteil, dann Reihenfolge
      if (x > bestWert || (x === bestWert && best >= 0 &&
          (zaehler[i] < zaehler[best] || (zaehler[i] === zaehler[best] && w[i] > w[best])))) { best = i; bestWert = x; }
    }
    if (bestWert <= 0) { zuteilung.push(-1); continue; } // will niemand → bleibt übrig (z. B. spenden/verkaufen)
    zuteilung.push(best); zaehler[best]++;
  }

  const fair = v.map((row, i) => w[i] * row.reduce((s, x) => s + x, 0));
  const erhalten = v.map((row, i) => row.reduce((s, x, k) => s + (zuteilung[k] === i ? x : 0), 0));
  const d = fair.map((f, i) => f - erhalten[i]);
  const ueberschuss = -d.reduce((s, x) => s + x, 0);
  const zahlung = d.map((x, i) => runde(x + w[i] * ueberschuss)); // >0: bekommt Geld, <0: zahlt
  // Rundungsrest dem Größten zuschlagen, damit die Summe exakt 0 ist
  const rest = runde(-zahlung.reduce((s, x) => s + x, 0));
  if (rest !== 0) { const j = zahlung.indexOf(Math.max(...zahlung)); zahlung[j] = runde(zahlung[j] + rest); }

  return {
    gewichte: w, zuteilung, fair, erhalten, ueberschuss, zahlung,
    // Gesamtwert für i nach eigener Bewertung = erhaltene Gegenstände + Zahlung
    gesamt: erhalten.map((e, i) => e + zahlung[i]),
    ueberweisungen: ueberweisungen(zahlung),
  };
}

function runde(x) { return Math.round(x * 100) / 100; }

// Möglichst wenige Überweisungen: Zahler → Empfänger
function ueberweisungen(zahlung) {
  const geber = zahlung.map((z, i) => ({ i, b: -z })).filter((x) => x.b > 0.004).sort((a, b) => b.b - a.b);
  const nehmer = zahlung.map((z, i) => ({ i, b: z })).filter((x) => x.b > 0.004).sort((a, b) => b.b - a.b);
  const out = [];
  let g = 0, n = 0;
  while (g < geber.length && n < nehmer.length) {
    const betrag = runde(Math.min(geber[g].b, nehmer[n].b));
    if (betrag > 0) out.push({ von: geber[g].i, an: nehmer[n].i, betrag });
    geber[g].b = runde(geber[g].b - betrag); nehmer[n].b = runde(nehmer[n].b - betrag);
    if (geber[g].b <= 0.004) g++;
    if (nehmer[n].b <= 0.004) n++;
  }
  return out;
}

if (typeof module !== "undefined") module.exports = { teile, ueberweisungen };
