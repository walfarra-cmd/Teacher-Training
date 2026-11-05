/* ============================================================
   Edulixa 360 — Level 3 · Session 3 · the live examples
   Seven small modules, all independent:
     1. the real miniature website you can take apart
     2. the three navigation bars
     3. the six colour themes, repainting one live mini page
     4. the tabbed panel
     5. the four image galleries
     6. the six button styles
     7. the contact form (validates, never sends)

   RULE followed everywhere below: this file never writes a bare string
   into the page. It writes data-en + data-ar and then calls
   EdulixaLang.translate, so a page that OPENS in Arabic is Arabic.
   And it never puts data-en on an element that has children, because
   edulixa.js would replace the whole subtree with a plain string.
   ============================================================ */
(function () {
  'use strict';

  var isAr = function () {
    return document.documentElement.getAttribute('dir') === 'rtl';
  };

  /* Write one bilingual string into an element, the safe way. */
  function say(el, en, ar) {
    if (!el) return;
    el.setAttribute('data-en', en);
    el.setAttribute('data-ar', ar);
    el.textContent = isAr() ? ar : en;
  }

  /* Copy a hidden bilingual source block into an output box. The source is
     re-translated by edulixa.js on every flip, so on a flip we copy again. */
  function mirror(outEl, srcEl) {
    if (!outEl || !srcEl) return;
    outEl.innerHTML = srcEl.innerHTML;
    if (window.EdulixaLang) window.EdulixaLang.translate(outEl, isAr());
  }

  /* Run fn now and again after every language flip. */
  var repaints = [];
  function onLang(fn) { repaints.push(fn); fn(); }
  window.addEventListener('edulixa:lang', function () {
    repaints.forEach(function (f) { try { f(); } catch (e) {} });
  });

  /* Single-choice button group. Calls pick(button) for the chosen one. */
  function group(sel, pick) {
    var btns = [].slice.call(document.querySelectorAll(sel));
    if (!btns.length) return null;
    function choose(b) {
      btns.forEach(function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        x.classList.toggle('is-on', x === b);
      });
      pick(b);
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { choose(b); });
    });
    var start = btns.filter(function (b) { return b.classList.contains('is-on'); })[0] || btns[0];
    choose(start);
    return { btns: btns, choose: choose, current: function () {
      return btns.filter(function (b) { return b.classList.contains('is-on'); })[0];
    } };
  }

  /* ==========================================================
     1. THE REAL MINIATURE WEBSITE
     A working page. Select a part and it lights up, with its
     number, and the explanation appears underneath.
     ========================================================== */
  (function () {
    var mini = document.getElementById('mini');
    var out  = document.getElementById('part-out');
    if (!mini || !out) return;

    var parts = [].slice.call(mini.querySelectorAll('[data-part]'));
    var chips = [].slice.call(document.querySelectorAll('#part-chips [data-part-go]'));
    var chosen = 'nav';

    function light() {
      parts.forEach(function (p) {
        var on = p.getAttribute('data-part') === chosen;
        p.classList.toggle('is-on', on);
        p.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      chips.forEach(function (c) {
        var on = c.getAttribute('data-part-go') === chosen;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      mirror(out, document.getElementById('part-' + chosen));
    }

    function set(name) { chosen = name; light(); }

    parts.forEach(function (p) {
      p.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        set(p.getAttribute('data-part'));
      });
    });
    chips.forEach(function (c) {
      c.addEventListener('click', function () { set(c.getAttribute('data-part-go')); });
    });

    onLang(light);
  })();

  /* ==========================================================
     2. THE THREE NAVIGATION BARS
     All three are on the page at once, so there is nothing to switch.
     The only behaviour needed: the demo links must not navigate, and the
     sticky card drops its "scroll here" hint once the teacher has scrolled.
     ========================================================== */
  [].slice.call(document.querySelectorAll('.navframe')).forEach(function (frame) {
    frame.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) e.preventDefault();
    });
  });
  (function () {
    var sticky = document.querySelector('.nv-sticky.is-scroll');
    if (!sticky) return;
    sticky.addEventListener('scroll', function () {
      if (sticky.scrollTop > 12) sticky.classList.add('is-scrolled');
    }, { passive: true });
  })();

  /* The builder's holding message. edulixa.js does not know about
     data-*-holding, so mirror the right one into data-holding on every flip.
     It is drawn by .lab-frame:before, behind the iframe. */
  (function () {
    var frame = document.getElementById('lab-frame');
    if (!frame) return;
    onLang(function () {
      frame.setAttribute('data-holding',
        (isAr() ? frame.getAttribute('data-ar-holding')
                : frame.getAttribute('data-en-holding')) || '');
    });
  })();

  /* ==========================================================
     3. THE SIX COLOUR THEMES
     One mini page, repainted from the five colours held on each
     swatch. The whole idea of a theme in one demo: you change the
     colours, you do not rebuild the page.
     ========================================================== */
  (function () {
    var demo = document.getElementById('theme-demo');
    var hexes = document.getElementById('theme-hex');
    var nameOut = document.getElementById('theme-name');
    if (!demo) return;

    function paint(b) {
      if (!b) return;
      var c = {
        bg: b.getAttribute('data-bg'), main: b.getAttribute('data-main'),
        shout: b.getAttribute('data-shout'), ink: b.getAttribute('data-ink'),
        soft: b.getAttribute('data-soft')
      };
      demo.style.setProperty('--m-bg', c.bg);
      demo.style.setProperty('--m-main', c.main);
      demo.style.setProperty('--m-shout', c.shout);
      demo.style.setProperty('--m-ink', c.ink);
      demo.style.setProperty('--m-soft', c.soft);
      demo.setAttribute('data-theme-on', b.getAttribute('data-theme'));

      if (hexes) {
        hexes.innerHTML = '';
        [c.bg, c.main, c.shout].forEach(function (hex) {
          var chip = document.createElement('span');
          chip.className = 'hexchip';
          chip.style.setProperty('--sw', hex);
          var dot = document.createElement('i');
          var code = document.createElement('code');
          code.textContent = hex.toUpperCase();
          chip.appendChild(dot); chip.appendChild(code);
          hexes.appendChild(chip);
        });
      }
      /* The name lives on data-name-en / data-name-ar, NOT data-en: a data-en
         on the button would make edulixa.js wipe its dots and its label. */
      if (nameOut) {
        say(nameOut, b.getAttribute('data-name-en') || '', b.getAttribute('data-name-ar') || '');
      }
    }

    var g = group('#theme-swatches [data-theme]', paint);
    if (!g) return;
    onLang(function () { paint(g.current()); });

    demo.addEventListener('click', function (e) {
      var a = e.target.closest('a,button');
      if (a) e.preventDefault();
    });
  })();

  /* ==========================================================
     3b. SASS IN ONE MOVE
     One named value drives the code line and all three cards, so the
     idea ("change it once, everything changes") is the demo itself.
     ========================================================== */
  (function () {
    var demo = document.getElementById('sassdemo');
    var hex  = document.getElementById('sass-hex');
    if (!demo) return;
    group('#sassdemo .sasspick', function (b) {
      var v = b.getAttribute('data-sass');
      demo.style.setProperty('--sass', v);
      if (hex) hex.textContent = v;   /* a hex code reads the same in both languages */
    });
  })();

  /* ==========================================================
     4. TABBED PANELS
     Any .tp on the page works, with no per-instance wiring.
     ========================================================== */
  [].slice.call(document.querySelectorAll('.tp')).forEach(function (tp) {
    var tabs  = [].slice.call(tp.querySelectorAll('.tp-strip [data-tp]'));
    var panes = [].slice.call(tp.querySelectorAll('[data-tp-pane]'));
    if (!tabs.length || !panes.length) return;

    function show(key) {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', t.getAttribute('data-tp') === key ? 'true' : 'false');
      });
      panes.forEach(function (p) {
        p.hidden = p.getAttribute('data-tp-pane') !== key;
      });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { show(t.getAttribute('data-tp')); });
      t.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(t), n = tabs.length;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault(); tabs[(i + 1) % n].focus(); tabs[(i + 1) % n].click();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault(); tabs[(i - 1 + n) % n].focus(); tabs[(i - 1 + n) % n].click();
        }
      });
    });
    show((tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]
          || tabs[0]).getAttribute('data-tp'));
  });

  /* ==========================================================
     5. THE FOUR IMAGE GALLERIES
     ========================================================== */
  (function () {
    var demo = document.getElementById('gal-demo');
    var note = document.getElementById('gal-note');
    if (!demo) return;

    var figs  = [].slice.call(demo.querySelectorAll('.gal-item'));
    var prev  = document.getElementById('gal-prev');
    var next  = document.getElementById('gal-next');
    var count = document.getElementById('gal-count');
    var at = 0;

    function paintCarousel() {
      figs.forEach(function (f, i) { f.classList.toggle('is-on', i === at); });
      if (count) {
        var n = (at + 1) + ' / ' + figs.length;
        say(count, n, n);
      }
    }
    function slide(step) {
      at = (at + step + figs.length) % figs.length;
      paintCarousel();
    }
    if (prev) prev.addEventListener('click', function () { slide(-1); });
    if (next) next.addEventListener('click', function () { slide(1); });

    var g = group('#gal-tabs [data-gal-style]', function (b) {
      var s = b.getAttribute('data-gal-style');
      demo.setAttribute('data-style', s);
      var carousel = s === 'carousel';
      if (prev) prev.hidden = !carousel;
      if (next) next.hidden = !carousel;
      if (count) count.hidden = !carousel;
      if (carousel) { at = 0; slide(0); }
      else figs.forEach(function (f) { f.classList.remove('is-on'); });
    });
    if (!g) return;

    function paintNote() {
      var b = g.current();
      if (b) mirror(note, document.getElementById('galnote-' + b.getAttribute('data-gal-style')));
    }
    g.btns.forEach(function (b) { b.addEventListener('click', paintNote); });
    onLang(function () { paintNote(); paintCarousel(); });

    /* In "press to enlarge" mode a picture opens the full-screen viewer.
       In every other mode a picture does nothing, which is the honest
       demonstration: the enlarging is a thing you have to ask for. */
    figs.forEach(function (f, i) {
      f.addEventListener('click', function () {
        if (demo.getAttribute('data-style') !== 'enlarge') return;
        if (!window.EdulixaLightbox) return;
        window.EdulixaLightbox.open({
          items: figs.map(function (x) {
            var m = x.querySelector('img');
            return {
              src: m.getAttribute('src'),
              label: m.getAttribute('data-en-label') || m.getAttribute('alt') || '',
              labelAr: m.getAttribute('data-ar-label') || ''
            };
          }),
          index: i
        });
      });
    });
  })();

  /* ==========================================================
     6. THE SIX BUTTON STYLES
     Pressing one reports what a visitor would have expected.
     ========================================================== */
  (function () {
    var out = document.getElementById('btn-out');
    var demos = [].slice.call(document.querySelectorAll('#btn-demo [data-btn-says-en]'));
    if (!out || !demos.length) return;

    var lastEn = '', lastAr = '';
    demos.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        lastEn = b.getAttribute('data-btn-says-en') || '';
        lastAr = b.getAttribute('data-btn-says-ar') || '';
        say(out, lastEn, lastAr);
        out.classList.remove('is-fresh');
        void out.offsetWidth;
        out.classList.add('is-fresh');
      });
    });

    say(out, 'Press any of the six buttons above.', 'اضغط أي زر من الأزرار الستة أعلاه.');
    onLang(function () { if (lastEn) say(out, lastEn, lastAr); });
  })();

  /* ==========================================================
     7. THE CONTACT FORM
     It validates and reports, and it never sends anything. The
     point of the block is where the error appears, so the error
     goes under its own field and the first bad field gets focus.
     ========================================================== */
  (function () {
    var form = document.getElementById('formex');
    var said = document.getElementById('form-said');
    if (!form) return;

    var rules = [
      { id: 'f-name', en: 'Please write your name.', ar: 'اكتب اسمك من فضلك.',
        ok: function (v) { return v.trim().length > 1; } },
      { id: 'f-mail', en: 'This email address is missing an @ sign.',
        ar: 'عنوان البريد هذا تنقصه علامة @.',
        ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
      { id: 'f-msg', en: 'Please write your message.', ar: 'اكتب رسالتك من فضلك.',
        ok: function (v) { return v.trim().length > 2; } }
    ];

    function errBox(id) { return form.querySelector('[data-err="' + id + '"]'); }

    function check(showAll) {
      var firstBad = null;
      rules.forEach(function (r) {
        var input = document.getElementById(r.id);
        var box = errBox(r.id);
        if (!input || !box) return;
        var bad = !r.ok(input.value);
        var touched = showAll || input.dataset.touched === '1';
        if (bad && touched) {
          say(box, r.en, r.ar);
          box.hidden = false;
          input.closest('.fld').classList.add('is-bad');
          input.setAttribute('aria-invalid', 'true');
          if (!firstBad) firstBad = input;
        } else {
          box.hidden = true;
          box.textContent = '';
          input.closest('.fld').classList.remove('is-bad');
          input.removeAttribute('aria-invalid');
        }
      });
      return firstBad;
    }

    rules.forEach(function (r) {
      var input = document.getElementById(r.id);
      if (!input) return;
      input.addEventListener('blur', function () {
        input.dataset.touched = '1';
        check(false);
      });
      input.addEventListener('input', function () {
        if (input.dataset.touched === '1') check(false);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = check(true);
      if (firstBad) {
        if (said) said.hidden = true;
        firstBad.focus();
        return;
      }
      if (said) {
        say(said,
          'Sent. On a real site this is where you say when you will reply.',
          'أُرسلت. وفي موقع حقيقي، هنا تقول متى سترد.');
        said.hidden = false;
      }
    });

    onLang(function () {
      check(false);
      if (said && !said.hidden) {
        say(said,
          'Sent. On a real site this is where you say when you will reply.',
          'أُرسلت. وفي موقع حقيقي، هنا تقول متى سترد.');
      }
    });
  })();

})();
