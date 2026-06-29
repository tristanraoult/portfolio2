(function () {

  /* ── CSS global ──────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.tr-overlay{position:fixed;inset:0;z-index:9997;background:#141517;pointer-events:none;opacity:1;transition:opacity 0.55s cubic-bezier(0.22,1,0.36,1);}',
    '.tr-overlay.visible{opacity:0;}',
    '.tr-progress{position:fixed;top:0;left:0;height:1px;background:rgba(255,255,255,0.35);z-index:9999;width:0%;pointer-events:none;}',
    '.pc-img img{transition:transform 0.85s cubic-bezier(0.22,1,0.36,1)!important;}',
    '.np-card{transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);}',
    '.np-card:hover{transform:translateY(-4px);}',
    '.project-card{transition:transform 0.45s cubic-bezier(0.22,1,0.36,1),box-shadow 0.45s ease;}',
    '.project-card:hover{transform:translateY(-3px);}',
    /* Nav en avant-plan + nav-links originale masquée quand overlay actif */
    'nav.menu-open{z-index:9998!important;}',
    'nav.menu-open .nav-links{opacity:0!important;pointer-events:none!important;}',
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

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { overlay.classList.add('visible'); });
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.style.transition = 'opacity 0.55s cubic-bezier(0.22,1,0.36,1)';
      overlay.style.pointerEvents = 'none';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { overlay.classList.add('visible'); });
      });
    }
  });

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


  /* ── Menu mobile : overlay standalone dans <body> ───────────
     Div#tr-mob créé directement en root (z-9996) pour éviter
     les conflits de stacking context avec la nav fixed.        */
  (function () {
    var burger = document.getElementById('nav-burger');
    if (!burger) return;
    var sourceLinks = document.querySelector('.nav-links');
    if (!sourceLinks) return;
    var nav = document.querySelector('nav');

    var mStyle = document.createElement('style');
    mStyle.textContent =
      /* Overlay plein écran */
      '#tr-mob{position:fixed;inset:0;z-index:9996;background:#0a0b0d;' +
      'display:flex;flex-direction:column;align-items:stretch;justify-content:center;' +
      'padding:0 32px;' +
      'opacity:0;pointer-events:none;transition:opacity 0.28s ease;}' +
      '#tr-mob.open{opacity:1;pointer-events:auto;}' +
      /* Réinitialise le ul.nav-links cloné */
      '#tr-mob .nav-links{position:static!important;inset:auto!important;' +
      'opacity:1!important;background:none!important;' +
      'z-index:auto!important;display:flex!important;flex-direction:column!important;' +
      'gap:0!important;align-items:stretch!important;justify-content:center!important;' +
      'transition:none!important;padding:0!important;' +
      'counter-reset:nav!important;}' +
      /* Chaque item */
      '#tr-mob .nav-links li{' +
      'counter-increment:nav;' +
      'border-bottom:1px solid rgba(255,255,255,0.07);' +
      'opacity:0;transform:translateX(-18px);' +
      'transition:opacity 0.3s ease,transform 0.42s cubic-bezier(0.22,1,0.36,1);}' +
      '#tr-mob .nav-links li:first-child{border-top:1px solid rgba(255,255,255,0.07);}' +
      '#tr-mob.open .nav-links li{opacity:1;transform:none;}' +
      '#tr-mob.open .nav-links li:nth-child(1){transition-delay:90ms;}' +
      '#tr-mob.open .nav-links li:nth-child(2){transition-delay:130ms;}' +
      '#tr-mob.open .nav-links li:nth-child(3){transition-delay:170ms;}' +
      '#tr-mob.open .nav-links li:nth-child(4){transition-delay:210ms;}' +
      /* Liens */
      '#tr-mob .nav-links a{' +
      'display:flex!important;align-items:center!important;gap:16px!important;' +
      'padding:24px 0!important;' +
      'font-size:28px!important;font-weight:600!important;' +
      'color:rgba(255,255,255,0.92)!important;' +
      'letter-spacing:-0.3px!important;text-decoration:none!important;}' +
      '#tr-mob .nav-links a:active{color:#fff!important;}' +
      /* Numéro avant chaque lien */
      '#tr-mob .nav-links a::before{' +
      'content:"0" counter(nav)!important;' +
      'font-size:10px!important;font-weight:400!important;letter-spacing:2px!important;' +
      'color:rgba(255,255,255,0.28)!important;' +
      'font-family:"Fragment Mono",monospace!important;flex-shrink:0!important;}' +
      /* Neutralise tout ::after hérité des pages */
      '#tr-mob .nav-links a::after{display:none!important;}';
    document.head.appendChild(mStyle);

    var mob = document.createElement('div');
    mob.id = 'tr-mob';
    mob.appendChild(sourceLinks.cloneNode(true));
    document.body.appendChild(mob);

    function openMob() {
      mob.classList.add('open');
      if (nav) nav.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMob() {
      mob.classList.remove('open');
      if (nav) nav.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
      mob.classList.contains('open') ? closeMob() : openMob();
    });

    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMob);
    });
  })();

})();


/* ── Explore pill + cursor dot ───────────────────────────────────────────── */
(function () {
  /* Desktop uniquement (pointer précis = souris) */
  if (!window.matchMedia('(pointer:fine)').matches) return;

  /* Masque le curseur système globalement */
  var cs = document.createElement('style');
  cs.textContent = '*{cursor:none!important;}input,textarea,select{cursor:text!important;}';
  document.head.appendChild(cs);

  /* ── Dot curseur lumineux ── */
  var dot = document.createElement('div');
  dot.style.cssText =
    'position:fixed;top:0;left:0;z-index:9999;pointer-events:none;' +
    'width:12px;height:12px;border-radius:50%;' +
    'background:rgba(255,255,255,0.95);' +
    'box-shadow:0 0 16px 4px rgba(255,255,255,0.45),0 0 4px 1px rgba(255,255,255,0.9);' +
    'transform:translate(-50%,-50%);opacity:0;will-change:left,top;';
  document.body.appendChild(dot);

  /* ── Pill "Explore" glassmorphisme ── */
  var pill = document.createElement('div');
  pill.textContent = 'Explore';
  pill.style.cssText =
    'position:fixed;top:0;left:0;z-index:9998;pointer-events:none;' +
    'padding:13px 28px;border-radius:100px;' +
    'background:rgba(10,11,13,0.52);' +
    'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);' +
    'border:1px solid rgba(255,255,255,0.15);' +
    'color:rgba(255,255,255,0.92);' +
    "font-family:Inter,sans-serif;font-size:14px;font-weight:500;letter-spacing:0.03em;" +
    'white-space:nowrap;will-change:left,top;' +
    'opacity:0;transform:translate(-50%,-50%) scale(0.82);' +
    'transition:opacity 0.22s cubic-bezier(0.22,1,0.36,1),transform 0.22s cubic-bezier(0.22,1,0.36,1);';
  document.body.appendChild(pill);

  /* ── État ── */
  var dx = -300, dy = -300, dtx = -300, dty = -300;
  var px = -300, py = -300, ptx = -300, pty = -300;
  var alive = false;
  var pillActive = false;

  document.addEventListener('mousemove', function (e) {
    dtx = ptx = e.clientX;
    dty = pty = e.clientY;
    if (!alive) { alive = true; dx = dtx; dy = dty; px = ptx; py = pty; }
    if (!pillActive) dot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
    pill.style.opacity = '0';
    pill.style.transform = 'translate(-50%,-50%) scale(0.82)';
  });

  /* ── Montrer / cacher la pill ── */
  function showPill() {
    pillActive = true;
    pill.style.opacity = '1';
    pill.style.transform = 'translate(-50%,-50%) scale(1)';
    dot.style.opacity = '0';
  }
  function hidePill() {
    pillActive = false;
    pill.style.opacity = '0';
    pill.style.transform = 'translate(-50%,-50%) scale(0.82)';
    if (alive) dot.style.opacity = '1';
  }

  /* ── Bind sur les cartes ── */
  function bindTriggers() {
    document.querySelectorAll('.np-card,.project-card,.work-item').forEach(function (el) {
      el.addEventListener('mouseenter', showPill);
      el.addEventListener('mouseleave', hidePill);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindTriggers);
  } else {
    bindTriggers();
  }

  /* ── Boucle RAF ── */
  function tick() {
    dx += (dtx - dx) * 0.22;
    dy += (dty - dy) * 0.22;
    dot.style.left = (dx | 0) + 'px';
    dot.style.top  = (dy | 0) + 'px';

    px += (ptx - px) * 0.09;
    py += (pty - py) * 0.09;
    pill.style.left = (px | 0) + 'px';
    pill.style.top  = (py | 0) + 'px';

    requestAnimationFrame(tick);
  }
  tick();
})();


