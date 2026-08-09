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
function initSlider(targetId, images, intervalMs = 3000) {
  const el = document.getElementById(targetId);
  if (!el) return;
  images.forEach(({ src, alt }, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (i === 0) img.classList.add('active');
    el.appendChild(img);
  });
  let current = 0;
  const imgs = el.querySelectorAll('img');
  if (imgs.length < 2) return;
  setInterval(() => {
    imgs[current].classList.remove('active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('active');
  }, intervalMs);
}
