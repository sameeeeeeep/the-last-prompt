/** Connect the exploded system diagram to the seven curriculum modules. */
export function initAIAnatomy(root) {
  if (!root) return { destroy() {} };

  const section = root.closest('section');
  const tabs = [...root.querySelectorAll('[data-ai-step]')];
  const panels = [...root.querySelectorAll('[data-ai-panel]')];
  const layers = [...root.querySelectorAll('[data-ai-layer]')];
  const track = root.querySelector('[role="tablist"]');
  const previous = section.querySelector('#course-prev');
  const next = section.querySelector('#course-next');
  const range = section.querySelector('#course-range');
  const announcement = root.querySelector('#anatomy-announcement');
  const diagramTitle = root.querySelector('#anatomy-diagram-title');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;

  function revealTab(tab) {
    const target = tab.getBoundingClientRect();
    const viewport = track.getBoundingClientRect();
    const offset = target.left < viewport.left ? target.left - viewport.left
      : target.right > viewport.right ? target.right - viewport.right : 0;
    if (offset) track.scrollTo({
      left: track.scrollLeft + offset,
      behavior: reduced.matches ? 'auto' : 'smooth'
    });
  }

  function selectLevel(value, { focus = false, announce = true, reveal = true } = {}) {
    const index = Math.max(0, Math.min(tabs.length - 1, value));
    if (!Number.isInteger(index)) return;
    selected = index;
    root.dataset.level = String(index);

    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      tab.classList.toggle('is-included', i <= index);
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      if (panel.hidden) panel.querySelectorAll('details[open]').forEach(detail => { detail.open = false; });
    });
    layers.forEach((layer, i) => {
      layer.classList.toggle('is-active', i === index);
      layer.classList.toggle('is-included', i <= index);
    });

    previous.disabled = index === 0;
    next.disabled = index === tabs.length - 1;
    range.textContent = `Level ${index + 1} of ${tabs.length}`;
    const title = panels[index].querySelector('h3').textContent;
    diagramTitle.textContent = `AI, part by part. Level ${index + 1}: ${title}. This layer and the preceding layers are highlighted.`;
    if (announce) announcement.textContent = `Level ${index + 1}: ${title}. ${panels[index].querySelector('.anatomy-when').textContent}.`;
    if (focus) tabs[index].focus({ preventScroll: true });
    if (reveal) revealTab(tabs[index]);
  }

  function onClick(event) {
    const target = event.target.closest('[data-ai-step], [data-ai-part]');
    if (!target || !root.contains(target)) return;
    selectLevel(Number(target.dataset.aiStep ?? target.dataset.aiPart));
  }

  function onKeydown(event) {
    if (!event.target.closest('[role="tab"]')) return;
    const destinations = { ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    selectLevel(destinations[event.key], { focus: true });
  }

  const goPrevious = () => selectLevel(selected - 1);
  const goNext = () => selectLevel(selected + 1);
  root.addEventListener('click', onClick);
  track.addEventListener('keydown', onKeydown);
  previous.addEventListener('click', goPrevious);
  next.addEventListener('click', goNext);
  selectLevel(0, { announce: false, reveal: false });

  return {
    destroy() {
      root.removeEventListener('click', onClick);
      track.removeEventListener('keydown', onKeydown);
      previous.removeEventListener('click', goPrevious);
      next.removeEventListener('click', goNext);
    }
  };
}
