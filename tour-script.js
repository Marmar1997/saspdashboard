/* SASP Tour Script — declarative steps consumed by tour-engine.js
   Action schema documented in tour-engine.js + outline. */

(function () {
  'use strict';

  const DATA = window.SASP_DATA || {};
  const TOUR_CONTEXT = resolveTourContext(DATA);
  const ACTIVE_ORG = TOUR_CONTEXT.org;
  const ACTIVE_PRODUCT = TOUR_CONTEXT.product;
  const PRODUCT_NAME = ACTIVE_PRODUCT.name || 'Digital Personal Loan';
  const PRODUCT_SEGMENT = ACTIVE_PRODUCT.segment || 'Young Professionals 25-35';
  const PRODUCT_TYPE = ACTIVE_PRODUCT.type || 'Personal loan';
  const PRODUCT_STATUS = ACTIVE_PRODUCT.status || 'draft';
  const PRODUCT_RATE = Number(ACTIVE_PRODUCT.rate) || 5.2;
  const IS_DEPOSIT = /deposit|savings/i.test(PRODUCT_TYPE);
  const RATE_END = Math.max(0.5, PRODUCT_RATE + (IS_DEPOSIT ? 0.45 : -0.35));
  const RATE_START_TENTHS = Math.round(PRODUCT_RATE * 10);
  const RATE_END_TENTHS = Math.round(RATE_END * 10);
  const RATE_START_TRACK = clamp(PRODUCT_RATE / 10, 0.12, 0.88);
  const RATE_END_TRACK = clamp(RATE_END / 10, 0.12, 0.88);
  const RATE_LABEL = IS_DEPOSIT ? 'Yield rate' : 'APR / pricing rate';
  const PRODUCT_AMOUNT = formatMoney(ACTIVE_PRODUCT.amount);
  const PRODUCT_TERM = Number(ACTIVE_PRODUCT.term) || 60;
  const RECORD_COUNT = parseCount(ACTIVE_PRODUCT.items) || 12718;
  const PUBLIC_POST_COUNT = publicPostCount(DATA.SOURCES_DATA) || 1284;
  const PRODUCT_DESCRIPTION =
    `${ACTIVE_ORG.name} is testing ${PRODUCT_NAME} for ${PRODUCT_SEGMENT}. ` +
    `The scenario starts at ${PRODUCT_RATE.toFixed(2)}% over ${PRODUCT_TERM} months with ${PRODUCT_AMOUNT} of simulated exposure.`;
  const SELECTED_CATEGORY_HTML =
    '<span style="color:var(--tour-ink-900); font-weight:600">' + esc(PRODUCT_TYPE) + '</span>' +
    '<span style="color:var(--tour-ink-400)">▾</span>';
  const AGE_RANGE = ageRange(DATA.ARCHETYPES);
  const AGE_RANGE_LABEL = AGE_RANGE.min + '-' + AGE_RANGE.max + ' yrs';
  const ADOPTION_RATE = estimateAdoption(ACTIVE_PRODUCT);
  const SENTIMENT = estimateSentiment(ACTIVE_PRODUCT, ADOPTION_RATE);

  // ===== Reusable HTML fragments ============================================

  const HTML_CREATE_TRIGGER =
    '<button class="tour-fake-btn" data-tour-real="0">+ Create product</button>';

  const HTML_CREATE_MODAL =
    '<div class="tour-modal-back"></div>' +
    '<div class="tour-modal">' +
      '<h3>Create financial product</h3>' +
      '<div class="tour-modal-sub">Define the product to test against synthetic audiences.</div>' +
      '<div class="tour-field">' +
        '<label class="tour-field-label">Product name</label>' +
        '<div class="tour-input" id="tour-name"></div>' +
      '</div>' +
      '<div class="tour-field">' +
        '<label class="tour-field-label">Category</label>' +
        '<div class="tour-dd" id="tour-category-dd">' +
          '<div class="tour-dd-trigger" id="tour-category"><span>Choose category</span><span style="color:var(--tour-ink-400)">▾</span></div>' +
          '<div class="tour-dd-list" id="tour-category-list">' +
            '<button id="tour-cat-active">' + esc(PRODUCT_TYPE) + '</button>' +
            categoryOptionHTML(PRODUCT_TYPE) +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="tour-field">' +
        '<label class="tour-field-label">Description</label>' +
        '<div class="tour-input area" id="tour-desc"></div>' +
      '</div>' +
      '<div class="tour-field">' +
        '<label class="tour-field-label">Target audience age</label>' +
        '<div class="tour-range" id="tour-age">' +
          '<span class="tour-range-vals">' + esc(AGE_RANGE_LABEL) + '</span>' +
          '<div class="tour-range-track"></div>' +
          '<div class="tour-range-fill" style="left:14%; width:0%"></div>' +
          '<div class="tour-range-handle" id="tour-age-handle" style="left:14%"></div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex; gap:8px; justify-content:flex-end; margin-top:16px;">' +
        '<button class="tour-btn">Cancel</button>' +
        '<button class="tour-btn tour-btn-primary" id="tour-save">Save product</button>' +
      '</div>' +
    '</div>';

  const HTML_SOURCES_PANEL =
    '<div class="tour-panel-card" id="tour-sources-card" style="max-width:760px;">' +
      '<div class="tour-card-eyebrow">Step 2 — Link sources</div>' +
      '<h4>Connect signals for ' + esc(PRODUCT_SEGMENT) + '</h4>' +
      '<div class="tour-connectors">' +
        '<div class="tour-connector" id="tour-conn-x">' +
          '<span class="tour-c-logo x">X</span>' +
          '<span>X (Twitter)</span>' +
          '<span class="tour-c-status">Not connected</span>' +
        '</div>' +
        '<div class="tour-connector" id="tour-conn-rd">' +
          '<span class="tour-c-logo rd">r/</span>' +
          '<span>Reddit</span>' +
          '<span class="tour-c-status">Not connected</span>' +
        '</div>' +
        '<div class="tour-connector" id="tour-conn-li">' +
          '<span class="tour-c-logo li">in</span>' +
          '<span>LinkedIn</span>' +
          '<span class="tour-c-status">Not connected</span>' +
        '</div>' +
        '<div style="flex:1; text-align:right; align-self:center;">' +
          '<span class="tour-counter" id="tour-post-counter">Signals: 0</span>' +
        '</div>' +
      '</div>' +
      '<div id="tour-ingest-status" style="font-size:11.5px;color:var(--tour-ink-500); min-height:16px;"></div>' +
      '<div class="tour-feed" id="tour-feed"></div>' +
      '<div class="tour-tags" id="tour-tags"></div>' +
    '</div>';

  const HTML_AUDIENCE_PANEL =
    '<div class="tour-panel-card" id="tour-audience-card" style="max-width:820px;">' +
      '<div class="tour-card-eyebrow">Step 3 — Generate segments</div>' +
      '<h4>Synthesize customer segments</h4>' +
      '<div id="tour-personas-status" style="font-size:11.5px;color:var(--tour-ink-500); margin-bottom:10px;"></div>' +
      '<div class="tour-avatars" id="tour-avatars"></div>' +
      '<div class="tour-demo-summary" id="tour-summary" style="display:none;">' +
        '<div class="tour-summary-card">' +
          '<h5>Age distribution</h5>' +
          '<div class="tour-mini-bars" id="tour-age-bars"></div>' +
        '</div>' +
        '<div class="tour-summary-card">' +
          '<h5>Income range</h5>' +
          '<div class="tour-mini-bars" id="tour-income-bars"></div>' +
        '</div>' +
        '<div class="tour-summary-card">' +
          '<h5>Sentiment</h5>' +
          '<div class="tour-sent-row" id="tour-sent-row"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  const HTML_CONFIG_PANEL =
    '<div class="tour-panel-card" id="tour-config-card" style="max-width:760px;">' +
      '<div class="tour-card-eyebrow">Step 4 — Tune simulation</div>' +
      '<h4>Simulation parameters</h4>' +
      '<div class="tour-config">' +
        '<div class="tour-config-card" id="tour-cfg-rate">' +
          '<label class="tour-field-label">' + esc(RATE_LABEL) + '</label>' +
          '<div class="tour-rate">' +
            '<div class="tour-rate-val" id="tour-rate-val">' + PRODUCT_RATE.toFixed(1) + '%</div>' +
            '<div class="tour-rate-bar tour-range" id="tour-rate-range">' +
              '<div class="tour-range-track"></div>' +
              '<div class="tour-range-fill" style="left:0%; width:' + (RATE_START_TRACK * 100).toFixed(0) + '%"></div>' +
              '<div class="tour-range-handle" id="tour-rate-handle" style="left:' + (RATE_START_TRACK * 100).toFixed(0) + '%; top:2px"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tour-config-card" id="tour-cfg-narrative">' +
          '<label class="tour-field-label">Include green-lending narrative</label>' +
          '<div style="display:flex; align-items:center; gap:10px; margin-top:6px;">' +
            '<div class="tour-switch" id="tour-narrative-switch"></div>' +
            '<span style="font-size:12px; color:var(--tour-ink-500);" id="tour-narrative-state">Off</span>' +
          '</div>' +
        '</div>' +
        '<div class="tour-config-card" id="tour-cfg-marketing">' +
          '<label class="tour-field-label">Marketing intensity</label>' +
          '<div class="tour-dd" id="tour-marketing-dd" style="margin-top:6px;">' +
            '<div class="tour-dd-trigger" id="tour-marketing"><span id="tour-marketing-val">Low</span><span style="color:var(--tour-ink-400)">▾</span></div>' +
            '<div class="tour-dd-list" id="tour-marketing-list">' +
              '<button>Low</button>' +
              '<button id="tour-mkt-medium">Medium</button>' +
              '<button>High</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tour-config-card" id="tour-cfg-run" style="display:flex; align-items:center; justify-content:center;">' +
          '<button class="tour-fake-btn" id="tour-run">Run simulation</button>' +
        '</div>' +
      '</div>' +
      '<div class="tour-run-bar" id="tour-run-bar" style="display:none;">' +
        '<div class="tour-run-progress"><div id="tour-run-progress-fill"></div></div>' +
        '<div class="tour-run-status" id="tour-run-status">Simulating…</div>' +
      '</div>' +
    '</div>';

  const HTML_RESULTS_PANEL =
    '<div class="tour-panel-card" id="tour-results-card" style="max-width:820px;">' +
      '<div class="tour-card-eyebrow">Step 5 — Results</div>' +
      '<h4>' + esc(PRODUCT_NAME) + ' outcome</h4>' +
      '<div class="tour-results">' +
        '<div>' +
          '<div class="tour-bars-big" id="tour-driver-bars"></div>' +
          '<div class="tour-insights" id="tour-insights"></div>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:14px;">' +
          '<div>' +
            '<div style="text-align:center; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--tour-ink-400); font-weight:600; margin-bottom:6px;">Adoption rate</div>' +
            '<div class="tour-gauge">' +
              '<svg viewBox="0 0 140 80">' +
                '<path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#E3E7E1" stroke-width="10" stroke-linecap="round"/>' +
                '<path id="tour-gauge-arc" d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#188A56" stroke-width="10" stroke-linecap="round" stroke-dasharray="0 999" pathLength="100"/>' +
              '</svg>' +
              '<div class="tour-gauge-num" id="tour-gauge-num">0%</div>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div style="text-align:center; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--tour-ink-400); font-weight:600; margin-bottom:6px;">Sentiment</div>' +
            '<svg class="tour-donut" viewBox="0 0 110 110">' +
              '<circle cx="55" cy="55" r="38" fill="none" stroke="#E3E7E1" stroke-width="12"/>' +
              '<circle id="tour-donut-pos" class="tour-donut-fg-anim" cx="55" cy="55" r="38" fill="none" stroke-width="12" stroke-linecap="butt" transform="rotate(-90 55 55)" style="--tour-arc:' + (SENTIMENT.positive * 2.38).toFixed(1) + '"/>' +
              '<circle id="tour-donut-neu" cx="55" cy="55" r="38" fill="none" stroke="#C0AB6E" stroke-width="12" stroke-linecap="butt" stroke-dasharray="0 999" transform="rotate(118 55 55)" style="opacity:0; transition:stroke-dasharray 800ms cubic-bezier(.22,.61,.36,1), opacity 240ms ease"/>' +
              '<circle id="tour-donut-neg" cx="55" cy="55" r="38" fill="none" stroke="#C0392B" stroke-width="12" stroke-linecap="butt" stroke-dasharray="0 999" transform="rotate(215 55 55)" style="opacity:0; transition:stroke-dasharray 800ms cubic-bezier(.22,.61,.36,1), opacity 240ms ease"/>' +
            '</svg>' +
            '<div class="tour-donut-center"><div class="v">' + SENTIMENT.positive + '%</div><div class="l">Positive</div></div>' +
            '<div class="tour-sent-row" style="justify-content:center; margin-top:6px;">' +
              '<span class="tour-sent-chip pos">Positive ' + SENTIMENT.positive + '%</span>' +
              '<span class="tour-sent-chip neu">Neutral ' + SENTIMENT.neutral + '%</span>' +
              '<span class="tour-sent-chip neg">Negative ' + SENTIMENT.negative + '%</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  // ===== Data ===============================================================

  const POSTS = buildPosts(DATA, ACTIVE_PRODUCT);
  const TAGS = buildTags(DATA.SOURCES_DATA, ACTIVE_PRODUCT);
  const PERSONAS = buildPersonas(DATA.ARCHETYPES);
  const AGE_DIST = buildAgeDistribution(DATA.ARCHETYPES);
  const INCOME_DIST = buildIncomeDistribution(DATA.ARCHETYPES);
  const DRIVERS = buildDrivers(ACTIVE_PRODUCT, DATA.ARCHETYPES);
  const INSIGHTS = buildInsights(ACTIVE_PRODUCT, ACTIVE_ORG, DATA.ARCHETYPES, RATE_END, ADOPTION_RATE);

  // ===== Helpers used inside the script (executed when actions run) ========

  function postHTML(p) {
    return '<div class="tour-post">' +
      '<div class="meta">' +
        '<span class="src ' + p.src + '">' + sourceMark(p.src) + '</span>' +
        '<span>' + esc(p.user) + '</span>' +
        '<span>· ' + p.time + '</span>' +
        '<span class="sentiment ' + p.sent + '"></span>' +
      '</div>' +
      '<div>' + esc(p.text) + '</div>' +
    '</div>';
  }

  function avatarHTML(p, i) {
    const init = p.name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase();
    return '<div class="tour-av" style="animation-delay:' + (i * 100) + 'ms">' +
      '<div class="tour-av-circle" style="background:hsl(' + p.hue + ',55%,42%)">' + esc(init) + '</div>' +
      '<div class="tour-av-name">' + esc(p.name) + '</div>' +
      '<div class="tour-av-role">' + esc(p.role) + ' · ' + p.age + '</div>' +
      '<div class="tour-av-trait">' + esc(p.trait) + '</div>' +
    '</div>';
  }

  function tagHTML(t, i) {
    return '<span class="tour-tag" style="animation-delay:' + (i * 90) + 'ms">' + esc(t) + '</span>';
  }

  function miniRow(label, pct, idx) {
    return '<div class="tour-mini-row">' +
      '<div>' + esc(label) + '</div>' +
      '<div class="tour-mini-track"><div class="tour-mini-fill" style="--tour-bar:' + pct + '%; animation-delay:' + (idx * 100) + 'ms"></div></div>' +
      '<div class="tour-mini-val">' + pct + '%</div>' +
    '</div>';
  }

  function driverRow(label, pct, idx) {
    return '<div class="tour-bar-big-row">' +
      '<div>' + esc(label) + '</div>' +
      '<div class="tour-bar-big-track"><div class="tour-bar-big-fill" style="--tour-bar:' + pct + '%; animation-delay:' + (idx * 140) + 'ms"></div></div>' +
      '<div class="tour-bar-big-val">' + pct + '%</div>' +
    '</div>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function resolveTourContext(data) {
    const fallbackProduct = {
      id: 'personal-loan-young-pros',
      name: 'Digital Personal Loan',
      segment: 'Young Professionals 25-35',
      type: 'Personal loan',
      status: 'draft',
      rate: 6.2,
      term: 60,
      amount: 12000,
      items: '12,718',
      features: { digitalOnly: true },
    };
    const fallbackOrg = {
      id: 'banca-esempio',
      name: 'Banca Esempio Italia',
      products: [fallbackProduct],
    };
    const tenants = Array.isArray(data.TENANTS_DATA) && data.TENANTS_DATA.length ? data.TENANTS_DATA : [fallbackOrg];
    const params = new URLSearchParams(location.search);
    const orgId = params.get('org');
    const productId = params.get('product');
    const orgFromProduct = productId
      ? tenants.find((org) => (org.products || []).some((product) => product.id === productId))
      : null;
    const org = tenants.find((item) => item.id === orgId) || orgFromProduct || tenants[0] || fallbackOrg;
    const product = (org.products || []).find((item) => item.id === productId) || (org.products || [])[0] || fallbackProduct;
    return { org, product };
  }

  function categoryOptionHTML(activeType) {
    const options = ['Personal loan', 'Mortgage', 'Deposit', 'Protection insurance', 'Pension', 'SME credit', 'Investments']
      .filter((item) => item.toLowerCase() !== String(activeType || '').toLowerCase());
    return options.slice(0, 4).map((item) => '<button>' + esc(item) + '</button>').join('');
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatMoney(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '€12,000';
    return '€' + Math.round(n).toLocaleString();
  }

  function parseCount(value) {
    const n = Number(String(value || '').replace(/[^\d]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  function publicPostCount(sources) {
    if (!sources) return 0;
    return ['x', 'reddit', 'linkedin'].reduce((sum, key) => {
      return sum + (Number(sources[key]?.posts) || 0);
    }, 0);
  }

  function ageRange(archetypes) {
    const ages = (archetypes || []).map((item) => Number(item.age)).filter(Number.isFinite);
    if (!ages.length) return { min: 25, max: 45 };
    return { min: Math.min(...ages), max: Math.max(...ages) };
  }

  function sourceClass(source) {
    const raw = String(source || '').toLowerCase();
    if (raw.includes('reddit')) return 'rd';
    if (raw.includes('linkedin') || raw === 'li') return 'li';
    return 'x';
  }

  function sourceMark(source) {
    if (source === 'rd') return 'r/';
    if (source === 'li') return 'in';
    return 'X';
  }

  function sourceUser(source, index) {
    if (source === 'rd') return ['r/ItalyPersonalFinance', 'r/personalfinance', 'r/Fire', 'r/Insurance'][index % 4];
    if (source === 'li') return ['LinkedIn signal', 'Market analyst', 'Banking post', 'Client advisor'][index % 4];
    return ['@banking_watch', '@money_lab', '@finanza_today', '@credit_signal'][index % 4];
  }

  function sentimentForText(text) {
    const t = String(text || '').toLowerCase();
    if (/hide|risk|nervous|reject|kills|mandatory|red tape|out|bury|bad|won't|regret/.test(t)) return 'neg';
    if (/clear|transparent|fast|solid|saved|prefer|fine|worth|usable|enough|stable/.test(t)) return 'pos';
    return 'neu';
  }

  function cleanSignalText(text) {
    return String(text || '')
      .replace(/^["'“”]+|["'“”]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildPosts(data, product) {
    const ticker = data.SOURCES_DATA?.ticker || [];
    const fromTicker = ticker.map((item, index) => {
      const src = sourceClass(item.src || item.source);
      return {
        src,
        user: sourceUser(src, index),
        time: ['2m', '8m', '14m', '22m', '31m', '44m', '1h', '1h'][index % 8],
        text: cleanSignalText(item.t),
        sent: sentimentForText(item.t),
      };
    });

    const quotePosts = (data.ARCHETYPES || []).flatMap((archetype) => {
      return (archetype.quotes || []).map((quote) => {
        const src = sourceClass(quote.source);
        return {
          src,
          user: quote.handle || quote.author || sourceUser(src, 0),
          time: '1h',
          text: cleanSignalText(quote.text),
          sent: sentimentForText(quote.text),
        };
      });
    });

    const productPost = {
      src: 'li',
      user: 'CRM cohort note',
      time: 'now',
      text: `${product.name} is being tested against ${formatMoney(product.amount)} exposure and ${product.segment}.`,
      sent: 'pos',
    };

    const posts = [productPost, ...fromTicker, ...quotePosts].filter((item) => item.text).slice(0, 8);
    return posts.length ? posts : [
      { src: 'x', user: '@banking_watch', time: '2m', text: 'Transparent pricing is driving more consumer finance comparisons.', sent: 'pos' },
      { src: 'rd', user: 'r/personalfinance', time: '8m', text: 'Fixed rates and clear repayment schedules matter more than a banner discount.', sent: 'pos' },
    ];
  }

  function cleanTopic(value) {
    return String(value || '')
      .replace(/^#/, '')
      .replace(/^r\//i, '')
      .replace(/[@"]/g, '')
      .replace(/[-_]/g, ' ')
      .trim();
  }

  function buildTags(sources, product) {
    const sourceTags = [
      ...(sources?.x?.hashtags || []),
      ...(sources?.reddit?.subs || []),
      ...(sources?.linkedin?.hashtags || []),
    ];
    const productTags = [product.type, product.segment, product.status, 'pricing', 'trust', 'fee transparency'];
    const seen = new Set();
    return [...productTags, ...sourceTags]
      .map(cleanTopic)
      .filter(Boolean)
      .filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }

  function compactRole(job) {
    const text = String(job || 'Retail banking customer');
    return text.length > 24 ? text.slice(0, 22).trim() + '.' : text;
  }

  function buildPersonas(archetypes) {
    const hues = [152, 38, 198, 14, 280, 162, 96, 220, 320, 60, 200, 12];
    const personas = (archetypes || []).map((item, index) => ({
      name: item.name,
      age: item.age,
      role: compactRole(item.job),
      trait: item.tagline || item.summary || 'Financial customer segment',
      hue: hues[index % hues.length],
    }));
    return personas.length ? personas : [
      { name: 'Marco', age: 34, role: 'Designer', trait: 'Risk-averse, compares APR and fees.', hue: 152 },
      { name: 'Sofia', age: 29, role: 'Freelancer', trait: 'Needs flexibility for variable income.', hue: 38 },
    ];
  }

  function pctRows(rows) {
    const total = rows.reduce((sum, row) => sum + row.count, 0) || 1;
    return rows.map((row) => ({ label: row.label, pct: Math.max(1, Math.round((row.count / total) * 100)) }));
  }

  function buildAgeDistribution(archetypes) {
    const buckets = [
      { label: '24-28', min: 24, max: 28, count: 0 },
      { label: '29-33', min: 29, max: 33, count: 0 },
      { label: '34-38', min: 34, max: 38, count: 0 },
      { label: '39-45', min: 39, max: 45, count: 0 },
    ];
    (archetypes || []).forEach((item) => {
      const age = Number(item.age);
      const bucket = buckets.find((row) => age >= row.min && age <= row.max) || buckets[buckets.length - 1];
      bucket.count += 1;
    });
    const rows = pctRows(buckets.filter((row) => row.count));
    return rows.length ? rows : [
      { label: '24-28', pct: 28 },
      { label: '29-33', pct: 41 },
      { label: '34-38', pct: 22 },
      { label: '39-45', pct: 9 },
    ];
  }

  function incomeMidpoint(value) {
    const text = String(value || '');
    const match = text.match(/(\d+)(?:[–-](\d+))?\s*k/i);
    if (!match) return 40;
    const a = Number(match[1]);
    const b = Number(match[2] || match[1]);
    return (a + b) / 2;
  }

  function buildIncomeDistribution(archetypes) {
    const buckets = [
      { label: '€20-35k', min: 0, max: 35, count: 0 },
      { label: '€35-55k', min: 35, max: 55, count: 0 },
      { label: '€55-80k', min: 55, max: 80, count: 0 },
      { label: '€80k+', min: 80, max: 999, count: 0 },
    ];
    (archetypes || []).forEach((item) => {
      const mid = incomeMidpoint(item.income);
      const bucket = buckets.find((row) => mid >= row.min && mid < row.max) || buckets[1];
      bucket.count += 1;
    });
    const rows = pctRows(buckets.filter((row) => row.count));
    return rows.length ? rows : [
      { label: '€20-35k', pct: 18 },
      { label: '€35-55k', pct: 44 },
      { label: '€55-80k', pct: 28 },
      { label: '€80k+', pct: 10 },
    ];
  }

  function topTerms(archetypes, key) {
    const counts = new Map();
    (archetypes || []).forEach((item) => {
      (item[key] || []).forEach((term) => {
        const label = String(term).trim();
        counts.set(label, (counts.get(label) || 0) + 1);
      });
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label]) => label);
  }

  function titleTerm(value) {
    return String(value || '')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\bApr\b/g, 'APR');
  }

  function buildDrivers(product, archetypes) {
    const featureDrivers = [];
    if (product.features?.digitalOnly) featureDrivers.push('Digital onboarding');
    if (product.features?.advisor) featureDrivers.push('Advisor availability');
    if (product.features?.flexiblePause) featureDrivers.push('Repayment flexibility');
    if (product.features?.jointApplication) featureDrivers.push('Joint application fit');
    if (product.features?.insuranceBundle) featureDrivers.push('Protection cover clarity');

    const liked = topTerms(archetypes, 'likes').map(titleTerm);
    const primary = IS_DEPOSIT ? 'Yield competitiveness' : 'APR transparency';
    const labels = [primary, ...featureDrivers, ...liked, 'Brand trust', 'Fee transparency'];
    const seen = new Set();
    return labels.filter((label) => {
      const key = label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4).map((label, index) => ({
      label,
      pct: [78, 66, 59, 52][index] || 48,
    }));
  }

  function estimateAdoption(product) {
    let score = 48;
    if (product.features?.digitalOnly) score += 5;
    if (product.features?.advisor) score += 4;
    if (product.features?.earlyExitWaiver) score += 4;
    if (product.features?.flexiblePause) score += 5;
    if (product.features?.jointApplication) score += 3;
    if (product.features?.insuranceBundle) score -= 4;
    if (!IS_DEPOSIT && Number(product.rate) > 6.5) score -= 5;
    if (IS_DEPOSIT && Number(product.rate) >= 3) score += 6;
    return Math.round(clamp(score, 34, 76));
  }

  function estimateSentiment(product, adoption) {
    const positive = Math.round(clamp(adoption + (product.features?.advisor ? 4 : 0), 44, 72));
    const negative = Math.round(clamp(product.features?.insuranceBundle ? 18 : 100 - positive - 27, 12, 24));
    const neutral = Math.max(10, 100 - positive - negative);
    return { positive, neutral, negative };
  }

  function buildInsights(product, org, archetypes, tunedRate, adoption) {
    const liked = topTerms(archetypes, 'likes')[0] || 'transparent pricing';
    const objection = topTerms(archetypes, 'distrust')[0] || 'fee transparency';
    const ratePhrase = IS_DEPOSIT
      ? `Yield tuning to ${tunedRate.toFixed(1)}% lifts projected adoption to ${adoption}%.`
      : `APR tuning to ${tunedRate.toFixed(1)}% lifts projected adoption to ${adoption}%.`;
    return [
      ratePhrase,
      `${org.name} blends ${formatCount(RECORD_COUNT)} CRM records with X, Reddit, and LinkedIn signals.`,
      `${titleTerm(objection)} is the top objection; lead with ${liked} in product messaging.`,
    ];
  }

  function formatCount(value) {
    return Number(value || 0).toLocaleString();
  }

  // ===== Script =============================================================

  window.TOUR_SCRIPT = [
    // ============================================================== ACT 1 ====
    { type: 'act', label: 'Act 1 — Create the Product' },
    { type: 'navTo', index: 0 },
    { type: 'wait', duration: 350 },
    { type: 'show', id: 'create-trigger', anchor: 'main', x: 32, y: 24, html: HTML_CREATE_TRIGGER },
    { type: 'move', target: '#tour-ov-create-trigger button', duration: 600 },
    { type: 'click', target: '#tour-ov-create-trigger button' },
    { type: 'show', id: 'create-modal', html: HTML_CREATE_MODAL, animateIn: 'modal' },
    { type: 'wait', duration: 380 },

    // Name
    { type: 'move', target: '#tour-name', duration: 480 },
    { type: 'click', target: '#tour-name' },
    { type: 'type',  target: '#tour-name', value: PRODUCT_NAME, perChar: 55 },
    { type: 'wait', duration: 200 },

    // Category
    { type: 'move', target: '#tour-category', duration: 460 },
    { type: 'click', target: '#tour-category' },
    { type: 'set', target: '#tour-category-dd', prop: 'addClass', value: 'open' },
    { type: 'set', target: '#tour-category', prop: 'addClass', value: 'focused' },
    { type: 'wait', duration: 280 },
    { type: 'move', target: '#tour-cat-active', duration: 380 },
    { type: 'set', target: '#tour-cat-active', prop: 'addClass', value: 'hovered' },
    { type: 'click', target: '#tour-cat-active' },
    { type: 'set', target: '#tour-category-dd', prop: 'removeClass', value: 'open' },
    { type: 'set', target: '#tour-category', prop: 'html', value: SELECTED_CATEGORY_HTML },
    { type: 'wait', duration: 200 },

    // Description
    { type: 'move', target: '#tour-desc', duration: 480 },
    { type: 'click', target: '#tour-desc' },
    { type: 'type',  target: '#tour-desc', value: PRODUCT_DESCRIPTION, perChar: 32 },
    { type: 'wait', duration: 220 },

    // Slider drag 18→25..45
    { type: 'move', target: '#tour-age-handle', duration: 460 },
    { type: 'drag', target: '#tour-age', value: 0.45, duration: 800 },

    // Save
    { type: 'move', target: '#tour-save', duration: 420 },
    { type: 'click', target: '#tour-save' },
    { type: 'glow', target: '#tour-save', duration: 280 },
    { type: 'toast', text: '✓ Product created', duration: 2000 },
    { type: 'wait', duration: 700 },
    { type: 'hide', id: 'create-modal', animateOut: 'fade' },
    { type: 'hide', id: 'create-trigger' },
    { type: 'wait', duration: 600 },

    // ============================================================== ACT 2 ====
    { type: 'act', label: 'Act 2 — Connect sources' },
    { type: 'navTo', index: 1 },
    { type: 'wait', duration: 400 },
    { type: 'show', id: 'sources-card', anchor: 'main', x: 24, y: 24, w: 760, html: HTML_SOURCES_PANEL, animateIn: 'slide' },
    { type: 'wait', duration: 360 },

    // Connect X
    { type: 'move', target: '#tour-conn-x', duration: 540 },
    { type: 'click', target: '#tour-conn-x' },
    { type: 'set', target: '#tour-conn-x', prop: 'addClass', value: 'connecting' },
    { type: 'set', target: '#tour-conn-x .tour-c-status', prop: 'text', value: 'Authorizing…' },
    { type: 'wait', duration: 900 },
    { type: 'set', target: '#tour-conn-x', prop: 'removeClass', value: 'connecting' },
    { type: 'set', target: '#tour-conn-x', prop: 'addClass', value: 'connected' },
    { type: 'set', target: '#tour-conn-x .tour-c-status', prop: 'text', value: '✓ Connected' },
    { type: 'wait', duration: 250 },

    // Connect Reddit
    { type: 'move', target: '#tour-conn-rd', duration: 460 },
    { type: 'click', target: '#tour-conn-rd' },
    { type: 'set', target: '#tour-conn-rd', prop: 'addClass', value: 'connecting' },
    { type: 'set', target: '#tour-conn-rd .tour-c-status', prop: 'text', value: 'Authorizing…' },
    { type: 'wait', duration: 760 },
    { type: 'set', target: '#tour-conn-rd', prop: 'removeClass', value: 'connecting' },
    { type: 'set', target: '#tour-conn-rd', prop: 'addClass', value: 'connected' },
    { type: 'set', target: '#tour-conn-rd .tour-c-status', prop: 'text', value: '✓ Connected' },
    { type: 'wait', duration: 250 },

    // Connect LinkedIn
    { type: 'move', target: '#tour-conn-li', duration: 460 },
    { type: 'click', target: '#tour-conn-li' },
    { type: 'set', target: '#tour-conn-li', prop: 'addClass', value: 'connecting' },
    { type: 'set', target: '#tour-conn-li .tour-c-status', prop: 'text', value: 'Authorizing…' },
    { type: 'wait', duration: 900 },
    { type: 'set', target: '#tour-conn-li', prop: 'removeClass', value: 'connecting' },
    { type: 'set', target: '#tour-conn-li', prop: 'addClass', value: 'connected' },
    { type: 'set', target: '#tour-conn-li .tour-c-status', prop: 'text', value: '✓ Connected' },
    { type: 'wait', duration: 250 },

    // Collect
    { type: 'set', target: '#tour-ingest-status', prop: 'text', value: 'Collecting public posts and bank records…' },
    { type: 'append', parent: '#tour-feed', items: POSTS, render: postHTML, stagger: 150 },
    { type: 'count',  target: '#tour-post-counter', from: 0, to: PUBLIC_POST_COUNT + RECORD_COUNT, duration: 1500, fmt: (n) => 'Signals: ' + n.toLocaleString() },
    { type: 'set', target: '#tour-ingest-status', prop: 'text', value: 'Extracting topics…' },
    { type: 'wait', duration: 300 },
    { type: 'append', parent: '#tour-tags', items: TAGS, render: tagHTML, stagger: 90 },
    { type: 'set', target: '#tour-ingest-status', prop: 'text', value: `${(PUBLIC_POST_COUNT + RECORD_COUNT).toLocaleString()} signals collected · ${TAGS.length} topics extracted` },
    { type: 'wait', duration: 700 },

    // ============================================================== ACT 3 ====
    { type: 'act', label: 'Act 3 — Generate Segments' },
    { type: 'hide', id: 'sources-card', animateOut: 'fade' },
    { type: 'navTo', index: 2 },
    { type: 'wait', duration: 380 },
    { type: 'show', id: 'audience-card', anchor: 'main', x: 24, y: 24, w: 820, html: HTML_AUDIENCE_PANEL, animateIn: 'slide' },
    { type: 'wait', duration: 320 },

    // Fake "Generate Audience" cursor click - target is the eyebrow area; we just shimmer
    { type: 'set', target: '#tour-personas-status', prop: 'text', value: 'Synthesizing financial customer segments…' },
    { type: 'move', target: '#tour-audience-card h4', duration: 480 },
    { type: 'click' },
    { type: 'wait', duration: 350 },

    // Avatars
    { type: 'append', parent: '#tour-avatars', items: PERSONAS, render: avatarHTML, stagger: 100 },
    { type: 'wait', duration: 300 },
    { type: 'set', target: '#tour-personas-status', prop: 'text', value: `${PERSONAS.length} segments generated · summary below` },

    // Show summary panel
    { type: 'set', target: '#tour-summary', prop: 'style', value: { display: 'grid' } },
    { type: 'append', parent: '#tour-age-bars', items: AGE_DIST, render: (d, i) => miniRow(d.label, d.pct, i), stagger: 120 },
    { type: 'append', parent: '#tour-income-bars', items: INCOME_DIST, render: (d, i) => miniRow(d.label, d.pct, i), stagger: 120 },
    { type: 'set', target: '#tour-sent-row', prop: 'html', value:
      '<span class="tour-sent-chip pos">Positive ' + SENTIMENT.positive + '%</span>' +
      '<span class="tour-sent-chip neu">Neutral ' + SENTIMENT.neutral + '%</span>' +
      '<span class="tour-sent-chip neg">Negative ' + SENTIMENT.negative + '%</span>' },
    { type: 'wait', duration: 700 },

    // ============================================================== ACT 4 ====
    { type: 'act', label: 'Act 4 — Tune Parameters' },
    { type: 'hide', id: 'audience-card', animateOut: 'fade' },
    { type: 'navTo', index: 3 },
    { type: 'wait', duration: 380 },
    { type: 'show', id: 'config-card', anchor: 'main', x: 24, y: 24, w: 760, html: HTML_CONFIG_PANEL, animateIn: 'slide' },
    { type: 'wait', duration: 320 },

    // Drag pricing/yield rate toward the simulated optimum
    { type: 'move', target: '#tour-rate-handle', duration: 480 },
    { type: 'drag', target: '#tour-rate-range', value: RATE_END_TRACK, duration: 900 },
    { type: 'count', target: '#tour-rate-val', from: RATE_START_TENTHS, to: RATE_END_TENTHS, duration: 250, fmt: (n) => (n / 10).toFixed(1) + '%' },
    { type: 'glow', target: '#tour-cfg-rate', duration: 200 },
    { type: 'wait', duration: 280 },

    // Toggle narrative
    { type: 'move', target: '#tour-narrative-switch', duration: 460 },
    { type: 'click', target: '#tour-narrative-switch' },
    { type: 'set', target: '#tour-narrative-switch', prop: 'addClass', value: 'on' },
    { type: 'set', target: '#tour-narrative-state', prop: 'text', value: 'On' },
    { type: 'glow', target: '#tour-cfg-narrative', duration: 200 },
    { type: 'wait', duration: 280 },

    // Marketing dropdown low → medium
    { type: 'move', target: '#tour-marketing', duration: 460 },
    { type: 'click', target: '#tour-marketing' },
    { type: 'set', target: '#tour-marketing-dd', prop: 'addClass', value: 'open' },
    { type: 'wait', duration: 260 },
    { type: 'move', target: '#tour-mkt-medium', duration: 360 },
    { type: 'click', target: '#tour-mkt-medium' },
    { type: 'set', target: '#tour-marketing-dd', prop: 'removeClass', value: 'open' },
    { type: 'set', target: '#tour-marketing-val', prop: 'text', value: 'Medium' },
    { type: 'glow', target: '#tour-cfg-marketing', duration: 200 },
    { type: 'wait', duration: 360 },

    // ============================================================== ACT 5 ====
    { type: 'act', label: 'Act 5 — Run Simulation' },

    // Click Run
    { type: 'move', target: '#tour-run', duration: 540 },
    { type: 'click', target: '#tour-run' },
    { type: 'glow', target: '#tour-run', duration: 240 },
    { type: 'set', target: '#tour-run-bar', prop: 'style', value: { display: 'flex' } },
    { type: 'set', target: '#tour-run-status', prop: 'text', value: `Simulating ${(PUBLIC_POST_COUNT + RECORD_COUNT).toLocaleString()} interactions…` },
    { type: 'set', target: '#tour-run-progress-fill', prop: 'style', value: { width: '100%', transition: 'width 2.2s cubic-bezier(.22,.61,.36,1)' } },
    { type: 'wait', duration: 2200 },
    { type: 'set', target: '#tour-run-status', prop: 'text', value: '✓ Simulation complete' },
    { type: 'wait', duration: 320 },
    { type: 'hide', id: 'config-card', animateOut: 'fade' },

    // Results panel
    { type: 'show', id: 'results-card', anchor: 'main', x: 24, y: 24, w: 820, html: HTML_RESULTS_PANEL, animateIn: 'slide' },
    { type: 'wait', duration: 360 },

    // Gauge animate to product-specific adoption estimate
    { type: 'set', target: '#tour-gauge-arc', prop: 'style', value: { strokeDasharray: ADOPTION_RATE + ' 999', transition: 'stroke-dasharray 1100ms cubic-bezier(.22,.61,.36,1)' } },
    { type: 'count', target: '#tour-gauge-num', from: 0, to: ADOPTION_RATE, duration: 1100, fmt: (n) => n + '%' },

    // Driver bars
    { type: 'append', parent: '#tour-driver-bars', items: DRIVERS, render: (d, i) => driverRow(d.label, d.pct, i), stagger: 140 },
    { type: 'wait', duration: 800 },

    // Insights typewriter
    { type: 'append', parent: '#tour-insights', items: INSIGHTS, render: (_, i) =>
        '<div class="tour-insight shimmer" id="tour-insight-' + i + '"><span class="tour-insight-text"></span><span class="tour-caret"></span></div>',
      stagger: 50 },
    { type: 'type', target: '#tour-insight-0 .tour-insight-text', value: INSIGHTS[0], perChar: 22 },
    { type: 'wait', duration: 240 },
    { type: 'type', target: '#tour-insight-1 .tour-insight-text', value: INSIGHTS[1], perChar: 22 },
    { type: 'wait', duration: 240 },
    { type: 'type', target: '#tour-insight-2 .tour-insight-text', value: INSIGHTS[2], perChar: 22 },
    { type: 'wait', duration: 600 },
  ];
})();
