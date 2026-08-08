// ---------- mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
});

// ---------- gallery renderer ----------
// Call renderGallery('elementId', imageArray) on any page.
// imageArray items: { src, alt }
function renderGallery(targetId, images) {
  const el = document.getElementById(targetId);
  if (!el) return;
  images.forEach(({ src, alt }) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    el.appendChild(img);
  });
}
