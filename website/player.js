// Kugel-Player: Die Kugel pulsiert passend zur Lautstärke der Ansage.
(function () {
  var audio = new Audio(), ctx, analyser, data, current = null, raf;
  audio.crossOrigin = 'anonymous';

  function setupAnalyser() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      var src = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      data = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser); analyser.connect(ctx.destination);
    } catch (e) { analyser = null; }
  }

  function loop() {
    if (!current) return;
    var lvl;
    if (analyser) {
      analyser.getByteFrequencyData(data);
      var sum = 0; for (var i = 0; i < data.length; i++) sum += data[i];
      lvl = Math.min(1, (sum / data.length) / 90);
    } else {
      lvl = 0.3 + 0.3 * Math.sin(Date.now() / 120);
    }
    current.querySelector('.orb').style.setProperty('--lvl', lvl.toFixed(3));
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    if (!current) return;
    current.classList.remove('playing');
    current.querySelector('.orb-icon').textContent = '▶';
    current.querySelector('.orb').style.setProperty('--lvl', 0);
    current = null; cancelAnimationFrame(raf);
  }

  document.querySelectorAll('.orb-card').forEach(function (card) {
    card.addEventListener('click', function () {
      setupAnalyser();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      if (current === card) { audio.pause(); stop(); return; }
      stop();
      current = card;
      card.classList.add('playing');
      card.querySelector('.orb-icon').textContent = '❚❚';
      audio.src = card.dataset.src;
      audio.play();
      loop();
    });
  });
  audio.addEventListener('ended', stop);
})();
