# Rätselabend: das Escape-Spiel aus euren eigenen Familiengeschichten

Ein Escape-Spiel zum Ausdrucken, bei dem **jedes Rätsel aus der Familie des Käufers gebaut ist**: Papas
angebrannte Gans wird zur Quizfrage, Omas Alter zum Zahlenschloss, der Insider-Witz zur Geheimschrift.
Am Ende öffnet der Code den „Tresor“, und darin steht, wo das echte Geschenk versteckt ist.

**Für wen:** Privatleute. Eltern und Großeltern zu Weihnachten, Silvester mit Freunden, Kindergeburtstage,
Jahrestage.
**Preis:** 19 € (Weihnachten/Silvester/Geburtstag). **Ziel:** 100 € → 6 Spiele.
**Lieferung:** 2 PDFs per Mail innerhalb von 24 Stunden (Spiel + Blatt für die Spielleitung). Kein Versand, kein Lager.

## Warum das neu ist und warum es gerade jetzt geht

- Fertige Escape-Spiele zum Ausdrucken gibt es, aber nur von der Stange, für jede Familie dieselben Rätsel.
  Ein für eine einzige Familie geschriebenes Spiel für 19 € in 24 Stunden lohnte sich bisher nicht, weil es
  zu viel Handarbeit war. Diese Handarbeit mache jetzt ich.
- Bis Weihnachten sind es 4 Wochen. Es ist ein digitales Last-Minute-Geschenk, auch am 23.12. noch
  bestellbar. Danach kommen Silvester und das ganze Jahr Geburtstage.

## Wer macht was

| Aufgabe | Wer |
|---|---|
| Rätsel ausdenken, Texte schreiben, PDFs bauen, prüfen | **Claude** |
| Bestellungen im Postfach lesen, Spiel erstellen, Lieferung als Gmail-Entwurf vorbereiten | **Claude** |
| Anzeigentexte, Bilder, Vorlagen | **Claude** (fertig, siehe unten) |
| Anzeige einstellen + Status in WhatsApp posten (einmalig, ca. 15 Min.) | **Niklas** |
| Kleinanzeigen-Nachrichten mit Vorlage 1 beantworten | **Niklas** (1 Min.) |
| Zahlung prüfen, Lieferentwurf absenden | **Niklas** (1 Min.) |

Was ich nicht selbst kann: Konten eröffnen, Geld annehmen, Kleinanzeigen-/WhatsApp-Nachrichten lesen.

## Ablauf einer Bestellung

1. Kunde bestellt (Kleinanzeigen, WhatsApp, Etsy) → bekommt **Vorlage 1** mit dem Fragebogen.
2. Kunde zahlt 19 € und schickt den ausgefüllten Fragebogen an **ansagewerk@gmail.com**
   (dieses Postfach kann ich lesen; ein eigenes Postfach ist später besser).
3. Claude baut daraus `auftraege/<familie>.json` (wird nie committet, das Repo ist öffentlich) und erzeugt das Spiel:
   ```bash
   python3 raetselabend/werkzeug/spiel.py raetselabend/auftraege/<familie>.json
   ```
4. Claude prüft jedes Rätsel auf Lösbarkeit und legt **Vorlage 2** mit beiden PDFs als Gmail-Entwurf an.
   Niklas klickt auf „Senden“.
5. Kundendaten nach 30 Tagen löschen.

## Realistische Rechnung

- **Schnellster Weg zu den ersten 100 €: der eigene Bekanntenkreis.** WhatsApp-Status, Familiengruppe,
  Sportverein (Text in `ANZEIGEN.md`). 6 Verkäufe an Bekannte und deren Bekannte in der Vorweihnachtszeit
  sind gut machbar. Danach gibt es echte Fotos und Bewertungen für Kleinanzeigen und Etsy.
- Kleinanzeigen und Etsy brauchen ohne Bewertungen erfahrungsgemäß länger. Sie laufen parallel mit.
- Garantiert ist nichts. Kostet nichts, außer Etsy (ca. 0,20 $ pro Anzeige + Gebühren pro Verkauf).

## Vor dem Start (Niklas)

1. **Gewerbe:** Regelmäßiges Verkaufen ist gewerblich. Gewerbe bei der Gemeinde Edewecht anmelden (online,
   ca. 20–30 €) oder mit Theo klären, ob die GbR das mit übernimmt. Kleinunternehmer → keine Umsatzsteuer.
2. **Zahlung:** PayPal (Waren & Dienstleistungen) oder IBAN in `VORLAGEN.md` bei **[ZAHLUNGSDATEN]** eintragen.
3. **Widerrufsrecht:** Ein Spiel, das extra für den Kunden angefertigt wird, ist vom Widerruf ausgeschlossen
   (§ 312g Abs. 2 Nr. 1 BGB). Steht schon so in den Vorlagen. Kulanz: Wer unzufrieden ist, bekommt eine Korrektur.
4. Anzeigen einstellen (`ANZEIGEN.md`), Bild: `beispiel/anzeige_titelbild.jpg`.

## Dateien

- `ANZEIGEN.md`: WhatsApp-Status, Kleinanzeigen- und Etsy-Texte
- `FRAGEBOGEN.md`: was der Kunde ausfüllt
- `VORLAGEN.md`: Antworttexte
- `beispiel/`: komplettes Beispielspiel „Familie Beispiel“ (erfunden) + Anzeigenbild
- `werkzeug/spiel.py`: der Spiel-Generator (Themen: Weihnachten, Silvester, Geburtstag)
