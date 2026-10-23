/* BioStitched Builder’s Guide: stitch-cycle walkthrough and parts checklist */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Stitch cycle ---------- */

  // One entry per state. needleY: how far the needle drops (px); rot: needle rotation (deg);
  // seqX / seqY: where the moving sequin sits; seqT: how it gets there.
  var STEPS = [
    { n: '00', title: 'Ready', text: 'One sequin waits at the base of the magazine, lined up with the needle’s own axis.', actor: 'none yet', needleY: 0, rot: 0, seqX: 0, seqY: 108, seqT: 'none' },
    { n: '01', title: 'Drop', text: 'The escapement releases a single sequin. It falls along the needle’s axis and lands on the fabric, right under the needle.', actor: 'escapement servo', needleY: 0, rot: 0, seqX: 0, seqY: 224, seqT: 'transform 650ms cubic-bezier(0.55, 0, 1, 0.45)' },
    { n: '02', title: 'Pierce', text: 'The needle drives straight down through the sequin’s hole and the fabric. It has to enter vertically, or the fabric snags.', actor: 'Z-axis servo', needleY: 64, rot: 0, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '03', title: 'Rotate 180°', text: 'Below the fabric, the needle turns half a revolution so the hook catches the thread.', actor: 'rotation servo', needleY: 64, rot: 180, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '04', title: 'Retract', text: 'The needle lifts back through the fabric, drawing up a loop of thread that holds the sequin in place.', actor: 'Z-axis servo', needleY: 0, rot: 180, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '05', title: 'Rotate back', text: 'The needle turns back to face A, ready to enter cleanly on the next stitch.', actor: 'rotation servo', needleY: 0, rot: 0, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '06', title: 'Advance', text: 'The steppers move on by one stitch length, and the cycle starts again.', actor: 'X and Y steppers', needleY: 0, rot: 0, seqX: -56, seqY: 224, seqT: 'transform 600ms ease', showLength: true }
  ];

  var needle = document.getElementById('needle');
  var live = document.getElementById('sequin-live');

  if (needle && live) {
    var faceLabel = document.getElementById('face-label');
    var stepLabel = document.getElementById('step-label');
    var stepTitle = document.getElementById('step-title');
    var stepText = document.getElementById('step-text');
    var stepActor = document.getElementById('step-actor');
    var lengthEls = Array.prototype.slice.call(document.querySelectorAll('[data-length]'));
    var stepButtons = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
    var playBtn = document.getElementById('cycle-play');
    var nextBtn = document.getElementById('cycle-next');
    var resetBtn = document.getElementById('cycle-reset');
    var current = 0;
    var timer = null;

    var render = function (i) {
      var s = STEPS[i];
      current = i;
      needle.style.transform = 'translateY(' + s.needleY + 'px) rotateY(' + s.rot + 'deg)';
      live.style.transition = reduceMotion ? 'none' : s.seqT;
      live.style.transform = 'translate(' + s.seqX + 'px, ' + s.seqY + 'px)';
      faceLabel.textContent = s.rot === 180 ? 'B' : 'A';
      lengthEls.forEach(function (el) { el.hidden = !s.showLength; });
      stepLabel.textContent = i === 0 ? 'Ready' : 'Step ' + s.n + ' of 06';
      stepTitle.textContent = s.title;
      stepText.textContent = s.text;
      stepActor.textContent = s.actor;
      stepButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-step')) === i));
      });
    };

    var nextIndex = function () { return current >= 6 ? 0 : current + 1; };

    var stop = function () {
      if (timer) { clearInterval(timer); timer = null; }
      playBtn.textContent = 'Play the cycle';
    };

    var play = function () {
      stop();
      render(nextIndex());
      timer = setInterval(function () { render(nextIndex()); }, 1800);
      playBtn.textContent = 'Pause';
    };

    playBtn.addEventListener('click', function () { if (timer) { stop(); } else { play(); } });
    nextBtn.addEventListener('click', function () { stop(); render(nextIndex()); });
    resetBtn.addEventListener('click', function () { stop(); render(0); });
    stepButtons.forEach(function (b) {
      b.addEventListener('click', function () { stop(); render(Number(b.getAttribute('data-step'))); });
    });

    render(0);
  }

  /* ---------- Parts checklist ---------- */

  var KEY = 'biostitched-parts';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('input[data-part]'));

  if (boxes.length) {
    var progressText = document.getElementById('progress-text');
    var progressBar = document.getElementById('progress-bar');
    var progressTrack = progressBar ? progressBar.parentNode : null;
    var clearBtn = document.getElementById('clear-ticks');
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));

    var load = function () {
      try { return JSON.parse(window.localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
    };
    var save = function (state) {
      try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
    };

    var state = load();

    var update = function () {
      var ticked = boxes.filter(function (b) { return b.checked; }).length;
      var pct = Math.round((ticked / boxes.length) * 100);
      progressText.textContent = ticked + ' of ' + boxes.length + ' ticked';
      progressBar.style.width = pct + '%';
      if (progressTrack) { progressTrack.setAttribute('aria-valuenow', String(pct)); }
      groups.forEach(function (g) {
        var inGroup = Array.prototype.slice.call(g.querySelectorAll('input[data-part]'));
        var done = inGroup.filter(function (b) { return b.checked; }).length;
        var count = g.querySelector('[data-count]');
        if (count) { count.textContent = done + ' of ' + inGroup.length; }
      });
    };

    boxes.forEach(function (b) {
      var id = b.getAttribute('data-part');
      b.checked = !!state[id];
      b.addEventListener('change', function () {
        if (b.checked) { state[id] = true; } else { delete state[id]; }
        save(state);
        update();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state = {};
        save(state);
        boxes.forEach(function (b) { b.checked = false; });
        update();
      });
    }

    update();
  }
})();
