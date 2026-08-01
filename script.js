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
     1b. SHOOTING STARS
     A rare, gentle streak across the sky — atmosphere, not a
     light show. Fires occasionally on a random interval.
  ----------------------------------------------------------- */
  function spawnShootingStar() {
    const layer = document.getElementById('shooting-stars');
    if (!layer) return;

    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = `${5 + Math.random() * 35}%`;
    star.style.left = `${40 + Math.random() * 55}%`;

    layer.appendChild(star);
    setTimeout(() => star.remove(), 1800);
  }

  function scheduleShootingStars() {
    if (prefersReducedMotion) return;
    const next = 6000 + Math.random() * 9000; // every 6–15s, irregular
    setTimeout(() => {
      spawnShootingStar();
      scheduleShootingStars();
    }, next);
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
    "Happy Birthday Adham 🤍🌙",
    "I know life changes and sometimes things don't stay the same, but some people are not easy to forget. Some people leave a piece of themselves in our hearts, and you are one of those people for me.",
    "Today, I couldn't let this day pass without telling you how much you mean to me. I want you to know that having you in my life was one of the most beautiful things that ever happened to me.",
    "You were not just someone I loved… you were the person who made my days brighter, the person I wanted to share my happiness with, my little moments with, and my dreams with. You were the person I cared about deeply, and I loved you with a sincere heart.",
    "I will always remember our conversations, our laughs, the little things that only we understood, and all those moments that made me smile. Those memories are precious to me, and I will always be grateful that I got to live them with you.",
    "Sometimes I think about all the things we still wanted to do together… the places we wanted to discover, the moments we imagined, and the memories we hoped to create, especially when we would finally be together in Tunisia. Maybe life had a different plan for us, but those dreams will always remain a beautiful part of my heart.",
    "I hope this new year of your life brings you happiness, success, peace, and all the beautiful things you deserve. I hope you always feel loved and appreciated, because you truly deserve that.",
    "No matter where life takes us, I will never regret loving you. I will always be thankful for the person you were in my life and for the beautiful chapter we shared together.",
    "Happy Birthday, Adham. 🌙❤️\nTake care of yourself. You will always have a special place in my heart."
  ];

  let typewriterStarted = false;

  function typeLetter() {
    if (typewriterStarted) return;
    typewriterStarted = true;

    const target = document.getElementById('letter-text');
    if (!target) return;

    const signature = document.getElementById('letter-signature');

    if (prefersReducedMotion) {
      target.textContent = letterParagraphs.join('\n\n');
      if (signature) signature.classList.add('is-visible');
      return;
    }

    target.classList.add('is-typing');
    const fullText = letterParagraphs.join('\n\n');
    let i = 0;
    const speed = 14; // ms per character — brisk enough for the longer letter

    (function typeChar() {
      target.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) {
        setTimeout(typeChar, speed);
      } else {
        target.classList.remove('is-typing');
        // the signature settles in softly once the letter is fully written
        if (signature) setTimeout(() => signature.classList.add('is-visible'), 300);
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
  scheduleShootingStars();
});