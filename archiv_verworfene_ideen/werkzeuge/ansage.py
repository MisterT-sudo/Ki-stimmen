#!/usr/bin/env python3
"""Erstellt eine fertige Telefonansage in allen gängigen Formaten.

Aufruf:
  python3 werkzeuge/ansage.py --stimme lea --text "Herzlich willkommen ..." --name praxis_muster_weihnachten
  python3 werkzeuge/ansage.py --stimme lea --datei text.txt --name ...

Ergebnis in lieferungen/<name>/:
  <name>.mp3              Original (für Website, FRITZ!Box-Ansagen ab MP3, Cloud-Anlagen)
  <name>_telefon.wav      8 kHz, 16 bit, mono (FRITZ!Box, Auerswald, 3CX, Telekom CompanyFlex)
  <name>_alaw.wav         8 kHz G.711 A-law (ältere ISDN-/TK-Anlagen)
Braucht: ffmpeg und die ElevenLabs-Verbindung (Schlüssel wird vom Proxy gesetzt).
"""
import argparse, json, os, subprocess, sys, urllib.request, urllib.error

STIMMEN = {  # Namen wie auf der Website; IDs = ElevenLabs-Standardstimmen bzw. Bibliothek
    "lea": None, "petra": None, "franziska": None, "stephan": None,
    "julius": None, "sarah": "EXAVITQu4vr4xnSDxMaL", "daniel": "onwK4e9ZLuTAKqWW03F6",
}
API = "https://api.elevenlabs.io"

def req(path, data=None):
    r = urllib.request.Request(API + path, data=json.dumps(data).encode() if data else None,
                               headers={"xi-api-key": "proxy", "Content-Type": "application/json"})
    return urllib.request.urlopen(r, timeout=120)

def stimme_id(name):
    vid = STIMMEN.get(name.lower())
    if vid: return vid
    voices = json.load(req("/v2/voices?page_size=100"))["voices"]
    for v in voices:
        if v["name"].split()[0].lower() == name.lower():
            return v["voice_id"]
    sys.exit(f"Stimme '{name}' nicht im Konto gefunden. Vorhanden: {[v['name'] for v in voices]}")

def main():
    a = argparse.ArgumentParser()
    a.add_argument("--stimme", default="lea"); a.add_argument("--name", required=True)
    g = a.add_mutually_exclusive_group(required=True); g.add_argument("--text"); g.add_argument("--datei")
    o = a.parse_args()
    text = o.text or open(o.datei, encoding="utf-8").read().strip()
    out = os.path.join(os.path.dirname(__file__), "..", "lieferungen", o.name); os.makedirs(out, exist_ok=True)
    mp3 = os.path.join(out, o.name + ".mp3")
    try:
        audio = req(f"/v1/text-to-speech/{stimme_id(o.stimme)}?output_format=mp3_44100_128",
                    {"text": text, "model_id": "eleven_multilingual_v2",
                     "voice_settings": {"stability": 0.6, "similarity_boost": 0.8, "style": 0.15}}).read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs-Fehler {e.code}: {e.read()[:300]!r}\n→ Bei 401: API-Schlüssel in den Umgebungs-Einstellungen erneuern.")
    open(mp3, "wb").write(audio)
    # 0,5 s Stille vorne, damit die Anlage den Anfang nicht abschneidet; Lautheit fürs Telefon normalisieren
    f = "adelay=500|500,loudnorm=I=-16:TP=-1.5"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-af", f, "-ar", "8000", "-ac", "1",
                    "-sample_fmt", "s16", os.path.join(out, o.name + "_telefon.wav")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-af", f, "-ar", "8000", "-ac", "1",
                    "-acodec", "pcm_alaw", os.path.join(out, o.name + "_alaw.wav")], check=True)
    open(os.path.join(out, "TEXT.txt"), "w", encoding="utf-8").write(text + "\n")
    print("Fertig:", os.path.abspath(out))

if __name__ == "__main__":
    main()
