#!/usr/bin/env python3
"""Bewerbungswerk: erstellt Lebenslauf + Anschreiben als PDF und Word aus einer JSON-Datei.

Aufruf:  python3 bewerbung/werkzeug/erstellen.py auftraege/<kunde>.json            (fertige Dateien)
         python3 bewerbung/werkzeug/erstellen.py auftraege/<kunde>.json --vorschau (nur PDF mit Wasserzeichen,
                                                                                 vor der Zahlung verschicken)
Ergebnis: Ordner neben der JSON-Datei, z. B. auftraege/<kunde>/
          Lebenslauf_<Name>.pdf/.docx, Anschreiben_<Name>.pdf/.docx
Aufbau der JSON-Datei: siehe bewerbung/beispiel/beispiel.json
"""
import json, os, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from docx import Document
from docx.shared import Pt, RGBColor, Cm

AKZENT = (0.11, 0.30, 0.45)  # dunkles Blau, seriös für alle Branchen
W, H = A4
L, R = 22 * mm, W - 20 * mm


def umbrechen(c, text, font, size, breite):
    zeilen = []
    for absatz in str(text).split("\n"):
        z = ""
        for wort in absatz.split():
            t = (z + " " + wort).strip()
            if c.stringWidth(t, font, size) > breite and z:
                zeilen.append(z); z = wort
            else:
                z = t
        zeilen.append(z)
    return zeilen


VORSCHAU = False


def wasserzeichen(c):
    if not VORSCHAU: return
    c.saveState(); c.setFillColorRGB(0.85, 0.15, 0.15, alpha=0.18); c.setFont("Helvetica-Bold", 70)
    c.translate(W / 2, H / 2); c.rotate(40)
    for dy in (-260, 0, 260): c.drawCentredString(0, dy, "VORSCHAU")
    c.restoreState()


class Seite:
    def __init__(self, c):
        self.c, self.y = c, H - 20 * mm
        wasserzeichen(c)

    def platz(self, h):
        if self.y - h < 20 * mm:
            self.c.showPage(); self.y = H - 20 * mm; wasserzeichen(self.c)

    def text(self, t, x=L, breite=None, font="Helvetica", size=10.5, lead=14.5, farbe=(0.1, 0.1, 0.1)):
        breite = breite or (R - x)
        for z in umbrechen(self.c, t, font, size, breite):
            self.platz(lead)
            self.c.setFont(font, size); self.c.setFillColorRGB(*farbe)
            self.c.drawString(x, self.y, z); self.y -= lead


def lebenslauf_pdf(d, pfad):
    c = canvas.Canvas(pfad, pagesize=A4); c.setTitle("Lebenslauf " + d["name"])
    s = Seite(c)
    c.setFillColorRGB(*AKZENT); c.rect(0, H - 42 * mm, W, 42 * mm, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1); c.setFont("Helvetica-Bold", 24); c.drawString(L, H - 20 * mm, d["name"])
    c.setFont("Helvetica", 11.5); c.drawString(L, H - 28 * mm, d.get("titel", ""))
    c.setFont("Helvetica", 9.5)
    kontakt = "  ·  ".join(x for x in [d.get("adresse"), d.get("telefon"), d.get("email")] if x)
    c.drawString(L, H - 36 * mm, kontakt)
    s.y = H - 54 * mm

    def abschnitt(titel):
        s.platz(30 * mm); s.y -= 2 * mm
        c.setFillColorRGB(*AKZENT); c.setFont("Helvetica-Bold", 12.5); c.drawString(L, s.y, titel.upper())
        c.setStrokeColorRGB(*AKZENT); c.setLineWidth(0.8); c.line(L, s.y - 2.5 * mm, R, s.y - 2.5 * mm)
        s.y -= 9 * mm

    if d.get("profil"):
        abschnitt("Profil"); s.text(d["profil"]); s.y -= 2 * mm
    for key, titel in (("erfahrung", "Berufserfahrung"), ("ausbildung", "Ausbildung")):
        if not d.get(key): continue
        abschnitt(titel)
        for e in d[key]:
            s.platz(18 * mm)
            c.setFont("Helvetica", 9.5); c.setFillColorRGB(0.4, 0.4, 0.4); c.drawString(L, s.y, e.get("zeit", ""))
            x = L + 38 * mm
            s.text(e["was"], x=x, font="Helvetica-Bold", size=10.5)
            if e.get("wo"): s.text(e["wo"], x=x, size=10, farbe=(0.35, 0.35, 0.35))
            for p in e.get("punkte", []): s.text("•  " + p, x=x + 2 * mm, size=10, lead=13.5)
            s.y -= 3 * mm
    if d.get("kenntnisse"):
        abschnitt("Kenntnisse")
        for k, v in d["kenntnisse"].items():
            s.platz(14 * mm)
            c.setFont("Helvetica-Bold", 10); c.setFillColorRGB(0.1, 0.1, 0.1); c.drawString(L, s.y, k)
            s.text(v, x=L + 38 * mm, size=10)
    if d.get("ort_datum"):
        s.y -= 8 * mm; s.text(d["ort_datum"], size=10); s.text(d["name"], font="Helvetica-Oblique", size=12)
    c.save()


def anschreiben_pdf(d, pfad):
    a = d["anschreiben"]
    c = canvas.Canvas(pfad, pagesize=A4); c.setTitle("Anschreiben " + d["name"])
    s = Seite(c)
    c.setFillColorRGB(*AKZENT); c.setFont("Helvetica-Bold", 16); c.drawString(L, s.y, d["name"]); s.y -= 6 * mm
    c.setFont("Helvetica", 9.5); c.setFillColorRGB(0.35, 0.35, 0.35)
    c.drawString(L, s.y, "  ·  ".join(x for x in [d.get("adresse"), d.get("telefon"), d.get("email")] if x))
    c.setStrokeColorRGB(*AKZENT); c.line(L, s.y - 3 * mm, R, s.y - 3 * mm)
    s.y = H - 52 * mm; s.text(a["empfaenger"], size=10.5)
    s.y = H - 90 * mm; c.setFont("Helvetica", 10.5); c.setFillColorRGB(0.1, 0.1, 0.1)
    c.drawRightString(R, s.y, a["ort_datum"]); s.y -= 12 * mm
    s.text(a["betreff"], font="Helvetica-Bold", size=11.5); s.y -= 5 * mm
    s.text(a["anrede"]); s.y -= 3 * mm
    for p in a["absaetze"]:
        s.text(p, lead=15); s.y -= 4 * mm
    s.text(a.get("gruss", "Mit freundlichen Grüßen")); s.y -= 10 * mm
    s.text(d["name"])
    c.save()


def docx_basis():
    doc = Document()
    st = doc.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(11)
    for sec in doc.sections:
        sec.left_margin = sec.right_margin = Cm(2.2); sec.top_margin = Cm(2)
    return doc


def kopf(doc, d):
    p = doc.add_paragraph(); r = p.add_run(d["name"]); r.bold = True; r.font.size = Pt(20)
    r.font.color.rgb = RGBColor(*(int(x * 255) for x in AKZENT))
    if d.get("titel"): doc.add_paragraph(d["titel"])
    doc.add_paragraph("  ·  ".join(x for x in [d.get("adresse"), d.get("telefon"), d.get("email")] if x))


def lebenslauf_docx(d, pfad):
    doc = docx_basis(); kopf(doc, d)
    if d.get("profil"):
        doc.add_heading("Profil", 2); doc.add_paragraph(d["profil"])
    for key, titel in (("erfahrung", "Berufserfahrung"), ("ausbildung", "Ausbildung")):
        if not d.get(key): continue
        doc.add_heading(titel, 2)
        t = doc.add_table(rows=0, cols=2)
        for e in d[key]:
            z = t.add_row().cells; z[0].text = e.get("zeit", "")
            p = z[1].paragraphs[0]; p.add_run(e["was"]).bold = True
            if e.get("wo"): z[1].add_paragraph(e["wo"])
            for pkt in e.get("punkte", []): z[1].add_paragraph("• " + pkt)
        for row in t.rows:
            row.cells[0].width = Cm(4); row.cells[1].width = Cm(12.5)
    if d.get("kenntnisse"):
        doc.add_heading("Kenntnisse", 2)
        for k, v in d["kenntnisse"].items():
            p = doc.add_paragraph(); p.add_run(k + ": ").bold = True; p.add_run(v)
    if d.get("ort_datum"):
        doc.add_paragraph(); doc.add_paragraph(d["ort_datum"]); doc.add_paragraph(d["name"])
    doc.save(pfad)


def anschreiben_docx(d, pfad):
    a = d["anschreiben"]; doc = docx_basis(); kopf(doc, d)
    doc.add_paragraph(); doc.add_paragraph(a["empfaenger"]); doc.add_paragraph(a["ort_datum"])
    p = doc.add_paragraph(); p.add_run(a["betreff"]).bold = True
    doc.add_paragraph(a["anrede"])
    for x in a["absaetze"]: doc.add_paragraph(x)
    doc.add_paragraph(a.get("gruss", "Mit freundlichen Grüßen")); doc.add_paragraph(); doc.add_paragraph(d["name"])
    doc.save(pfad)


def main():
    global VORSCHAU
    args = [a for a in sys.argv[1:] if a != "--vorschau"]; VORSCHAU = "--vorschau" in sys.argv
    if len(args) != 1: sys.exit(__doc__)
    quelle = args[0]; d = json.load(open(quelle, encoding="utf-8"))
    out = os.path.splitext(quelle)[0]; os.makedirs(out, exist_ok=True)
    n = d["name"].replace(" ", "_")
    if VORSCHAU:
        lebenslauf_pdf(d, os.path.join(out, f"VORSCHAU_Lebenslauf_{n}.pdf"))
        if d.get("anschreiben"): anschreiben_pdf(d, os.path.join(out, f"VORSCHAU_Anschreiben_{n}.pdf"))
        print("Vorschau fertig:", os.path.abspath(out)); return
    lebenslauf_pdf(d, os.path.join(out, f"Lebenslauf_{n}.pdf"))
    lebenslauf_docx(d, os.path.join(out, f"Lebenslauf_{n}.docx"))
    if d.get("anschreiben"):
        anschreiben_pdf(d, os.path.join(out, f"Anschreiben_{n}.pdf"))
        anschreiben_docx(d, os.path.join(out, f"Anschreiben_{n}.docx"))
    print("Fertig:", os.path.abspath(out))


if __name__ == "__main__":
    main()
