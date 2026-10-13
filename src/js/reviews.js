export function initReviews() {
  const list = document.querySelector('#reviews-list');
  const previous = document.querySelector('[data-reviews-prev]');
  const next = document.querySelector('[data-reviews-next]');
  const status = document.querySelector('[data-reviews-status]');
  if (!list || !previous || !next || !status) return;

  function update() {
    const max = list.scrollWidth - list.clientWidth;
    previous.disabled = max <= 1 || list.scrollLeft <= 1;
    next.disabled = max <= 1 || list.scrollLeft >= max - 1;
    const cards = [...list.children];
    const viewport = list.getBoundingClientRect();
    const visible = cards
      .map((card, index) => ({ rect: card.getBoundingClientRect(), index }))
      .filter(
        ({ rect }) =>
          rect.left >= viewport.left - 1 && rect.right <= viewport.right + 1
      );
    status.textContent = visible.length
      ? `Reviews ${visible[0].index + 1}–${visible.at(-1).index + 1} of ${cards.length}`
      : '';
  }

  function move(direction) {
    const card = list.firstElementChild;
    if (!card) return;
    const step =
      card.getBoundingClientRect().width +
      parseFloat(getComputedStyle(list).columnGap);
    list.scrollBy({ left: direction * step, behavior: 'instant' });
    update();
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  list.addEventListener('scroll', update, { passive: true });
  list.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  new ResizeObserver(update).observe(list);
  new MutationObserver(update).observe(list, { childList: true });
  update();
}
