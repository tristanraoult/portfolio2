(function () {
  var overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);display:none;align-items:center;justify-content:center;';

  var lbImg = document.createElement('img');
  lbImg.id = 'lb-img';
  lbImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;display:block;cursor:grab;user-select:none;transition:transform 0.08s;transform-origin:center center;';

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = 'position:fixed;top:20px;right:28px;background:none;border:none;color:#fff;font-size:42px;line-height:1;cursor:pointer;opacity:0.55;z-index:10000;transition:opacity 0.2s;font-family:sans-serif;';
  closeBtn.onmouseenter = function () { closeBtn.style.opacity = '1'; };
  closeBtn.onmouseleave = function () { closeBtn.style.opacity = '0.55'; };

  var hint = document.createElement('div');
  hint.textContent = 'Molette pour zoomer · Échap pour fermer';
  hint.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);font-size:12px;color:rgba(255,255,255,0.3);font-family:Inter,sans-serif;letter-spacing:0.05em;pointer-events:none;';

  overlay.appendChild(lbImg);
  overlay.appendChild(closeBtn);
  overlay.appendChild(hint);
  document.body.appendChild(overlay);

  var scale = 1, tx = 0, ty = 0, dragging = false, ox = 0, oy = 0;

  function applyTransform() {
    lbImg.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }

  function openLightbox(src) {
    lbImg.src = src;
    scale = 1; tx = 0; ty = 0;
    applyTransform();
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Clic sur images de contenu (toutes sauf zones exclues et liens de navigation)
  document.addEventListener('click', function (e) {
    var img = e.target.closest('img');
    if (!img) return;
    if (img.closest('#proj-hero, .np-thumb, nav, #footer, #next-projects, #cta')) return;
    if (img.closest('a[href]')) return;
    e.preventDefault();
    openLightbox(img.src);
  });

  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeLightbox(); });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  // Zoom molette
  overlay.addEventListener('wheel', function (e) {
    e.preventDefault();
    scale = Math.max(0.5, Math.min(6, scale * (e.deltaY < 0 ? 1.12 : 0.9)));
    applyTransform();
  }, { passive: false });

  // Drag pour déplacer
  lbImg.addEventListener('mousedown', function (e) {
    dragging = true;
    ox = e.clientX - tx;
    oy = e.clientY - ty;
    lbImg.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    tx = e.clientX - ox;
    ty = e.clientY - oy;
    applyTransform();
  });
  window.addEventListener('mouseup', function () {
    dragging = false;
    lbImg.style.cursor = 'grab';
  });

  // Double-clic pour reset zoom
  lbImg.addEventListener('dblclick', function () {
    scale = 1; tx = 0; ty = 0;
    applyTransform();
  });

  // Curseur zoom-in sur toutes les images cliquables
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(function (img) {
      if (!img.closest('#proj-hero,.np-thumb,nav,#footer,#next-projects,#cta') && !img.closest('a[href]')) {
        img.style.cursor = 'zoom-in';
      }
    });
  });
})();
