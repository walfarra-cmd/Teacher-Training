/* ============================================================
   Edulixa 360 — Level 3 · the write-it-yourself workshop
   Drop <div class="lab" data-write-lab></div> on a page, include this
   file after edulixa.js, and the teacher gets a three-step practice:

     Step 1  write an HTML page                    (no CSS, no JavaScript)
     Step 2  the same page, with CSS added          (design, still no logic)
     Step 3  the same page, with JavaScript added   (the button finally works)

   The code the teacher writes in one step is carried into the next, so all
   three steps are one page gaining a layer — the same lesson as the car.
   Each step checks the teacher's own code live and says why each item
   matters. Step 3's last check is behavioural: the teacher has to press
   their own button in the preview and the page has to visibly change.
   ============================================================ */
(function () {
  'use strict';

  var STORE = 'edulixa-l3-write';
  var isAr = function () { return document.documentElement.getAttribute('dir') === 'rtl'; };
  function say(el, en, ar) {
    el.setAttribute('data-en', en);
    el.setAttribute('data-ar', ar);
    el.textContent = isAr() ? ar : en;
  }

  /* ---------- the starting file, and one model answer per step ---------- */
  var START = [
    '<!doctype html>',
    '<html>',
    '<head>',
    '  <meta charset="utf-8">',
    '  <title>My lesson page</title>',
    '</head>',
    '<body>',
    '',
    '  <!-- Write your page here. Try a heading, a sentence,',
    '       a list of two things, and a button. -->',
    '',
    '</body>',
    '</html>'
  ].join('\n');

  var MODEL_BODY = [
    '  <h1>The Water Cycle</h1>',
    '  <p>Today we will name the four stages and put them in order.</p>',
    '  <ul>',
    '    <li>Say the four stages out loud</li>',
    '    <li>Put them in the right order</li>',
    '  </ul>',
    '  <button id="check">Check my answer</button>',
    '  <p id="reply"></p>'
  ].join('\n');

  var MODEL_CSS = [
    '    body {',
    '      font-family: system-ui, sans-serif;',
    '      max-width: 520px;',
    '      margin: 0 auto;',
    '      padding: 28px;',
    '      color: #12211F;',
    '      background: #F6F8F7;',
    '    }',
    '    h1 { color: #0F695D; }',
    '    ul { line-height: 2; }',
    '    button {',
    '      background: #0F695D;',
    '      color: #ffffff;',
    '      border: 0;',
    '      padding: 12px 22px;',
    '      border-radius: 10px;',
    '      font-size: 15px;',
    '      cursor: pointer;',
    '    }',
    '    #reply { color: #C0301C; font-weight: bold; }'
  ].join('\n');

  /* This example has to work on whatever page the teacher actually wrote, so it
     finds their first button by itself instead of assuming an id, and makes the
     paragraph it writes into if their page has not got one. */
  var MODEL_JS = [
    '    var button = document.querySelector("button");',
    '    var reply = document.getElementById("reply");',
    '',
    '    if (!reply) {',
    '      reply = document.createElement("p");',
    '      reply.id = "reply";',
    '      document.body.appendChild(reply);',
    '    }',
    '',
    '    if (button) {',
    '      button.addEventListener("click", function () {',
    '        reply.textContent =',
    '          "Well done. Evaporation, condensation, precipitation, collection.";',
    '      });',
    '    }'
  ].join('\n');

  /* ---------- what each step asks for, and why ---------- */
  var STEPS = {
    1: {
      head: ['Step 1 of 3 · Write the HTML', 'الخطوة 1 من 3 · اكتب HTML'],
      tag: 'HTML', tagClass: 'is-html',
      title: ['Write a page with nothing but HTML', 'اكتب صفحة بـ HTML وحده'],
      note: ['Type inside the body. You are only saying which parts exist — a heading, a sentence, a list, a button. The preview will look plain and the button will do nothing, and both of those are correct at this step.',
             'اكتب داخل الـ body. أنت تحدد الأجزاء الموجودة فقط — عنوان وجملة وقائمة وزر. ستبدو المعاينة بسيطة ولن يفعل الزر شيئًا، وكلا الأمرين صحيح في هذه الخطوة.'],
      checks: [
        { label: ['A main heading', 'عنوان رئيسي'],
          why: ['Every page needs one h1 — it tells the learner, and a screen reader, what the page is about.',
                'كل صفحة تحتاج عنوانًا رئيسيًا واحدًا — فهو يخبر المتعلم وقارئ الشاشة بموضوع الصفحة.'],
          test: function (c) { return /<h1[\s>]/i.test(c) && /<h1[^>]*>\s*\S/i.test(c); } },
        { label: ['A sentence in a paragraph', 'جملة داخل فقرة'],
          why: ['One line saying what the learner will do. Loose text with no p tag has no structure for the browser to work with.',
                'سطر واحد يوضح ما سيفعله المتعلم. النص السائب بلا وسم p لا يمنح المتصفح بنية يعمل عليها.'],
          test: function (c) { return /<p[^>]*>\s*\S/i.test(c); } },
        { label: ['A list with at least two items', 'قائمة بعنصرين على الأقل'],
          why: ['A list is how you show that two things belong to the same set. Two br tags would look similar and mean nothing.',
                'القائمة هي الطريقة التي تُظهر بها أن شيئين ينتميان إلى المجموعة نفسها. وسمَا br سيبدوان مشابهين ولا يعنيان شيئًا.'],
          test: function (c) { return (c.match(/<li[^>]*>/gi) || []).length >= 2 && /<(ul|ol)[\s>]/i.test(c); } },
        { label: ['A button', 'زر'],
          why: ['Add it now even though it cannot work yet. HTML puts the button on the page; JavaScript will give it a job in step 3.',
                'أضفه الآن رغم أنه لا يستطيع العمل بعد. HTML يضع الزر على الصفحة، و JavaScript سيمنحه وظيفة في الخطوة 3.'],
          test: function (c) { return /<button[^>]*>\s*\S/i.test(c); } }
      ],
      done: ['That is a complete, correct HTML page. It is plain and it is silent, and it is finished — everything from here is a layer on top of it.',
             'هذه صفحة HTML كاملة وصحيحة. بسيطة وصامتة، ومكتملة — وكل ما يأتي بعدها طبقة فوقها.']
    },
    2: {
      head: ['Step 2 of 3 · Add the CSS', 'الخطوة 2 من 3 · أضف CSS'],
      tag: 'CSS', tagClass: 'is-css',
      title: ['Design the same page, without touching the content', 'صمّم الصفحة نفسها دون أن تلمس المحتوى'],
      note: ['Your page from step 1 is already here, and a style block has been opened for you inside the head. Write your design rules in it. Do not change a single word of the content — watch how much changes anyway.',
             'صفحتك من الخطوة 1 موجودة هنا بالفعل، وقد فُتحت لك كتلة style داخل الـ head. اكتب قواعد التصميم داخلها. ولا تغيّر كلمة واحدة من المحتوى — ولاحظ كم يتغير مع ذلك.'],
      checks: [
        { label: ['A style block with rules in it', 'كتلة style تحتوي على قواعد'],
          why: ['This is the CSS layer. Everything inside it describes appearance, and nothing inside it can add or remove a part of the page.',
                'هذه هي طبقة CSS. كل ما داخلها يصف المظهر، ولا شيء داخلها يستطيع إضافة جزء إلى الصفحة أو حذفه.'],
          test: function (c) { var m = c.match(/<style[^>]*>([\s\S]*?)<\/style>/i); return !!m && /\{[\s\S]*?\}/.test(m[1]); } },
        { label: ['A typeface and a colour on the body', 'خط ولون على الـ body'],
          why: ['Setting font-family and colour once on body is inherited by everything inside it. That is why one rule changes the whole page.',
                'تحديد font-family واللون مرة واحدة على الـ body يورَّث إلى كل ما داخله. ولهذا تغيّر قاعدة واحدة الصفحة كلها.'],
          test: function (c) { return /font-family\s*:/i.test(c) && /(^|[^-])color\s*:/i.test(c); } },
        { label: ['Space around the content', 'مسافة حول المحتوى'],
          why: ['Padding or a margin is what stops text touching the edge of a phone screen. Spacing is the difference teachers notice first.',
                'الـ padding أو الـ margin هو ما يمنع النص من ملامسة حافة شاشة الهاتف. والمسافات هي الفرق الذي يلاحظه المعلمون أولًا.'],
          test: function (c) { return /(padding|margin)\s*:/i.test(c); } },
        { label: ['The button styled', 'الزر مُنسَّق'],
          why: ['Give the button a background, a colour and rounded corners. It still does nothing — you have made a beautiful button that is not connected to anything.',
                'امنح الزر خلفية ولونًا وحواف دائرية. وسيظل لا يفعل شيئًا — لقد صنعت زرًا جميلًا غير موصول بشيء.'],
          test: function (c) {
            var m = c.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            return !!m && /button[^{]*\{[\s\S]*?\}/i.test(m[1]) && /border-radius\s*:/i.test(m[1]);
          } }
      ],
      done: ['Not one word of your content changed, and the page is a different object. This is the whole reason you can describe a look to AI and keep your lesson intact.',
             'لم تتغير كلمة واحدة من محتواك، ومع ذلك أصبحت الصفحة شيئًا آخر. وهذا هو السبب الكامل في أنك تستطيع وصف الشكل للذكاء الاصطناعي مع بقاء درسك سليمًا.']
    },
    3: {
      head: ['Step 3 of 3 · Add the JavaScript', 'الخطوة 3 من 3 · أضف JavaScript'],
      tag: 'JS', tagClass: 'is-js',
      title: ['Make your button do something', 'اجعل زرك يفعل شيئًا'],
      note: ['A script block has been opened for you before the closing body tag. Write the instruction that runs when your button is pressed. Then press your own button in the preview — the last check only passes when the page visibly changes.',
             'فُتحت لك كتلة script قبل وسم إغلاق الـ body. اكتب التعليمة التي تُنفَّذ عند الضغط على زرك. ثم اضغط زرك بنفسك في المعاينة — فالتحقق الأخير لا ينجح إلا عندما تتغير الصفحة فعلًا.'],
      checks: [
        { label: ['A script block with code in it', 'كتلة script تحتوي على كود'],
          why: ['This is the JavaScript layer, and it is the only one that can respond, decide, count or change anything after the page has loaded.',
                'هذه هي طبقة JavaScript، وهي الوحيدة القادرة على الاستجابة أو القرار أو العدّ أو تغيير أي شيء بعد تحميل الصفحة.'],
          test: function (c) { var m = c.match(/<script[^>]*>([\s\S]*?)<\/script>/i); return !!m && m[1].trim().length > 10; } },
        { label: ['It listens for a click', 'يستمع إلى النقر'],
          why: ['Nothing in JavaScript happens on its own. Something has to tell it when to run, and a click on your button is the simplest trigger there is.',
                'لا شيء في JavaScript يحدث من تلقاء نفسه. لا بد أن يخبره شيء بموعد التنفيذ، والنقر على زرك هو أبسط مُشغِّل ممكن.'],
          test: function (c) { return /addEventListener\s*\(\s*["']click["']/i.test(c) || /onclick\s*=/i.test(c); } },
        { label: ['It changes something on the page', 'يغيّر شيئًا على الصفحة'],
          why: ['Write to the page — textContent, a class, a style. A calculation nobody can see has not taught anybody anything.',
                'اكتب على الصفحة — textContent أو class أو style. فالحساب الذي لا يراه أحد لم يعلّم أحدًا شيئًا.'],
          test: function (c) { return /(textContent|innerHTML|innerText|classList|\.style\.|setAttribute)/.test(c); } },
        { label: ['Pressing your button really changes the page', 'الضغط على زرك يغيّر الصفحة فعلًا'],
          why: ['Press it yourself in the preview. This is the moment the page stops being a picture of an activity and becomes an activity.',
                'اضغطه بنفسك في المعاينة. هذه هي اللحظة التي تتوقف فيها الصفحة عن كونها صورة لنشاط وتصبح نشاطًا.'],
          /* There is nothing to press until the page has a button on it, so say so
             plainly instead of leaving this check quietly impossible to pass. */
          blocked: function (c) { return !/<button[^>]*>/i.test(c); },
          whyBlocked: ['Your page has no button yet, so there is nothing to press. Go back to step 1 and add one, or press “Show me one answer” and it will be written for you.',
                       'صفحتك ليس بها زر بعد، فلا يوجد ما تضغطه. ارجع إلى الخطوة 1 وأضف زرًا، أو اضغط «أرِني إجابة واحدة» فيُكتب لك.'],
          live: true }
      ],
      done: ['You have written all three layers of a working web page by hand. From here on, AI writes these three layers for you — and you now know exactly which one to ask it to change.',
             'لقد كتبت الطبقات الثلاث لصفحة ويب تعمل، بيدك. ومن الآن سيكتب الذكاء الاصطناعي هذه الطبقات الثلاث نيابة عنك — وأنت تعرف بالضبط أي طبقة تطلب تعديلها.']
    }
  };

  /* the preview gets one extra script that the teacher never sees: it watches
     for the page changing after a click and reports it back to this page. */
  var REPORTER =
    '<script>(function(){var told=false;' +
    'function tell(){if(told)return;told=true;try{parent.postMessage({writeLabChanged:true},"*");}catch(e){}}' +
    'document.addEventListener("click",function(){var before=document.body.innerHTML;' +
    'setTimeout(function(){if(document.body.innerHTML!==before)tell();},80);},true);})();<\/script>';

  function shell() {
    return '' +
    '<div class="lab-head">' +
      '<span class="lab-title" data-role="head"></span>' +
      '<span class="lamps" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '</div>' +
    '<div class="stage-tabs" role="tablist" data-en-label="Practice steps" data-ar-label="خطوات التطبيق">' +
      '<button class="stage-tab" type="button" role="tab" aria-selected="true" data-go-step="1">' +
        '<b data-en="Step 1 · HTML" data-ar="الخطوة 1 · HTML">Step 1 · HTML</b>' +
        '<span data-en="Write the page" data-ar="اكتب الصفحة">Write the page</span></button>' +
      '<button class="stage-tab" type="button" role="tab" aria-selected="false" data-go-step="2">' +
        '<b data-en="Step 2 · CSS" data-ar="الخطوة 2 · CSS">Step 2 · CSS</b>' +
        '<span data-en="Design the page" data-ar="صمّم الصفحة">Design the page</span></button>' +
      '<button class="stage-tab" type="button" role="tab" aria-selected="false" data-go-step="3">' +
        '<b data-en="Step 3 · JavaScript" data-ar="الخطوة 3 · JavaScript">Step 3 · JavaScript</b>' +
        '<span data-en="Make it work" data-ar="اجعلها تعمل">Make it work</span></button>' +
    '</div>' +
    '<div class="lab-caption" style="margin:0 0 20px">' +
      '<div class="lab-name"><h3 data-role="title"></h3><span class="layer-tag" data-role="tag"></span></div>' +
      '<p data-role="note"></p>' +
    '</div>' +
    '<div class="twin">' +
      '<div class="editor-wrap">' +
        '<div class="editor-bar">' +
          '<span data-en="index.html — your code" data-ar="index.html — كودك">index.html — your code</span>' +
        '</div>' +
        '<textarea class="editor" data-role="editor" spellcheck="false" dir="ltr" ' +
          'data-en-label="Your HTML file — type your code here" ' +
          'data-ar-label="ملف HTML الخاص بك — اكتب كودك هنا"></textarea>' +
      '</div>' +
      '<div class="browser">' +
        '<div class="browser-bar">' +
          '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
          '<span class="browser-url">index.html</span>' +
        '</div>' +
        '<iframe data-role="preview" title="Live preview of your page" sandbox="allow-scripts"></iframe>' +
      '</div>' +
    '</div>' +
    '<div class="lab-head" style="margin:26px 0 0">' +
      '<span class="checks-count" data-role="count"></span>' +
    '</div>' +
    '<ul class="checks" data-role="checks"></ul>' +
    '<div class="done-note" data-role="done" hidden><p><b data-role="done-b"></b><span data-role="done-t"></span></p></div>' +
    '<div class="lab-actions">' +
      '<button class="btn btn-outline" type="button" data-role="back" data-en="Previous step" data-ar="الخطوة السابقة">Previous step</button>' +
      '<button class="btn btn-primary" type="button" data-role="next" data-en="Next step" data-ar="الخطوة التالية">Next step</button>' +
      '<button class="btn btn-ghost" type="button" data-role="model" data-en="Show me one answer" data-ar="أرِني إجابة واحدة">Show me one answer</button>' +
      '<button class="btn btn-ghost" type="button" data-role="reset" data-en="Start this step again" data-ar="أعد هذه الخطوة">Start this step again</button>' +
      '<button class="btn btn-accent" type="button" data-role="copy" data-en="Copy my page" data-ar="انسخ صفحتي">Copy my page</button>' +
      '<span class="copied" data-role="copied" aria-live="polite"></span>' +
    '</div>';
  }

  /* ---------- turning one step's code into the next step's starting point ---------- */
  function addStyleBlock(code) {
    if (/<style[\s>]/i.test(code)) return code;
    var open = '  <style>\n    /* Write your design rules here */\n\n  </style>\n';
    if (/<\/head>/i.test(code)) return code.replace(/<\/head>/i, open + '</head>');
    return open + code;
  }
  function addScriptBlock(code) {
    if (/<script[\s>]/i.test(code)) return code;
    var open = '  <script>\n    /* Write what happens when the button is pressed */\n\n  <\/script>\n';
    if (/<\/body>/i.test(code)) return code.replace(/<\/body>/i, open + '</body>');
    return code + '\n' + open;
  }
  function modelStep1() {
    return START.replace(/\n\n  <!-- Write your page here[\s\S]*?-->\n\n/, '\n' + MODEL_BODY + '\n');
  }
  /* A teacher who opens step 2 or step 3 first carries an empty page forward, and
     styling or scripting nothing teaches nothing. If the page still has no content
     of its own, the model answer writes the content in too. */
  function ensureBody(code) {
    if (/<(h1|button)[^>]*>\s*\S/i.test(code)) return code;
    var body = MODEL_BODY + '\n';
    if (/<body[^>]*>/i.test(code)) {
      return code.replace(/(<body[^>]*>)([\s\S]*?)(<\/body>)/i, function (all, open, inner, close) {
        /* keep any style or script block the step already opened */
        var keep = (inner.match(/<(style|script)[\s\S]*?<\/(style|script)>/gi) || []).join('\n');
        return open + '\n' + body + (keep ? keep + '\n' : '') + close;
      });
    }
    return body + code;
  }
  function fillStyle(code) {
    return addStyleBlock(code).replace(
      /(<style[^>]*>)[\s\S]*?(<\/style>)/i,
      '$1\n' + MODEL_CSS + '\n  $2');
  }
  function fillScript(code) {
    return addScriptBlock(code).replace(
      /(<script[^>]*>)[\s\S]*?(<\/script>)/i,
      '$1\n' + MODEL_JS + '\n  $2');
  }

  function mount(lab) {
    lab.innerHTML = shell();
    /* this markup arrived after the language engine ran — translate it now */
    if (window.EdulixaLang) window.EdulixaLang.translate(lab);
    var q = function (r) { return lab.querySelector('[data-role="' + r + '"]'); };
    var head = q('head'), title = q('title'), note = q('note'), tag = q('tag');
    var editor = q('editor'), preview = q('preview'), list = q('checks'), count = q('count');
    var doneBox = q('done'), doneB = q('done-b'), doneT = q('done-t');
    var back = q('back'), next = q('next'), copied = q('copied');

    var step = 1;
    var code = { 1: START, 2: '', 3: '' };
    var pressed = { 3: false };

    /* restore anything the teacher typed before a refresh */
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved && saved.code) {
        code = { 1: saved.code[1] || START, 2: saved.code[2] || '', 3: saved.code[3] || '' };
        step = saved.step || 1;
        pressed[3] = !!saved.pressed;
      }
    } catch (e) {}
    function save() {
      try {
        localStorage.setItem(STORE, JSON.stringify({ code: code, step: step, pressed: pressed[3] }));
      } catch (e) {}
    }

    /* a step opens from the previous step's work, the first time it is opened */
    function seed(n) {
      if (code[n]) return code[n];
      if (n === 2) code[2] = addStyleBlock(code[1] || START);
      if (n === 3) code[3] = addScriptBlock(code[2] || addStyleBlock(code[1] || START));
      return code[n];
    }

    var previewTimer = null;
    function paintPreview() {
      var doc = code[step] || '';
      var out = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, REPORTER + '</body>') : doc + REPORTER;
      preview.setAttribute('srcdoc', out);
    }

    function renderChecks() {
      var spec = STEPS[step].checks;
      var passed = 0;
      list.innerHTML = '';
      spec.forEach(function (ch) {
        var ok = ch.live ? !!pressed[step] : ch.test(code[step] || '');
        if (ok) passed++;
        var li = document.createElement('li');
        if (ok) li.className = 'is-done';
        var b = document.createElement('b');
        say(b, ch.label[0], ch.label[1]);
        var s = document.createElement('small');
        var why = ch.why;
        if (!ok && ch.blocked && ch.blocked(code[step] || '')) {
          why = ch.whyBlocked;
          li.className = 'is-blocked';
        }
        say(s, why[0], why[1]);
        var wrap = document.createElement('div');
        wrap.appendChild(b);
        wrap.appendChild(s);
        li.appendChild(wrap);
        list.appendChild(li);
      });
      say(count, passed + ' of ' + spec.length + ' done', passed + ' من ' + spec.length + ' مكتملة');
      var all = passed === spec.length;
      doneBox.hidden = !all;
      if (all) {
        say(doneB, 'Step complete. ', 'أنجزت الخطوة. ');
        say(doneT, STEPS[step].done[0], STEPS[step].done[1]);
      }
    }

    function render() {
      var d = STEPS[step];
      seed(step);
      lab.setAttribute('data-stage', String(step));
      say(head, d.head[0], d.head[1]);
      say(title, d.title[0], d.title[1]);
      say(note, d.note[0], d.note[1]);
      tag.textContent = d.tag;
      tag.className = 'layer-tag ' + d.tagClass;
      if (editor.value !== code[step]) editor.value = code[step];
      lab.querySelectorAll('[data-go-step]').forEach(function (b) {
        b.setAttribute('aria-selected', String(Number(b.getAttribute('data-go-step')) === step));
      });
      /* A greyed-out primary button at the last step reads as a fault rather than
         as an ending, so a step that cannot be reached hides its button instead. */
      back.disabled = step === 1; back.hidden = step === 1;
      next.disabled = step === 3; next.hidden = step === 3;
      paintPreview();
      renderChecks();
      save();
    }

    editor.addEventListener('input', function () {
      code[step] = editor.value;
      /* a later step already opened keeps its own copy — only reseed empty ones */
      if (step === 1) { code[2] = code[2] || ''; }
      renderChecks();
      save();
      clearTimeout(previewTimer);
      previewTimer = setTimeout(paintPreview, 420);
    });

    lab.querySelectorAll('[data-go-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        step = Number(b.getAttribute('data-go-step'));
        render();
      });
    });
    back.addEventListener('click', function () { if (step > 1) { step--; render(); } });
    next.addEventListener('click', function () { if (step < 3) { step++; render(); } });

    q('model').addEventListener('click', function () {
      if (step === 1) code[1] = modelStep1();
      if (step === 2) code[2] = fillStyle(ensureBody(code[2] || addStyleBlock(code[1] || START)));
      if (step === 3) code[3] = fillScript(ensureBody(code[3] || addScriptBlock(code[2] || START)));
      render();
    });

    q('reset').addEventListener('click', function () {
      if (step === 1) { code[1] = START; code[2] = ''; code[3] = ''; }
      if (step === 2) { code[2] = addStyleBlock(code[1] || START); code[3] = ''; }
      if (step === 3) { code[3] = addScriptBlock(code[2] || START); pressed[3] = false; }
      render();
    });

    q('copy').addEventListener('click', function () {
      var text = code[step] || '';
      var done = function () {
        copied.textContent = isAr() ? '✓ تم نسخ صفحتك' : '✓ Your page is copied';
        setTimeout(function () { copied.textContent = ''; }, 2600);
      };
      var legacy = function () {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, legacy);
      } else { legacy(); }
    });

    /* the preview reports that pressing the button really changed the page */
    window.addEventListener('message', function (e) {
      if (!e.data || !e.data.writeLabChanged) return;
      if (e.source !== preview.contentWindow) return;
      if (!pressed[step]) { pressed[step] = true; renderChecks(); save(); }
    });

    render();
    window.addEventListener('edulixa:lang', render);
  }

  function boot() {
    document.querySelectorAll('[data-write-lab]').forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
