/** Connect the exploded system diagram to the seven curriculum modules. */
export function initAIAnatomy(root) {
  if (!root) return { setPaused() {}, destroy() {} };

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
  let selected = 0, timer = 0, heldUntil = 0;
  let visible = false, hovered = false, focused = false, paused = false, pageActive = true, alive = true;

  function canAdvance() {
    return alive && visible && !hovered && !focused && !paused && pageActive
      && !reduced.matches && !document.hidden && !root.querySelector('details[open]');
  }

  function schedule() {
    clearTimeout(timer);
    timer = 0;
    if (!canAdvance()) return;
    timer = setTimeout(() => {
      if (!canAdvance()) return;
      selectLevel((selected + 1) % tabs.length, { announce: false });
      schedule();
    }, Math.max(1200, heldUntil - Date.now()));
  }

  function chooseLevel(index, options) {
    heldUntil = Date.now() + 12000;
    selectLevel(index, options);
    schedule();
  }

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
    chooseLevel(Number(target.dataset.aiStep ?? target.dataset.aiPart));
  }

  function onKeydown(event) {
    if (!event.target.closest('[role="tab"]')) return;
    const destinations = { ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    chooseLevel(destinations[event.key], { focus: true });
  }

  const goPrevious = () => chooseLevel(selected - 1);
  const goNext = () => chooseLevel(selected + 1);
  const enter = event => { if (event.pointerType !== 'touch') { hovered = true; schedule(); } };
  const leave = () => { hovered = false; schedule(); };
  const focusIn = () => { focused = true; schedule(); };
  const focusOut = event => { focused = section.contains(event.relatedTarget); schedule(); };
  const detailToggle = event => { if (event.target.matches('details')) schedule(); };
  const hide = () => { pageActive = false; schedule(); };
  const show = () => { pageActive = true; schedule(); };
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .25);
    schedule();
  }, { threshold: [0, .25] });
  observer.observe(root);
  root.addEventListener('click', onClick);
  track.addEventListener('keydown', onKeydown);
  previous.addEventListener('click', goPrevious);
  next.addEventListener('click', goNext);
  section.addEventListener('pointerenter', enter);
  section.addEventListener('pointerleave', leave);
  section.addEventListener('focusin', focusIn);
  section.addEventListener('focusout', focusOut);
  root.addEventListener('toggle', detailToggle, true);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  window.addEventListener('pagehide', hide);
  window.addEventListener('pageshow', show);
  selectLevel(0, { announce: false, reveal: false });

  return {
    setPaused(value) { paused = Boolean(value); schedule(); },
    destroy() {
      alive = false;
      clearTimeout(timer);
      observer.disconnect();
      section.removeEventListener('pointerenter', enter);
      section.removeEventListener('pointerleave', leave);
      section.removeEventListener('focusin', focusIn);
      section.removeEventListener('focusout', focusOut);
      root.removeEventListener('toggle', detailToggle, true);
      document.removeEventListener('visibilitychange', schedule);
      reduced.removeEventListener('change', schedule);
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('pageshow', show);
      root.removeEventListener('click', onClick);
      track.removeEventListener('keydown', onKeydown);
      previous.removeEventListener('click', goPrevious);
      next.removeEventListener('click', goNext);
    }
  };
}
