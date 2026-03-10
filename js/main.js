/* ================================================================
   NEXUS DARK — main.js
   Particle network canvas, typed text, scroll reveal, counters
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── Hamburger ─────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // ── Particle Canvas (Tor Network Graph) ───────────────────────
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], frame = 0;

    const NODE_COUNT   = 65;
    const EDGE_DIST    = 180;
    const NODE_SPEED   = 0.35;
    const COLORS       = ['rgba(0,245,255,', 'rgba(0,255,136,', 'rgba(100,200,255,'];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * NODE_SPEED,
          vy: (Math.random() - 0.5) * NODE_SPEED,
          r:  Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.6 + 0.2,
          color: colorBase,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < EDGE_DIST) {
            const opacity = (1 - dist / EDGE_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        n.pulse += 0.02;
        const glowAlpha = n.alpha * (0.7 + 0.3 * Math.sin(n.pulse));

        // Glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        grad.addColorStop(0, n.color + glowAlpha + ')');
        grad.addColorStop(1, n.color + '0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + glowAlpha + ')';
        ctx.fill();

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); initNodes(); });
    resize();
    initNodes();
    draw();
  }

  // ── Typed Text Animation ──────────────────────────────────────
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = [
      'Establishing encrypted tunnel...',
      'Routing through Tor circuit...',
      'Identity concealed. Channel secured.',
      'Welcome to NEXUS DARK — Gov Edition.',
      'All sessions zero-knowledge by design.',
    ];
    let pi = 0, ci = 0, deleting = false, pause = false;

    function type() {
      if (pause) { setTimeout(type, 1800); pause = false; return; }

      const current = phrases[pi];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++ci);
        if (ci === current.length) { deleting = true; pause = true; }
        setTimeout(type, 55);
      } else {
        typedEl.textContent = current.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, 28);
        }
      }
    }
    type();
  }

  // ── Scroll Reveal ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── Counter Animation ─────────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el    = e.target;
        const end   = parseFloat(el.getAttribute('data-count'));
        const dec   = el.getAttribute('data-dec') ? parseInt(el.getAttribute('data-dec')) : 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const dur   = 1800;
        const step  = 16;
        let current = 0;
        const inc = end / (dur / step);

        const timer = setInterval(() => {
          current += inc;
          if (current >= end) { current = end; clearInterval(timer); }
          el.textContent = dec ? current.toFixed(dec) : Math.floor(current).toString();
          el.textContent += suffix;
        }, step);

        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  // ── Glitch Trigger ────────────────────────────────────────────
  const glitchEls = document.querySelectorAll('.glitch-text');
  glitchEls.forEach(el => {
    el.setAttribute('data-text', el.textContent);
    setInterval(() => {
      el.style.animation = 'none';
      const pseudo = el.querySelector('::before');
      // trigger repaint
      void el.offsetWidth;
    }, 5000 + Math.random() * 3000);
  });

  // ── Pricing Card Hover Tilt ───────────────────────────────────
  document.querySelectorAll('.pricing-card, .feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width  * 8;
      const dy = (e.clientY - cy) / rect.height * 8;
      card.style.transform = `translateY(-6px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });

  // ── Highlight active nav link ─────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.style.color = 'var(--cyan)';
    }
  });

});
