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


/* ── Curseur custom (core + halo) ───────────────────────────────────────── */
(function () {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  /* Masque le curseur système + styles curseur */
  var cs = document.createElement('style');
  cs.textContent =
    '*{cursor:none!important;}input,textarea,select{cursor:text!important;}' +
    '#cursor{position:fixed;inset:0;pointer-events:none;z-index:9999;}' +
    '.cursor-core,.cursor-halo{position:fixed;left:0;top:0;pointer-events:none;transform:translate(-50%,-50%);will-change:left,top;}' +
    /* Point central — blanc lumineux au repos */
    '.cursor-core{width:9px;height:9px;border-radius:50%;background:#fff;' +
    'box-shadow:0 0 6px 2px rgba(255,255,255,0.95),0 0 18px 4px rgba(255,255,255,0.55),0 0 32px 8px rgba(255,255,255,0.18);' +
    'z-index:9999;transition:background .25s,box-shadow .25s;}' +
    /* Halo flou — plus visible, légèrement chaud */
    '.cursor-halo{width:52px;height:52px;border-radius:50%;' +
    'background:radial-gradient(circle,rgba(255,248,230,0.28) 0%,rgba(255,255,255,0.10) 45%,transparent 70%);' +
    'opacity:1;filter:blur(5px);transition:width .22s,height .22s,background .25s,opacity .22s;}' +
    /* État hover : or chaud sur le point + halo élargi et coloré */
    '#cursor.cursor-hover .cursor-core{background:#D4A756;' +
    'box-shadow:0 0 6px 2px rgba(212,167,86,0.95),0 0 18px 5px rgba(212,167,86,0.55),0 0 36px 10px rgba(212,167,86,0.20);}' +
    '#cursor.cursor-hover .cursor-halo{width:68px;height:68px;' +
    'background:radial-gradient(circle,rgba(212,167,86,0.22) 0%,rgba(212,167,86,0.08) 50%,transparent 72%);opacity:1;}';
  document.head.appendChild(cs);

  /* Éléments DOM */
  var cursorLayer = document.createElement('div');
  cursorLayer.id = 'cursor';
  cursorLayer.setAttribute('hidden', '');
  var core = document.createElement('span');
  core.className = 'cursor-core';
  var halo = document.createElement('span');
  halo.className = 'cursor-halo';
  cursorLayer.appendChild(core);
  cursorLayer.appendChild(halo);
  document.body.appendChild(cursorLayer);

  /* RAF loop */
  var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  var x = tx, y = ty, hx = tx, hy = ty;

  window.addEventListener('pointermove', function (e) {
    tx = e.clientX; ty = e.clientY;
    cursorLayer.removeAttribute('hidden');
  });

  (function loop() {
    x  += (tx - x)  * 0.35;
    y  += (ty - y)  * 0.35;
    core.style.left = x + 'px';
    core.style.top  = y + 'px';
    hx += (tx - hx) * 0.15;
    hy += (ty - hy) * 0.15;
    halo.style.left = hx + 'px';
    halo.style.top  = hy + 'px';
    requestAnimationFrame(loop);
  })();

  /* Changement couleur sur éléments interactifs */
  function bindHover() {
    document.querySelectorAll('a,button,[data-cursor]').forEach(function (el) {
      el.addEventListener('pointerenter', function () { cursorLayer.classList.add('cursor-hover'); });
      el.addEventListener('pointerleave', function () { cursorLayer.classList.remove('cursor-hover'); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bindHover(); });
  } else {
    bindHover();
  }
})();

/* ── Smooth scroll cinématique (vanilla, sans lib externe) ────────────── */
(function () {
  if (!window.matchMedia('(pointer:fine)').matches) return;

  /* évite le double-lissage si la page a scroll-behavior:smooth */
  var ss = document.createElement('style');
  ss.textContent = 'html{scroll-behavior:auto!important;}';
  document.head.appendChild(ss);

  var tgt = window.scrollY;
  var cur = window.scrollY;
  var raf = 0;

  function step() {
    var diff = tgt - cur;
    if (Math.abs(diff) < 0.5) {
      window.scrollTo(0, tgt);
      cur = tgt;
      raf = 0;
      return;
    }
    cur += diff * 0.10;
    window.scrollTo(0, cur);
    /* appel synchrone pour éviter le décalage d'une frame sur les cartes */
    if (typeof window.__cardsUpdate === 'function') window.__cardsUpdate();
    raf = requestAnimationFrame(step);
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    var max = document.documentElement.scrollHeight - window.innerHeight;
    tgt = Math.max(0, Math.min(max, tgt + e.deltaY));
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: false });

  /* resync si l'utilisateur utilise la barre de scroll ou les flèches clavier */
  window.addEventListener('scroll', function () {
    if (!raf) {
      tgt = window.scrollY; cur = window.scrollY;
    } else if (Math.abs(window.scrollY - cur) > 80) {
      tgt = window.scrollY; cur = window.scrollY;
      cancelAnimationFrame(raf); raf = 0;
    }
  }, { passive: true });
})();
