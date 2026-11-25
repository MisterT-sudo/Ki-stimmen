#!/usr/bin/env python3
"""Rätselabend: erzeugt ein personalisiertes Familien-Escape-Spiel als druckfertiges PDF.

Aufruf:  python3 raetselabend/werkzeug/spiel.py auftraege/<familie>.json [--vorschau]
Ergebnis: <familie>_Spiel.pdf (für die Spieler) + <familie>_Spielleitung.pdf (Lösungen, Ablauf)
Aufbau der JSON: siehe raetselabend/beispiel/familie_beispiel.json

Ablauf im Spiel: 4 Rätsel → je eine Ziffer → 4-stelliger Code → Code öffnet den „Tresor“ (letzte Seite,
gefaltet/zugeklebt) → dort steht, wo das echte Geschenk versteckt ist.
"""
import json, os, random, sys, string
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

W, H = A4
L, R = 20 * mm, W - 20 * mm
ZAHLWORT = ["NULL", "EINS", "ZWEI", "DREI", "VIER", "FUENF", "SECHS", "SIEBEN", "ACHT", "NEUN"]
THEMEN = {
    "weihnachten": dict(farbe=(0.62, 0.10, 0.14), akzent=(0.85, 0.65, 0.2), titel="Die verschwundene Weihnacht",
        story="Heute Nacht ist etwas Schlimmes passiert: Ein frecher Wichtel hat sich ins Haus geschlichen und das "
              "Weihnachtsgeschenk in einen Tresor gesperrt. Der Tresor hat ein Zahlenschloss mit vier Ziffern. "
              "Der Wichtel hat Hinweise hinterlassen – und er kennt diese Familie erschreckend gut. "
              "Löst alle vier Rätsel, findet die vier Ziffern und öffnet den Tresor, bevor die Kerzen heruntergebrannt sind!",
        woerter=["STERN", "KERZE", "SCHNEE", "PLAETZCHEN", "TANNE", "GLOCKE", "ENGEL", "GESCHENK"]),
    "silvester": dict(farbe=(0.10, 0.12, 0.35), akzent=(0.90, 0.75, 0.25), titel="Der Code um Mitternacht",
        story="Um Mitternacht beginnt das neue Jahr – aber jemand hat die Überraschung in einen Tresor gesperrt! "
              "Nur wer diese Familie wirklich kennt, kann die vier Ziffern finden. Schafft ihr es vor dem Countdown?",
        woerter=["RAKETE", "SEKT", "KONFETTI", "COUNTDOWN", "GLUECK", "BLEI", "FEST", "JAHR"]),
    "geburtstag": dict(farbe=(0.05, 0.45, 0.45), akzent=(0.95, 0.55, 0.2), titel="Das Geburtstags-Geheimnis",
        story="Das Geburtstagsgeschenk ist verschwunden! Ein geheimnisvoller Rätselmeister hat es in einen Tresor "
              "gesperrt und vier Hinweise hinterlassen. Löst sie alle, dann gehört der Schatz euch!",
        woerter=["KUCHEN", "KERZEN", "PARTY", "BALLON", "TORTE", "FEIER", "SPIELE", "GAESTE"]),
}


class Pdf:
    def __init__(self, pfad, t, vorschau):
        self.c = canvas.Canvas(pfad, pagesize=A4); self.t = t; self.vorschau = vorschau

    def seite(self, titel, nummer=None):
        c, t = self.c, self.t
        c.setFillColorRGB(*t["farbe"]); c.rect(0, H - 30 * mm, W, 30 * mm, fill=1, stroke=0)
        c.setFillColorRGB(*t["akzent"]); c.rect(0, H - 32 * mm, W, 2 * mm, fill=1, stroke=0)
        c.setFillColorRGB(1, 1, 1); c.setFont("Helvetica-Bold", 22); c.drawString(L, H - 19 * mm, titel)
        if nummer: c.setFont("Helvetica", 11); c.drawRightString(R, H - 19 * mm, nummer)
        self.y = H - 46 * mm

    def fertig(self):
        if self.vorschau:
            c = self.c; c.saveState(); c.setFillColorRGB(0.8, 0.1, 0.1, alpha=0.16); c.setFont("Helvetica-Bold", 64)
            c.translate(W / 2, H / 2); c.rotate(40)
            for dy in (-250, 0, 250): c.drawCentredString(0, dy, "VORSCHAU")
            c.restoreState()
        c = self.c; c.setFont("Helvetica", 7.5); c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawCentredString(W / 2, 10 * mm, "Rätselabend · persönlich für euch erstellt")
        c.showPage()

    def text(self, t, size=11.5, font="Helvetica", lead=None, x=L, farbe=(0.1, 0.1, 0.1), breite=None):
        c = self.c; lead = lead or size * 1.42; breite = breite or (R - x)
        for absatz in t.split("\n"):
            z = ""
            for w in absatz.split():
                k = (z + " " + w).strip()
                if c.stringWidth(k, font, size) > breite and z:
                    c.setFont(font, size); c.setFillColorRGB(*farbe); c.drawString(x, self.y, z); self.y -= lead; z = w
                else:
                    z = k
            c.setFont(font, size); c.setFillColorRGB(*farbe); c.drawString(x, self.y, z); self.y -= lead

    def kasten(self, h, inhalt=None):
        c = self.c; c.setStrokeColorRGB(*self.t["akzent"]); c.setLineWidth(1.5)
        c.roundRect(L, self.y - h, R - L, h, 4 * mm, stroke=1, fill=0)
        y0 = self.y; self.y -= h + 6 * mm; return y0


# ---------- Rätsel-Bausteine ----------

def quiz(pdf, d, ziffer):
    """Multiple-Choice über die Familie. Buchstaben der richtigen Antworten → Zahlwort der Ziffer."""
    wort = ZAHLWORT[ziffer]; fragen = d["quiz"]
    assert len(fragen) >= len(wort), f"Quiz braucht mind. {len(wort)} Fragen für '{wort}'"
    rnd = random.Random(d["familie"] + "quiz")
    pdf.seite("Rätsel 1: Wer kennt die Familie?", "1 / 4")
    pdf.text("Der Wichtel hat Fragen über euch gestellt. Kreist die richtige Antwort ein. Jede richtige Antwort hat "
             "einen Buchstaben. Lest die Buchstaben der Reihe nach: Sie verraten die ERSTE Ziffer des Codes.", 11)
    pdf.y -= 3 * mm
    loesung = []
    for i, (q, buchstabe) in enumerate(zip(fragen, wort)):
        opts = [q["richtig"]] + q["falsch"][:2]; rnd.shuffle(opts)
        falsche_buchst = [b for b in string.ascii_uppercase if b != buchstabe]; rnd.shuffle(falsche_buchst)
        pdf.text(f"{i + 1}. {q['frage']}", 12, "Helvetica-Bold")
        zeile = []
        for o in opts:
            b = buchstabe if o == q["richtig"] else falsche_buchst.pop()
            zeile.append(f"[{b}]  {o}")
        pdf.text("        ".join(zeile), 11, x=L + 6 * mm); pdf.y -= 2.5 * mm
        loesung.append(f"{i + 1}. {q['richtig']} → {buchstabe}")
    pdf.y -= 4 * mm
    pdf.text("Lösungswort:  " + "  ".join("___" for _ in wort) + "      →  Ziffer 1 = ____", 13, "Helvetica-Bold")
    pdf.fertig()
    return f"Rätsel 1 (Quiz): {'; '.join(loesung)} → Wort {wort} → Ziffer {ziffer}"


def geheimschrift(pdf, d, ziffer):
    """Verschiebe-Code (Caesar). Schlüssel = eine Familienzahl (z. B. Anzahl Personen)."""
    k = d["geheimschrift"]["schluessel_zahl"] % 26 or 3
    satz = f"{d['geheimschrift']['satz'].upper()} DIE ZWEITE ZIFFER IST {ZAHLWORT[ziffer]}"
    satz = satz.replace("Ä", "AE").replace("Ö", "OE").replace("Ü", "UE").replace("ß", "SS")
    enc = "".join(chr((ord(ch) - 65 + k) % 26 + 65) if ch.isalpha() and ch.isascii() else ch for ch in satz)
    pdf.seite("Rätsel 2: Die Geheimschrift", "2 / 4")
    pdf.text("Der Wichtel schreibt in Geheimschrift. Jeder Buchstabe wurde im Alphabet um dieselbe Zahl nach hinten "
             "verschoben. Diese Zahl findet ihr hier:", 11)
    pdf.y -= 2 * mm
    pdf.text("Schlüssel: " + d["geheimschrift"]["schluessel_frage"], 12, "Helvetica-Bold"); pdf.y -= 4 * mm
    y0 = pdf.kasten(42 * mm); pdf.y = y0 - 10 * mm
    pdf.text(enc, 17, "Courier-Bold", lead=24, x=L + 6 * mm, breite=R - L - 12 * mm); pdf.y = y0 - 48 * mm
    pdf.text("Hilfe: das Alphabet", 10, "Helvetica-Bold")
    c = pdf.c; w = (R - L) / 26
    for row, off in ((0, 0), (1, None)):
        for i, ch in enumerate(string.ascii_uppercase):
            x = L + i * w
            c.setStrokeColorRGB(0.6, 0.6, 0.6); c.rect(x, pdf.y - 9 * mm * (row + 1), w, 9 * mm)
            if row == 0:
                c.setFont("Helvetica-Bold", 11); c.setFillColorRGB(0, 0, 0); c.drawCentredString(x + w / 2, pdf.y - 6 * mm, ch)
    c.setFont("Helvetica", 8); c.drawString(L, pdf.y - 22 * mm, "Untere Reihe: tragt ein, welcher Buchstabe darüber steht, wenn ihr verschiebt.")
    pdf.y -= 34 * mm
    pdf.text("Entschlüsselte Nachricht:", 11, "Helvetica-Bold")
    for _ in range(3):
        c.setStrokeColorRGB(0.5, 0.5, 0.5); c.line(L, pdf.y - 4 * mm, R, pdf.y - 4 * mm); pdf.y -= 11 * mm
    pdf.text("→  Ziffer 2 = ____", 13, "Helvetica-Bold")
    pdf.fertig()
    return f"Rätsel 2 (Geheimschrift, Schlüssel {k}): „{satz}“ → Ziffer {ziffer}"


def suchsel(pdf, d, ziffer, thema):
    """Buchstabengitter mit Familiennamen + Themenwörtern. Übrige Buchstaben ergeben das Zahlwort."""
    rnd = random.Random(d["familie"] + "suchsel")
    norm = lambda s: s.upper().replace("Ä", "AE").replace("Ö", "OE").replace("Ü", "UE").replace("ß", "SS").replace(" ", "").replace("-", "")
    def kurz(n):  # zu lange Namen: längsten passenden Namensteil nehmen (z. B. „Großvater Heinz“ → HEINZ)
        if len(norm(n)) <= 11: return norm(n)
        teile = [norm(t) for t in n.replace("-", " ").split() if len(norm(t)) <= 11]
        return max(teile, key=len) if teile else norm(n)[:11]
    woerter = [kurz(n) for n in d["namen"]] + thema["woerter"]
    satz = "DIEDRITTEZIFFERIST" + ZAHLWORT[ziffer]
    fueller = {"weihnachten": "FROHEWEIHNACHTEN", "silvester": "GUTENRUTSCH", "geburtstag": "ALLESGUTE"}.get(d.get("thema", "weihnachten"), "VIELSPASS")
    N = 11
    bester = None
    for versuch in range(300):
        g = [[None] * N for _ in range(N)]; platziert = []
        for w in sorted(set(woerter), key=len, reverse=True):
            if len(w) > N: continue
            for _ in range(300):
                dx, dy = rnd.choice([(1, 0), (0, 1), (1, 1)])
                x = rnd.randrange(0, N - (len(w) - 1) * dx); y = rnd.randrange(0, N - (len(w) - 1) * dy)
                if all(g[y + i * dy][x + i * dx] in (None, ch) for i, ch in enumerate(w)):
                    for i, ch in enumerate(w): g[y + i * dy][x + i * dx] = ch
                    platziert.append(w); break
        frei = [(y, x) for y in range(N) for x in range(N) if g[y][x] is None]
        if len(frei) >= len(satz) and (bester is None or len(frei) < len(bester[1]) or len(platziert) > len(bester[2])):
            bester = (g, frei, platziert)
            if len(frei) - len(satz) <= 12 and len(platziert) >= len(set(woerter)) - 1: break
    if not bester: sys.exit("Buchstabengitter ließ sich nicht bauen – weniger/kürzere Namen angeben.")
    g, frei, platziert = bester
    text = satz + (fueller * 10)[: len(frei) - len(satz)]
    for (y, x), ch in zip(frei, text): g[y][x] = ch
    pdf.seite("Rätsel 3: Das Buchstabengitter", "3 / 4")
    pdf.text("Versteckt sind die Namen eurer Familie und ein paar Wörter (waagerecht, senkrecht oder schräg nach "
             "rechts unten). Streicht alle gefundenen Wörter durch. Die übrigen Buchstaben ergeben – Zeile für Zeile "
             "von links oben gelesen – eine geheime Botschaft mit der DRITTEN Ziffer.", 11)
    pdf.y -= 3 * mm
    zelle = 11 * mm; x0 = (W - N * zelle) / 2; c = pdf.c
    for yy in range(N):
        for xx in range(N):
            c.setStrokeColorRGB(0.75, 0.75, 0.75); c.rect(x0 + xx * zelle, pdf.y - (yy + 1) * zelle, zelle, zelle)
            c.setFont("Helvetica-Bold", 15); c.setFillColorRGB(0.1, 0.1, 0.1)
            c.drawCentredString(x0 + xx * zelle + zelle / 2, pdf.y - (yy + 1) * zelle + 3.6 * mm, g[yy][xx])
    pdf.y -= N * zelle + 8 * mm
    pdf.text("Gesucht: " + ", ".join(sorted(set(platziert))), 11)
    pdf.y -= 2 * mm; pdf.text("Botschaft: _______________________________   →  Ziffer 3 = ____", 13, "Helvetica-Bold")
    pdf.fertig()
    return f"Rätsel 3 (Buchstabengitter): übrige Buchstaben = {text} → Ziffer {ziffer}"


def rechnen(pdf, d, ziffer):
    """Familien-Rechnung: Zahlen aus Fakten, Ergebnis-Endziffer = Ziffer 4 (wird automatisch angepasst)."""
    r = d["rechnung"]; a, b = r["a"]["wert"], r["b"]["wert"]
    zwischen = a + b
    korrektur = (ziffer - zwischen) % 10  # so viel muss noch addiert werden
    pdf.seite("Rätsel 4: Die Familien-Rechnung", "4 / 4")
    pdf.text("Der Wichtel hat eine Rechnung versteckt. Die Zahlen kennt nur, wer diese Familie kennt. "
             "Die LETZTE Ziffer des Ergebnisses ist die VIERTE Ziffer des Codes.", 11)
    pdf.y -= 6 * mm
    for zeile in (f"A  =  {r['a']['frage']}", f"B  =  {r['b']['frage']}",
                  f"C  =  {korrektur}   (das hat der Wichtel schon für euch ausgerechnet)"):
        pdf.text(zeile, 12.5, "Helvetica-Bold"); pdf.y -= 3 * mm
    pdf.y -= 8 * mm
    y0 = pdf.kasten(40 * mm); pdf.y = y0 - 14 * mm
    pdf.text("A  +  B  +  C   =   __________", 20, "Helvetica-Bold", x=L + 25 * mm)
    pdf.y = y0 - 52 * mm
    pdf.text("Die letzte Ziffer des Ergebnisses  →  Ziffer 4 = ____", 13, "Helvetica-Bold")
    pdf.fertig()
    return f"Rätsel 4 (Rechnung): {a} + {b} + {korrektur} = {zwischen + korrektur} → Ziffer {ziffer}"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; vorschau = "--vorschau" in sys.argv
    if len(args) != 1: sys.exit(__doc__)
    d = json.load(open(args[0], encoding="utf-8")); t = THEMEN[d.get("thema", "weihnachten")]
    rnd = random.Random(d["familie"])
    code = d.get("code") or [rnd.choice([1, 2, 3, 4, 8, 9])] + [rnd.randrange(1, 10) for _ in range(3)]  # Ziffer 1: 4-Buchstaben-Zahlwort → 4 Quizfragen
    out = os.path.splitext(args[0])[0]; os.makedirs(out, exist_ok=True)
    name = d["familie"].replace(" ", "_")
    pre = "VORSCHAU_" if vorschau else ""
    pdf = Pdf(os.path.join(out, f"{pre}{name}_Spiel.pdf"), t, vorschau)
    pdf.c.setTitle(f"{t['titel']} – {d['familie']}")
    # Titelseite
    c = pdf.c; c.setFillColorRGB(*t["farbe"]); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColorRGB(*t["akzent"]); c.setFont("Helvetica-Bold", 14); c.drawCentredString(W / 2, H - 60 * mm, "EIN ESCAPE-SPIEL NUR FÜR")
    c.setFillColorRGB(1, 1, 1); c.setFont("Helvetica-Bold", 34); c.drawCentredString(W / 2, H - 78 * mm, d["familie"].upper())
    c.setFont("Helvetica-Bold", 26); c.setFillColorRGB(*t["akzent"]); c.drawCentredString(W / 2, H - 105 * mm, t["titel"])
    pdf.y = H - 130 * mm; pdf.text(d.get("story") or t["story"], 13, x=L + 10 * mm, farbe=(1, 1, 1), breite=R - L - 20 * mm, lead=19)
    pdf.y -= 8 * mm
    pdf.text("Mitspieler: " + ", ".join(d["namen"]), 12, "Helvetica-Bold", x=L + 10 * mm, farbe=(1, 1, 1))
    pdf.y -= 10 * mm
    c.setFillColorRGB(*t["akzent"]); c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(W / 2, pdf.y - 10 * mm, "CODE:   [   ]  [   ]  [   ]  [   ]")
    pdf.fertig()
    loes = [quiz(pdf, d, code[0]), geheimschrift(pdf, d, code[1]), suchsel(pdf, d, code[2], t), rechnen(pdf, d, code[3])]
    # Tresor-Seite: obere Hälfte Hinweis, untere Hälfte Lösung (falten + zukleben)
    pdf.seite("Der Tresor")
    pdf.text("Ihr habt alle vier Ziffern? Dann ruft laut euren Code der Spielleitung zu. Ist er richtig, dürft ihr "
             "den Tresor öffnen: Unten abschneiden oder die zugeklebte Lasche aufreißen.", 12)
    c.setDash(4, 4); c.setStrokeColorRGB(0.4, 0.4, 0.4); c.line(L - 10 * mm, H / 2, R + 10 * mm, H / 2); c.setDash()
    c.setFont("Helvetica", 9); c.drawString(L, H / 2 + 2 * mm, "- - -  hier falten und zukleben – erst mit dem richtigen Code öffnen!")
    pdf.y = H / 2 - 25 * mm
    pdf.text("GESCHAFFT!", 30, "Helvetica-Bold", farbe=t["farbe"]); pdf.y -= 4 * mm
    pdf.text(d["schatz"], 16, lead=24)
    pdf.fertig(); pdf.c.save()
    # Spielleitung
    sl = Pdf(os.path.join(out, f"{pre}{name}_Spielleitung.pdf"), t, vorschau)
    sl.seite("Für die Spielleitung – nicht zeigen!")
    sl.text(f"Der richtige Code lautet:  {' '.join(map(str, code))}", 18, "Helvetica-Bold", farbe=t["farbe"]); sl.y -= 4 * mm
    sl.text("So geht's: 1) Spiel-PDF ausdrucken (die Rätselseiten am besten einzeln). 2) Die letzte Seite (Tresor) "
            "an der gestrichelten Linie falten und zukleben. 3) Das echte Geschenk an dem Ort verstecken, der im Tresor "
            "steht. 4) Titelseite vorlesen, dann alle Rätsel auf den Tisch legen. Dauer: ca. 45–60 Minuten. "
            "Tipp: Wenn jemand festhängt, darf die Spielleitung einen Hinweis geben.", 11)
    sl.y -= 4 * mm
    for l in loes: sl.text(l, 11); sl.y -= 3 * mm
    sl.text(f"Tresor-Inhalt: {d['schatz']}", 11, "Helvetica-Bold")
    sl.fertig(); sl.c.save()
    print("Fertig:", os.path.abspath(out), "· Code", "".join(map(str, code)))


if __name__ == "__main__":
    main()
