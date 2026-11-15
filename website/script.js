(function () {
  "use strict";
  var C = window.KI_STIMMEN || {};
  var isTodo = function (v) { return !v || /^TODO/i.test(String(v)); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ----- Kontaktdaten aus config.js einsetzen ----- */
  var missing = ["inhaber", "strasse", "telefonAnzeige", "telefonLink", "email", "hoster"].filter(function (k) { return isTodo(C[k]); });
  var bar = $("#todo-bar");
  if (bar && missing.length) bar.hidden = false;

  $$("[data-c]").forEach(function (el) {
    var key = el.getAttribute("data-c");
    if (key === "telefon") {
      if (isTodo(C.telefonAnzeige) || isTodo(C.telefonLink)) return;
      el.textContent = C.telefonAnzeige;
      if (el.tagName === "A") el.href = "tel:" + C.telefonLink;
    } else if (key === "email") {
      if (isTodo(C.email)) return;
      el.textContent = C.email;
      if (el.tagName === "A") el.href = "mailto:" + C.email;
    } else if (!isTodo(C[key])) {
      el.textContent = C[key];
    }
  });

  var jahr = $("#jahr");
  if (jahr) jahr.textContent = new Date().getFullYear();

  /* ----- Weihnachts-Hinweis nur bis zum Stichtag ----- */
  var xmas = $("#xmas");
  if (xmas && C.weihnachtenBis) {
    var end = new Date(C.weihnachtenBis + "T23:59:59");
    if (!isNaN(end) && new Date() <= end) xmas.hidden = false;
  }

  /* ----- Mobiles Menü ----- */
  var toggle = $(".nav-toggle"), nav = $("#nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ----- Wellenform im Hero ----- */
  var wave = $("#wave");
  if (wave) {
    var heights = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 75, 40, 90, 65, 30, 55, 85, 45, 70, 95, 40, 60, 80, 35, 50, 75, 45, 30];
    heights.forEach(function (h, i) {
      var s = document.createElement("span");
      s.style.setProperty("--h", h);
      s.style.setProperty("--i", i);
      wave.appendChild(s);
    });
  }

  /* ----- Hörproben-Player ----- */
  var fmt = function (t) {
    if (!isFinite(t)) return "";
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  };
  var players = [];
  $$(".player").forEach(function (p) {
    var btn = $(".player__btn", p), fill = $(".player__bar i", p);
    var state = $(".player__state", p), time = $(".player__time", p);
    var audio = new Audio();
    audio.preload = "metadata";
    players.push({ el: p, audio: audio });

    audio.addEventListener("loadedmetadata", function () { time.textContent = fmt(audio.duration); });
    audio.addEventListener("error", function () {
      p.classList.add("is-missing");
      p.classList.remove("is-playing");
      btn.disabled = true;
      state.textContent = "Hörprobe folgt in Kürze";
      time.textContent = "";
    });
    audio.addEventListener("timeupdate", function () {
      if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
      time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
    });
    audio.addEventListener("play", function () { p.classList.add("is-playing"); state.textContent = "Läuft"; });
    audio.addEventListener("pause", function () { p.classList.remove("is-playing"); state.textContent = "Anhören"; });
    audio.addEventListener("ended", function () { fill.style.width = "0"; time.textContent = fmt(audio.duration); });

    btn.addEventListener("click", function () {
      if (audio.paused) {
        players.forEach(function (o) { if (o.audio !== audio) o.audio.pause(); });
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });
    audio.src = p.getAttribute("data-src");
  });

  /* ----- Preis-Buttons wählen das Produkt im Formular vor ----- */
  var wunsch = $("#f-wunsch");
  $$("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () { if (wunsch) wunsch.value = a.getAttribute("data-pick"); });
  });

  /* ----- Demo-Formular: öffnet das E-Mail-Programm ----- */
  var form = $("#demo-form"), status = $("#form-status");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var praxis = form.praxis.value.trim(), name = form.name.value.trim();
      if (!praxis || !name) {
        status.textContent = "Bitte geben Sie Praxis und Ansprechperson an.";
        (praxis ? form.name : form.praxis).focus();
        return;
      }
      if (isTodo(C.email)) {
        status.textContent = "Das Formular ist noch nicht freigeschaltet. Bitte rufen Sie uns an.";
        return;
      }
      var body = [
        "Guten Tag,", "",
        "ich interessiere mich für: " + form.wunsch.value, "",
        "Praxis / Betrieb: " + praxis,
        "Ansprechperson: " + name,
        "Telefon: " + (form.telefon.value.trim() || "–"), "",
        "Sprechzeiten / Nachricht:",
        form.nachricht.value.trim() || "–", "",
        "Viele Grüße", name
      ].join("\n");
      window.location.href = "mailto:" + C.email +
        "?subject=" + encodeURIComponent("Anfrage Telefonansage: " + praxis) +
        "&body=" + encodeURIComponent(body);
      status.textContent = "Ihr E-Mail-Programm öffnet sich. Bitte senden Sie die Nachricht dort ab.";
    });
  }

  /* ----- Sanftes Einblenden ----- */
  var items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
