(() => {
  let startY = 0;
  let pulling = false;
  let distance = 0;
  const threshold = 82;
  const indicator = document.createElement('div');
  indicator.className = 'pull-refresh-indicator';
  indicator.setAttribute('role', 'status');
  indicator.setAttribute('aria-live', 'polite');
  indicator.textContent = '↓ Pull to refresh';
  document.body.append(indicator);

  const atTop = () => window.scrollY <= 0;
  const reset = () => {
    pulling = false;
    distance = 0;
    indicator.classList.remove('pulling', 'ready', 'refreshing');
    indicator.style.setProperty('--pull-distance', '0px');
    indicator.textContent = '↓ Pull to refresh';
  };

  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || !atTop()) return;
    const target = event.target;
    if (target.closest('input, textarea, select, button, a, canvas, [contenteditable="true"], dialog, .table-wrap, .heatmap-scroll')) return;
    startY = event.touches[0].clientY;
    pulling = true;
  }, { passive: true });

  document.addEventListener('touchmove', event => {
    if (!pulling || event.touches.length !== 1 || !atTop()) return;
    const delta = event.touches[0].clientY - startY;
    if (delta <= 0) return reset();
    event.preventDefault();
    distance = Math.min(delta * 0.55, 120);
    indicator.style.setProperty('--pull-distance', `${distance}px`);
    indicator.classList.add('pulling');
    const ready = distance >= threshold;
    indicator.classList.toggle('ready', ready);
    indicator.textContent = ready ? '↑ Release to refresh' : '↓ Pull to refresh';
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!pulling) return;
    if (distance >= threshold) {
      indicator.classList.add('refreshing');
      indicator.textContent = '↻ Refreshing…';
      setTimeout(() => window.location.reload(), 180);
    } else reset();
  }, { passive: true });

  document.addEventListener('touchcancel', reset, { passive: true });
})();
