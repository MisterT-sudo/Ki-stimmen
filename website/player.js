// Sprechblasen-Player: weiße, weich schimmernde Blasen, die sich zur Stimme verformen.
(function () {
  var audio = new Audio(), ctx, analyser, data, current = null;
  var cards = [].slice.call(document.querySelectorAll('.orb-card'));
  function fmt(s) { s = Math.round(s || 0); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  cards.forEach(function (card) {
    var meta = document.createElement('span'); meta.className = 'orb-meta';
    meta.innerHTML = '<span class="eq"><i></i><i></i><i></i><i></i><i></i></span><span class="orb-time">–:––</span>';
    card.appendChild(meta);
    var bar = document.createElement('span'); bar.className = 'orb-bar'; card.appendChild(bar);
    var probe = new Audio(); probe.preload = 'metadata'; probe.src = card.dataset.src;
    probe.addEventListener('loadedmetadata', function () { card.dataset.dur = probe.duration; meta.lastChild.textContent = fmt(probe.duration); });
  });
  var state = cards.map(function (card, i) {
    var cv = card.querySelector('canvas'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = 76 * dpr; cv.height = 76 * dpr;
    return { card: card, cv: cv, g: cv.getContext('2d'), dpr: dpr, seed: i * 1.7, lvl: 0, energy: 0 };
  });

  function setupAnalyser() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      var src = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = .7;
      data = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser); analyser.connect(ctx.destination);
    } catch (e) { analyser = null; }
  }

  function level() {
    if (!analyser) return .35 + .25 * Math.sin(Date.now() / 110);
    analyser.getByteFrequencyData(data);
    var sum = 0; for (var i = 2; i < 60; i++) sum += data[i];
    return Math.min(1, sum / 58 / 110);
  }

  function draw(s, t) {
    var g = s.g, W = s.cv.width, cx = W / 2, cy = W / 2, R = W * .30;
    var playing = s.card === current;
    var target = playing ? level() : 0;
    s.lvl += (target - s.lvl) * .25;
    s.energy += ((playing ? 1 : 0) - s.energy) * .06;
    var amp = .035 + s.energy * .05 + s.lvl * .11, speed = .6 + s.energy * 1.6;
    g.clearRect(0, 0, W, W);

    // Blasen-Umriss mit weichen Wellen
    g.beginPath();
    for (var k = 0; k <= 64; k++) {
      var a = k / 64 * Math.PI * 2, tt = t * speed + s.seed;
      var r = R * (1 + s.lvl * .1 + amp * (Math.sin(a * 3 + tt * 1.3) * .6 + Math.sin(a * 5 - tt * 1.7) * .3 + Math.sin(a * 2 + tt * .7) * .4));
      var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      k ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();

    // Schatten / Glow
    g.save();
    g.shadowColor = 'rgba(15,118,110,' + (.15 + s.energy * .1 + s.lvl * .12) + ')';
    g.shadowBlur = (5 + s.lvl * 9) * s.dpr;
    g.fillStyle = '#fff'; g.fill();
    g.restore();

    // Innen: weiß mit wandernden Pastell-Schimmern
    g.save(); g.clip();
    var cols = ['rgba(153,246,228,', 'rgba(191,219,254,', 'rgba(221,214,254,'];
    for (var j = 0; j < 3; j++) {
      var ang = t * (.5 + j * .23) * speed + j * 2.1 + s.seed;
      var px = cx + Math.cos(ang) * R * .45, py = cy + Math.sin(ang * 1.2) * R * .45;
      var grd = g.createRadialGradient(px, py, 0, px, py, R * 1.1);
      grd.addColorStop(0, cols[j] + (.55 + s.energy * .35) + ')');
      grd.addColorStop(1, cols[j] + '0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, W);
    }
    var hl = g.createRadialGradient(cx - R * .35, cy - R * .4, 0, cx - R * .35, cy - R * .4, R * .7);
    hl.addColorStop(0, 'rgba(255,255,255,.95)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.fillRect(0, 0, W, W);
    g.restore();

    g.lineWidth = 1 * s.dpr; g.strokeStyle = 'rgba(11,59,68,.08)'; g.stroke();
  }

  function frame(ms) {
    var t = ms / 1000;
    state.forEach(function (s) { draw(s, t); });
    if (current) {
      var s = state[cards.indexOf(current)], bars = current.querySelectorAll('.eq i');
      for (var i = 0; i < bars.length; i++) bars[i].style.height = (4 + 14 * Math.min(1, s.lvl * (0.7 + 0.6 * Math.abs(Math.sin(t * (6 + i * 1.7) + i))))) + 'px';
      var d = audio.duration || +current.dataset.dur || 1;
      current.querySelector('.orb-bar').style.width = (audio.currentTime / d * 100) + '%';
      current.querySelector('.orb-time').textContent = fmt(audio.currentTime) + ' / ' + fmt(d);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function stop() {
    if (!current) return;
    current.classList.remove('playing');
    current.querySelector('.orb-bar').style.width = '0';
    current.querySelectorAll('.eq i').forEach(function (b) { b.style.height = '4px'; });
    current.querySelector('.orb-time').textContent = fmt(+current.dataset.dur);
    current.querySelector('.orb-icon').textContent = '▶';
    current = null;
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      setupAnalyser();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      if (current === card) { audio.pause(); stop(); return; }
      stop();
      current = card; card.classList.add('playing');
      card.querySelector('.orb-icon').textContent = '❚❚';
      audio.src = card.dataset.src; audio.play();
    });
  });
  audio.addEventListener('ended', stop);
})();
