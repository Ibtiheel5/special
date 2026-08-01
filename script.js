/* =============================================================
   "The Moon and Memories" — birthday site for Adham
   Vanilla JS only. Organized by feature, each section commented.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     1. STARFIELD
     Scatter a field of small twinkling stars across the sky.
     Density is modest so the moonlight stays the focal point.
  ----------------------------------------------------------- */
  function buildStarfield() {
    const container = document.getElementById('stars');
    if (!container) return;
    const count = window.innerWidth < 600 ? 70 : 130;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const size = Math.random() * 2 + 1; // 1px - 3px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${2.5 + Math.random() * 4}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;

      fragment.appendChild(star);
    }
    container.appendChild(fragment);
  }

  /* -----------------------------------------------------------
     2. FLOATING HEARTS
     A slow, sparse drift of small hearts rising through the sky.
     Kept subtle: this is atmosphere, not confetti.
  ----------------------------------------------------------- */
  function spawnHeart() {
    const field = document.getElementById('hearts-field');
    if (!field) return;

    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.5 ? '❤' : '🤍';

    const left = Math.random() * 100;
    const drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
    const duration = 9 + Math.random() * 8;
    const size = 0.8 + Math.random() * 1.1;

    heart.style.left = `${left}%`;
    heart.style.setProperty('--drift', drift);
    heart.style.animationDuration = `${duration}s`;
    heart.style.fontSize = `${size}rem`;

    field.appendChild(heart);
    // clean up once the animation finishes so the DOM doesn't grow forever
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  let heartInterval = null;
  function startHeartField() {
    if (prefersReducedMotion || heartInterval) return;
    spawnHeart();
    heartInterval = setInterval(spawnHeart, 2200);
  }

  /* -----------------------------------------------------------
     3. SCROLL REVEALS
     Sections fade/rise into place as they enter the viewport;
     the constellation lines/stars are triggered the same way
     via the shared `is-visible` class (see style.css).
  ----------------------------------------------------------- */
  function initRevealObserver() {
    const targets = document.querySelectorAll('.reveal-target');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.35 });

    targets.forEach(t => observer.observe(t));
  }

  /* -----------------------------------------------------------
     4. TYPEWRITER LETTER
     Types the letter out slowly, paragraph by paragraph, so it
     reads like it's being written in real time.
  ----------------------------------------------------------- */
  const letterParagraphs = [
    'Happy Birthday Adham.',
    "I know life changes and sometimes things don't stay the same, but some people keep a special place in our hearts.",
    'Today I just wanted to remind you how much you meant to me and how grateful I am for every moment, every laugh, every conversation, and every beautiful memory we shared.',
    'I hope this new year of your life brings you happiness, success, peace, and everything your heart wishes for.',
    'No matter where life takes us, I will always appreciate the person you were in my life.',
    'Happy Birthday.\nTake care of yourself. You will always be someone special to me. ❤️'
  ];

  let typewriterStarted = false;

  function typeLetter() {
    if (typewriterStarted) return;
    typewriterStarted = true;

    const target = document.getElementById('letter-text');
    if (!target) return;

    if (prefersReducedMotion) {
      target.textContent = letterParagraphs.join('\n\n');
      return;
    }

    target.classList.add('is-typing');
    const fullText = letterParagraphs.join('\n\n');
    let i = 0;
    const speed = 26; // ms per character — gentle, readable pace

    (function typeChar() {
      target.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) {
        setTimeout(typeChar, speed);
      } else {
        target.classList.remove('is-typing');
      }
    })();
  }

  /* -----------------------------------------------------------
     5. OPENING THE GIFT
     The single ritual moment of the page: the button fades,
     the moon rises, the atmosphere turns on, and we glide down
     into the letter.
  ----------------------------------------------------------- */
  const openButton = document.getElementById('open-gift');
  const musicButton = document.getElementById('music-toggle');

  if (openButton) {
    openButton.addEventListener('click', () => {
      document.body.classList.add('gift-opened');
      openButton.classList.add('is-hidden');

      startHeartField();

      if (musicButton) {
        musicButton.classList.remove('hidden');
      }

      // give the moon-rise moment a beat before scrolling to the letter
      setTimeout(() => {
        const letterSection = document.getElementById('letter');
        if (letterSection) {
          letterSection.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(typeLetter, 500);
      }, 900);
    });
  }

  /* -----------------------------------------------------------
     6. MUSIC TOGGLE
     Audio only ever starts on explicit user action, never
     autoplays. "Our song" plays/pauses on tap.
  ----------------------------------------------------------- */
  const audio = document.getElementById('bg-audio');

  if (musicButton && audio) {
    musicButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {
          // If the browser blocks playback or the file isn't present yet,
          // fail quietly — the visual experience still works on its own.
        });
        musicButton.setAttribute('aria-pressed', 'true');
        musicButton.querySelector('.music-label').textContent = 'Playing our song';
      } else {
        audio.pause();
        musicButton.setAttribute('aria-pressed', 'false');
        musicButton.querySelector('.music-label').textContent = 'Our song';
      }
    });
  }

  /* -----------------------------------------------------------
     INIT
  ----------------------------------------------------------- */
  buildStarfield();
  initRevealObserver();
});
