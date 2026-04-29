/* SASP Onboarding — Spotlight Tour
   Entry: window.initOnboarding()
   Persistence key: sasp_onboarding_seen
   Non-destructive: lives outside React tree, targets DOM by selector. */

(function () {
  'use strict';

  const STORAGE_KEY = 'sasp_onboarding_seen';
  const NAV_SELECTOR = 'aside nav button';

  // --- State -----------------------------------------------------------------
  let root = null;
  let svgEl = null;
  let cutoutEl = null;
  let dimEl = null;
  let pulseEl = null;
  let tipEl = null;
  let liveRegion = null;
  let replayBtn = null;
  let stepIndex = 0;
  let active = false;
  let lastFocused = null;
  let resizeRaf = null;

  // --- Steps -----------------------------------------------------------------
  // Each step: which nav button (0..3), copy, rich content renderer, optional onEnter.
  const STEPS = [
    {
      navIndex: 0,
      eyebrow: 'Step 1 of 4 — Create a product',
      title: 'Define the product to test',
      body:
        "Start by defining the financial product you want to test — name it, set its category, and describe its target market. This is your simulation's foundation.",
      side: 'right',
      rich: null,
      onEnter: clickNav.bind(null, 0),
      onNext: () => {
        // Try to scroll to a creation entry on the Portfolio screen.
        const targets = ['[data-onboarding="create-product"]', 'button[data-create]', 'main button'];
        for (const sel of targets) {
          const el = document.querySelector(sel);
          if (el && /create|new product|add product/i.test(el.textContent || '')) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
      },
    },
    {
      navIndex: 1,
      eyebrow: 'Step 2 of 4 — Link sources',
      title: 'Connect databases & social',
      body:
        'Connect your data sources. SASP pulls public conversations from X (Twitter) and LinkedIn to learn what real people are saying about products like yours.',
      side: 'right',
      rich: renderSocialFeed,
      onEnter: clickNav.bind(null, 1),
    },
    {
      navIndex: 2,
      eyebrow: 'Step 3 of 4 — Generate segments',
      title: 'Synthesize realistic personas',
      body:
        'From those posts, SASP synthesizes realistic customer segments — demographics, sentiment, financial behavior — so you can test against believable demand instead of guesswork.',
      side: 'right',
      rich: renderAvatars,
      onEnter: clickNav.bind(null, 2),
    },
    {
      navIndex: 3,
      eyebrow: 'Step 4 of 4 — Run simulation',
      title: 'See how the audience reacts',
      body:
        'Now run the simulation. SASP shows how your generated audience reacts to your product — adoption rates, sentiment breakdown, objections, and key insights you can act on.',
      side: 'right',
      rich: renderResults,
      onEnter: clickNav.bind(null, 3),
    },
    {
      // Final centered card
      navIndex: -1,
      eyebrow: 'You are ready',
      title: 'Create your first product to begin',
      body: "You've seen the happy path. Spin up a product, link sources, generate segments, then run a simulation against your audience.",
      side: 'center',
      rich: null,
      actions: [
        {
          label: 'Start testing',
          variant: 'primary',
        },
        {
          label: "Didn't understand? View demo",
          variant: 'secondary',
          onClick: () => {
            const demoLink = document.querySelector('[data-demo-link="true"]');
            location.href = demoLink ? demoLink.getAttribute('href') : 'SASP-tour.html';
          },
        },
      ],
    },
  ];

  // --- Public API ------------------------------------------------------------
  window.initOnboarding = function initOnboarding() {
    ensureReplayButton();
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Wait for app shell to mount before starting
      waitForNav().then((ok) => {
        if (ok) start();
      });
    }
  };

  // --- Replay button (always visible, fixed) --------------------------------
  function ensureReplayButton() {
    if (replayBtn) return;
    replayBtn = document.createElement('button');
    replayBtn.type = 'button';
    replayBtn.className = 'sonb-replay';
    replayBtn.setAttribute('aria-label', 'Replay onboarding tour');
    replayBtn.innerHTML =
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 8a5 5 0 0 1 8.5-3.5L13 6"/>' +
      '<path d="M13 3v3h-3"/>' +
      '<path d="M13 8a5 5 0 0 1-8.5 3.5L3 10"/>' +
      '<path d="M3 13v-3h3"/>' +
      '</svg>' +
      '<span>Replay tour</span>';
    replayBtn.addEventListener('click', () => start());
    document.body.appendChild(replayBtn);
  }

  function waitForNav(maxMs = 6000) {
    const t0 = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        if (document.querySelectorAll(NAV_SELECTOR).length >= 4) return resolve(true);
        if (performance.now() - t0 > maxMs) return resolve(false);
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  // --- Lifecycle -------------------------------------------------------------
  function start() {
    if (active) return;
    active = true;
    lastFocused = document.activeElement;
    stepIndex = 0;
    buildRoot();
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    showStep(stepIndex);
  }

  function finish(skipped) {
    if (!active) return;
    active = false;
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize, true);
    if (root) {
      root.classList.remove('sonb-active');
      root.style.opacity = '0';
      setTimeout(() => {
        if (root && root.parentNode) root.parentNode.removeChild(root);
        root = svgEl = cutoutEl = dimEl = pulseEl = tipEl = liveRegion = null;
      }, 240);
    }
    localStorage.setItem(STORAGE_KEY, '1');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) { /* noop */ }
    }
  }

  // --- DOM construction ------------------------------------------------------
  function buildRoot() {
    root = document.createElement('div');
    root.className = 'sonb-root sonb-active';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Product onboarding tour');
    root.style.transition = 'opacity 240ms ease';

    // SVG mask overlay
    const svgNS = 'http://www.w3.org/2000/svg';
    svgEl = document.createElementNS(svgNS, 'svg');
    svgEl.setAttribute('class', 'sonb-svg');
    svgEl.setAttribute('preserveAspectRatio', 'none');

    const defs = document.createElementNS(svgNS, 'defs');
    const mask = document.createElementNS(svgNS, 'mask');
    mask.setAttribute('id', 'sonb-mask');
    const maskBg = document.createElementNS(svgNS, 'rect');
    maskBg.setAttribute('x', '0');
    maskBg.setAttribute('y', '0');
    maskBg.setAttribute('width', '100%');
    maskBg.setAttribute('height', '100%');
    maskBg.setAttribute('fill', 'white');
    cutoutEl = document.createElementNS(svgNS, 'rect');
    cutoutEl.setAttribute('class', 'sonb-cutout');
    cutoutEl.setAttribute('rx', '12');
    cutoutEl.setAttribute('ry', '12');
    cutoutEl.setAttribute('fill', 'black');
    cutoutEl.setAttribute('x', '50%');
    cutoutEl.setAttribute('y', '50%');
    cutoutEl.setAttribute('width', '0');
    cutoutEl.setAttribute('height', '0');
    mask.appendChild(maskBg);
    mask.appendChild(cutoutEl);
    defs.appendChild(mask);
    svgEl.appendChild(defs);

    dimEl = document.createElementNS(svgNS, 'rect');
    dimEl.setAttribute('class', 'sonb-dim');
    dimEl.setAttribute('x', '0');
    dimEl.setAttribute('y', '0');
    dimEl.setAttribute('width', '100%');
    dimEl.setAttribute('height', '100%');
    dimEl.setAttribute('mask', 'url(#sonb-mask)');
    svgEl.appendChild(dimEl);

    root.appendChild(svgEl);

    // Pulse ring
    pulseEl = document.createElement('div');
    pulseEl.className = 'sonb-pulse';
    pulseEl.style.display = 'none';
    root.appendChild(pulseEl);

    // Tooltip card
    tipEl = document.createElement('div');
    tipEl.className = 'sonb-tip';
    tipEl.setAttribute('role', 'document');
    tipEl.tabIndex = -1;
    root.appendChild(tipEl);

    // aria-live region
    liveRegion = document.createElement('div');
    liveRegion.className = 'sonb-sr';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    root.appendChild(liveRegion);

    document.body.appendChild(root);
  }

  // --- Step rendering --------------------------------------------------------
  function showStep(i) {
    stepIndex = i;
    const step = STEPS[i];
    if (!step) return finish(false);

    // Run side-effects (nav switch)
    if (typeof step.onEnter === 'function') {
      try { step.onEnter(); } catch (e) { /* noop */ }
    }

    // Build tooltip content
    tipEl.classList.remove('sonb-tip-visible');
    tipEl.setAttribute('data-side', step.side || 'right');
    tipEl.innerHTML = '';
    const stepActions = Array.isArray(step.actions) ? step.actions : null;
    const hasFinalActions = stepActions && stepActions.length;

    // Skip (X) button — except final step which uses CTA
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'sonb-skip';
    skip.setAttribute('aria-label', step.cta || hasFinalActions ? 'Close' : 'Skip tour');
    skip.textContent = '✕';
    skip.addEventListener('click', () => finish(true));
    tipEl.appendChild(skip);

    const eyebrow = document.createElement('div');
    eyebrow.className = 'sonb-eyebrow';
    eyebrow.textContent = step.eyebrow;
    tipEl.appendChild(eyebrow);

    const title = document.createElement('h2');
    title.className = 'sonb-title';
    title.textContent = step.title;
    tipEl.appendChild(title);

    const body = document.createElement('p');
    body.className = 'sonb-body';
    body.textContent = step.body;
    tipEl.appendChild(body);

    if (typeof step.rich === 'function') {
      const rich = document.createElement('div');
      rich.className = 'sonb-rich';
      tipEl.appendChild(rich);
      // Defer to next frame so transition begins before heavy animations
      requestAnimationFrame(() => step.rich(rich));
    }

    // Footer
    const footer = document.createElement('div');
    footer.className = 'sonb-footer';

    if (!step.cta && !hasFinalActions) {
      const dots = document.createElement('div');
      dots.className = 'sonb-dots';
      dots.setAttribute('aria-hidden', 'true');
      for (let d = 0; d < 4; d++) {
        const dot = document.createElement('span');
        dot.className = 'sonb-dot' + (d === i ? ' sonb-dot-active' : '');
        dots.appendChild(dot);
      }
      footer.appendChild(dots);

      const skipBtn = document.createElement('button');
      skipBtn.type = 'button';
      skipBtn.className = 'sonb-btn sonb-btn-ghost';
      skipBtn.textContent = 'Skip';
      skipBtn.addEventListener('click', () => finish(true));
      footer.appendChild(skipBtn);

      if (i > 0) {
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'sonb-btn sonb-btn-secondary';
        back.textContent = 'Back';
        back.addEventListener('click', () => showStep(i - 1));
        footer.appendChild(back);
      }

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'sonb-btn sonb-btn-primary';
      next.textContent = i === STEPS.length - 2 ? 'Finish' : 'Next';
      next.addEventListener('click', () => {
        if (typeof step.onNext === 'function') step.onNext();
        showStep(i + 1);
      });
      footer.appendChild(next);
    } else {
      // Final step: spacer + CTA actions
      footer.classList.add('sonb-footer-final');
      const spacer = document.createElement('div');
      spacer.style.flex = '1';
      footer.appendChild(spacer);

      const actions = hasFinalActions ? stepActions : [{ label: step.cta, variant: 'primary', onClick: step.onCta }];
      actions.forEach((action) => {
        const cta = document.createElement('button');
        cta.type = 'button';
        cta.className = 'sonb-btn sonb-btn-' + (action.variant || 'secondary');
        cta.textContent = action.label;
        cta.addEventListener('click', () => {
          try { action.onClick && action.onClick(); } catch (e) { /* noop */ }
          finish(false);
        });
        footer.appendChild(cta);
      });
    }

    tipEl.appendChild(footer);

    // Position spotlight + tooltip
    positionForStep(step);

    // Animate in
    requestAnimationFrame(() => {
      tipEl.classList.add('sonb-tip-visible');
    });

    // Live announce
    if (liveRegion) liveRegion.textContent = step.title + '. ' + step.body;

    // Focus first interactive element
    setTimeout(() => {
      const focusables = getFocusables();
      if (focusables.length) focusables[0].focus();
      else tipEl.focus();
    }, 60);
  }

  // --- Positioning -----------------------------------------------------------
  function positionForStep(step) {
    if (step.side === 'center') {
      // Hide spotlight and pulse for centered final card
      cutoutEl.setAttribute('x', '50%');
      cutoutEl.setAttribute('y', '50%');
      cutoutEl.setAttribute('width', '0');
      cutoutEl.setAttribute('height', '0');
      pulseEl.style.display = 'none';
      tipEl.style.left = '';
      tipEl.style.top = '';
      return;
    }

    const target = getNavButton(step.navIndex);
    if (!target) return;

    const r = target.getBoundingClientRect();
    const pad = 8;
    const x = Math.max(0, r.left - pad);
    const y = Math.max(0, r.top - pad);
    const w = r.width + pad * 2;
    const h = r.height + pad * 2;

    cutoutEl.setAttribute('x', String(x));
    cutoutEl.setAttribute('y', String(y));
    cutoutEl.setAttribute('width', String(w));
    cutoutEl.setAttribute('height', String(h));

    pulseEl.style.display = 'block';
    pulseEl.style.left = x + 'px';
    pulseEl.style.top = y + 'px';
    pulseEl.style.width = w + 'px';
    pulseEl.style.height = h + 'px';

    placeTooltip(x, y, w, h);
  }

  function placeTooltip(x, y, w, h) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tipRect = tipEl.getBoundingClientRect();
    const tipW = tipRect.width || 360;
    const tipH = tipRect.height || 220;
    const gap = 14;

    let side = 'right';
    let left = x + w + gap;
    let top = y + h / 2 - tipH / 2;

    if (left + tipW > vw - 8) {
      // Try below
      if (y + h + gap + tipH < vh - 8) {
        side = 'bottom';
        left = Math.min(Math.max(8, x), vw - tipW - 8);
        top = y + h + gap;
      } else if (y - gap - tipH > 8) {
        side = 'top';
        left = Math.min(Math.max(8, x), vw - tipW - 8);
        top = y - gap - tipH;
      } else {
        side = 'left';
        left = Math.max(8, x - gap - tipW);
        top = y + h / 2 - tipH / 2;
      }
    }

    // Clamp vertically
    top = Math.min(Math.max(8, top), vh - tipH - 8);
    left = Math.min(Math.max(8, left), vw - tipW - 8);

    tipEl.setAttribute('data-side', side);
    tipEl.style.left = left + 'px';
    tipEl.style.top = top + 'px';
  }

  function onResize() {
    if (!active) return;
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const step = STEPS[stepIndex];
      if (step) positionForStep(step);
    });
  }

  // --- Keyboard --------------------------------------------------------------
  function onKey(e) {
    if (!active) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      finish(true);
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      const step = STEPS[stepIndex];
      if (step && (step.cta || (Array.isArray(step.actions) && step.actions.length))) {
        // On final step Enter triggers CTA
        if (e.key === 'Enter') {
          e.preventDefault();
          const action = Array.isArray(step.actions) && step.actions.length ? step.actions[0] : { onClick: step.onCta };
          try { action.onClick && action.onClick(); } catch (err) { /* noop */ }
          finish(false);
        }
        return;
      }
      if (stepIndex < STEPS.length - 1) {
        e.preventDefault();
        const cur = STEPS[stepIndex];
        if (cur && typeof cur.onNext === 'function') cur.onNext();
        showStep(stepIndex + 1);
      }
      return;
    }
    if (e.key === 'ArrowLeft') {
      if (stepIndex > 0) {
        e.preventDefault();
        showStep(stepIndex - 1);
      }
      return;
    }
    if (e.key === 'Tab') {
      // Focus trap
      const focusables = getFocusables();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const a = document.activeElement;
      if (e.shiftKey && a === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && a === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function getFocusables() {
    if (!tipEl) return [];
    return Array.from(
      tipEl.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('disabled'));
  }

  // --- Helpers ---------------------------------------------------------------
  function getNavButton(i) {
    const btns = document.querySelectorAll(NAV_SELECTOR);
    return btns[i] || null;
  }

  function clickNav(i) {
    const btn = getNavButton(i);
    if (btn) btn.click();
  }

  // ===== Step 2 — fake X / LinkedIn feed =====================================
  function renderSocialFeed(slot) {
    const head = document.createElement('div');
    head.className = 'sonb-feed-head';
    head.innerHTML =
      '<span class="sonb-logo-pill"><span class="sonb-post-src sonb-x">X</span>X<span class="sonb-dots-anim"></span></span>' +
      '<span class="sonb-logo-pill"><span class="sonb-post-src sonb-li">in</span>LinkedIn<span class="sonb-dots-anim"></span></span>' +
      '<span class="sonb-counter" data-counter>Posts collected: 0</span>';
    slot.appendChild(head);

    const feed = document.createElement('div');
    feed.className = 'sonb-feed';
    slot.appendChild(feed);

    const POSTS = [
      { src: 'x',  user: '@mara_finanze',     time: '2m',  text: 'Honestly the new digital loan apps feel less stressful than walking into a branch.' },
      { src: 'li', user: 'Tomás Bertolini',   time: '8m',  text: 'Banks underestimate how much young pros want salary-switch perks bundled in.' },
      { src: 'x',  user: '@gioia.savings',    time: '14m', text: 'Anyone else comparing fixed vs variable rates this week? My head hurts.' },
      { src: 'li', user: 'Priya Raman',       time: '22m', text: 'Joint applications saved us €600 in fees. Worth shopping around.' },
      { src: 'x',  user: '@finogeek',         time: '31m', text: 'Quick repayment cadence > lower rate, fight me.' },
    ];

    POSTS.forEach((p, idx) => {
      setTimeout(() => {
        if (!feed.isConnected) return;
        const post = document.createElement('div');
        post.className = 'sonb-post';
        post.innerHTML =
          '<div class="sonb-post-meta">' +
            '<span class="sonb-post-src sonb-' + p.src + '">' + (p.src === 'x' ? 'X' : 'in') + '</span>' +
            '<span>' + escapeHtml(p.user) + '</span>' +
            '<span>· ' + p.time + '</span>' +
          '</div>' +
          '<div>' + escapeHtml(p.text) + '</div>';
        feed.prepend(post);
        // Cap visible
        while (feed.children.length > 4) feed.lastChild.remove();
      }, 220 + idx * 280);
    });

    // Counter tick: 0 -> 247
    const counterEl = head.querySelector('[data-counter]');
    animateNumber(counterEl, 0, 247, 1800, (n) => 'Posts collected: ' + n);
  }

  function animateNumber(el, from, to, dur, fmt) {
    if (!el) return;
    const t0 = performance.now();
    function tick(t) {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = Math.round(from + (to - from) * eased);
      el.textContent = fmt ? fmt(v) : String(v);
      if (k < 1 && el.isConnected) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ===== Step 3 — avatar grid ================================================
  function renderAvatars(slot) {
    const grid = document.createElement('div');
    grid.className = 'sonb-avatars';
    slot.appendChild(grid);

    const PEOPLE = [
      { name: 'Marco R.',   age: 34, trait: 'Risk-averse, urban',     hue: 152 },
      { name: 'Giulia P.',  age: 29, trait: 'Mobile-first, saver',    hue: 38  },
      { name: 'Luca B.',    age: 41, trait: 'Investor mindset',        hue: 198 },
      { name: 'Sara M.',    age: 27, trait: 'New career, cautious',    hue: 14  },
      { name: 'Tomás A.',   age: 36, trait: 'Joint applicant',         hue: 280 },
      { name: 'Priya N.',   age: 31, trait: 'High earner, busy',       hue: 162 },
      { name: 'Karim Z.',   age: 38, trait: 'Switcher, fee-sensitive', hue: 96  },
      { name: 'Elena V.',   age: 45, trait: 'Loyal, branch user',      hue: 220 },
    ];

    PEOPLE.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'sonb-av';
      card.style.animationDelay = (idx * 80) + 'ms';
      const initials = p.name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase();
      card.innerHTML =
        '<div class="sonb-av-circle" style="background:hsl(' + p.hue + ',55%,42%)">' + escapeHtml(initials) + '</div>' +
        '<div class="sonb-av-name">' + escapeHtml(p.name) + '</div>' +
        '<div class="sonb-av-trait">' + escapeHtml(p.trait + ', ' + p.age) + '</div>';
      grid.appendChild(card);
    });
  }

  // ===== Step 4 — mock results ==============================================
  function renderResults(slot) {
    const wrap = document.createElement('div');
    wrap.className = 'sonb-results';

    const bars = document.createElement('div');
    bars.className = 'sonb-bars';
    const ROWS = [
      { label: 'Adoption',  pct: 62 },
      { label: 'Curious',   pct: 48 },
      { label: 'Objection', pct: 27 },
    ];
    ROWS.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'sonb-bar-row';
      r.innerHTML =
        '<div>' + escapeHtml(row.label) + '</div>' +
        '<div class="sonb-bar-track"><div class="sonb-bar-fill" style="--sonb-bar:' + row.pct + '%; animation-delay:' + (idx * 140) + 'ms"></div></div>' +
        '<div class="sonb-bar-val">' + row.pct + '%</div>';
      bars.appendChild(r);
    });
    wrap.appendChild(bars);

    // Donut
    const svgNS = 'http://www.w3.org/2000/svg';
    const donut = document.createElementNS(svgNS, 'svg');
    donut.setAttribute('viewBox', '0 0 64 64');
    donut.setAttribute('class', 'sonb-donut');
    const c = 2 * Math.PI * 22; // ~138
    const arc = c * 0.66;       // 66% positive
    donut.innerHTML =
      '<circle class="sonb-donut-bg" cx="32" cy="32" r="22" fill="none" stroke-width="8"/>' +
      '<circle class="sonb-donut-fg" cx="32" cy="32" r="22" fill="none" stroke-width="8" stroke-linecap="round" ' +
      'transform="rotate(-90 32 32)" style="--sonb-arc:' + arc.toFixed(1) + '"/>' +
      '<text class="sonb-donut-label" x="32" y="36" text-anchor="middle">66%</text>';
    wrap.appendChild(donut);

    slot.appendChild(wrap);

    const insights = document.createElement('div');
    insights.className = 'sonb-insights';
    const INS = [
      'Young pros respond best when fees are bundled, not itemized.',
      'Salary-switch perk lifts adoption by ~14 pts in urban segments.',
      'Variable rates trigger 2x more objections than fixed.',
    ];
    INS.forEach((text, i) => {
      const ins = document.createElement('div');
      ins.className = 'sonb-insight';
      ins.style.animationDelay = (250 + i * 180) + 'ms';
      ins.textContent = text;
      insights.appendChild(ins);
    });
    slot.appendChild(insights);
  }

  // --- Utils -----------------------------------------------------------------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Auto-init -------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initOnboarding);
  } else {
    window.initOnboarding();
  }
})();
