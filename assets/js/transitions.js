(function () {

  /* ── CSS injecté ─────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    /* Overlay de transition entre pages */
    '.tr-overlay{position:fixed;inset:0;z-index:9997;background:#141517;pointer-events:none;opacity:1;transition:opacity 0.55s cubic-bezier(0.22,1,0.36,1);}',
    '.tr-overlay.visible{opacity:0;}',

    /* Barre de progression au scroll */
    '.tr-progress{position:fixed;top:0;left:0;height:1px;background:rgba(255,255,255,0.35);z-index:9999;width:0%;pointer-events:none;}',

    /* Nav fond au scroll */
    'nav{transition:background 0.4s ease,backdrop-filter 0.4s ease,border-color 0.4s ease,-webkit-backdrop-filter 0.4s ease;}',
    'nav.nav-scrolled{background:rgba(20,21,23,0.88)!important;backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;border-bottom:1px solid rgba(255,255,255,0.07)!important;}',

    /* Hover sur les images de contenu : légère scale */
    '.pc-img img{transition:transform 0.85s cubic-bezier(0.22,1,0.36,1)!important;}',

    /* np-card : slide + scale plus fluide */
    '.np-card{transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);}',
    '.np-card:hover{transform:translateY(-4px);}',

    /* project-card sur work/cours : lift au hover */
    '.project-card{transition:transform 0.45s cubic-bezier(0.22,1,0.36,1),box-shadow 0.45s ease;}',
    '.project-card:hover{transform:translateY(-3px);}',

    /* Hamburger : z-index élevé quand menu ouvert pour passer au-dessus de tout */
    'nav.menu-open{z-index:9998!important;}',
  ].join('');
  document.head.appendChild(style);


  /* ── Overlay de transition entre pages ──────────────────── */
  var overlay = document.createElement('div');
  overlay.className = 'tr-overlay';
  document.body.appendChild(overlay);

  /* Fade-in à l'arrivée sur la page */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('visible');
    });
  });

  /* Fade-out avant de quitter la page */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href) return;
    if (a.target === '_blank') return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    /* Liens ancres purs (#section) : pas de transition */
    if (href.startsWith('#')) return;
    /* Liens externes */
    if (href.startsWith('http') && href.indexOf(location.hostname) === -1) return;

    e.preventDefault();
    var dest = a.href;
    overlay.style.transition = 'opacity 0.38s cubic-bezier(0.4,0,1,1)';
    overlay.classList.remove('visible');
    overlay.style.pointerEvents = 'all';
    setTimeout(function () { location.href = dest; }, 390);
  });


  /* ── Barre de progression ────────────────────────────────── */
  var bar = document.createElement('div');
  bar.className = 'tr-progress';
  document.body.appendChild(bar);


  /* ── Comportements au scroll ─────────────────────────────── */
  var nav = document.querySelector('nav');
  /* Sur les pages projet (hero 100vh sticky), le nav-scrolled
     s'active seulement quand le contenu remonte derrière le nav */
  var heroEl = document.getElementById('proj-hero');
  var scrollThreshold = heroEl ? (window.innerHeight * 0.85) : 60;

  window.addEventListener('resize', function () {
    if (heroEl) scrollThreshold = window.innerHeight * 0.85;
  });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var sy = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;

      /* Barre de progression */
      bar.style.width = (total > 0 ? (sy / total) * 100 : 0) + '%';

      /* Nav fond */
      if (nav) {
        nav.classList.toggle('nav-scrolled', sy > scrollThreshold);
      }

      ticking = false;
    });
  }, { passive: true });


  /* ── Hamburger : scroll lock iOS-compatible ──────────────────── */
  if (nav) {
    var _savedScrollY = 0;
    var _wasMenuOpen = false;
    new MutationObserver(function () {
      var isOpen = nav.classList.contains('menu-open');
      if (isOpen === _wasMenuOpen) return; /* ignore nav-scrolled toggles */
      _wasMenuOpen = isOpen;
      if (isOpen) {
        _savedScrollY = window.scrollY;
        /* Remplace overflow:hidden (inefficace sur iOS) par position:fixed */
        document.body.style.overflow = '';
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + _savedScrollY + 'px';
        document.body.style.width = '100%';
      } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, _savedScrollY);
      }
    }).observe(nav, { attributes: true, attributeFilter: ['class'] });
  }

})();
