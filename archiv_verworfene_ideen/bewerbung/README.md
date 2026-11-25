# Bewerbungswerk: Bewerbungen schreiben lassen

Leute schicken uns ihre Daten und die Stellenanzeige. Wir liefern innerhalb von 48 Stunden ein
fertiges Anschreiben und einen Lebenslauf, als PDF und als Word-Datei.

**Ziel: 100 € Umsatz.** Das sind 4 Komplettpakete à 25 €.

## Wer macht was

| Aufgabe | Wer | Aufwand |
|---|---|---|
| Texte schreiben, Dokumente gestalten, Korrekturen | **Claude** | – |
| Anzeigentexte, Titelbild, Antwortvorlagen | **Claude** (fertig, siehe unten) | – |
| Kundenmails lesen, Rückfragen und Lieferung als Gmail-Entwurf vorbereiten | **Claude** | – |
| Anzeigen bei Kleinanzeigen einstellen (einmalig) | **Niklas** | ca. 15 Min. |
| Kleinanzeigen-Nachrichten beantworten: Kunden zum Fragebogen bzw. zur Mail schicken (Vorlage 1) | **Niklas** | 1 Min. pro Anfrage |
| Entwürfe kurz ansehen und auf „Senden“ drücken | **Niklas** | 1 Min. pro Mail |
| Zahlung prüfen (PayPal/Überweisung) | **Niklas** | – |

Mehr kann ich nicht selbst übernehmen: Ich kann keine Konten eröffnen, kein Geld annehmen und keine
Kleinanzeigen-Nachrichten lesen. Alles andere mache ich.

## Ablauf eines Auftrags

1. Ein Kunde meldet sich auf Kleinanzeigen. Niklas schickt **Vorlage 1** (aus `VORLAGEN.md`).
2. Der Kunde mailt Fragebogen, alten Lebenslauf (falls vorhanden) und Stellenanzeige an **ansagewerk@gmail.com**
   (auf dieses Postfach habe ich Zugriff; später gern ein eigenes Postfach).
3. Claude legt `auftraege/<name>.json` an (wird **nie** committet, das Repo ist öffentlich), schreibt die Texte und erstellt die Vorschau:
   `python3 bewerbung/werkzeug/erstellen.py bewerbung/auftraege/<name>.json --vorschau`
4. Claude legt in Gmail einen Entwurf mit Vorschau und Zahlungsdaten an (**Vorlage 2**). Niklas sendet ihn.
5. Sobald das Geld da ist, erstellt Claude die fertigen Dateien ohne `--vorschau` und legt **Vorlage 3** als Entwurf an.
6. Kundendaten nach 30 Tagen löschen (Mail + Auftragsordner).

## Preise

| Paket | Preis |
|---|---|
| Lebenslauf (neu gestaltet + überarbeitet) | 15 € |
| Anschreiben für eine Stelle | 15 € |
| **Komplettpaket** (Anschreiben + Lebenslauf, 1 Korrekturrunde) | **25 €** |
| Jedes weitere Anschreiben für eine andere Stelle | 10 € |

Bezahlt wird nach der Vorschau, vor der Lieferung der fertigen Dateien. Das schützt vor Nicht-Zahlern,
und der Kunde kauft trotzdem nicht die Katze im Sack.

## Was noch erledigt werden muss, bevor es losgeht (Niklas)

1. **Gewerbe:** Das ist ein anderer Zweck als die Ansagewerk-GbR. Entweder mit Theo klären, dass die GbR das
   mit übernimmt, oder ein eigenes Gewerbe bei der Gemeinde Edewecht anmelden (online, ca. 20–30 €).
   Kleinunternehmerregelung (§ 19 UStG) → keine Umsatzsteuer auf der Rechnung.
2. **Zahlung:** Eine IBAN oder ein PayPal-Konto für geschäftliche Zahlungen (nicht „Freunde & Familie“). Bitte in
   `VORLAGEN.md` bei **[ZAHLUNGSDATEN]** eintragen oder mir sagen.
3. **Kleinanzeigen:** Anzeigen aus `ANZEIGEN.md` einstellen, als **gewerblicher Anbieter** (mit Impressum,
   Pflicht bei Gewerbe). Kategorie: *Dienstleistungen → Sonstige Dienstleistungen*.
4. Bilder: `beispiel/anzeige_titelbild.jpg` als erstes Bild hochladen.

## Warum das realistisch ist

- Auf Kleinanzeigen wird aktiv gesucht („Bewerbung schreiben lassen“, „Lebenslauf erstellen“).
  Wir müssen also niemanden kalt anschreiben.
- Professionelle Anbieter nehmen meist 50–150 € für ein Komplettpaket. Mit 25 € sind wir deutlich günstiger.
- Ein Auftrag kostet Niklas etwa 5 Minuten (weiterleiten und senden), den Rest mache ich.
- Ehrlich: Neue Anzeigen ohne Bewertungen brauchen etwas Zeit. Rechne mit 2–4 Wochen bis 100 €. Die erste
  Anzeige alle 7 Tage kostenlos „hochschieben“ (neu einstellen) hilft. Der Januar ist die stärkste
  Bewerbungszeit des Jahres.

## Dateien

- `ANZEIGEN.md`: fertige Kleinanzeigen-Texte (zum Kopieren)
- `FRAGEBOGEN.md`: was der Kunde uns schicken soll
- `VORLAGEN.md`: Antworttexte für Kleinanzeigen und Mails
- `beispiel/`: Musterbewerbung (erfundene Person) + Anzeigenbild
- `werkzeug/erstellen.py`: macht aus einer JSON-Datei Lebenslauf und Anschreiben (PDF + Word)
