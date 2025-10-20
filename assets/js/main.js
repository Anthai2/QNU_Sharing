// QNUniShare interactions
(function () {
  const header = document.querySelector('header');
  const headerHeight = () => (header ? header.offsetHeight : 0);

  function smoothScrollTo(targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight();
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Enhance all in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(id);
      closeMobileMenu();
    });
  });

  // CTA buttons
  const btnExplore = document.getElementById('btnExplore');
  const btnPlans = document.getElementById('btnPlans');
  btnExplore && btnExplore.addEventListener('click', () => smoothScrollTo('features'));
  btnPlans && btnPlans.addEventListener('click', () => smoothScrollTo('plans'));

  // Mobile menu toggle
  const btnMenu = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    btnMenu?.setAttribute('aria-expanded', 'true');
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    btnMenu?.setAttribute('aria-expanded', 'false');
  }
  btnMenu && btnMenu.addEventListener('click', () => {
    if (!mobileMenu) return;
    const isHidden = mobileMenu.classList.contains('hidden');
    isHidden ? openMobileMenu() : closeMobileMenu();
  });

  // Close mobile menu on nav click
  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));

  // Active section highlighting
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  function updateActiveLink() {
    const y = window.scrollY + headerHeight() + 8;
    let current = null;
    sections.forEach((s) => {
      if (s.offsetTop <= y) current = s;
    });
    navLinks.forEach((l) => l.classList.remove('active'));
    if (current) {
      const active = navLinks.find((l) => l.getAttribute('href') === `#${current.id}`);
      active && active.classList.add('active');
    }
  }
  updateActiveLink();
  window.addEventListener('scroll', () => requestAnimationFrame(updateActiveLink));
  window.addEventListener('resize', () => requestAnimationFrame(updateActiveLink));
})();

