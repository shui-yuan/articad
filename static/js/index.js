document.addEventListener('DOMContentLoaded', () => {
  const teaserSlides = [
    { category: 'Static Assemblies', layout: 'single', images: ['static/images/teaser-carousel/static-01-rack.png'], alt: 'Static assembly example' },
    { category: 'Static Assemblies', layout: 'single', images: ['static/images/teaser-carousel/static-02-bench.png'], alt: 'Static assembly example' },
    { category: 'Static Assemblies', layout: 'single', images: ['static/images/teaser-carousel/static-03-stair-shelf.png'], alt: 'Static assembly example' },
    { category: 'Static Assemblies', layout: 'single', images: ['static/images/teaser-carousel/static-04-ship.png'], alt: 'Static assembly example' },
    { category: 'Static Assemblies', layout: 'single', images: ['static/images/teaser-carousel/static-05-spiral-stair.png'], alt: 'Static assembly example' },
    { category: 'Static Assemblies', layout: 'single', images: ['static/images/teaser-carousel/static-06-cart.png'], alt: 'Static assembly example' },
    { category: 'Articulated Assemblies', layout: 'pair', images: ['static/images/teaser-carousel/articulated-01-chair-a.png', 'static/images/teaser-carousel/articulated-01-chair-b.png'], alt: 'Articulated assembly example' },
    { category: 'Articulated Assemblies', layout: 'pair', images: ['static/images/teaser-carousel/articulated-02-bicycle-a.png', 'static/images/teaser-carousel/articulated-02-bicycle-b.png'], alt: 'Articulated assembly example' },
    { category: 'Articulated Assemblies', layout: 'pair', images: ['static/images/teaser-carousel/articulated-03-swing-a.png', 'static/images/teaser-carousel/articulated-03-swing-b.png'], alt: 'Articulated assembly example' },
    { category: 'Articulated Assemblies', layout: 'pair', images: ['static/images/teaser-carousel/articulated-04-display-a.png', 'static/images/teaser-carousel/articulated-04-display-b.png'], alt: 'Articulated assembly example' },
    { category: 'Industrial Assemblies', layout: 'single', images: ['static/images/teaser-carousel/industrial-01-chain.png'], alt: 'Industrial assembly example' },
    { category: 'Industrial Assemblies', layout: 'single', images: ['static/images/teaser-carousel/industrial-02-bracket.png'], alt: 'Industrial assembly example' },
    { category: 'Industrial Assemblies', layout: 'single', images: ['static/images/teaser-carousel/industrial-03-clamp.png'], alt: 'Industrial assembly example' },
    { category: 'Industrial Assemblies', layout: 'single', images: ['static/images/teaser-carousel/industrial-04-rotor.png'], alt: 'Industrial assembly example' },
    { category: 'Industrial Assemblies', layout: 'single', images: ['static/images/teaser-carousel/industrial-05-gears.png'], alt: 'Industrial assembly example' },
    { category: 'Industrial Assemblies', layout: 'single', images: ['static/images/teaser-carousel/industrial-06-fixture.png'], alt: 'Industrial assembly example' },
  ];

  function buildSlide(slide, isPreview = false) {
    const frameClass = slide.layout === 'pair'
      ? 'teaser-slide-frame teaser-slide-frame-pair'
      : 'teaser-slide-frame teaser-slide-frame-single';
    const images = slide.images
      .map((src, index) => `<div class="teaser-image-shell"><img class="teaser-slide-image" src="${src}" alt="${slide.alt}${slide.layout === 'pair' ? ` view ${index + 1}` : ''}" loading="lazy"></div>`)
      .join('');
    const meta = isPreview ? '' : `<div class="teaser-slide-meta"><span class="teaser-slide-category">${slide.category}</span></div>`;
    return `<div class="teaser-slide-inner"><div class="${frameClass}">${images}</div>${meta}</div>`;
  }

  function initTeaserCarousel() {
    const root = document.querySelector('[data-teaser-carousel]');
    if (!root) return;

    const prevSlide = root.querySelector('.teaser-slide-prev');
    const currentSlide = root.querySelector('.teaser-slide-current');
    const nextSlide = root.querySelector('.teaser-slide-next');
    let activeIndex = 0;
    let autoplayId = null;
    let animationId = null;
    let isAnimating = false;
    const autoplayDelay = 3200;
    const transitionDuration = 360;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrap = (index) => (index + teaserSlides.length) % teaserSlides.length;

    function render() {
      prevSlide.innerHTML = buildSlide(teaserSlides[wrap(activeIndex - 1)], true);
      currentSlide.innerHTML = buildSlide(teaserSlides[activeIndex], false);
      nextSlide.innerHTML = buildSlide(teaserSlides[wrap(activeIndex + 1)], true);
    }

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function animateTransition(direction) {
      if (prefersReducedMotion || direction === 0) return;

      root.classList.remove('is-sliding-next', 'is-sliding-prev');
      if (animationId !== null) {
        window.clearTimeout(animationId);
      }

      isAnimating = true;
      void root.offsetWidth;
      root.classList.add(direction > 0 ? 'is-sliding-next' : 'is-sliding-prev');

      animationId = window.setTimeout(() => {
        root.classList.remove('is-sliding-next', 'is-sliding-prev');
        animationId = null;
        isAnimating = false;
      }, transitionDuration);
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayId = window.setInterval(() => {
        goTo(1, false);
      }, autoplayDelay);
    }

    function goTo(offset, restartAutoplay = true) {
      if (isAnimating || offset === 0) return;

      activeIndex = wrap(activeIndex + offset);
      render();
      animateTransition(offset);
      if (restartAutoplay) {
        startAutoplay();
      }
    }

    prevSlide.addEventListener('click', () => goTo(-1));
    nextSlide.addEventListener('click', () => goTo(1));
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);

    render();
    startAutoplay();
  }

  initTeaserCarousel();

  function initPrototypeShowcase() {
    const root = document.querySelector('[data-prototype-showcase]');
    if (!root) return;

    const steps = Array.from(root.querySelectorAll('[data-showcase-step]'));
    if (!steps.length) return;

    let activeIndex = 0;
    let autoplayId = null;
    const showcaseStepAutoplayDelay = 1700;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function syncAutoplayState() {
      root.classList.toggle('is-autoplaying', autoplayId !== null);
    }

    function syncInteractionState(isInteracting) {
      root.classList.toggle('is-interacting', isInteracting);
    }

    function render() {
      steps.forEach((step, index) => {
        step.classList.toggle('is-active-step', index === activeIndex);
      });
    }

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
      syncAutoplayState();
    }

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion) return;
      autoplayId = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % steps.length;
        render();
      }, showcaseStepAutoplayDelay);
      syncAutoplayState();
    }

    steps.forEach((step, index) => {
      step.addEventListener('mouseenter', () => {
        activeIndex = index;
        render();
      });

      step.addEventListener('focusin', () => {
        activeIndex = index;
        render();
      });
    });

    root.addEventListener('mouseenter', () => {
      syncInteractionState(true);
      stopAutoplay();
    });
    root.addEventListener('mouseleave', () => {
      syncInteractionState(false);
      startAutoplay();
    });
    root.addEventListener('focusin', () => {
      syncInteractionState(true);
      stopAutoplay();
    });
    root.addEventListener('focusout', (event) => {
      if (root.contains(event.relatedTarget)) return;
      syncInteractionState(false);
      startAutoplay();
    });

    render();
    startAutoplay();
  }

  initPrototypeShowcase();

  const copyButton = document.querySelector('.copy-bibtex-btn');
  const bibtex = document.getElementById('bibtex-code');

  if (!copyButton || !bibtex) {
    return;
  }

  copyButton.addEventListener('click', async () => {
    const original = copyButton.textContent;
    try {
      await navigator.clipboard.writeText(bibtex.textContent);
      copyButton.textContent = 'Copied';
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = bibtex.textContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      copyButton.textContent = 'Copied';
    }
    setTimeout(() => {
      copyButton.textContent = original;
    }, 1800);
  });
});
