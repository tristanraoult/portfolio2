(function () {

  /* ── CSS injecté ─────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    /* Overlay de transition entre pages */
    '.tr-overlay{position:fixed;inset:0;z-index:9997;background:#141517;pointer-events:none;opacity:1;transition:opacity 0.55s cubic-bezier(0.22,1,0.36,1);}',
    '.tr-overlay.visible{opacity:0;}',

    /* Barre de progression au scroll */
    '.tr-progress{position:fixed;top:0;left:0;height:1px;background:rgba(255,255,255,0.35);z-index:9999;width:0%;pointer-events:none;}',

    /* Hover sur les images de contenu : légère scale */
    '.pc-img img{transition:transform 0.85s cubic-bezier(0.22,1,0.36,1)!important;}',

    /* np-card : slide + scale plus fluide */
    '.np-card{transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);}',
    '.np-card:hover{transform:translateY(-4px);}',

    /* project-card sur work/cours : lift au hover */
    '.project-card{transition:transform 0.45s cubic-bezier(0.22,1,0.36,1),box-shadow 0.45s ease;}',
    '.project-card:hover{transform:translateY(-3px);}',

    /* Hamburger z-index */
    'nav.menu-open{z-index:9998!important;}',

    /* Burger raffiné — mobile uniquement */
    '@media(max-width:810px){',
    '.nav-burger{width:44px!important;height:44px!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;overflow:visible!important;}',
    '.nav-burger span{display:block!important;width:22px!important;height:1.5px!important;background:rgba(255,255,255,0.88)!important;margin:3.5px 0!important;border-radius:1px!important;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1),opacity 0.2s ease!important;}',
    'nav.menu-open .nav-burger span:nth-child(1){transform:translateY(8.5px) rotate(45deg)!important;}',
    'nav.menu-open .nav-burger span:nth-child(2){opacity:0!important;}',
    'nav.menu-open .nav-burger span:nth-child(3){transform:translateY(-8.5px) rotate(-45deg)!important;}',
    '}',
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
    if (href.startsWith('#')) return;
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

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var sy = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (sy / total) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive: true });

})();
