/* ============================================================
   Waleed 2026 — Level 3 · the three-layer car lab
   Drop <div class="lab" data-car-lab></div> on a page, include this
   file after edulixa.js, and the whole demonstration builds itself:
   stage 1 the frame (HTML), stage 2 the paint (CSS), stage 3 the
   engine (JavaScript) with the car actually driving.

   Optional: define window.EdulixaScore(key, points) before this runs
   and each stage reports itself so a page can keep a score.
   ============================================================ */
(function () {
  'use strict';

  var isAr = function () { return document.documentElement.getAttribute('dir') === 'rtl'; };
  function say(el, en, ar) {
    el.setAttribute('data-en', en);
    el.setAttribute('data-ar', ar);
    el.textContent = isAr() ? ar : en;
  }
  function score(key, n) {
    if (typeof window.EdulixaScore === 'function') window.EdulixaScore(key, n);
  }

  var STAGES = {
    1: {
      head: ['Stage 1 · Structure', 'المرحلة 1 · الهيكل'],
      name: ['The car frame', 'هيكل السيارة'],
      tag: 'HTML', tagClass: 'is-html',
      note: ['HTML is the frame. It decides which parts exist — a body, a roof, two windows, two wheels, two lamps — and nothing else. No colour, no shine, no movement. A page at this stage is complete and correct, and it still looks like nothing.',
             'HTML هو الهيكل. يحدد الأجزاء الموجودة — جسم وسقف ونافذتان وعجلتان ومصباحان — ولا شيء غير ذلك. لا لون ولا لمعان ولا حركة. الصفحة في هذه المرحلة كاملة وصحيحة، ومع ذلك تبدو بلا شكل.'],
      code: '<span class="cm">&lt;!-- HTML: the parts exist. Nothing more. --&gt;</span>\n&lt;<b>div</b> <i>class</i>="car"&gt;\n  &lt;<b>div</b> <i>class</i>="roof"&gt;&lt;/<b>div</b>&gt;\n  &lt;<b>div</b> <i>class</i>="window"&gt;&lt;/<b>div</b>&gt;\n  &lt;<b>div</b> <i>class</i>="window"&gt;&lt;/<b>div</b>&gt;\n  &lt;<b>div</b> <i>class</i>="body"&gt;&lt;/<b>div</b>&gt;\n  &lt;<b>div</b> <i>class</i>="wheel"&gt;&lt;/<b>div</b>&gt;\n  &lt;<b>div</b> <i>class</i>="wheel"&gt;&lt;/<b>div</b>&gt;\n&lt;/<b>div</b>&gt;'
    },
    2: {
      head: ['Stage 2 · Styling', 'المرحلة 2 · التنسيق'],
      name: ['Colour, shape and light', 'لون وشكل وإضاءة'],
      tag: 'CSS', tagClass: 'is-css',
      note: ['CSS never adds a new part. It takes the parts HTML already placed and decides how each one looks — the paint, the curve of the body, the glass in the windows, the rubber of the tyres, the light along the bonnet. The car is recognisable now, and it is still standing still.',
             'CSS لا يضيف جزءًا جديدًا أبدًا. يأخذ الأجزاء التي وضعها HTML بالفعل ويحدد شكل كل منها — الطلاء، وانحناء الجسم، وزجاج النوافذ، ومطاط الإطارات، والضوء على الغطاء. أصبحت السيارة معروفة الآن، ومع ذلك لا تزال واقفة.'],
      code: '<span class="cm">/* CSS: the same parts, now with an appearance. */</span>\n.<i>body</i> {\n  <b>background</b>: linear-gradient(#F97316, #C2410C);\n  <b>border-radius</b>: 15px;\n}\n.<i>window</i> { <b>background</b>: #DCEEFB; <b>border-radius</b>: 6px; }\n.<i>wheel</i>  { <b>background</b>: #2B3444; <b>border-radius</b>: 50%; }\n.<i>lamp</i>   { <b>background</b>: #FFD34D; }'
    },
    3: {
      head: ['Stage 3 · Logic', 'المرحلة 3 · المنطق'],
      name: ['The engine', 'المحرك'],
      tag: 'JS', tagClass: 'is-js',
      note: ['JavaScript is the engine, and the only layer that can respond, decide, count and move. Press the button below: nothing about the frame or the paint changes — but the car starts to drive, the wheels turn, the road runs past and the exhaust puffs. This is the layer that turns a picture of an activity into an activity.',
             'JavaScript هو المحرك، والطبقة الوحيدة القادرة على الاستجابة والقرار والعدّ والحركة. اضغط الزر أدناه: لن يتغير شيء في الهيكل ولا في الطلاء — لكن السيارة تبدأ في السير، وتدور العجلات، ويمرّ الطريق، ويتصاعد العادم. هذه هي الطبقة التي تحوّل صورة النشاط إلى نشاط حقيقي.'],
      code: '<span class="cm">// JavaScript: the layer that can act.</span>\n<u>igniteButton</u>.<b>addEventListener</b>("click", <b>function</b> () {\n  car.<i>classList</i>.<b>toggle</b>("driving");\n  <b>if</b> (car.<i>classList</i>.<b>contains</b>("driving")) {\n    <u>igniteButton</u>.<i>textContent</i> = "Stop the engine";\n  } <b>else</b> {\n    <u>igniteButton</u>.<i>textContent</i> = "Start the engine";\n  }\n});'
    }
  };

  var SVG =
  '<svg viewBox="0 0 560 300" role="img" data-en-label="A car drawn in three stages: an outline, then painted, then driving" data-ar-label="سيارة مرسومة على ثلاث مراحل: هيكل، ثم ملوّنة، ثم تسير">' +
    '<defs>' +
      '<linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" style="stop-color:var(--paint-1)"></stop>' +
        '<stop offset="1" style="stop-color:var(--paint-2)"></stop>' +
      '</linearGradient>' +
      '<linearGradient id="paintTop" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" style="stop-color:var(--paint-3)"></stop>' +
        '<stop offset="1" style="stop-color:var(--paint-1)"></stop>' +
      '</linearGradient>' +
    '</defs>' +
    '<rect class="road-bed" x="0" y="242" width="560" height="58"></rect>' +
    '<path class="road-dash" d="M0 271 H560"></path>' +
    '<g class="car-group">' +
      '<g class="puff">' +
        '<circle cx="128" cy="214" r="7"></circle>' +
        '<circle cx="122" cy="205" r="9"></circle>' +
        '<circle cx="115" cy="219" r="6"></circle>' +
      '</g>' +
      '<rect class="car-part car-cabin" x="204" y="128" width="152" height="52" rx="13"></rect>' +
      '<rect class="car-part car-win" x="216" y="139" width="59" height="30" rx="6"></rect>' +
      '<rect class="car-part car-win" x="285" y="139" width="59" height="30" rx="6"></rect>' +
      '<rect class="car-part car-body" x="148" y="176" width="284" height="60" rx="15"></rect>' +
      '<rect class="car-part car-lamp-b" x="150" y="190" width="13" height="13" rx="3"></rect>' +
      '<rect class="car-part car-lamp-f" x="414" y="190" width="17" height="13" rx="4"></rect>' +
      '<path class="shine" d="M172 190 H392" stroke="var(--paint-3)" stroke-width="5" stroke-linecap="round" opacity=".5"></path>' +
      '<g class="wheel-spin">' +
        '<circle class="car-part car-tyre" cx="212" cy="238" r="27"></circle>' +
        '<circle class="car-part car-hub" cx="212" cy="238" r="10"></circle>' +
        '<path class="car-part car-spoke" d="M195 238 H229 M212 221 V255"></path>' +
      '</g>' +
      '<g class="wheel-spin">' +
        '<circle class="car-part car-tyre" cx="368" cy="238" r="27"></circle>' +
        '<circle class="car-part car-hub" cx="368" cy="238" r="10"></circle>' +
        '<path class="car-part car-spoke" d="M351 238 H385 M368 221 V255"></path>' +
      '</g>' +
    '</g>' +
  '</svg>';

  function shell() {
    return '' +
    '<div class="lab-head">' +
      '<span class="lab-title" data-role="head"></span>' +
      '<span class="lamps" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '</div>' +
    '<div class="stage-tabs" role="tablist" data-en-label="Car stages" data-ar-label="مراحل السيارة">' +
      '<button class="stage-tab" type="button" role="tab" aria-selected="true" data-go-stage="1">' +
        '<b data-en="Stage 1 · HTML" data-ar="المرحلة 1 · HTML">Stage 1 · HTML</b>' +
        '<span data-en="Build the frame" data-ar="ابنِ الهيكل">Build the frame</span></button>' +
      '<button class="stage-tab" type="button" role="tab" aria-selected="false" data-go-stage="2">' +
        '<b data-en="Stage 2 · CSS" data-ar="المرحلة 2 · CSS">Stage 2 · CSS</b>' +
        '<span data-en="Paint the car" data-ar="لوّن السيارة">Paint the car</span></button>' +
      '<button class="stage-tab" type="button" role="tab" aria-selected="false" data-go-stage="3">' +
        '<b data-en="Stage 3 · JavaScript" data-ar="المرحلة 3 · JavaScript">Stage 3 · JavaScript</b>' +
        '<span data-en="Start the engine" data-ar="أدر المحرك">Start the engine</span></button>' +
    '</div>' +
    '<div class="garage">' + SVG + '</div>' +
    '<div class="lab-caption">' +
      '<div class="lab-name"><h3 data-role="name"></h3><span class="layer-tag" data-role="tag"></span></div>' +
      '<p data-role="note"></p>' +
    '</div>' +
    '<div class="lab-actions">' +
      '<button class="btn btn-outline" type="button" data-role="back" data-en="Previous stage" data-ar="المرحلة السابقة">Previous stage</button>' +
      '<button class="btn btn-primary" type="button" data-role="next" data-en="Next stage" data-ar="المرحلة التالية">Next stage</button>' +
      '<button class="btn btn-accent" type="button" data-role="ignite" hidden data-en="Start the engine" data-ar="أدر المحرك">Start the engine</button>' +
    '</div>' +
    '<div class="codepane">' +
      '<div class="codepane-head"><span data-en="The code behind this stage" data-ar="الكود وراء هذه المرحلة">The code behind this stage</span></div>' +
      '<pre data-role="code"></pre>' +
    '</div>';
  }

  function mount(lab) {
    lab.innerHTML = shell();
    /* this markup arrived after the language engine ran — translate it now */
    if (window.EdulixaLang) window.EdulixaLang.translate(lab);
    var q = function (r) { return lab.querySelector('[data-role="' + r + '"]'); };
    var head = q('head'), name = q('name'), note = q('note'), tag = q('tag'), code = q('code');
    var back = q('back'), next = q('next'), ignite = q('ignite');
    var stage = 1, painted = false;

    function igniteLabel(driving) {
      if (driving) say(ignite, 'Stop the engine', 'أوقف المحرك');
      else say(ignite, 'Start the engine', 'أدر المحرك');
    }

    function render() {
      var d = STAGES[stage];
      lab.setAttribute('data-stage', String(stage));
      say(head, d.head[0], d.head[1]);
      say(name, d.name[0], d.name[1]);
      say(note, d.note[0], d.note[1]);
      tag.textContent = d.tag;
      tag.className = 'layer-tag ' + d.tagClass;
      code.innerHTML = d.code;
      lab.querySelectorAll('[data-go-stage]').forEach(function (b) {
        b.setAttribute('aria-selected', String(Number(b.getAttribute('data-go-stage')) === stage));
      });
      back.disabled = stage === 1;
      next.hidden = stage === 3;
      ignite.hidden = stage !== 3;
      if (stage !== 3) { lab.classList.remove('is-driving'); igniteLabel(false); }
      /* stage 1 is where the teacher lands, so the first paint is not scored */
      if (painted) score('car' + stage, 10);
      painted = true;
    }

    lab.querySelectorAll('[data-go-stage]').forEach(function (b) {
      b.addEventListener('click', function () {
        stage = Number(b.getAttribute('data-go-stage'));
        render();
      });
    });
    back.addEventListener('click', function () { if (stage > 1) { stage--; render(); } });
    next.addEventListener('click', function () { if (stage < 3) { stage++; render(); } });
    ignite.addEventListener('click', function () {
      var driving = lab.classList.toggle('is-driving');
      igniteLabel(driving);
      if (driving) score('drive', 20);
    });

    render();
    window.addEventListener('edulixa:lang', render);
  }

  function boot() {
    document.querySelectorAll('[data-car-lab]').forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
