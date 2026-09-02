(function () {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');

  if (!track || !prevBtn || !nextBtn) return;

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let targetIndex = 0;
  let isNavigating = false;
  let navTimeout = null;

  function getItems() {
    return Array.from(track.querySelectorAll('.carousel-item'));
  }

  function getItemPositions() {
    const items = getItems();
    if (!items.length) return [0];
    const baseOffset = items[0].offsetLeft;
    return items.map((item) => item.offsetLeft - baseOffset);
  }

  function getCurrentIndex() {
    const positions = getItemPositions();
    const currentScroll = track.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < positions.length; i++) {
      const diff = Math.abs(positions[i] - currentScroll);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }

  function scrollToIndex(index, behavior = 'smooth') {
    const positions = getItemPositions();
    const clampedIndex = Math.max(0, Math.min(index, positions.length - 1));
    targetIndex = clampedIndex;
    isNavigating = true;

    clearTimeout(navTimeout);
    navTimeout = setTimeout(() => {
      isNavigating = false;
    }, 600);

    track.scrollTo({
      left: positions[clampedIndex],
      behavior: behavior,
    });
  }

  function navigate(direction) {
    const positions = getItemPositions();
    const baseIndex = isNavigating ? targetIndex : getCurrentIndex();
    const nextIdx = Math.max(0, Math.min(baseIndex + direction, positions.length - 1));
    scrollToIndex(nextIdx, 'smooth');
  }

  // Navegación con botones
  prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    navigate(-1);
  });

  nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    navigate(1);
  });

  // Navegación con teclado
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigate(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigate(-1);
    }
  });

  // Soporte para arrastre táctil y con mouse (Drag)
  function onPointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDown = true;
    moved = false;
    startX = e.clientX;
    lastX = e.clientX;
    startScroll = track.scrollLeft;
    lastTime = performance.now();
    velocity = 0;
    isNavigating = false;
    clearTimeout(navTimeout);

    track.classList.add('dragging');
    try {
      track.setPointerCapture(e.pointerId);
    } catch (err) {}
  }

  function onPointerMove(e) {
    if (!isDown) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) {
      moved = true;
    }

    track.scrollLeft = startScroll - dx;

    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 8) {
      velocity = (e.clientX - lastX) / dt; // px por ms
      lastX = e.clientX;
      lastTime = now;
    }
  }

  function onPointerUp(e) {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');

    try {
      track.releasePointerCapture(e.pointerId);
    } catch (err) {}

    if (!moved) return;

    const positions = getItemPositions();
    const closestIndex = getCurrentIndex();

    let finalIndex = closestIndex;
    if (Math.abs(velocity) > 0.25) {
      const dir = velocity < 0 ? 1 : -1;
      const count = Math.abs(velocity) > 1.2 ? 2 : 1;
      finalIndex = Math.max(0, Math.min(closestIndex + dir * count, positions.length - 1));
    }

    scrollToIndex(finalIndex, 'smooth');
  }

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove);
  track.addEventListener('pointerup', onPointerUp);
  track.addEventListener('pointercancel', onPointerUp);
  track.addEventListener('pointerleave', onPointerUp);

  // Evita clicks accidentales durante el arrastre
  track.addEventListener(
    'click',
    function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
})();