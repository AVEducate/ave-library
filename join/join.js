/* AV Library sign-in page (aveducate.com/the-av-library, logged out).
   A short loader in the site's footer code injection adds this file on pages
   that show Squarespace's member sign-in box (#sqs-paywall-page-root). It loads
   join.css, then adds a hero, a teaser search, a card for each library section
   (a snippet of its real pictures) and a closing JOIN THE AVE FAM box.
   Squarespace's headline, description, Sign Up box and Log In button are
   hidden (Omar: the new section covers them), but our buttons still click
   Squarespace's, so Squarespace does the real sign up / log in.
   The public page about the library (aveducate.com/avlibrary) gets the same
   pictures from its own loader (that page's header code injection): the page's
   text block stays on the page for Google, moved into the hero, the cards and
   the boxes. Its buttons, cards and search rows are links to the sign-in page,
   which then opens Squarespace's sign up (#join) or log in (#login) straight away.
   Data: stats.json and search.json, made by build/join_index.py. */
(function () {
  var base = ((document.currentScript && document.currentScript.src) || '').replace(/[^\/]*$/, ''); // .../ave-library/join/
  var lib = base.replace(/join\/$/, '');                                                           // .../ave-library/
  var root = document.getElementById('sqs-paywall-page-root');
  var headline = document.getElementById('headline');
  // the AV Library's sign-in page, or else the public page's text block; only once
  var signIn = !!(root && headline && /AV Library/i.test(headline.textContent));
  var text = signIn ? null : publicText();
  if (signIn ? root.classList.contains('avl-ready') : !text) return done();
  // the public page's links: the sign-in page, opening Squarespace's sign up / log in
  var JOIN = '/the-av-library#join', LOGIN = '/the-av-library#login';

  // aveducate.com/avlibrary: Omar's Markdown block (title, intro, JOIN link, the
  // What's Inside list, short sections). Not in Squarespace's editor (a frame),
  // where the block stays as he wrote it.
  function publicText() {
    if (window.self !== window.top || location.pathname.replace(/\/+$/, '') !== '/avlibrary') return null;
    var h1 = document.querySelector('.sqs-block-content > h1'), box = h1 && h1.parentNode;
    if (!box || !/AV Library/i.test(h1.textContent) || box.querySelector('.avl-join')) return null;
    return box.querySelector(':scope > ul') && box.querySelector(':scope > h3 > a') ? box : null;
  }
  // the public page's loader hides the text block until the pictures are in
  // (or for 3 s at most): show it now, built or not
  function done() { document.documentElement.classList.remove('avl-wait'); }

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
  // Squarespace's own Log In leaves its account panel (Digital Products) open
  // after signing in, full screen on a phone. Its sign-in-to-join screen (the
  // one behind JOIN > "Already have an account? Sign in") sends members
  // straight into the library instead, so Log in opens that screen for the
  // AV Library's plan; Squarespace's Log In button is the fallback.
  function login() {
    var api = window.UserAccountApi, jb = $('.join-button', root);
    var plan = jb && /joinPricingPlan\('([^']+)'/.exec(jb.getAttribute('onclick') || '');
    if (plan && api && api.getAccountScreenPath && api.openAccountScreen) {
      api.openAccountScreen(api.getAccountScreenPath(true, 'PAYWALL_PAGE', plan[1], '', location.pathname));
      return;
    }
    var b = $('.sign-in-button', root);
    if (b) b.click();
  }

  var LOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
    + '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  // the hero title is the sign-in page's own headline (Squarespace: Member Sites > Sign-up page)
  var title = signIn ? headline.textContent.trim() : '';

  // tab name like the site's other pages (the tab keeps the site's AVE icon;
  // Omar didn't like a separate AV Library icon)
  if (signIn && !/AV Library/i.test(document.title)) document.title = title + ' \u2014 ' + document.title;
  // one card per library section, in the library's own order and names; the
  // picture area is a snippet of that section (kind: icons, covers, gear, terms).
  // item: the public page's What's Inside line that becomes the card's text there
  var CARDS = [
    { key: 'apps', title: 'Apps', kind: 'icons', text: 'Calculators, test signals and field tools for your phone and tablet.', item: /\bapps\b/i },
    { key: 'training', title: 'Training', kind: 'icons', text: 'Audio, video, lighting, networking and rigging courses from the brands you use.', item: /training/i },
    { key: 'youtube', title: 'YouTube', kind: 'icons', text: 'Audio, video, lighting and live streaming channels to keep you learning.', item: /youtube/i },
    { key: 'software', title: 'Software', kind: 'icons', text: 'AV, VJ and playback software, from show control to signage.', item: /software/i },
    { key: 'books', title: 'Books', kind: 'covers', text: 'Video and color, lighting and power, audio, leadership and the business of AV.', item: /\bbooks\b/i },
    { key: 'careers', title: 'Careers', kind: 'icons', text: 'Agencies, crew directories, labor forms and job boards.', item: /career/i },
    { key: 'certs', title: 'Certs', kind: 'icons', text: 'Certifications for audio, video, lighting, networking and more.', item: /certification/i },
    { key: 'workbox', title: 'WorkBox', kind: 'gear', text: 'Gear and field essentials for your work box.' },
    { key: 'community', title: 'Community', kind: 'icons', text: 'Podcasts and industry events for AV people.' },
    { key: 'terms', title: 'AV Dictionary', kind: 'terms', text: 'Look up the language of AV, from audio and video to rigging and XR.', item: /dictionary/i }
  ];

  // a JOIN button: on the sign-in page it clicks Squarespace's Sign Up, on the
  // public page it is a link to the sign-in page
  function joinButton(label) {
    return signIn ? '<button type="button" class="avl-btn" data-join>' + label + '</button>'
      : '<a class="avl-btn" href="' + JOIN + '">' + label + '</a>';
  }
  var SEARCH = '<div class="avl-search">'
    + '<label for="avl-q">What are you looking to learn?</label>'
    + '<div class="avl-search-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
    + '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'
    + '<input id="avl-q" type="search" autocomplete="off" spellcheck="false" placeholder="Try Dante, wireless, LED…"></div>'
    + '<div class="avl-results" hidden aria-live="polite"></div>'
    + '</div>';
  var CARDS_HTML = '<div class="avl-cards">' + CARDS.map(function (c) {
    return '<a class="avl-card" href="' + (signIn ? '#avl-join' : JOIN) + '" data-card="' + c.key + '">'
      + '<div class="avl-art avl-art-' + c.kind + '" data-art="' + c.key + '"></div>'
      + '<div class="avl-card-body"><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p>'
      + '<span class="avl-go" data-go="' + c.key + '">See all &rarr;</span></div></a>';
  }).join('') + '</div>';
  var CLOSE = '<h2>Built for the AV community.</h2>'
    + '<p data-close>One free membership to help you learn, grow, and get better at your craft.</p>';

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
      + '<div class="avl-cta">' + joinButton('Join free')
      + '<button type="button" class="avl-login" data-login>Already a member? Log in</button></div>'
      // no account: the printable guides in the 101 AV Guides shop (a plain link, not data-join)
      + '<p class="avl-alt">Rather not sign up? <a href="/101-av-guides">Shop the 101 AV Guides</a> &mdash; printable PDFs, no account needed.</p>'
      + '</div>'
      + SEARCH
      + CARDS_HTML
      + '<div class="avl-close">'
      + CLOSE
      + joinButton('Join the AVE Fam &rarr;')
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
    fill(el);
    search(el);

    // arriving from the public page's buttons: Squarespace's sign up or log in
    // opens straight away (its account script may still be loading: wait for it)
    var open = location.hash === '#join' ? join : location.hash === '#login' ? login : null;
    if (open) {
      history.replaceState(null, '', location.pathname + location.search);
      (function when(tries) {
        if (window.UserAccountApi || !tries) open(); else setTimeout(function () { when(tries - 1); }, 200);
      })(25);
    }
  }

  // the public page: its text block's own pieces go into the hero, the cards
  // and the boxes (moved, not copied, so the page says everything once and
  // Google reads the same words); anything else stays where it was
  function buildPublic() {
    var h1 = $(':scope > h1', text), list = $(':scope > ul', text);
    var eyebrow = h1.previousElementSibling, intro = h1.nextElementSibling;
    var topJoin = intro && intro.nextElementSibling, inside = list.previousElementSibling;
    var joins = text.querySelectorAll(':scope > h3'), endJoin = joins[joins.length - 1];
    var story = endJoin.nextElementSibling, after = list.nextElementSibling;
    var el = document.createElement('section');
    el.className = 'avl-join avl-public';
    el.setAttribute('aria-label', 'The AV Library');
    el.innerHTML = '<div class="avl-hero"></div>' + SEARCH + CARDS_HTML + '<div class="avl-info"></div><div class="avl-close">' + CLOSE + '</div>';
    var hero = $('.avl-hero', el), cards = $('.avl-cards', el), info = $('.avl-info', el), close = $('.avl-close', el);
    function joinLink(h3, where) {
      h3.classList.add('avl-cta-join');
      $('a', h3).classList.add('avl-btn');
      $('a', h3).setAttribute('href', JOIN);
      where.appendChild(h3);
    }

    // hero: the eyebrow line, the title, the intro, counts, JOIN + Log in, the shop line
    if (eyebrow && eyebrow.tagName === 'H2') { eyebrow.classList.add('avl-tag'); hero.appendChild(eyebrow); }
    h1.classList.add('avl-title');
    hero.appendChild(h1);
    if (intro && intro.tagName === 'P') { intro.classList.add('avl-lede'); hero.appendChild(intro); }
    hero.insertAdjacentHTML('beforeend', '<div class="avl-counts" data-counts></div><div class="avl-cta"></div>'
      + '<p class="avl-alt">Rather not sign up? <a href="/101-av-guides">Shop the 101 AV Guides</a> &mdash; printable PDFs, no account needed.</p>');
    var cta = $('.avl-cta', hero);
    if (topJoin && topJoin !== endJoin && topJoin.tagName === 'H3' && $('a', topJoin)) joinLink(topJoin, cta);
    cta.insertAdjacentHTML('beforeend', '<a class="avl-login" href="' + LOGIN + '">Already a member? Log in</a>');

    // What's Inside: its heading over the cards, each line of its list in its card
    if (inside && inside.tagName === 'H2') { inside.classList.add('avl-head'); el.insertBefore(inside, cards); }
    [].slice.call(list.children).forEach(function (li) {
      var c = CARDS.filter(function (c) { return c.item && !c.used && c.item.test(li.textContent); })[0];
      if (!c) return;
      var p = $('[data-card="' + c.key + '"] p', cards);
      p.textContent = '';
      while (li.firstChild) p.appendChild(li.firstChild);
      c.used = true;
      list.removeChild(li);
    });
    if (list.children.length) el.insertBefore(list, cards.nextSibling); else list.parentNode.removeChild(list);

    // the short sections (a heading and its lines) side by side, up to the last JOIN link
    var box = null;
    while (after && after !== endJoin) {
      var next = after.nextElementSibling;
      if (after.tagName === 'H2' || !box) (box = info.appendChild(document.createElement('div'))).className = 'avl-info-box';
      box.appendChild(after);
      after = next;
    }
    if (!box) el.removeChild(info);

    // closing box: the last JOIN link and the launch story line
    if (endJoin !== topJoin) joinLink(endJoin, close);
    if (story && story.tagName === 'H4') { story.classList.add('avl-story'); close.appendChild(story); }

    text.insertBefore(el, text.firstChild);
    fill(el);
    search(el);
    done();
  }

  // counts and each card's snippet
  function fill(el) {
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
  }

  // teaser search: names only, loaded the first time someone uses the box.
  // A word has to start with what they typed ("led" finds LED, not "coupled").
  function search(el) {
    var input = $('#avl-q', el), out = $('.avl-results', el), data = null, loading = null, timer;
    // a result opens Squarespace's sign up: clicked here, or a link from the public page
    var row = signIn ? '<a href="#avl-join" data-row' : '<a href="' + JOIN + '"';
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
            + joinButton('Join free');
        } else {
          var parts = [];
          if (items.length) parts.push(plural(items.length, 'resource', 'resources'));
          if (terms.length) parts.push(plural(terms.length, 'AV term', 'AV terms'));
          out.innerHTML = '<div class="avl-results-head">' + parts.join(' and ')
            + (items.length + terms.length === 1 ? ' matches' : ' match') + ' &ldquo;' + esc(typed) + '&rdquo;</div>'
            + '<ul>' + rows.map(function (r) {
              return '<li>' + row + ' aria-label="' + esc(r[0] + ' (' + r[1] + '), join free to open') + '">' + LOCK + '<span class="avl-name">' + esc(r[0])
                + '</span><span class="avl-sec">' + esc(r[1]) + '</span></a></li>';
            }).join('') + '</ul>'
            + joinButton('Join free to open them');
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
  css.onload = signIn ? build : buildPublic;
  css.onerror = done;
  document.head.appendChild(css);
})();
