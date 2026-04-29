/* SASP Tour Engine — Phase 2 demo mode
   Public API:
     window.TourEngine.start()   -- begin / restart from step 0
     window.TourEngine.pause()
     window.TourEngine.resume()
     window.TourEngine.skip()    -- jump to next 'act' marker
     window.TourEngine.stop()    -- exit, leaves DOM clean
     window.TourEngine.setSpeed(1|1.5|2)
     window.startTour()          -- alias

   Tour script lives on window.TOUR_SCRIPT (array of action objects).
   See tour-script.js for the schema.
*/

(function () {
  'use strict';

  // ====== State =============================================================
  let steps = [];
  let stepIndex = 0;
  let speed = 2;
  let paused = false;
  let stopped = false;
  let runningPromise = null;
  let pauseDeferred = null;
  let abortToken = 0;

  let cursorEl = null;
  let bannerEl = null;
  let panelEl = null;
  let progressFillEl = null;
  let progressPctEl = null;
  let actLabelEl = null;
  let toastEl = null;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE = matchMedia('(max-width: 760px)').matches;
  const STORAGE_KEY = 'sasp_tour_completed';
  const PHASE1_KEY = 'sasp_onboarding_seen';

  // ====== Public API ========================================================
  const TourEngine = {
    start,
    pause,
    resume,
    skip,
    stop,
    setSpeed,
    get state() {
      return { stepIndex, total: steps.length, paused, stopped, speed };
    },
  };
  window.TourEngine = TourEngine;
  window.startTour = function () { start(); };

  // ====== Boot ==============================================================
  let booted = false;
  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();
  function boot() {
    if (booted) return;
    booted = true;
    document.body.classList.add('tour-mode');
    // Suppress phase-1 onboarding by pre-flagging
    try { localStorage.setItem(PHASE1_KEY, '1'); } catch (e) {}
    buildBanner();
    buildCursor();
    buildPanel();
    waitForApp().then((ok) => {
      if (!ok) return;
      steps = (window.TOUR_SCRIPT || []).slice();
      // Default speed honours reduced motion
      if (REDUCED) speed = 4;
      // Auto-start
      start();
    });
  }

  function waitForApp(maxMs = 8000) {
    const t0 = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        const ready = document.querySelectorAll('aside nav button').length >= 4 &&
                      document.querySelector('main');
        if (ready) return resolve(true);
        if (performance.now() - t0 > maxMs) return resolve(false);
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  // ====== Banner ============================================================
  function buildBanner() {
    if (bannerEl) return;
    bannerEl = document.createElement('div');
    bannerEl.className = 'tour-banner';
    bannerEl.setAttribute('role', 'status');
    bannerEl.innerHTML =
      '<span class="tour-banner-dot" aria-hidden="true"></span>' +
      '<span class="tour-banner-emoji" aria-hidden="true">🎬</span>' +
      '<span>DEMO MODE — Watch SASP build a simulation</span>';
    document.body.appendChild(bannerEl);
  }

  // ====== Cursor ============================================================
  function buildCursor() {
    if (cursorEl || IS_MOBILE) return;
    cursorEl = document.createElement('div');
    cursorEl.className = 'tour-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.innerHTML =
      '<svg viewBox="0 0 22 22" fill="none">' +
      '<path d="M3 2 L19 11 L11 12.5 L7.2 19.6 L3 2 Z" fill="#0B1410" stroke="#FFFFFF" stroke-width="1.4" stroke-linejoin="round"/>' +
      '</svg>';
    document.body.appendChild(cursorEl);
    setCursor(cursorX, cursorY, 0);
  }

  function setCursor(x, y, dur) {
    if (!cursorEl) return;
    cursorX = x; cursorY = y;
    cursorEl.style.transition = (dur > 0 && !REDUCED)
      ? `transform ${dur}ms cubic-bezier(.22,.61,.36,1)`
      : 'none';
    cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function clickRing(x, y) {
    if (!cursorEl || IS_MOBILE) return;
    const ring = document.createElement('div');
    ring.className = 'tour-click-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 600);
    cursorEl.classList.add('tour-cursor-clicking');
    setTimeout(() => cursorEl && cursorEl.classList.remove('tour-cursor-clicking'), 180);
  }

  // ====== Panel =============================================================
  function buildPanel() {
    if (panelEl) return;
    panelEl = document.createElement('div');
    panelEl.className = 'tour-panel';
    panelEl.setAttribute('role', 'region');
    panelEl.setAttribute('aria-label', 'Tour controls');
    panelEl.innerHTML =
      '<div class="tour-panel-row">' +
        '<span class="tour-panel-title">Demo controls</span>' +
        '<span class="tour-panel-act" data-act>—</span>' +
      '</div>' +
      '<div class="tour-panel-row">' +
        '<button class="tour-btn tour-btn-primary" data-action="toggle">⏸ Pause</button>' +
        '<button class="tour-btn" data-action="skip" title="Skip to next act">⏭ Skip step</button>' +
        '<div class="tour-speed" role="group" aria-label="Speed">' +
          '<button data-speed="1">1x</button>' +
          '<button data-speed="1.5">1.5x</button>' +
          '<button data-speed="2" class="active">2x</button>' +
        '</div>' +
      '</div>' +
      '<div class="tour-panel-row">' +
        '<div class="tour-progress" aria-hidden="true"><div data-prog></div></div>' +
        '<span class="tour-progress-pct" data-pct>0%</span>' +
        '<button class="tour-btn tour-btn-danger" data-action="exit">Exit ↗</button>' +
      '</div>';
    document.body.appendChild(panelEl);

    progressFillEl = panelEl.querySelector('[data-prog]');
    progressPctEl = panelEl.querySelector('[data-pct]');
    actLabelEl = panelEl.querySelector('[data-act]');

    panelEl.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'toggle') paused ? resume() : pause();
      if (action === 'skip')   skip();
      if (action === 'exit')   exitToDashboard();
      const sp = e.target.closest('[data-speed]')?.dataset.speed;
      if (sp) {
        setSpeed(parseFloat(sp));
        panelEl.querySelectorAll('[data-speed]').forEach((b) =>
          b.classList.toggle('active', b.dataset.speed === sp)
        );
      }
    });

    updateToggle();
  }

  function updateToggle() {
    if (!panelEl) return;
    const btn = panelEl.querySelector('[data-action="toggle"]');
    if (btn) btn.textContent = paused ? '▶ Resume' : '⏸ Pause';
  }

  function updateProgress() {
    if (!progressFillEl) return;
    const pct = Math.round((stepIndex / Math.max(1, steps.length)) * 100);
    progressFillEl.style.width = pct + '%';
    if (progressPctEl) progressPctEl.textContent = pct + '%';
  }

  function updateActLabel(label) {
    if (actLabelEl) actLabelEl.textContent = label;
  }

  // ====== Public ops ========================================================
  function setSpeed(s) {
    speed = s || 1;
  }

  function pause() {
    if (paused || stopped) return;
    paused = true;
    pauseDeferred = deferred();
    updateToggle();
  }

  function resume() {
    if (!paused) return;
    paused = false;
    if (pauseDeferred) { pauseDeferred.resolve(); pauseDeferred = null; }
    updateToggle();
  }

  function skip() {
    abortToken++;
    // Find next act marker after current
    let i = stepIndex + 1;
    while (i < steps.length && steps[i].type !== 'act') i++;
    stepIndex = i;
    if (paused) resume();
  }

  function stop() {
    stopped = true;
    abortToken++;
    if (paused) resume();
    cleanupOverlays();
  }

  function exitToDashboard() {
    stop();
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    location.href = dashboardHref();
  }

  function dashboardHref() {
    const params = new URLSearchParams(location.search);
    const next = new URLSearchParams();
    const org = params.get('org');
    const product = params.get('product');
    if (org) next.set('org', org);
    if (product) next.set('product', product);
    return 'SASP.html' + (next.toString() ? '?' + next.toString() : '');
  }

  // ====== Main loop =========================================================
  async function start() {
    stopped = false;
    paused = false;
    stepIndex = 0;
    abortToken++;
    cleanupOverlays();
    updateToggle();
    updateProgress();
    runningPromise = (async () => {
      try { await runLoop(abortToken); } catch (e) { console.warn('[Tour]', e); }
    })();
  }

  async function runLoop(token) {
    while (stepIndex < steps.length && !stopped && token === abortToken) {
      await waitIfPaused();
      if (token !== abortToken || stopped) return;

      const a = steps[stepIndex];
      try {
        await handleAction(a, token);
      } catch (e) { console.warn('[Tour] step error', a, e); }

      if (token !== abortToken) return; // skip jumped ahead
      stepIndex++;
      updateProgress();
    }
    if (!stopped && token === abortToken) {
      onComplete();
    }
  }

  async function waitIfPaused() {
    while (paused) {
      pauseDeferred = pauseDeferred || deferred();
      await pauseDeferred.promise;
    }
  }

  function dur(ms) {
    if (REDUCED) return Math.min(60, ms || 0);
    return Math.max(30, (ms || 0) / Math.max(0.25, speed));
  }

  // ====== Actions ===========================================================
  async function handleAction(a, token) {
    switch (a.type) {
      case 'act':         updateActLabel(a.label); return sleep(dur(180));
      case 'wait':        return sleep(dur(a.duration || 0));
      case 'move':        return doMove(a);
      case 'click':       return doClick(a);
      case 'navTo':       return doNavTo(a);
      case 'show':        return doShow(a);
      case 'hide':        return doHide(a);
      case 'type':        return doType(a, token);
      case 'drag':        return doDrag(a);
      case 'set':         return doSet(a);
      case 'count':       return doCount(a);
      case 'append':      return doAppend(a, token);
      case 'glow':        return doGlow(a);
      case 'toast':       return doToast(a);
      case 'goto':        location.href = a.url; return;
      default: return;
    }
  }

  async function doMove(a) {
    const pt = resolveTargetPoint(a.target);
    if (!pt) return;
    const d = dur(a.duration || 500);
    setCursor(pt.x, pt.y, d);
    await sleep(d);
  }

  async function doClick(a) {
    if (a.target) {
      const pt = resolveTargetPoint(a.target);
      if (pt) { setCursor(pt.x, pt.y, dur(180)); await sleep(dur(180)); }
    }
    clickRing(cursorX, cursorY);
    if (a.target) {
      const el = resolveEl(a.target);
      if (el && typeof el.click === 'function' && el.dataset && el.dataset.tourReal === '1') {
        try { el.click(); } catch (e) {}
      }
    }
    await sleep(dur(220));
  }

  async function doNavTo(a) {
    const btns = document.querySelectorAll('aside nav button');
    const btn = btns[a.index];
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    setCursor(x, y, dur(550));
    await sleep(dur(550));
    clickRing(x, y);
    btn.click();
    await sleep(dur(280));
  }

  function overlayContainer() {
    let c = document.getElementById('tour-overlays');
    if (!c) {
      c = document.createElement('div');
      c.id = 'tour-overlays';
      c.style.position = 'fixed';
      c.style.inset = '0';
      c.style.pointerEvents = 'none';
      c.style.zIndex = '48';
      document.body.appendChild(c);
    }
    return c;
  }

  async function doShow(a) {
    const c = overlayContainer();
    let el = document.getElementById('tour-ov-' + a.id);
    if (!el) {
      el = document.createElement('div');
      el.id = 'tour-ov-' + a.id;
      el.className = 'tour-ov';
      el.dataset.anchor = a.anchor || 'fixed';
      el.style.pointerEvents = 'auto';
      c.appendChild(el);
    }
    el.innerHTML = a.html || '';

    // Position
    if (a.anchor === 'main') {
      const main = document.querySelector('main');
      const mr = main ? main.getBoundingClientRect() : { left: 80, top: 100, width: 800, height: 400 };
      el.style.left = (mr.left + (a.x || 0)) + 'px';
      el.style.top = (mr.top + (a.y || 0)) + 'px';
      if (a.w) el.style.width = a.w + 'px';
      el.style.position = 'fixed';
    } else {
      el.style.left = (a.x != null ? a.x + 'px' : '50%');
      el.style.top = (a.y != null ? a.y + 'px' : '50%');
      if (a.w) el.style.width = a.w + 'px';
    }

    // Animate in
    if (a.animateIn === 'modal') {
      // backdrop + modal entrance handled by inner classes
      requestAnimationFrame(() => {
        el.querySelectorAll('.tour-modal-back').forEach((n) => n.classList.add('in'));
        el.querySelectorAll('.tour-modal').forEach((n) => n.classList.add('in'));
      });
    } else if (a.animateIn === 'slide') {
      el.querySelectorAll('.tour-panel-card').forEach((n) => {
        requestAnimationFrame(() => n.classList.add('in'));
      });
    } else {
      el.style.opacity = '0';
      el.style.transition = 'opacity 240ms cubic-bezier(.22,.61,.36,1)';
      requestAnimationFrame(() => { el.style.opacity = '1'; });
    }

    await sleep(dur(a.duration || 240));
  }

  async function doHide(a) {
    const el = document.getElementById('tour-ov-' + a.id);
    if (!el) return;
    if (a.animateOut === 'fade' || true) {
      el.querySelectorAll('.tour-modal').forEach((n) => n.classList.remove('in'));
      el.querySelectorAll('.tour-modal-back').forEach((n) => n.classList.remove('in'));
      el.style.transition = 'opacity 240ms cubic-bezier(.22,.61,.36,1)';
      el.style.opacity = '0';
    }
    await sleep(dur(280));
    el.remove();
  }

  async function doType(a, token) {
    const el = resolveEl(a.target);
    if (!el) return;
    el.classList.add('focused');
    // remove any pre-existing caret
    let caret = el.querySelector('.tour-caret');
    if (!caret) {
      caret = document.createElement('span');
      caret.className = 'tour-caret';
      el.appendChild(caret);
    }
    // text node before caret
    let textNode = el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild : document.createTextNode('');
    if (!el.firstChild || el.firstChild.nodeType !== 3) el.insertBefore(textNode, caret);
    textNode.nodeValue = '';

    const value = a.value || '';
    const per = (a.perChar || 50) / Math.max(0.25, speed);
    for (let i = 0; i < value.length; i++) {
      if (token !== abortToken || stopped) break;
      while (paused) await waitIfPaused();
      textNode.nodeValue += value[i];
      // small jitter
      await sleep(REDUCED ? 0 : per * (0.85 + Math.random() * 0.3));
    }
  }

  async function doDrag(a) {
    const el = resolveEl(a.target);
    if (!el) return;
    const handle = el.querySelector('.tour-range-handle');
    const fill = el.querySelector('.tour-range-fill');
    const trackRect = el.querySelector('.tour-range-track').getBoundingClientRect();
    const startLeft = parseFloat(handle.style.left || '0%') / 100 || 0;
    const targetPct = Math.max(0, Math.min(1, a.value));
    const d = dur(a.duration || 700);

    // Move the demo cursor along with the handle
    const startX = trackRect.left + trackRect.width * startLeft;
    const endX = trackRect.left + trackRect.width * targetPct;
    const yMid = trackRect.top + trackRect.height / 2;

    setCursor(startX, yMid, dur(220));
    await sleep(dur(220));

    handle.style.left = (targetPct * 100) + '%';
    if (fill) fill.style.width = (targetPct * 100) + '%';
    setCursor(endX, yMid, d);

    // Update label if present
    const valLabel = el.querySelector('[data-range-label]');
    if (valLabel) {
      const t0 = performance.now();
      const fromVal = parseFloat(valLabel.dataset.from || '0');
      const toVal = parseFloat(valLabel.dataset.to || '100');
      const min = parseFloat(valLabel.dataset.min || '0');
      const max = parseFloat(valLabel.dataset.max || '100');
      function tick(t) {
        const k = Math.min(1, (t - t0) / d);
        const eased = 1 - Math.pow(1 - k, 3);
        const v = Math.round(min + (max - min) * (startLeft + (targetPct - startLeft) * eased));
        valLabel.textContent = v + '–' + Math.round(min + (max - min) * targetPct + 20) + ' yrs';
        valLabel.dataset.from = String(fromVal);
        valLabel.dataset.to = String(toVal);
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    await sleep(d);
  }

  async function doSet(a) {
    const el = resolveEl(a.target);
    if (!el) return;
    if (a.prop === 'text')   { el.textContent = a.value; return; }
    if (a.prop === 'class')  { el.className = a.value; return; }
    if (a.prop === 'addClass'){ el.classList.add(a.value); return; }
    if (a.prop === 'removeClass'){ el.classList.remove(a.value); return; }
    if (a.prop === 'toggleClass'){ el.classList.toggle(a.value); return; }
    if (a.prop === 'value')  {
      // For tour-input fake fields
      let textNode = el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild : null;
      if (!textNode) {
        textNode = document.createTextNode('');
        el.insertBefore(textNode, el.firstChild);
      }
      textNode.nodeValue = a.value;
      return;
    }
    if (a.prop === 'style')  {
      Object.assign(el.style, a.value || {});
      return;
    }
    if (a.prop === 'html')   { el.innerHTML = a.value; return; }
  }

  async function doCount(a) {
    const el = resolveEl(a.target);
    if (!el) return;
    const d = dur(a.duration || 1500);
    const t0 = performance.now();
    const fmt = a.fmt || ((n) => n.toLocaleString());
    return new Promise((resolve) => {
      function tick(t) {
        const k = Math.min(1, (t - t0) / d);
        const eased = 1 - Math.pow(1 - k, 3);
        const v = Math.round(a.from + (a.to - a.from) * eased);
        el.textContent = fmt(v);
        if (k < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

  async function doAppend(a, token) {
    const parent = resolveEl(a.parent);
    if (!parent) return;
    const items = a.items || [];
    const stagger = (a.stagger || 120) / Math.max(0.25, speed);
    for (let i = 0; i < items.length; i++) {
      if (token !== abortToken || stopped) break;
      while (paused) await waitIfPaused();
      const node = a.render(items[i], i);
      if (typeof node === 'string') {
        const wrap = document.createElement('div');
        wrap.innerHTML = node.trim();
        const el = wrap.firstElementChild;
        if (el) parent.appendChild(el);
      } else if (node && node.nodeType === 1) {
        parent.appendChild(node);
      }
      await sleep(REDUCED ? 0 : stagger);
    }
  }

  async function doGlow(a) {
    const el = resolveEl(a.target);
    if (!el) return;
    el.classList.add('glow');
    setTimeout(() => { el && el.classList && el.classList.remove('glow'); }, dur(700));
    await sleep(dur(a.duration || 200));
  }

  async function doToast(a) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'tour-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = a.text || '';
    requestAnimationFrame(() => toastEl.classList.add('in'));
    await sleep(dur(a.duration || 1800));
    toastEl.classList.remove('in');
    await sleep(dur(280));
  }

  // ====== Resolution helpers ================================================
  function resolveEl(t) {
    if (!t) return null;
    if (typeof t === 'string') return document.querySelector(t);
    if (typeof t === 'function') {
      try { return t(); } catch (e) { return null; }
    }
    if (t.nodeType === 1) return t;
    return null;
  }

  function resolveTargetPoint(t) {
    if (!t) return null;
    if (typeof t === 'object' && 'x' in t && 'y' in t) return { x: t.x, y: t.y };
    const el = resolveEl(t);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // ====== Cleanup ===========================================================
  function cleanupOverlays() {
    document.querySelectorAll('#tour-overlays > *').forEach((n) => n.remove());
    if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    toastEl = null;
  }

  // ====== Completion ========================================================
  function onComplete() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    showClosingModal();
  }

  function showClosingModal() {
    const back = document.createElement('div');
    back.className = 'tour-close-back';
    document.body.appendChild(back);

    const modal = document.createElement('div');
    modal.className = 'tour-close-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<h3>That\'s SASP.</h3>' +
      '<p>Ready to run your own simulation?</p>' +
      '<div class="row">' +
        '<button class="tour-btn" data-act="replay">↻ Replay tour</button>' +
        '<button class="tour-btn tour-btn-primary" data-act="real">Start a real product →</button>' +
      '</div>';
    document.body.appendChild(modal);
    requestAnimationFrame(() => { back.classList.add('in'); modal.classList.add('in'); });

    modal.addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]')?.dataset.act;
      if (a === 'replay') {
        modal.remove(); back.remove();
        start();
      }
      if (a === 'real') {
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch (er) {}
        location.href = dashboardHref();
      }
    });
  }

  // ====== Utils =============================================================
  function sleep(ms) {
    return new Promise((res) => setTimeout(res, Math.max(0, ms)));
  }

  function deferred() {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  }
})();
