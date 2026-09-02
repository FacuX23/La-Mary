(function () {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');

  if (!track || !prevBtn || !nextBtn) return;

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

})();