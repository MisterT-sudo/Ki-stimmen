// Stimmen-Karussell: farbige, weiche Kugeln, die sich zur Stimme bewegen.
(function () {
  var list = document.querySelector('.voices'); if (!list) return;
  var slides = [].slice.call(list.querySelectorAll('.voice'));
  var dots = document.querySelector('.voices-dots');
  var audio = new Audio(), ctx, analyser, data, current = null, active = 0;

  function hex(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; }
  var S = slides.map(function (el, i) {
    var cv = el.querySelector('canvas'), dpr = Math.min(window.devicePixelRatio || 1, 2), size = 180;
    cv.width = size * dpr; cv.height = size * dpr;
    var b = document.createElement('button'); b.setAttribute('aria-label', (i + 1) + '');
    b.onclick = function () { go(i); }; dots.appendChild(b);
    return { el: el, cv: cv, g: cv.getContext('2d'), cols: el.dataset.colors.split(',').map(hex), seed: i * 2.3, lvl: 0, e: 0 };
  });

  function setupAnalyser() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      var src = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = .75;
      data = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser); analyser.connect(ctx.destination);
    } catch (e) { analyser = null; }
  }
  function level(t) {
    if (!analyser) return .4 + .3 * Math.sin(t * 9);
    analyser.getByteFrequencyData(data);
    var s = 0; for (var i = 2; i < 64; i++) s += data[i];
    return Math.min(1, s / 62 / 100);
  }

  function draw(s, t) {
    var g = s.g, W = s.cv.width, c = W / 2, playing = s.el === current;
    s.lvl += ((playing ? level(t) : 0) - s.lvl) * .2;
    s.e += ((playing ? 1 : 0) - s.e) * .05;
    var R = W * .44 * (1 + s.lvl * .035), sp = .18 + s.e * .5, tt = t * sp + s.seed;
    g.clearRect(0, 0, W, W);

    // weicher Schatten
    g.save(); g.beginPath(); g.arc(c, c, R, 0, 7);
    g.shadowColor = 'rgba(0,0,0,' + (.06 + s.lvl * .04) + ')'; g.shadowBlur = W * .05; g.shadowOffsetY = W * .02;
    g.fillStyle = '#fbfaf8'; g.fill(); g.restore();

    g.save(); g.beginPath(); g.arc(c, c, R, 0, 7); g.clip();
    // Farbwolken, die durch die Kugel wandern
    for (var k = 0; k < s.cols.length; k++) {
      var a = tt * (0.6 + k * .17) + k * 1.9, rr = R * (.35 + .25 * Math.sin(tt * .7 + k));
      var x = c + Math.cos(a) * rr, y = c + Math.sin(a * 1.13) * rr;
      var rad = R * (0.75 + .25 * Math.sin(tt + k * 2) + s.lvl * .2);
      var col = s.cols[k], grd = g.createRadialGradient(x, y, 0, x, y, rad);
      grd.addColorStop(0, 'rgba(' + col + ',.75)'); grd.addColorStop(.55, 'rgba(' + col + ',.35)'); grd.addColorStop(1, 'rgba(' + col + ',0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, W);
    }
    // Glanz oben links + Rand-Schimmer
    var hl = g.createRadialGradient(c - R * .4, c - R * .45, 0, c - R * .4, c - R * .45, R * .9);
    hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.fillRect(0, 0, W, W);
    var rim = g.createRadialGradient(c, c, R * .75, c, c, R);
    rim.addColorStop(0, 'rgba(255,255,255,0)'); rim.addColorStop(1, 'rgba(255,255,255,.35)');
    g.fillStyle = rim; g.fillRect(0, 0, W, W);
    g.restore();
  }
  function frame(ms) {
    var t = ms / 1000;
    S.forEach(function (s, i) { if (Math.abs(i - active) <= 1 || s.el === current) draw(s, t); });
    requestAnimationFrame(frame);
  }

  function go(i) {
    i = Math.max(0, Math.min(S.length - 1, i));
    var el = slides[i];
    list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }
  function onScroll() {
    var mid = list.scrollLeft + list.clientWidth / 2, best = 0, bd = 1e9;
    slides.forEach(function (el, i) { var d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    if (best !== active || !slides[best].classList.contains('active')) {
      active = best;
      slides.forEach(function (el, i) { el.classList.toggle('active', i === best); });
      [].forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i === best); });
      if (current && current !== slides[best]) { audio.pause(); stop(); }
    }
  }
  list.addEventListener('scroll', onScroll, { passive: true });
  document.querySelector('.voices-nav.prev').onclick = function () { go(active - 1); };
  document.querySelector('.voices-nav.next').onclick = function () { go(active + 1); };

  function stop() {
    if (!current) return;
    current.classList.remove('playing'); current.querySelector('.voice-play').textContent = '▶'; current = null;
  }
  slides.forEach(function (el, i) {
    el.querySelector('.voice-orb').addEventListener('click', function () {
      if (i !== active) { go(i); return; }
      setupAnalyser(); if (ctx && ctx.state === 'suspended') ctx.resume();
      if (current === el) { audio.pause(); stop(); return; }
      stop(); current = el; el.classList.add('playing');
      el.querySelector('.voice-play').textContent = '❚❚';
      audio.src = el.dataset.src; audio.play();
    });
  });
  audio.addEventListener('ended', stop);

  onScroll(); requestAnimationFrame(frame);
})();
