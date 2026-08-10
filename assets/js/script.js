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
function startSlider(id, dotsId, interval) {
  const slides = document.querySelectorAll(`#${id} .slide`);
  const dotsContainer = document.getElementById(dotsId);
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.dot');

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }, interval);
}

startSlider('testimonial-slider', 'testimonial-dots', 4000);
startSlider('badge-slider', 'badge-dots', 3000);
