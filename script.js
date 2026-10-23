/* BioStitched Builder’s Guide: stitch-cycle walkthrough, test code viewer and blog links */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Stitch cycle ---------- */

  // One entry per state. needleY: how far the needle drops (px); rot: needle rotation (deg);
  // seqX / seqY: where the moving sequin sits; seqT: how it gets there.
  var STEPS = [
    { n: '00', title: 'Ready', text: 'One sequin waits at the base of the magazine, lined up with the needle’s own axis.', actor: 'none yet', needleY: 0, rot: 0, seqX: 0, seqY: 108, seqT: 'none' },
    { n: '01', title: 'Drop', text: 'The escapement releases a single sequin. It falls along the needle’s axis and lands on the fabric, right under the needle.', actor: 'the two escapement servos', needleY: 0, rot: 0, seqX: 0, seqY: 224, seqT: 'transform 650ms cubic-bezier(0.55, 0, 1, 0.45)' },
    { n: '02', title: 'Pierce', text: 'The needle drives straight down through the sequin’s hole and the fabric. It has to enter vertically, or the fabric snags.', actor: 'Z-axis servo', needleY: 64, rot: 0, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '03', title: 'Rotate 180°', text: 'Below the fabric, the needle turns half a revolution so the hook catches the thread.', actor: 'rotation servo', needleY: 64, rot: 180, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '04', title: 'Retract', text: 'The needle lifts back through the fabric, drawing up a loop of thread that holds the sequin in place.', actor: 'Z-axis servo', needleY: 0, rot: 180, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '05', title: 'Rotate back', text: 'The needle turns back to face A, ready to enter cleanly on the next stitch.', actor: 'rotation servo', needleY: 0, rot: 0, seqX: 0, seqY: 224, seqT: 'transform 600ms ease' },
    { n: '06', title: 'Advance', text: 'The steppers move on by one stitch length, and the cycle starts again.', actor: 'X-axis steppers', needleY: 0, rot: 0, seqX: -56, seqY: 224, seqT: 'transform 600ms ease', showLength: true }
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

  /* ---------- Test code: show each .ino file on the page ---------- */

  var codeBlocks = Array.prototype.slice.call(document.querySelectorAll('code[data-src]'));
  var sources = {};

  codeBlocks.forEach(function (block) {
    var file = block.getAttribute('data-src');
    fetch(file)
      .then(function (res) { if (!res.ok) { throw new Error(res.status); } return res.text(); })
      .then(function (text) { sources[file] = text; block.textContent = text; })
      .catch(function () { block.textContent = 'Download ' + file + ' to see this sketch.'; });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-copy]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = sources[btn.getAttribute('data-copy')];
      if (!text || !navigator.clipboard) { btn.textContent = 'Copy unavailable: use Download'; return; }
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy code'; }, 2000);
      }, function () { btn.textContent = 'Copy unavailable: use Download'; });
    });
  });

  /* ---------- Open blog: point the links at this repository's Discussions ---------- */

  // On GitHub Pages the address is USERNAME.github.io/REPOSITORY/, so the links can be
  // worked out automatically, even after a username change.
  var host = window.location.hostname.toLowerCase();
  if (/\.github\.io$/.test(host)) {
    var owner = host.slice(0, -'.github.io'.length);
    var firstPart = window.location.pathname.split('/').filter(Boolean)[0];
    var repo = firstPart && !/\.html?$/i.test(firstPart) ? firstPart : owner + '.github.io';
    var base = 'https://github.com/' + owner + '/' + repo + '/discussions';
    Array.prototype.slice.call(document.querySelectorAll('[data-gh="new"]')).forEach(function (a) {
      a.href = base + '/new?category=show-and-tell';
    });
    Array.prototype.slice.call(document.querySelectorAll('[data-gh="list"]')).forEach(function (a) {
      a.href = base;
    });
  }

  // Once the giscus script is pasted in, hide the "not connected yet" line.
  var empty = document.getElementById('comments-empty');
  if (empty && document.querySelector('script[src*="giscus.app"]')) { empty.hidden = true; }
})();
