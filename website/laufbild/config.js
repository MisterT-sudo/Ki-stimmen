// Einstellungen für Laufbild.
// ZAHLUNGS_LINK: Stripe-Zahlungslink (Payment Link) für den GPX-Download. In Stripe beim Link unter
//   „Nach der Zahlung“ → „Kunden auf Ihre Website weiterleiten“ eintragen:
//   https://mistert-sudo.github.io/Ki-stimmen/laufbild/?bezahlt=1
//   Leer lassen = GPX-Download kostenlos (z. B. für den Start, um Nutzer zu sammeln).
window.LB_CONFIG = {
  ZAHLUNGS_LINK: "",
  PREIS: "2,99 €",
  OVERPASS: ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"],
  NOMINATIM: "https://nominatim.openstreetmap.org/search",
  KACHELN: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
};
