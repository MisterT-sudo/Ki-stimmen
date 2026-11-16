# Anleitung Website – für Niklas

Die Website liegt in diesem Ordner und wird **automatisch über GitHub Pages veröffentlicht**,
sobald auf `main` etwas in `website/` geändert wird.

Adresse: **https://mistert-sudo.github.io/Ki-stimmen/**

## Was drin ist

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hörproben, Ablauf, Preise, Weihnachts-Hinweis, FAQ, Kontakt |
| `impressum.html` | Impressum (Theo & Niklas, GbR, Edewecht) |
| `datenschutz.html` | Datenschutzerklärung (Hoster: GitHub Pages) |
| `i18n.js` | Übersetzungen für den 🌐-Sprachknopf (EN, TR, PL, RU, UK, AR) |
| `style.css` | Aussehen (Farben, Schriften) |
| `audio/` | Die 4 Hörproben mit Stimme Lea |
| `vorschau_handy.png` | So sieht es auf dem Handy aus (wird nicht veröffentlicht) |

## Etwas ändern

1. Datei in `website/` ändern und auf `main` hochladen.
2. Nach 1–2 Minuten ist die Änderung online. Den Fortschritt siehst du im Repo unter **Actions**
   („Website veröffentlichen“).

## Texte ändern (mehrsprachig)

Der deutsche Text steht direkt in `index.html`. Jedes übersetzte Element hat ein `data-i18n="schluessel"`.
Wenn du einen deutschen Text änderst, pass in `i18n.js` denselben Schlüssel in allen Sprachen an.
Neuer Text: im HTML `data-i18n="neuer.schluessel"` dazuschreiben und in `i18n.js` je Sprache eine Zeile ergänzen.
Fehlt eine Übersetzung, erscheint automatisch der deutsche Text.
Link direkt in einer Sprache: `index.html?lang=en` (de, en, tr, pl, ru, uk, ar).

## Noch offen

- Datenschutzerklärung einmal mit einem Datenschutz-Generator gegenprüfen.
- Wenn ihr eine eigene Domain kauft (z. B. ansagewerk.de): unter Settings → Pages eintragen.

Wenn du etwas änderst: kurz in `NEUIGKEITEN.md` eintragen.
