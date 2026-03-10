(function () {
    'use strict';

    const refMeta = document.querySelector('meta[name="referrer"]');
    if (!refMeta) {
        const m = document.createElement('meta');
        m.name = 'referrer';
        m.content = 'no-referrer';
        document.head.appendChild(m);
    }

    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        showToast('Context menu disabled for security purposes.');
    });

    document.addEventListener('keydown', e => {

        if (e.key === 'F12') { e.preventDefault(); return; }

        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.ctrlKey && ['U', 'u'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.ctrlKey && ['S', 's'].includes(e.key)) {
            e.preventDefault();
        }
    });

    let devToolsOpen = false;
    const threshold = 160;

    function checkDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                showSecurityOverlay();
            }
        } else {
            if (devToolsOpen) {
                devToolsOpen = false;
                hideSecurityOverlay();
            }
        }
    }

    setInterval(checkDevTools, 1000);

    function showSecurityOverlay() {
        const overlay = document.getElementById('security-overlay');
        if (overlay) overlay.classList.add('show');
    }

    function hideSecurityOverlay() {
        const overlay = document.getElementById('security-overlay');
        if (overlay) overlay.classList.remove('show');
    }

    document.addEventListener('copy', e => {
        const selection = window.getSelection().toString();
        if (selection.trim().length > 0) {
            const watermark = '\n\n[NEXUS DARK — Classified. Unauthorized reproduction prohibited.]';
            try {
                e.clipboardData.setData('text/plain', selection + watermark);
                e.preventDefault();
            } catch (_) { }
        }
    });

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const honeypot = form.querySelector('[name="website"]');
            if (honeypot && honeypot.value) {

                showToast('Submission received.');
                return;
            }

            const btn = form.querySelector('[type="submit"]');
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = ' Encrypting & Routing...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = '[OK] Request Received';
                    showToast('Your request has been securely routed. Expect a PGP-encrypted response within 48h.');
                    setTimeout(() => {
                        btn.innerHTML = original;
                        btn.disabled = false;
                        form.reset();
                    }, 4000);
                }, 2200);
            }
        });
    });

    function showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 100000;
        display: flex; flex-direction: column; gap: 10px; max-width: 360px;
      `;
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
      background: rgba(7,7,15,0.95);
      border: 1px solid rgba(0,245,255,0.25);
      border-radius: 12px;
      padding: 14px 18px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      color: #00f5ff;
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,245,255,0.1);
      animation: fadeInUp 0.3s ease forwards;
      cursor: pointer;
      line-height: 1.5;
    `;
        toast.textContent = message;
        container.appendChild(toast);

        toast.addEventListener('click', () => toast.remove());
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }

    window._secureDelay = function (fn, base) {
        const jitter = Math.floor(Math.random() * 80);
        setTimeout(fn, (base || 0) + jitter);
    };

    let hiddenWarned = false;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !hiddenWarned) {
            hiddenWarned = true;

        }
    });

    const styles = [
        'color: #ff2244; font-size: 20px; font-weight: bold; font-family: monospace;',
        'color: #8892aa; font-size: 13px; font-family: monospace;',
    ];
    console.log('%c[!] SECURITY ALERT', styles[0]);
    console.log('%cThis console is monitored. Unauthorized access attempts are logged and may be reported to appropriate authorities.', styles[1]);
    console.log('%cAll connections are routed through Tor. Session data is zero-knowledge.', styles[1]);

})();
