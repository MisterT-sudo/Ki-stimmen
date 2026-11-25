// Einstellungen für den Nebenkosten-Check.
// ZAHLUNGS_LINK: Stripe-Zahlungslink (Payment Link) für das Widerspruchsschreiben.
//   In Stripe beim Zahlungslink unter „Nach der Zahlung“ → „Kunden auf Ihre Website weiterleiten“ eintragen:
//   https://mistert-sudo.github.io/Ki-stimmen/nebenkosten/?bezahlt=1#brief
//   Leer lassen = Schreiben ist kostenlos (z. B. zum Testen oder für den Start).
window.NK_CONFIG = {
  ZAHLUNGS_LINK: "",
  PREIS: "4,90 €",
};
