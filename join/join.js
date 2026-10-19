/* AV Library sign-in page (aveducate.com/the-av-library, logged out).
   A short loader in the site's footer code injection adds this file on pages
   that show Squarespace's member sign-in box (#sqs-paywall-page-root). It loads
   join.css, then adds a hero, a teaser search and four cards. Squarespace's
   Sign Up box and Log In button are hidden (Omar: the new section covers them),
   but our buttons still click them, so Squarespace does the real sign up / log in.
   Data: stats.json and search.json, made by build/join_index.py. */
(function () {
  var root = document.getElementById('sqs-paywall-page-root');
  var headline = document.getElementById('headline');
  // only the AV Library's sign-in page, and only once
  if (!root || !headline || !/AV Library/i.test(headline.textContent) || root.classList.contains('avl-ready')) return;
  var base = ((document.currentScript && document.currentScript.src) || '').replace(/[^\/]*$/, ''); // .../ave-library/join/
  var lib = base.replace(/join\/$/, '');                                                           // .../ave-library/

  function $(sel, el) { return (el || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function plural(n, one, many) { return '<b>' + fmt(n) + '</b> ' + (n === 1 ? one : many); }
  function src(u) { return /^https?:/.test(u) ? u : lib + u; }

  // Squarespace's own buttons do the real sign up / log in
  function join() {
    var b = $('.join-button', root);
    if (b) b.click();
    else if ($('.product-block', root)) $('.product-block', root).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function login() { var b = $('.sign-in-button', root); if (b) b.click(); }

  var LOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
    + '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  // the hero title is the sign-in page's own headline (Squarespace: Member Sites > Sign-up page)
  var title = headline.textContent.trim();
  var CARDS = [
    { key: 'tools', title: 'AV Tools', text: 'Apps and software for the job: calculators, test signals, show control and more.', go: 'Explore' },
    { key: 'brands', title: 'Training & Certs', text: 'Courses, channels and certifications from AVIXA, Extron, QSC, grandMA and more.', go: 'Explore' },
    { key: 'books', title: 'Books & Gear', text: 'Books for every part of the craft, plus the AVE WorkBox: the tools and gear for your kit.', go: 'Explore' },
    { key: 'terms', title: 'AV Dictionary', text: 'Look up the language of AV: audio, video, lighting, rigging, film and XR.', go: 'Look up' }
  ];

  function build() {
    if (root.classList.contains('avl-ready')) return;
    var el = document.createElement('section');
    el.className = 'avl-join';
    el.id = 'avl-join';
    el.setAttribute('aria-label', 'The AV Library');
    el.innerHTML =
      '<div class="avl-hero">'
      + '<div class="avl-badge">Free Membership</div>'
      + '<h1 class="avl-title">' + esc(title) + '</h1>'
      + '<div class="avl-tag">Equip. Enable. Empower.</div>'
      + '<p class="avl-lede">Real resources. Real equipment. Real education.</p>'
      + '<div class="avl-counts" data-counts></div>'
      + '<div class="avl-cta"><button type="button" class="avl-btn" data-join>Join free</button>'
      + '<button type="button" class="avl-login" data-login>Already a member? Log in</button></div>'
      + '</div>'
      + '<div class="avl-search">'
      + '<label for="avl-q">What are you looking to learn?</label>'
      + '<div class="avl-search-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
      + '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'
      + '<input id="avl-q" type="search" autocomplete="off" spellcheck="false" placeholder="Try Dante, wireless, LED…"></div>'
      + '<div class="avl-results" hidden aria-live="polite"></div>'
      + '</div>'
      + '<div class="avl-cards">' + CARDS.map(function (c) {
        return '<a class="avl-card" href="#avl-join" data-card="' + c.key + '">'
          + '<div class="avl-art" data-art="' + c.key + '"></div>'
          + '<div class="avl-card-body"><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p>'
          + '<div class="avl-num" data-num="' + c.key + '"></div>'
          + '<span class="avl-go">' + esc(c.go) + ' &rarr;</span></div></a>';
      }).join('') + '</div>';

    // the new section goes above everything; its title replaces the old headline.
    // join.css hides the headline, the Sign Up box and the Log In button; the
    // page's own description text stays, below the cards.
    root.insertBefore(el, headline.parentNode === root ? headline : root.firstChild);
    root.classList.add('avl-ready');

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-join], [data-card], [data-row], [data-login]');
      if (!t) return;
      e.preventDefault();
      if (t.hasAttribute('data-login')) login(); else join();
    });

    // counts and card artwork
    fetch(base + 'stats.json').then(function (r) { return r.json(); }).then(function (s) {
      var n = s.counts;
      $('[data-counts]', el).innerHTML = '<b>' + fmt(s.resources) + '</b>resources<span>&middot;</span><b>' + fmt(s.terms) + '</b>AV terms';
      var nums = {
        tools: fmt(n.apps) + ' apps · ' + fmt(n.software) + ' programs',
        brands: fmt(n.training) + ' training · ' + fmt(n.certs) + ' certs',
        books: fmt(n.books) + ' books · ' + fmt(n.workbox) + ' gear picks',
        terms: fmt(s.terms) + ' terms'
      };
      Object.keys(nums).forEach(function (k) { $('[data-num="' + k + '"]', el).textContent = nums[k]; });
      var a = s.art;
      function grid(list) {
        return '<div class="avl-grid">' + list.slice(0, 9).map(function (u) {
          return '<img src="' + esc(src(u)) + '" alt="" loading="lazy">';
        }).join('') + '</div>';
      }
      $('[data-art="tools"]', el).innerHTML = grid(a.tools);
      $('[data-art="brands"]', el).innerHTML = grid(a.brands);
      $('[data-art="books"]', el).innerHTML = '<div class="avl-books">'
        + a.covers.map(function (u) { return '<img class="cover" src="' + esc(u) + '" alt="" loading="lazy">'; }).join('')
        + a.gear.map(function (u) { return '<img class="gear" src="' + esc(u) + '" alt="" loading="lazy">'; }).join('') + '</div>';
      $('[data-art="terms"]', el).innerHTML = '<div class="avl-terms">' + a.terms.map(function (t) {
        return '<div><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>';
      }).join('') + '</div>';
    }).catch(function () {});

    // teaser search: names only, loaded the first time someone uses the box.
    // A word has to start with what they typed ("led" finds LED, not "coupled").
    var input = $('#avl-q', el), out = $('.avl-results', el), data = null, loading = null, timer;
    function load() {
      return loading || (loading = fetch(base + 'search.json').then(function (r) { return r.json(); })
        .then(function (d) { data = d; }, function (e) { loading = null; throw e; })); // a failed load is tried again
    }
    function run() {
      var typed = input.value.trim(), q = typed.toLowerCase();
      if (q.length < 2) { out.hidden = true; return; }
      load().then(function () {
        if (input.value.trim().toLowerCase() !== q) return;
        var word = new RegExp('(^|[^a-z0-9])' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        function starts(a, b) { return (a[0].toLowerCase().indexOf(q) === 0 ? 0 : 1) - (b[0].toLowerCase().indexOf(q) === 0 ? 0 : 1); }
        var items = data.items.filter(function (it) { return word.test(it[0]); }).sort(starts);
        var terms = data.terms.filter(function (t) { return word.test(t); })
          .map(function (t) { return [t, 'AV term']; }).sort(starts);
        var rows = items.slice(0, 6);
        rows = rows.concat(terms.slice(0, 6 - rows.length));
        if (!rows.length) {
          out.innerHTML = '<div class="avl-results-head">No match for &ldquo;' + esc(typed) + '&rdquo;. '
            + 'Try another word, or join free to browse the whole library.</div>'
            + '<button type="button" class="avl-btn" data-join>Join free</button>';
        } else {
          var parts = [];
          if (items.length) parts.push(plural(items.length, 'resource', 'resources'));
          if (terms.length) parts.push(plural(terms.length, 'AV term', 'AV terms'));
          out.innerHTML = '<div class="avl-results-head">' + parts.join(' and ')
            + (items.length + terms.length === 1 ? ' matches' : ' match') + ' &ldquo;' + esc(typed) + '&rdquo;</div>'
            + '<ul>' + rows.map(function (r) {
              return '<li><a href="#avl-join" data-row aria-label="' + esc(r[0] + ' (' + r[1] + '), join free to open') + '">' + LOCK + '<span class="avl-name">' + esc(r[0])
                + '</span><span class="avl-sec">' + esc(r[1]) + '</span></a></li>';
            }).join('') + '</ul>'
            + '<button type="button" class="avl-btn" data-join>Join free to open them</button>';
        }
        out.hidden = false;
      }).catch(function () {});
    }
    input.addEventListener('focus', load);
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 150); });
  }

  // style first, so the section never shows unstyled; no style, no change
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = base + 'join.css';
  css.onload = build;
  document.head.appendChild(css);
})();
