export function initMobileMenu() {
  const menu = document.querySelector('#mobile-menu');
  const openButton = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  if (!menu || !openButton || !closeButton) return;

  const panel = menu.querySelector('.mobile-menu-panel');
  const background = [...document.body.children].filter(
    (element) => element !== menu && element.tagName !== 'SCRIPT'
  );
  const desktop = window.matchMedia('(min-width: 1280px)');
  let previousFocus;
  let inertState = [];

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.inert = true;
    document.body.classList.remove('menu-is-open');
    openButton.setAttribute('aria-expanded', 'false');
    inertState.forEach(([element, wasInert]) => {
      element.inert = wasInert;
    });
    if (restoreFocus) previousFocus?.focus();
    menu.setAttribute('aria-hidden', 'true');
  }

  openButton.addEventListener('click', () => {
    if (desktop.matches || menu.classList.contains('is-open')) return;
    previousFocus = document.activeElement;
    inertState = background.map((element) => [element, element.inert]);
    background.forEach((element) => {
      element.inert = true;
    });
    menu.inert = false;
    menu.removeAttribute('aria-hidden');
    menu.classList.add('is-open');
    document.body.classList.add('menu-is-open');
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  });

  closeButton.addEventListener('click', () => closeMenu());
  menu.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu();
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    closeMenu();
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      if (!target.hasAttribute('tabindex'))
        target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    }
    if (event.key !== 'Tab') return;
    const focusable = [
      ...panel.querySelectorAll('a[href], button:not(:disabled)'),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  desktop.addEventListener('change', () => {
    if (desktop.matches && menu.classList.contains('is-open')) {
      closeMenu({ restoreFocus: false });
      document.querySelector('.header .logo')?.focus();
    }
  });
}
