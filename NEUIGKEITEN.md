# Neuigkeiten

🌐 **Website: https://mistert-sudo.github.io/Ki-stimmen/**

Neueste Einträge oben. Format: `Datum – Name: was gemacht / was als Nächstes`

## 📌 Aktueller Stand (16.11.2026) – für Niklas zum schnellen Überblick

- **Firmenname:** Ansagewerk · **E-Mail:** ansagewerk@gmail.com · Auftritt als „Theo & Niklas“
- **Stimme:** Lea (ElevenLabs). Demo-Paket fertig in `hoerproben/demo_paket_lea/`
- **Preise:** Einzelansage 39 € · Paket „Praxis komplett“ 99 € · Änderungsservice 9 €/Monat
- **Infoblatt:** `infoblatt/infoblatt_druck.pdf` ist **druckfertig, mit QR-Code** zu den Hörproben auf der Website.
- **Website:** **online** unter https://mistert-sudo.github.io/Ki-stimmen/ – wird bei jeder Änderung in `website/` auf `main` automatisch aktualisiert (Anleitung: `website/ANLEITUNG_NIKLAS.md`)
- **Zielliste:** `zielliste_edewecht.md` (17 Praxen)
- **Offen:** Gewerbe anmelden (beide) · Datenschutzerklärung einmal mit Generator gegenprüfen · Gesprächsskript

## Verlauf

- 26.11.2026 – Claude (tägliche Runde): 6 neue Mails (2 Australien, 4 Neuseeland). Gesamt ~205 Betriebe, weiterhin keine echte Antwort. Warte auf Entscheidung von Niklas: Runde pausieren oder Mail ändern.
- 25.11.2026 – Claude (tägliche Runde): 7 neue Mails (5 Australien, 2 Neuseeland). Gesamt ~200 Betriebe, weiterhin keine echte Antwort; heute 2 unzustellbar (Gold Coast Dental Services, The Physio Collective). Es werden kaum noch neue belegbare Adressen gefunden.
- 24.11.2026 – Claude (tägliche Runde): 11 neue Mails (8 Australien, 3 Neuseeland). Gesamt ~190 Betriebe, noch keine echte Antwort, heute keine Unzustellbaren.
- 23.11.2026 – Claude (tägliche Runde): 12 neue Mails (8 Australien, 4 Neuseeland). Gesamt ~180 Betriebe, noch keine echte Antwort; heute 1 unzustellbar (North Brisbane Chiropractic).
- 22.11.2026 – Claude (tägliche Runde): 14 neue Mails (10 Australien, 4 Neuseeland), u. a. erstmals Chiropraktiker. Gesamt ~168 Betriebe, noch keine echte Antwort; Family Dental Practice endgültig unzustellbar.
- 21.11.2026 – Claude (tägliche Runde): 18 neue Mails (13 Australien, 5 Neuseeland). Insgesamt jetzt rund 150 Betriebe angeschrieben, noch keine echte Antwort; Adelaide Animal Hospital endgültig unzustellbar.
- 20.11.2026 – Claude (tägliche Runde): 18 neue Mails (11 Australien, 6 Neuseeland, 1 UK). Noch keine echten Antworten; heute 1 unzustellbar (Bureta Physio), 2 Zustellungen verzögert.
- 19.11.2026 – Claude (tägliche Runde): 29 neue Mails (19 Australien, 10 Neuseeland). Noch keine echten Antworten; seit gestern 2 unzustellbar (Eaton Vets, So Physio).
- 18.11.2026 – Claude (tägliche Runde): 41 neue Mails (25 Australien, 16 Neuseeland). Bisher keine echten Antworten; 1 unzustellbar, 1 Zustellverzögerung, 2 Auto-Antworten.
- 17.11.2026 – Claude: Auf 50 Mails/Tag hochgefahren (Wunsch Niklas): weitere 26 an Zahnärzte, Physios, Tierärzte in Australien/Neuseeland. Heute insgesamt 48 Firmen-Mails, 1 unzustellbar, 2 Auto-Antworten, noch keine echte Antwort.
- 17.11.2026 – Claude: 14 persönliche E-Mails an Kleinbetriebe in Australien (Physio, Tierärzte) und Neuseeland (Zahnärzte) verschickt, Preise in A$/NZ$, ohne Straßenadresse.
  Regeln + Liste: `kontakte_ausland.md`. USA erst, wenn es eine Postanschrift (z. B. Postfach) für die Mails gibt.
- 17.11.2026 – Claude: 8 E-Mails an britische Praxen (Ltd) über ansagewerk@gmail.com verschickt, Preise in Pfund (£35/£85/£8). Liste + Status: `kontakte_ausland.md`.
  Antworten im Gmail-Postfach prüfen; wer „unsubscribe“ schreibt, nie wieder anschreiben.
- 17.11.2026 – Theo/Claude: **Entscheidung: keine Besuche vor Ort und kein Einspielen bei Kunden.** Alles läuft
  per E-Mail; wir liefern die fertige Datei. Website (alle 7 Sprachen) und Infoblatt entsprechend angepasst.
  Veraltete `website/en.html` gelöscht (Englisch läuft über den Sprachknopf).
- 16.11.2026 – Claude: Stimmproben wechseln jetzt mit der Website-Sprache: alle 7 Stimmen in allen 7 Sprachen
  (DE, EN, TR, PL, RU, UK, AR) unter `website/audio/stimmen/<sprache>/<stimme>.mp3`. Übersetzungen der
  Stimmen-Texte in `i18n.js` ergänzt. CSS/JS werden mit `?v=` geladen (gegen alten Browser-Cache) –
  bei Änderungen die Zahl erhöhen.
- 16.11.2026 – Claude: „Hören Sie selbst“ ist jetzt ein **Stimmen-Karussell** (`voices.js`): 7 Stimmen als farbige,
  animierte Kugeln, die sich zur Stimme bewegen. Deutsch: Lea, Petra, Franziska, Stephan, Julius.
  Englisch: Sarah, Daniel. Hörproben: `website/audio/stimme_*.mp3`. Alte Beispiel-Karten (player.js) entfernt,
  die Beispiel-Audios liegen weiter in `website/audio/`. Englische Texte in `i18n.js` ergänzt.
- 16.11.2026 – Claude: Hörproben-Karten neu gestaltet: weiße Karten mit Schatten, Fortschrittsbalken,
  Zeitanzeige, kleiner Equalizer, schimmernder Rahmen beim Abspielen (`style.css`, `player.js`).
- 16.11.2026 – Claude: Website mehrsprachig: 🌐-Knopf oben rechts mit Deutsch, Englisch, Türkisch, Polnisch, Russisch, Ukrainisch, Arabisch (`website/i18n.js`).
  Ersetzt den DE/EN-Umschalter; `en.html` leitet jetzt auf die englische Fassung weiter. Rechtstexte bleiben Deutsch.
  Übersetzungen am besten von Muttersprachlern gegenlesen lassen. **Texte auf der Startseite ändern → `i18n.js` mitpflegen** (siehe Anleitung).
- 16.11.2026 – Claude: Website: Player jetzt als weiße, animierte Sprechblasen (Canvas, reagiert auf die Stimme).
  Englische Version `website/en.html`, Umschalter DE/EN oben rechts.
- 16.11.2026 – Claude: Website: Hörproben jetzt als pulsierende Kugeln (`player.js`), 2 neue Beispiele
  (Handwerker, Englisch), neuer Abschnitt „Jede Sprache / Voice-Cloning“. Doppelte Pages-Automatik entfernt.
- 16.11.2026 – Claude: **Website ist online** (GitHub Pages). Infoblatt mit echtem QR-Code (`infoblatt/infoblatt_druck.pdf`), QR-Code per Scan-Test geprüft.
- 16.11.2026 – Claude: Impressum (Theo Lennox Pophanken & Niklas Schürmann GbR, Edewecht) und Datenschutz (Hoster GitHub Pages) ausgefüllt.
  Automatisches Veröffentlichen eingerichtet (`.github/workflows/website.yml`). Repo ist öffentlich, Zielliste bleibt bewusst drin.
- 16.11.2026 – Claude: Firmenname geändert auf **Ansagewerk**, E-Mail **ansagewerk@gmail.com**, Namen **Theo & Niklas**.
  Angepasst: Website (alle Seiten), Infoblatt (HTML + beide PDFs + Vorschau), Anleitung, diese Datei.
- 16.11.2026 – Theo/Claude: Entscheidung: Website erst online, wenn Impressum-Adresse geklärt ist.
  **Niklas macht die Website fertig** (Anleitung: `website/ANLEITUNG_NIKLAS.md`).
  Bis dahin: Infoblatt ohne QR-Code (`infoblatt/infoblatt_druck_ohne_qr.pdf`) + Hörproben vom Handy vorspielen.
- 16.11.2026 – Claude: Website gebaut (`website/`). Impressum/Datenschutz haben gelbe Platzhalter
  (echte Namen + Adresse nötig). Nächster Schritt: Hoster wählen und online stellen, dann QR-Code aufs Infoblatt.
- 16.11.2026 – Claude: Infoblatt-Entwurf erstellt (`infoblatt/`). Gelb markierte Stellen fehlen noch:
  Firmenname, Telefon/WhatsApp, E-Mail, Name, QR-Code. Bearbeiten in `infoblatt/infoblatt.html`.
- 16.11.2026 – Theo: Stimme **Lea** ausgewählt. Creator-Plan gekündigt, ab nächstem Monat Starter.
- 16.11.2026 – Claude: Demo-Paket „Praxis komplett“ mit Lea erstellt (`hoerproben/demo_paket_lea/`):
  Begrüßung, Warteschleife, außerhalb Sprechzeiten, Weihnachten. Texte in `TEXTE.md`.
  Nächster Schritt: Gewerbe anmelden, Infoblatt + Website.
- 16.11.2026 – Theo: Neues ElevenLabs-Konto, Creator-Plan gekauft und mit Claude verbunden.
- 16.11.2026 – Claude: 3 Hörproben erstellt (`hoerproben/`): Petra, Lea (weiblich), Stephan (männlich).
  Nächster Schritt: Lieblingsstimme auswählen (Theo + Freund), Gewerbe anmelden.
- 15.11.2026 – Theo: GitHub eingerichtet, Claude hat jetzt Zugriff.
- 15.11.2026 – Claude: Projekt angelegt, Zielliste (17 Praxen in Edewecht), 4-Wochen-Plan, README.
  Nächster Schritt: ElevenLabs-Plan auswählen, Stimmen aussuchen, erste Hörproben.
