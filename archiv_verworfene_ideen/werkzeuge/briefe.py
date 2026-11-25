#!/usr/bin/env python3
"""Erzeugt verkauf/briefe_edewecht.pdf: ein persönlicher Brief pro Praxis aus zielliste_edewecht.md.
Neu erzeugen nach Änderungen an der Zielliste: python3 werkzeuge/briefe.py"""
import re, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF

ROOT = os.path.join(os.path.dirname(__file__), "..")
URL = "https://mistert-sudo.github.io/Ki-stimmen/#hoerproben"
TEAL = (0.06, 0.46, 0.43)

def praxen():
    for line in open(os.path.join(ROOT, "zielliste_edewecht.md"), encoding="utf-8"):
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(c) >= 4 and c[3] == "offen" and not c[0].startswith("Name") and "prüfen)" not in c[0]:
            name, adr = c[0], c[1]
            ort = "26188 Edewecht"
            if "," in adr:
                adr, teil = [x.strip() for x in adr.split(",", 1)]
                ort = "26188 Edewecht-" + teil.replace("Süd Edewecht", "Süddorf")
            yield name, adr, ort

def absatz(c, text, x, y, w, size=11, lead=15.5, font="Helvetica"):
    c.setFont(font, size)
    for para in text.split("\n"):
        line = ""
        for word in para.split():
            t = (line + " " + word).strip()
            if c.stringWidth(t, font, size) > w:
                c.drawString(x, y, line); y -= lead; line = word
            else:
                line = t
        c.drawString(x, y, line); y -= lead
    return y

def brief(c, name, adr, ort):
    W, H = A4; L = 25 * mm; R = W - 20 * mm
    c.setFillColorRGB(*TEAL); c.setFont("Helvetica-Bold", 20); c.drawString(L, H - 25 * mm, "Ansagewerk")
    c.setFillColorRGB(.35, .4, .42); c.setFont("Helvetica", 9)
    c.drawRightString(R, H - 21 * mm, "Theo & Niklas · Buchenweg 9 · 26188 Edewecht")
    c.drawRightString(R, H - 26 * mm, "ansagewerk@gmail.com")
    c.setFont("Helvetica", 7.5); c.drawString(L, H - 47 * mm, "Ansagewerk · Buchenweg 9 · 26188 Edewecht")
    c.setFillColorRGB(0, 0, 0); y = absatz(c, f"{name}\n{adr}\n{ort}", L, H - 54 * mm, 85 * mm)
    c.setFont("Helvetica", 10); c.drawRightString(R, H - 92 * mm, "Edewecht, Ende November 2026")
    y = H - 105 * mm
    c.setFont("Helvetica-Bold", 13); c.drawString(L, y, "Ihre Weihnachtsansage – fertig in 24 Stunden, Hörprobe kostenlos"); y -= 11 * mm
    y = absatz(c, (
        "Guten Tag,\n\n"
        "wir sind Theo und Niklas aus Edewecht. Mit einer natürlich klingenden KI-Stimme erstellen wir "
        "Telefonansagen für Praxen hier im Ort: Weihnachts- und Urlaubsansagen, Begrüßung, Warteschleife "
        "und Ansagen außerhalb der Sprechzeiten.\n\n"
        "Zwischen den Jahren rufen viele Patienten an und wollen wissen: Wann ist geöffnet, wer vertritt? "
        "Schicken Sie uns einfach Ihre Feiertags-Zeiten und die Vertretung per E-Mail. Sie bekommen innerhalb "
        "von 24 Stunden eine kostenlose Hörprobe mit dem Namen Ihrer Praxis. Gefällt sie Ihnen, liefern wir die "
        "Datei passend für Ihre Telefonanlage (z. B. FRITZ!Box, Telekom, 3CX)."
    ), L, y, R - L)
    y -= 4 * mm
    c.setFillColorRGB(.94, .99, .98); c.roundRect(L, y - 30 * mm, R - L - 42 * mm, 32 * mm, 4 * mm, fill=1, stroke=0)
    c.setFillColorRGB(*TEAL); c.setFont("Helvetica-Bold", 12)
    c.drawString(L + 5 * mm, y - 6 * mm, "Weihnachtsansage: 39 €   ·   Paket „Praxis komplett“: 99 €")
    c.setFillColorRGB(0, 0, 0); c.setFont("Helvetica", 10.5)
    c.drawString(L + 5 * mm, y - 13 * mm, "Erst hören, dann zahlen – per Rechnung, kein Risiko.")
    c.drawString(L + 5 * mm, y - 19.5 * mm, "Bitte bis 18.12. melden, damit es vor den Feiertagen fertig ist.")
    c.setFont("Helvetica-Bold", 10.5); c.drawString(L + 5 * mm, y - 26 * mm, "E-Mail: ansagewerk@gmail.com")
    q = qr.QrCodeWidget(URL); b = q.getBounds(); s = 34 * mm
    d = Drawing(s, s, transform=[s / (b[2] - b[0]), 0, 0, s / (b[3] - b[1]), 0, 0]); d.add(q)
    renderPDF.draw(d, c, R - 36 * mm, y - 31 * mm)
    c.setFont("Helvetica", 8); c.drawCentredString(R - 19 * mm, y - 34 * mm, "Stimmen anhören")
    y -= 46 * mm
    y = absatz(c, "Viele Grüße aus Edewecht\n\nTheo & Niklas", L, y, R - L)
    c.setFillColorRGB(.4, .4, .4); c.setFont("Helvetica", 7.5)
    c.drawString(L, 18 * mm, "Ansagewerk · Theo Lennox Pophanken & Niklas Schürmann GbR · Buchenweg 9 · 26188 Edewecht")
    c.drawString(L, 14 * mm, "Kleinunternehmer gem. § 19 UStG · Keine weitere Post gewünscht? Eine kurze Mail genügt.")
    c.showPage()

if __name__ == "__main__":
    out = os.path.join(ROOT, "verkauf", "briefe_edewecht.pdf")
    c = canvas.Canvas(out, pagesize=A4); c.setTitle("Ansagewerk – Briefe Edewecht")
    n = 0
    for p in praxen(): brief(c, *p); n += 1
    c.save(); print(n, "Briefe →", os.path.abspath(out))
