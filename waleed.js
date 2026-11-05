/* ========================================
   Waleed 2026
   ========================================= */
(function () {
  'use strict';

  var KEY = 'waleed-l1-lang';

  /* ---------- 1. Language ---------- */
  function apply(lang) {
    var isAr = lang === 'ar';
    var root = document.documentElement;
    root.setAttribute('lang', isAr ? 'ar' : 'en');
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // Plain text nodes
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var v = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (v !== null) el.textContent = v;
    });
    // Rich (HTML) nodes
    document.querySelectorAll('[data-en-html]').forEach(function (el) {
      var v = isAr ? el.getAttribute('data-ar-html') : el.getAttribute('data-en-html');
      if (v !== null) el.innerHTML = v;
    });
    // Placeholders
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      var v = isAr ? el.getAttribute('data-ar-ph') : el.getAttribute('data-en-ph');
      if (v !== null) el.setAttribute('placeholder', v);
    });
    // Files that follow the language: a download link, or the picture of a
    // generated document. Set data-en-href/data-ar-href on the <a>, or
    // data-en-src/data-ar-src on the <img>, and the file switches with the page.
    document.querySelectorAll('[data-en-href]').forEach(function (el) {
      var v = isAr ? el.getAttribute('data-ar-href') : el.getAttribute('data-en-href');
      if (v !== null) el.setAttribute('href', v);
    });
    document.querySelectorAll('[data-en-src]').forEach(function (el) {
      var v = isAr ? el.getAttribute('data-ar-src') : el.getAttribute('data-en-src');
      if (v !== null && el.getAttribute('src') !== v) el.setAttribute('src', v);
    });
    // Accessible labels
    document.querySelectorAll('[data-en-label]').forEach(function (el) {
      var v = isAr ? el.getAttribute('data-ar-label') : el.getAttribute('data-en-label');
      if (v !== null) el.setAttribute('aria-label', v);
    });
    // Document title
    var t = document.querySelector('title');
    if (t && t.getAttribute('data-ar')) {
      document.title = isAr ? t.getAttribute('data-ar') : t.getAttribute('data-en');
    }
    // Toggle buttons show the language you can switch TO. A button carrying
    // data-lang-keep writes its own wording instead (see the big translate
    // button in Session 4), so leave that one alone.
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      if (b.hasAttribute('data-lang-keep')) return;
      b.textContent = isAr ? 'English' : 'العربية';
      b.setAttribute('aria-label', isAr ? 'Switch to English' : 'التبديل إلى العربية');
      b.setAttribute('lang', isAr ? 'en' : 'ar');
    });

    // A popup holds a copy of its source text, so close it when the language flips
    var openPop = document.getElementById('pop');
    if (openPop && openPop.open) openPop.close();

    try { localStorage.setItem(KEY, lang); } catch (e) {}

    // Anything that writes its own text (the game score and its messages) listens here
    try {
      document.dispatchEvent(new CustomEvent('waleed:lang', { detail: { lang: lang } }));
    } catch (e) {}
  }

  function current() {
    try { return localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en'; } catch (e) { return 'en'; }
  }

  function init() {
    apply(current());
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        apply(current() === 'ar' ? 'en' : 'ar');
      });
    });

    /* ---------- 2. Copy buttons ---------- */
    /* A prompt box is either a <textarea> or a contenteditable div (the latter so the
       [FIELDS] a teacher must replace can be highlighted). Both are handled here. */
    var isEditable = function (box) { return box.tagName !== 'TEXTAREA'; };
    var readBox = function (box) { return isEditable(box) ? box.innerText : box.value; };

    /* file:// is not a secure context, so the course is normally opened with the
       async Clipboard API unavailable. The hidden-textarea path is the one that
       actually runs offline — keep it. */
    function copyText(text, done) {
      var legacy = function () {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, legacy);
      } else { legacy(); }
    }

    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var box = document.getElementById(btn.getAttribute('data-copy'));
        if (!box) return;
        copyText(readBox(box), function () {
          var note = btn.parentNode.querySelector('.copied');
          if (!note) return;
          note.textContent = document.documentElement.getAttribute('dir') === 'rtl'
            ? '✓ تم النسخ' : '✓ Copied';
          setTimeout(function () { note.textContent = ''; }, 2400);
        });
      });
    });

    /* Reset an edited prompt back to its original text */
    document.querySelectorAll('[data-reset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var box = document.getElementById(btn.getAttribute('data-reset'));
        if (!box || box.dataset.original === undefined) return;
        if (isEditable(box)) box.innerHTML = box.dataset.original;
        else box.value = box.dataset.original;
      });
    });
    document.querySelectorAll('.prompt-box').forEach(function (box) {
      box.dataset.original = isEditable(box) ? box.innerHTML : box.value;
    });

    /* Click a highlighted field to select the whole thing, so typing replaces it */
    document.querySelectorAll('.prompt-box .ph').forEach(function (ph) {
      ph.addEventListener('click', function () {
        var r = document.createRange();
        r.selectNodeContents(ph);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
      });
    });

    /* ---------- 3. Optional images ---------- */
    /* A figure whose screenshot has not been dropped into assets/ yet hides itself
       instead of showing a broken-image icon. Add the file and it appears. */
    /* ---------- 4. Rail step lamps ---------- */
    /* Each step in "Session at a glance" is a switch: selecting it jumps to that
       part of the page and turns its light on. The lights are remembered per page. */
    var railItems = document.querySelectorAll('.rail ol li');
    if (railItems.length) {
      var lampKey = 'waleed-l1-lit:' + (location.pathname.split('/').pop() || 'index');
      var lit = {};
      try { lit = JSON.parse(localStorage.getItem(lampKey) || '{}') || {}; } catch (e) { lit = {}; }

      railItems.forEach(function (li, i) {
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');
        if (lit[i]) li.classList.add('is-lit');
        li.setAttribute('aria-pressed', lit[i] ? 'true' : 'false');

        var flip = function () {
          var on = li.classList.toggle('is-lit');
          li.setAttribute('aria-pressed', on ? 'true' : 'false');
          lit[i] = on ? 1 : 0;
          try { localStorage.setItem(lampKey, JSON.stringify(lit)); } catch (e) {}
          var go = li.getAttribute('data-go');
          if (on && go) {
            var target = document.getElementById(go);
            if (target) target.scrollIntoView({ block: 'start' });
          }
        };

        li.addEventListener('click', flip);
        li.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); flip(); }
        });
      });
    }

    /* ---------- 5. Screen replica → explanation popup ---------- */
    var pop = document.getElementById('pop');
    if (pop) {
      var popBody = pop.querySelector('.pop-body');
      var opener = null;

      var openPopup = function (id, trigger) {
        var src = document.getElementById(id);
        if (!src || !popBody) return;
        popBody.innerHTML = src.innerHTML;   // already in the current language
        opener = trigger || null;
        if (trigger) trigger.classList.add('is-seen');
        if (typeof pop.showModal === 'function') { pop.showModal(); }
        else { pop.setAttribute('open', ''); }
        var c = pop.querySelector('.pop-close');
        if (c) c.focus();
      };

      document.querySelectorAll('[data-pop]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          openPopup(btn.getAttribute('data-pop'), btn);
        });
      });

      pop.querySelectorAll('[data-pop-close]').forEach(function (b) {
        b.addEventListener('click', function () { pop.close(); });
      });
      /* Clicking the dimmed area behind the card closes it */
      pop.addEventListener('click', function (e) { if (e.target === pop) pop.close(); });
      pop.addEventListener('close', function () {
        if (opener) { opener.focus(); opener = null; }
      });
    }

    /* ---------- 6. The RCTF matching game ---------- */
    /* Drag a fragment of a real prompt onto the letter it belongs to, or select the
       fragment and then select the letter. Every word the teacher reads comes from
       data- attributes in the HTML, so the game can be reworded without touching this. */
    var game = document.getElementById('rctf-game');
    if (game) {
      var pool = game.querySelector('.game-pool');
      var msgEl = game.querySelector('.game-msg');
      var scoreEl = game.querySelector('.game-score');
      var zones = [].slice.call(game.querySelectorAll('.zone'));
      var frags = [].slice.call(game.querySelectorAll('.frag'));
      var held = null;

      var isAr = function () {
        return document.documentElement.getAttribute('dir') === 'rtl';
      };
      /* Arabic pages show Arabic-Indic numerals */
      var num = function (n) {
        if (!isAr()) return String(n);
        return String(n).replace(/[0-9]/g, function (d) {
          return String.fromCharCode(0x0660 + Number(d));
        });
      };
      var txt = function (name, el) {
        var host = el || game;
        return host.getAttribute('data-' + name + (isAr() ? '-ar' : '-en')) || '';
      };

      var setMsg = function (text, tone) {
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className = 'game-msg' + (tone ? ' ' + tone : '');
      };

      var isSet = function (f) { return f.classList.contains('is-set'); };
      var placedCount = function () {
        return frags.filter(isSet).length;
      };

      var paintScore = function () {
        if (!scoreEl) return;
        scoreEl.textContent = txt('score')
          .replace('{n}', num(placedCount()))
          .replace('{t}', num(frags.length));
      };

      var paintZones = function () {
        zones.forEach(function (z) {
          var box = z.querySelector('.zone-in');
          z.classList.toggle('is-full', !!(box && box.children.length));
        });
        if (pool) pool.classList.toggle('is-clear', placedCount() === frags.length);
      };

      var place = function (frag, zone) {
        if (!frag || !zone || isSet(frag)) return;
        frags.forEach(function (o) { o.classList.remove('is-held'); });
        if (frag.getAttribute('data-slot') === zone.getAttribute('data-drop')) {
          var box = zone.querySelector('.zone-in');
          if (box) box.appendChild(frag);
          frag.classList.add('is-set');
          frag.classList.remove('is-held');
          frag.setAttribute('aria-disabled', 'true');
          frag.setAttribute('tabindex', '-1');
          held = null;
          paintScore();
          paintZones();
          if (placedCount() === frags.length) {
            setMsg(txt('done'), 'is-done');
          } else {
            setMsg(txt('ok') + ' ' + txt('why', frag), 'is-good');
          }
        } else {
          frag.classList.add('is-wrong');
          setTimeout(function () { frag.classList.remove('is-wrong'); }, 470);
          setMsg(txt('no'), 'is-bad');
        }
      };

      var hold = function (frag) {
        if (isSet(frag)) return;
        var already = frag.classList.contains('is-held');
        frags.forEach(function (f) { f.classList.remove('is-held'); });
        held = already ? null : frag;
        if (held) {
          held.classList.add('is-held');
          setMsg(txt('held'), '');
        } else {
          setMsg('', '');
        }
      };

      /* --- Pointer dragging ---------------------------------------------
         Built on pointer events rather than the browser's own drag-and-drop, so
         the same code serves a mouse, a finger and a stylus. A line follows the
         pointer as a floating copy; the box under the pointer lights up. Below
         the movement threshold nothing drags and the press counts as a select. */
      var drag = null;

      var zoneUnder = function (x, y) {
        var el = document.elementFromPoint(x, y);
        return el ? el.closest('.zone') : null;
      };

      var lift = function (e) {
        if (!drag || drag.ghost) return;
        var f = drag.frag;
        var r = f.getBoundingClientRect();
        var g = f.cloneNode(true);
        g.classList.add('frag-ghost');
        g.style.width = r.width + 'px';
        g.style.left = r.left + 'px';
        g.style.top = r.top + 'px';
        document.body.appendChild(g);
        drag.ghost = g;
        drag.dx = drag.x0 - r.left;
        drag.dy = drag.y0 - r.top;
        f.classList.add('is-dragging');
        frags.forEach(function (o) { o.classList.remove('is-held'); });
        held = f;
        f.classList.add('is-held');
        setMsg(txt('held'), '');
      };

      var moveGhost = function (e) {
        if (!drag || !drag.ghost) return;
        drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
        drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
        var z = zoneUnder(e.clientX, e.clientY);
        /* Only when no box is under the pointer, creep the page so one can come into view */
        if (!z) {
          var pad = 46;
          if (e.clientY > window.innerHeight - pad) window.scrollBy(0, 14);
          else if (e.clientY < pad) window.scrollBy(0, -14);
        }
        zones.forEach(function (o) { o.classList.toggle('is-over', o === z); });
      };

      var onMove = function (e) {
        if (!drag) return;
        if (!drag.ghost) {
          if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 7) return;
          lift(e);
        }
        moveGhost(e);
      };

      var onUp = function (e) {
        if (!drag) return;
        var d = drag; drag = null;
        if (!d.ghost) return;                       // a press, not a drag
        d.ghost.remove();
        d.frag.classList.remove('is-dragging');
        zones.forEach(function (o) { o.classList.remove('is-over'); });
        d.frag.dataset.dragged = '1';               // stop the click that follows
        place(d.frag, zoneUnder(e.clientX, e.clientY));
      };

      var onCancel = function () {
        if (drag && drag.ghost) {
          drag.ghost.remove();
          drag.frag.classList.remove('is-dragging');
          zones.forEach(function (o) { o.classList.remove('is-over'); });
        }
        drag = null;
      };

      document.addEventListener('pointermove', onMove, { passive: false });
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onCancel);

      frags.forEach(function (frag) {
        frag.addEventListener('pointermove', onMove, { passive: false });
        frag.addEventListener('pointerup', onUp);
        frag.addEventListener('pointercancel', onCancel);
        frag.addEventListener('lostpointercapture', onCancel);
        frag.addEventListener('pointerdown', function (e) {
          if (isSet(frag) || e.button > 0) return;
          drag = { frag: frag, id: e.pointerId, x0: e.clientX, y0: e.clientY, ghost: null };
          /* Capture, so every later move and the release are delivered here even if
             the pointer leaves the line or the page scrolls underneath it. */
          try { frag.setPointerCapture(e.pointerId); } catch (err) {}
        });
        frag.addEventListener('click', function () {
          if (frag.dataset.dragged) { delete frag.dataset.dragged; return; }
          hold(frag);
        });
        frag.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); hold(frag); }
        });
      });

      zones.forEach(function (zone) {
        zone.addEventListener('click', function () {
          if (held) place(held, zone);
        });
        zone.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (held) place(held, zone);
          }
        });
      });

      /* Shuffle so the pool never gives the order away, and reset puts them back mixed */
      var shufflePool = function () {
        if (!pool) return;
        var kids = [].slice.call(pool.children);
        for (var i = kids.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = kids[i]; kids[i] = kids[j]; kids[j] = tmp;
        }
        kids.forEach(function (k) { pool.appendChild(k); });
      };

      var reset = function () {
        frags.forEach(function (f) {
          f.classList.remove('is-set', 'is-held', 'is-wrong', 'is-dragging');
          f.removeAttribute('aria-disabled');
          f.setAttribute('tabindex', '0');
          if (pool) pool.appendChild(f);
        });
        held = null;
        shufflePool();
        paintScore();
        paintZones();
        setMsg('', '');
      };

      game.querySelectorAll('[data-game-reset]').forEach(function (b) {
        b.addEventListener('click', reset);
      });

      document.addEventListener('waleed:lang', function () {
        paintScore();
        setMsg('', '');
      });

      shufflePool();
      paintScore();
      paintZones();
    }

    /* ---------- Criteria cards ---------- */
    /* Each pastel card in a .crits grid opens on select to show its explanation.
       The card is a <button>, so Enter and Space work with no extra code. */
    document.querySelectorAll('.crit').forEach(function (card) {
      card.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    document.querySelectorAll('img[data-optional]').forEach(function (img) {
      var hide = function () {
        var f = img.closest('figure');
        if (f) f.hidden = true;
      };
      img.addEventListener('error', hide);
      if (img.complete && img.naturalWidth === 0) hide();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

/* ── Counters, scroll reveal and optional contact buttons (merged from upgrade.js) ── */
(function(){
  if(window.__wlFx) return; window.__wlFx=1;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches, hasIO='IntersectionObserver' in window;

  /* counters: the final number is already in the HTML, so it shows even if this code never runs */
  var nums=document.querySelectorAll('[data-count]');
  if(nums.length && hasIO && !reduce){
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting) return; cio.unobserve(e.target);
      var el=e.target, to=+el.getAttribute('data-count'), t0=null, d=1400;
      (function f(t){ if(t0===null) t0=t; var p=Math.min((t-t0)/d,1);
        el.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); else el.textContent=to; })(performance.now());
    });},{threshold:.3});
    nums.forEach(function(el){ el.textContent='0'; cio.observe(el); });
    /* safety net: if a counter is on screen but the observer never fired, show the real number */
    setTimeout(function(){ nums.forEach(function(el){ var r=el.getBoundingClientRect();
      if(el.textContent==='0' && r.top<innerHeight && r.bottom>0){ cio.unobserve(el); el.textContent=el.getAttribute('data-count'); } }); },3000);
  }

  /* scroll reveal */
  var els=document.querySelectorAll('.stat,.srow,.app,.sec-head');
  if(els.length && hasIO && !reduce){
    var rio=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); rio.unobserve(e.target); }});},{threshold:.15});
    els.forEach(function(el,i){ el.classList.add('reveal'); el.style.transitionDelay=(i%4)*70+'ms'; rio.observe(el); });
  }

  /* floating contact buttons — fill these in to show them (leave '' to hide) */
  var CONTACT={phone:'', whatsapp:''};   /* e.g. phone:'+9665XXXXXXXX', whatsapp:'9665XXXXXXXX' */
  if(!CONTACT.phone && !CONTACT.whatsapp) return;
  var box=document.createElement('div'); box.className='fab';
  var ph='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z"/></svg>';
  var wa='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.2-3.1.8.83-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.45-.7-1.7-.8s-.4-.12-.55.12-.63.8-.77.95-.28.18-.52.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.72-1.33a.45.45 0 0 0 0-.42c-.06-.12-.55-1.33-.76-1.8s-.4-.4-.55-.4h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.85 2.04 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.7c1.55.67 2.15.73 2.93.62a2.5 2.5 0 0 0 1.64-1.16 2 2 0 0 0 .14-1.16c-.06-.1-.22-.16-.47-.28z"/></svg>';
  if(CONTACT.phone) box.insertAdjacentHTML('beforeend','<a href="tel:'+CONTACT.phone+'" aria-label="Call">'+ph+'</a>');
  if(CONTACT.whatsapp) box.insertAdjacentHTML('beforeend','<a class="wa" href="https://wa.me/'+CONTACT.whatsapp.replace(/\D/g,'')+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+wa+'</a>');
  document.body.appendChild(box);
})();
