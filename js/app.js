/* ============================================================
   APP — renders the page from data.js + i18n.js and handles
   language switching (no reload), navigation and reveal effects.
   ============================================================ */
(function () {
  'use strict';

  var D = window.PORTFOLIO;
  var UI = window.I18N;
  var STORAGE_KEY = 'portfolio-lang';
  var root = document.documentElement;
  var lang = root.lang === 'en' ? 'en' : 'ar';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ui(key) { return (UI[lang] && UI[lang][key]) || UI.en[key] || key; }
  // Bilingual value → current language. Plain strings are returned unchanged.
  function tr(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang] != null ? v[lang] : v.en;
  }
  // Latin-script text (tech names, emails, URLs) stays left-to-right inside RTL text.
  function ltr(s) { return '<bdi dir="ltr">' + esc(s) + '</bdi>'; }
  // Strings are treated as Latin/official names; {ar,en} objects are translated.
  function txt(v) { return typeof v === 'string' ? ltr(v) : esc(tr(v)); }

  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-').map(Number);
    var locale = lang === 'ar' ? 'ar-u-ca-gregory-nu-latn' : 'en-US';
    var opts = p.length === 3 ? { year: 'numeric', month: 'long', day: 'numeric' } : { year: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat(locale, opts).format(new Date(Date.UTC(p[0], p[1] - 1, p[2] || 1, 12)));
  }
  function dateRange(item) {
    if (!item.start && !item.end) return '';
    var from = fmtDate(item.start);
    var to = item.end ? fmtDate(item.end) : (item.current ? ui('exp.presentRange') : '');
    return to ? from + ' – ' + to : from;
  }
  function sortByDate(list) {
    return list.slice().sort(function (a, b) {
      if (!a.start && !b.start) return 0;
      if (!a.start) return 1;
      if (!b.start) return -1;
      return a.start < b.start ? 1 : a.start > b.start ? -1 : 0;
    });
  }

  var ICON = {
    external: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
    github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>',
    file: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    cert: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/></svg>'
  };

  /* ---------- renderers ---------- */
  function chips(items) {
    return '<ul class="chips">' + items.map(function (s) { return '<li class="chip">' + txt(s) + '</li>'; }).join('') + '</ul>';
  }

  function renderExperience() {
    var list = sortByDate(D.experience.filter(function (e) { return !e.hidden; }));
    var el = document.getElementById('experience-list');
    if (!list.length) { el.innerHTML = '<li class="empty">' + esc(ui('exp.empty')) + '</li>'; return; }
    el.innerHTML = list.map(function (e) {
      var range = dateRange(e);
      var meta = [];
      if (range) meta.push('<span class="meta-item"><bdi>' + esc(range) + '</bdi></span>');
      if (e.duration) meta.push('<span class="meta-item">' + esc(ui('exp.duration')) + ': ' + esc(tr(e.duration)) + '</span>');
      if (e.location) meta.push('<span class="meta-item">' + esc(tr(e.location)) + '</span>');
      return '<li class="t-item kind-' + esc(e.kind) + '">' +
        '<article class="card">' +
          '<div class="badges"><span class="badge badge-' + esc(e.kind) + '">' + esc(ui('kind.' + e.kind)) + '</span>' +
          (e.current ? '<span class="badge badge-current">' + esc(ui('exp.present')) + '</span>' : '') + '</div>' +
          '<h3>' + esc(tr(e.title)) + '</h3>' +
          '<p class="org">' + txt(e.org) + '</p>' +
          (meta.length ? '<p class="meta">' + meta.join('') + '</p>' : '') +
          '<p class="desc">' + esc(tr(e.description)) + '</p>' +
          (e.skills && e.skills.length ? '<p class="mini-label">' + esc(ui('exp.relatedSkills')) + '</p>' + chips(e.skills) : '') +
        '</article></li>';
    }).join('');
  }

  function renderSkills() {
    document.getElementById('skills-grid').innerHTML = D.skills.map(function (c) {
      return '<article class="card skill-card"><h3>' + esc(tr(c.title)) + '</h3>' + chips(c.items) + '</article>';
    }).join('');
  }

  function renderProjects() {
    var list = D.projects.filter(function (p) { return !p.hidden; });
    var el = document.getElementById('projects-list');
    if (!list.length) { el.innerHTML = '<p class="empty">' + esc(ui('projects.empty')) + '</p>'; return; }
    el.innerHTML = list.map(function (p) {
      var links = (p.links || []).map(function (l) {
        return '<a class="btn btn-ghost btn-sm" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(tr(l.label)) + ' ' + ICON.external + '<span class="sr-only"> (' + esc(ui('a11y.external')) + ')</span></a>';
      }).join('');
      return '<article class="card project' + (p.featured ? ' featured' : '') + '">' +
        (p.image ? '<div class="project-media"><img src="' + esc(p.image) + '" alt="' + esc(tr(p.alt)) + '" loading="lazy" width="' + (p.imgW || 1400) + '" height="' + (p.imgH || 716) + '" /></div>' : '') +
        '<div class="project-body">' +
          '<div class="badges">' + (p.featured ? '<span class="badge badge-featured">' + esc(ui('projects.featured')) + '</span>' : '') +
          '<span class="badge badge-type">' + esc(tr(p.type)) + '</span></div>' +
          '<h3>' + esc(tr(p.title)) + '</h3>' +
          '<p class="desc">' + esc(tr(p.description)) + '</p>' +
          '<p class="mini-label">' + esc(ui('projects.tech')) + '</p>' + chips(p.tech) +
          (links ? '<div class="project-links">' + links + '</div>' : '') +
        '</div></article>';
    }).join('');
  }

  function renderEducation() {
    var list = sortByDate(D.education);
    document.getElementById('education-list').innerHTML = list.map(function (e) {
      return '<article class="card edu-card kind-' + esc(e.kind) + '">' +
        '<div class="badges"><span class="badge badge-' + esc(e.kind) + '">' + esc(ui('kind.' + e.kind)) + '</span></div>' +
        '<h3>' + esc(tr(e.title)) + '</h3>' +
        '<p class="org">' + txt(e.org) + '</p>' +
        '<p class="meta"><span class="meta-item"><bdi>' + esc(dateRange(e)) + '</bdi></span>' +
        (e.location ? '<span class="meta-item">' + esc(tr(e.location)) + '</span>' : '') + '</p>' +
        '</article>';
    }).join('');

    var certs = sortByDate(D.certifications.map(function (c) { return Object.assign({}, c, { start: c.date }); }));
    var cEl = document.getElementById('cert-list');
    if (!certs.length) { cEl.innerHTML = '<p class="empty">' + esc(ui('edu.certEmpty')) + '</p>'; return; }
    cEl.innerHTML = certs.map(function (c) {
      return '<article class="card cert-card">' +
        '<span class="cert-icon">' + ICON.cert + '</span>' +
        '<h3>' + ltr(c.title) + '</h3>' +
        '<p class="org">' + ltr(c.issuer) + '</p>' +
        '<p class="meta"><span class="meta-item"><bdi>' + esc(fmtDate(c.date)) + '</bdi></span></p>' +
        (c.link ? '<a class="card-link" href="' + esc(c.link) + '" target="_blank" rel="noopener noreferrer">' + esc(ui('edu.viewCert')) + ' ' + ICON.external + '</a>' : '') +
        '</article>';
    }).join('');
  }

  function renderContact() {
    var P = D.profile, out = [];
    function item(href, icon, label, value, ext) {
      out.push('<li><a class="contact-chip" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        icon + '<span class="contact-text"><span class="contact-label">' + esc(label) + '</span><span class="contact-value">' + ltr(value) + '</span></span>' +
        (ext ? '<span class="sr-only">(' + esc(ui('a11y.external')) + ')</span>' : '') + '</a></li>');
    }
    if (P.email)    item('mailto:' + P.email, ICON.mail, ui('contact.email'), P.email);
    if (P.linkedin) item(P.linkedin, ICON.linkedin, 'LinkedIn', 'LinkedIn', true);
    if (P.github)   item(P.github, ICON.github, 'GitHub', 'GitHub', true);
    if (P.phone)    item('tel:' + P.phone, ICON.phone, ui('contact.phone'), P.phoneDisplay || P.phone);
    if (P.cv)       item(P.cv, ICON.file, ui('contact.cv'), 'PDF');
    document.getElementById('contact-links').innerHTML = out.length ? out.join('') : '<li class="empty">' + esc(ui('contact.empty')) + '</li>';
  }

  function renderStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = ui(n.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (n) {
      n.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':'); n.setAttribute(pair.slice(0, i).trim(), ui(pair.slice(i + 1).trim()));
      });
    });
    document.title = ui('meta.title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', ui('meta.description'));
    syncMenuLabel();
  }

  function renderAll() {
    renderStatic();
    renderExperience(); renderSkills(); renderProjects(); renderEducation(); renderContact();
    var cv = document.getElementById('cv-btn');
    if (D.profile.cv) { cv.hidden = false; cv.setAttribute('href', D.profile.cv); } else { cv.hidden = true; }
  }

  /* ---------- language ---------- */
  function setLang(l, persist) {
    lang = l === 'en' ? 'en' : 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('.lang-switch [data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    renderAll();
    if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
  }
  document.querySelectorAll('.lang-switch [data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });

  /* ---------- mobile menu ---------- */
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('menu-toggle');
  function syncMenuLabel() {
    var open = header.classList.contains('menu-open');
    toggle.setAttribute('aria-label', ui(open ? 'a11y.menuClose' : 'a11y.menuOpen'));
    toggle.setAttribute('aria-expanded', String(open));
  }
  function setMenu(open) { header.classList.toggle('menu-open', open); syncMenuLabel(); }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
  document.getElementById('site-nav').addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('menu-open') && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* ---------- active section + reveal ---------- */
  function observe() {
    var links = {};
    document.querySelectorAll('.site-nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
        if (links[en.target.id]) links[en.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('in'); rev.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (n) { rev.observe(n); });
  }

  /* ---------- init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  setLang(lang, false);
  observe();
})();
