/* AV Library sign-in page (aveducate.com/the-av-library, logged out).
   A short loader in the site's footer code injection adds this file on pages
   that show Squarespace's member sign-in box (#sqs-paywall-page-root). It loads
   join.css, then adds a hero, a teaser search, a card for each library section
   (a snippet of its real pictures) and a closing JOIN THE AVE FAM box.
   Squarespace's headline, description, Sign Up box and Log In button are
   hidden (Omar: the new section covers them), but our buttons still click
   Squarespace's, so Squarespace does the real sign up / log in.
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

  // the AV Library's own tab icon and tab name (Squarespace has one icon for the
  // whole site). Members' view: the page's header code does the same
  // (build/tab_icon_member_code.html).
  [].forEach.call(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]'), function (l) { l.remove(); });
  [['icon', '32x32', 'tab-icon-32.png'], ['icon', '16x16', 'tab-icon-16.png'], ['apple-touch-icon', '180x180', 'tab-icon-180.png']].forEach(function (i) {
    var l = document.createElement('link');
    l.rel = i[0]; l.type = 'image/png'; l.setAttribute('sizes', i[1]); l.href = base + i[2];
    document.head.appendChild(l);
  });
  if (!/AV Library/i.test(document.title)) document.title = title + ' \u2014 ' + document.title;
  // one card per library section, in the library's own order and names; the
  // picture area is a snippet of that section (kind: icons, covers, gear, terms)
  var CARDS = [
    { key: 'apps', title: 'Apps', kind: 'icons', text: 'Calculators, test signals and field tools for your phone and tablet.' },
    { key: 'training', title: 'Training', kind: 'icons', text: 'Audio, video, lighting, networking and rigging courses from the brands you use.' },
    { key: 'software', title: 'Software', kind: 'icons', text: 'AV, VJ and playback software, from show control to signage.' },
    { key: 'books', title: 'Books', kind: 'covers', text: 'Video and color, lighting and power, audio, leadership and the business of AV.' },
    { key: 'careers', title: 'Careers', kind: 'icons', text: 'Agencies, crew directories, labor forms and job boards.' },
    { key: 'certs', title: 'Certs', kind: 'icons', text: 'Certifications for audio, video, lighting, networking and more.' },
    { key: 'workbox', title: 'WorkBox', kind: 'gear', text: 'Gear and field essentials for your work box.' },
    { key: 'community', title: 'Community', kind: 'icons', text: 'Podcasts and industry events for AV people.' },
    { key: 'terms', title: 'AV Dictionary', kind: 'terms', text: 'Look up the language of AV, from audio and video to rigging and XR.' }
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
          + '<div class="avl-art avl-art-' + c.kind + '" data-art="' + c.key + '"></div>'
          + '<div class="avl-card-body"><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p>'
          + '<span class="avl-go" data-go="' + c.key + '">See all &rarr;</span></div></a>';
      }).join('') + '</div>'
      + '<div class="avl-close">'
      + '<h2>Built for the AV community.</h2>'
      + '<p data-close>One free membership to help you learn, grow, and get better at your craft.</p>'
      + '<button type="button" class="avl-btn" data-join>Join the AVE Fam &rarr;</button>'
      + '<button type="button" class="avl-close-login" data-login>Already a member? Log in.</button>'
      + '</div>';

    // the new section goes above everything; join.css hides Squarespace's
    // headline, description, Sign Up box and Log In button.
    root.insertBefore(el, headline.parentNode === root ? headline : root.firstChild);
    root.classList.add('avl-ready');

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-join], [data-card], [data-row], [data-login]');
      if (!t) return;
      e.preventDefault();
      if (t.hasAttribute('data-login')) login(); else join();
    });

    // counts and each card's snippet
    fetch(base + 'stats.json').then(function (r) { return r.json(); }).then(function (s) {
      $('[data-counts]', el).innerHTML = '<b>' + fmt(s.resources) + '</b>resources<span>&middot;</span><b>' + fmt(s.terms) + '</b>AV terms';
      $('[data-close]', el).textContent = fmt(s.resources) + ' resources. ' + fmt(s.terms)
        + ' AV terms. One free membership to help you learn, grow, and get better at your craft.';
      CARDS.forEach(function (c) {
        var count = c.key === 'terms' ? s.terms : s.counts[c.key], list = s.art[c.key] || [];
        if (count) $('[data-go="' + c.key + '"]', el).innerHTML = 'See all ' + fmt(count) + ' &rarr;';
        $('[data-art="' + c.key + '"]', el).innerHTML = '<div class="avl-mosaic">' + list.map(function (u) {
          return c.kind === 'terms' ? '<span>' + esc(u) + '</span>' : '<img src="' + esc(src(u)) + '" alt="" loading="lazy">';
        }).join('') + '</div>';
      });
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
