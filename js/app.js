(() => {
  const { CATS, REGIONS, PRODUCTS, BY_ID, FARMS, DASTARKHAN, T } = window.DATA;
  const ART = window.ART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const KEY = 'aitumarket.v1';
  const FREE_FROM = 7000, FEE = 490;
  const PROMOS = { AITU10: .10 };
  const STAGES = [0, 4000, 10000, 26000]; // ms after checkout: accepted → picking → on the way → delivered
  const TABS = ['home', 'catalog', 'cart', 'orders', 'profile'];

  /* ---------- state ---------- */
  const DAY = 864e5;
  const seed = () => ({
    lang: 'ru', cart: {}, slot: 'asap', promo: null, door: false, push: true,
    orders: [
      { no: 4719, at: Date.now() - 7 * DAY - 3 * 36e5, items: { tandyr: 2, milk: 1, eggs: 1, aport: 2, tea: 1 }, rated: 5 },
      { no: 4583, at: Date.now() - 16 * DAY - 7 * 36e5, items: { rice: 1, carrot: 2, onion: 1, lamb: 1, cucumber: 1, tomato: 1 }, rated: 5 },
    ],
  });
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch { S = null; }
  if (!S || !S.cart) S = seed();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } };

  const ui = { tab: 'home', cat: 'all', sort: 'pop', q: '', sheet: null, rating: {} };

  /* ---------- helpers ---------- */
  const L = () => T[S.lang];
  const t = (k, v = {}) => String(L()[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
  const nm = o => o[S.lang];
  const money = n => `${Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ')} ₸`;
  const unit = ([a, u]) => `${String(a).replace('.', ',')} ${L().units[u]}`;
  const plural = n => {
    const m10 = n % 10, m100 = n % 100;
    const k = m10 === 1 && m100 !== 11 ? 1 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 2 : 5;
    return `${n} ${t('items_' + k)}`;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const tint = p => CATS.find(c => c.id === p.cat).tint;
  const pct = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

  const qty = id => S.cart[id] || 0;
  const cartIds = () => Object.keys(S.cart).filter(id => S.cart[id] > 0 && BY_ID[id]);
  const count = () => cartIds().reduce((s, id) => s + S.cart[id], 0);
  function totals(items = S.cart) {
    const sub = Object.entries(items).reduce((s, [id, q]) => s + (BY_ID[id] ? BY_ID[id].price * q : 0), 0);
    const disc = S.promo && items === S.cart ? Math.round(sub * PROMOS[S.promo]) : 0;
    const fee = sub === 0 || sub >= FREE_FROM ? 0 : FEE;
    return { sub, disc, fee, total: sub - disc + fee };
  }

  /* ---------- icons ---------- */
  const I = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const IC = {
    home: I('<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6.5H9V21H4.5a1 1 0 0 1-1-1z"/>'),
    catalog: I('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="3.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
    cart: I('<path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>'),
    orders: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    profile: I('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/>'),
    search: I('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
    plus: I('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.4"'),
    minus: I('<path d="M5 12h14"/>', 'stroke-width="2.4"'),
    x: I('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="2.2"'),
    right: I('<path d="m9 5 7 7-7 7"/>', 'stroke-width="2.2"'),
    down: I('<path d="m6 9 6 6 6-6"/>', 'stroke-width="2.2"'),
    pin: I('<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    card: I('<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>'),
    door: I('<path d="M6 21V4.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V21M3.5 21h17"/><circle cx="14.5" cy="12.5" r=".8" fill="currentColor"/>'),
    tag: I('<path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1 1 0 0 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4 0z"/><circle cx="8" cy="8" r="1.4"/>'),
    bell: I('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
    globe: I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>'),
    info: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.1"/>'),
    phone: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>'),
    check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="2.4"'),
    clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    leaf: I('<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 9-7.5"/>'),
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor"/></svg>',
    reset: I('<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>'),
  };

  const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#0F3B2C"/>
    <path d="M20 31V19M20 19c0-6.5-7.5-9.5-11-5-2.4 3 0 7 3 6.2 2.4-.6 2.4-3.3.6-3.8M20 19c0-6.5 7.5-9.5 11-5 2.4 3 0 7-3 6.2-2.4-.6-2.4-3.3-.6-3.8" fill="none" stroke="#F3EFE4" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="20" cy="33.5" r="1.6" fill="#EE9B45"/></svg>`;
  const wordmark = `<span class="wm">aitu<b>market</b></span>`;

  /* ---------- small components ---------- */
  function ctl(id) {
    const q = qty(id);
    if (!q) return `<button class="add" data-add="${id}" aria-label="${t('add')}">${IC.plus}</button>`;
    return `<div class="step"><button data-dec="${id}" aria-label="−">${IC.minus}</button><output>${q}</output><button data-add="${id}" aria-label="+">${IC.plus}</button></div>`;
  }

  function tags(p) {
    const out = [];
    if (p.old) out.push(`<span class="tg tg-sale">−${pct(p)}%</span>`);
    const first = p.tags.find(x => x !== 'hit') || p.tags[0];
    if (first) out.push(`<span class="tg tg-${first}">${t('tag_' + first)}</span>`);
    return out.join('');
  }

  const card = p => `
    <article class="pc" data-open="${p.id}" style="--tint:${tint(p)}">
      <div class="pc-art">${ART(p.id)}<div class="pc-tags">${tags(p)}</div><div class="ctl" data-ctl="${p.id}">${ctl(p.id)}</div></div>
      <div class="pc-body">
        <div class="price"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
        <h3>${nm(p.name)}</h3>
        <span class="muted">${unit(p.unit)}</span>
      </div>
    </article>`;

  const head = (title, link) => `<div class="sec-head"><h2>${title}</h2>${link ? `<a href="${link}" class="link">${t('see_all')} ${IC.right}</a>` : ''}</div>`;

  function freeBar(sub) {
    const left = FREE_FROM - sub, ok = left <= 0;
    return `<div class="free ${ok ? 'ok' : ''}">
      <div class="free-row">${ok ? IC.check : ''}<span>${ok ? t('free_ok') : t('free_left', { p: `<b>${money(left)}</b>` })}</span></div>
      <div class="bar"><i style="width:${Math.min(100, sub / FREE_FROM * 100)}%"></i></div></div>`;
  }

  function greeting() {
    const h = new Date().getHours();
    return t(h < 5 ? 'g_night' : h < 12 ? 'g_morning' : h < 18 ? 'g_day' : 'g_evening');
  }
  // many browsers ship without kk-KZ month names, so Kazakh dates are formatted by hand
  const KK_M = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
  const KK_W = ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'];
  function dateStr(d, o) {
    if (S.lang !== 'kk' || o.hour) return new Intl.DateTimeFormat('ru-RU', o).format(d);
    return `${d.getDate()} ${KK_M[d.getMonth()]}${o.weekday ? `, ${KK_W[d.getDay()]}` : ''}`;
  }

  /* ---------- views ---------- */
  function topbar() {
    return `<header class="topbar">
      <button class="addr" data-go="profile">${IC.pin}<span><small>${t('deliver_to')}</small><b>${t('address')}</b></span>${IC.down}</button>
      <span class="eta"><i></i>${t('eta')}</span>
    </header>`;
  }

  function viewHome() {
    const season = PRODUCTS.filter(p => p.tags.includes('season') || p.tags.includes('hit'));
    const sale = PRODUCTS.filter(p => p.old);
    const bundle = totals(DASTARKHAN).sub;
    const aport = BY_ID.aport;
    return `${topbar()}
    <section class="greet">
      <p class="eyebrow">${dateStr(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })} · Алматы</p>
      <h1>${greeting()}, ${t('user')}</h1>
    </section>
    <button class="search fake" data-go="catalog" data-focus="1">${IC.search}<span>${t('search_ph', { n: PRODUCTS.length })}</span></button>

    <div class="heroes" role="list">
      <article class="hero hero-a" role="listitem">
        <div class="hero-txt">
          <p class="eyebrow">${t('h1_eye')}</p><h2>${t('h1_title')}</h2><p>${t('h1_text')}</p>
          <div class="hero-act"><button class="btn btn-light" data-open="aport">${t('h1_btn')}</button><span class="pill">${t('from_price', { p: money(aport.price) })}</span></div>
        </div>
        <div class="hero-art">${ART('aport')}</div>
      </article>
      <article class="hero hero-b" role="listitem">
        <div class="hero-txt">
          <p class="eyebrow">${t('h2_eye')}</p><h2>${t('h2_title')}</h2><p>${t('h2_text')}</p>
          <div class="hero-act"><button class="btn btn-dark" data-bundle="1">${t('h2_btn', { p: money(bundle) })}</button></div>
        </div>
        <div class="hero-art hero-stack"><span>${ART('tandyr')}</span><span>${ART('tea')}</span><span>${ART('baursak')}</span></div>
      </article>
      <article class="hero hero-c" role="listitem">
        <div class="hero-txt">
          <p class="eyebrow">${t('h3_eye')}</p><h2>${t('h3_title')}</h2><p>${t('h3_text')}</p>
          <div class="hero-act"><span class="code">AITU10</span><button class="btn btn-dark" data-promo="AITU10">${S.promo ? IC.check : t('h3_btn')}</button></div>
        </div>
      </article>
    </div>

    <section class="sec">${head(t('sec_cats'), '#/catalog')}
      <div class="cats">${CATS.map(c => `<a class="cat" href="#/catalog/${c.id}" style="--tint:${c.tint}"><span class="cat-art">${ART(c.art)}</span><span>${nm(c)}</span></a>`).join('')}</div>
    </section>

    <section class="sec">${head(t('sec_season'), '#/catalog')}
      <div class="rail-x">${season.map(card).join('')}</div>
    </section>

    <section class="sec">${head(t('sec_farms'))}
      <div class="farms">${FARMS.map((f, i) => `
        <article class="farm">
          <div class="farm-badge">${ART.horn ? `<svg viewBox="-20 -14 40 36">${ART.horn(0, 0, 1, '#F3EFE4', 2.2)}</svg>` : ''}</div>
          <div><h3>${nm(f)}</h3><p class="muted">${S.lang === 'ru' ? f.tru : f.tkk}</p><p class="farm-reg">${IC.pin}${nm(REGIONS[f.region])}</p></div>
          <div class="farm-items">${f.items.map(id => `<button data-open="${id}" style="--tint:${tint(BY_ID[id])}" aria-label="${nm(BY_ID[id].name)}">${ART(id)}</button>`).join('')}</div>
        </article>`).join('')}</div>
    </section>

    <section class="sec">${head(t('sec_sale'))}
      <div class="grid">${sale.map(card).join('')}</div>
    </section>
    <footer class="foot">${LOGO}<span>${t('foot')}</span></footer>`;
  }

  function filtered() {
    const q = ui.q.trim().toLowerCase();
    let list = PRODUCTS.filter(p => (ui.cat === 'all' || p.cat === ui.cat) &&
      (!q || [p.name.ru, p.name.kk, CATS.find(c => c.id === p.cat).ru].some(s => s.toLowerCase().includes(q))));
    if (ui.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
    if (ui.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }

  function gridHTML() {
    const list = filtered();
    if (!list.length) return `<div class="empty small">${ART('bag')}<h3>${t('nothing')}</h3><p class="muted">${t('nothing_hint')}</p></div>`;
    return `<div class="grid">${list.map(card).join('')}</div>`;
  }

  function viewCatalog() {
    return `<header class="page-head"><h1>${t('catalog_title')}</h1></header>
    <div class="cat-tools">
      <label class="search">${IC.search}<input id="q" type="search" value="${esc(ui.q)}" placeholder="${t('search_ph', { n: PRODUCTS.length })}" autocomplete="off"></label>
      <div class="chips" role="tablist">
        <button class="chip ${ui.cat === 'all' ? 'on' : ''}" data-cat="all">${t('cat_all')}</button>
        ${CATS.map(c => `<button class="chip ${ui.cat === c.id ? 'on' : ''}" data-cat="${c.id}"><span class="chip-art">${ART(c.art)}</span>${nm(c)}</button>`).join('')}
      </div>
    </div>
    <div class="toolbar"><span class="muted" id="cnt">${plural(filtered().length)}</span>
      <div class="seg">${['pop', 'asc', 'desc'].map(s => `<button class="${ui.sort === s ? 'on' : ''}" data-sort="${s}">${t('sort_' + s)}</button>`).join('')}</div>
    </div>
    <div id="grid">${gridHTML()}</div>`;
  }

  function line(id) {
    const p = BY_ID[id];
    return `<li class="ln">
      <button class="ln-art" data-open="${id}" style="--tint:${tint(p)}" aria-label="${nm(p.name)}">${ART(id)}</button>
      <div class="ln-info"><b>${nm(p.name)}</b><span class="muted">${unit(p.unit)} · ${money(p.price)}</span></div>
      <div class="ctl" data-ctl="${id}">${ctl(id)}</div>
      <b class="ln-sum">${money(p.price * qty(id))}</b>
    </li>`;
  }

  function slots() {
    const now = new Date(), h = now.getHours();
    const out = [{ id: 'asap', a: t('slot_asap'), b: t('slot_asap_t') }];
    for (let x = Math.max(h + 2, 10); x <= 21 && out.length < 3; x++) out.push({ id: `t${x}`, a: t('slot_today'), b: `${x}:00–${x + 1}:00` });
    [10, 12].forEach(x => out.push({ id: `m${x}`, a: t('slot_tomorrow'), b: `${x}:00–${x + 1}:00` }));
    if (!out.some(s => s.id === S.slot)) S.slot = 'asap';
    return out;
  }

  function summaryRows(tt) {
    return `<dl class="sum">
      <div><dt>${t('goods')}</dt><dd>${money(tt.sub)}</dd></div>
      ${tt.disc ? `<div class="disc"><dt>${t('discount')} · ${S.promo}</dt><dd>−${money(tt.disc)}</dd></div>` : ''}
      <div><dt>${t('delivery')}</dt><dd>${tt.fee ? money(tt.fee) : `<span class="ok">${t('free')}</span>`}</dd></div>
      <div class="tot"><dt>${t('total')}</dt><dd>${money(tt.total)}</dd></div></dl>`;
  }

  function viewCart() {
    const ids = cartIds();
    if (!ids.length) return `<header class="page-head"><h1>${t('cart_title')}</h1></header>
      <div class="empty">${ART('bag')}<h3>${t('empty_title')}</h3><p class="muted">${t('empty_text')}</p>
      <div class="empty-act"><a class="btn btn-dark" href="#/catalog">${t('to_catalog')}</a><button class="btn btn-ghost" data-open="tandyr">${nm(BY_ID.tandyr.name)} · ${money(BY_ID.tandyr.price)}</button></div></div>`;
    const tt = totals();
    const ups = ['tandyr', 'tea', 'milk', 'eggs', 'aport', 'kurt', 'lemon', 'baursak'].filter(id => !qty(id)).slice(0, 4);
    return `<div class="cart-layout">
      <div class="cart-main">
        <header class="page-head"><h1>${t('cart_title')} <sup>${count()}</sup></h1><button class="link" data-clear="1">${t('clear')}</button></header>
        ${freeBar(tt.sub)}
        <ul class="lines">${ids.map(line).join('')}</ul>
        ${ups.length ? `<section class="sec">${head(t('upsell'))}<div class="rail-x">${ups.map(id => card(BY_ID[id])).join('')}</div></section>` : ''}
      </div>
      <div class="checkout">
        <section class="box"><h3>${t('when')}</h3>
          <div class="slots">${slots().map(s => `<button class="slot ${S.slot === s.id ? 'on' : ''}" data-slot="${s.id}"><small>${s.a}</small><b>${s.b}</b></button>`).join('')}</div>
        </section>
        <section class="box rows">
          <div class="row">${IC.pin}<div><small>${t('where')}</small><b>${t('address_full')}</b></div></div>
          <div class="row">${IC.card}<div><small>${t('pay')}</small><b>${t('card')}</b></div></div>
          <label class="row">${IC.door}<div><b>${t('door')}</b><small>${t('door_t')}</small></div><input type="checkbox" class="sw" data-set="door" ${S.door ? 'checked' : ''}></label>
        </section>
        <section class="box">
          ${S.promo
            ? `<div class="promo-on">${IC.tag}<span>${t('promo_ok', { c: `<b>${S.promo}</b>` })}</span><button class="link" data-unpromo="1">${t('promo_rm')}</button></div>`
            : `<form class="promo" data-promo-form="1"><label>${IC.tag}<input name="code" placeholder="${t('promo_ph')}" autocomplete="off" autocapitalize="characters"></label><button class="btn btn-ghost">${t('apply')}</button></form>`}
        </section>
        <section class="box">${summaryRows(tt)}</section>
        <div class="cta-wrap"><button class="btn btn-dark cta" data-checkout="1"><span>${t('checkout')}</span><b>${money(tt.total)}</b></button></div>
      </div>
    </div>`;
  }

  /* orders */
  const stageOf = o => { const e = Date.now() - o.at; let s = 0; STAGES.forEach((ms, i) => { if (e >= ms) s = i; }); return s; };
  const ride = o => Math.min(1, Math.max(0, (Date.now() - o.at - STAGES[2]) / (STAGES[3] - STAGES[2])));
  const active = () => S.orders.filter(o => o.live && Date.now() - o.at < STAGES[3] + 60 * 60e3);

  function mapSVG() {
    let blocks = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      const park = r === 2 && c === 3, x = c * 60 + 8, y = 54 + r * 44 + 8;
      blocks += `<rect x="${x}" y="${y}" width="44" height="28" rx="5" fill="${park ? '#CFE0B2' : '#F6F2E7'}"/>`;
      if (park) blocks += `<circle cx="${x + 12}" cy="${y + 14}" r="6" fill="#9CC27C"/><circle cx="${x + 26}" cy="${y + 10}" r="5" fill="#8AB66B"/><circle cx="${x + 34}" cy="${y + 19}" r="5" fill="#9CC27C"/>`;
    }
    return `<svg viewBox="0 0 360 230" class="map-svg" aria-hidden="true">
      <rect width="360" height="230" fill="#E6DFCB"/>
      <path d="M0 50 28 26l20 12 30-28 26 20 26-14 28 22 32-26 30 22 30-16 28 18 30-22 22 14 30-16V0H0z" fill="#C5D1BF"/>
      <path d="m78 10 10 10-6-1-4 4-3-5-6 2zm126-2 9 10-6-1-3 4-4-5-6 2zm126 6 8 8-5 0-3 3-3-4-5 1z" fill="#fff"/>
      ${blocks}
      <path id="route" d="M30 186H120V142H240V98H300V64" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 186H120V142H240V98H300V64" fill="none" stroke="#0F3B2C" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round" opacity=".45"/>
      <path id="route-done" d="M30 186H120V142H240V98H300V64" fill="none" stroke="#2D7A4C" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="translate(30 186)"><circle r="13" fill="#0F3B2C"/><path d="M-5-2h10l-.8 7.5h-8.4zM-2.5-2v-2a2.5 2.5 0 0 1 5 0v2" stroke="#F3EFE4" stroke-width="1.6" fill="none" stroke-linejoin="round"/></g>
      <g transform="translate(300 64)"><circle r="13" fill="#EE9B45"/><path d="M-6 0 0-5.5 6 0v6h-12z" fill="#fff"/></g>
      <g id="courier"><circle r="15" fill="#2D7A4C" opacity=".2" class="pulse"/><circle r="9" fill="#2D7A4C" stroke="#fff" stroke-width="3"/></g>
    </svg>`;
  }

  function etaText(o, st) {
    if (st === 3) return t('delivered_at', { t: dateStr(new Date(o.at + STAGES[3]), { hour: '2-digit', minute: '2-digit' }) });
    const left = st < 2 ? 18 - st * 4 : Math.max(1, Math.round(9 * (1 - ride(o))));
    return t('eta_min', { m: left });
  }

  function trackCard(o) {
    const st = stageOf(o), total = o.total ?? totals(o.items).total;
    return `<article class="track" data-order="${o.no}" data-stage="${st}">
      <header class="track-head">
        <div><small class="muted">${t('order_no', { n: o.no })} · ${money(total)}</small><h2>${t('st' + st)}</h2></div>
        <span class="eta-big ${st === 3 ? 'done' : ''}">${etaText(o, st)}</span>
      </header>
      <div class="map">${mapSVG()}<div class="map-tag map-store">${t('store')}</div><div class="map-tag map-home">${t('home')}</div></div>
      <ol class="stages">${[0, 1, 2, 3].map(i => `<li class="${i < st ? 'done' : i === st ? 'now' : ''}"><i>${i < st || st === 3 ? IC.check : ''}</i><div><b>${t('st' + i)}</b>${i === st ? `<small>${t('st' + i + 'd')}</small>` : ''}</div></li>`).join('')}</ol>
      ${st === 2 ? `<div class="courier"><span class="ava">Е</span><div><small class="muted">${t('courier')}</small><b>${t('courier_name')}</b></div><button class="btn btn-ghost" data-toast="${t('call')} · +7 7•• ••• •• 18">${IC.phone}${t('call')}</button></div>` : ''}
      ${st === 3 ? `<div class="rate"><b>${t('rate')}</b><div class="stars">${[1, 2, 3, 4, 5].map(n => `<button class="${(o.rated || 0) >= n ? 'on' : ''}" data-rate="${o.no}:${n}" aria-label="${n}">${IC.star}</button>`).join('')}</div>${o.rated ? `<small class="muted">${t('thanks')}</small>` : ''}</div>` : ''}
    </article>`;
  }

  function viewOrders() {
    const live = active(), past = S.orders.filter(o => !live.includes(o));
    return `<header class="page-head"><h1>${t('orders_title')}</h1></header>
      ${live.map(trackCard).join('')}
      ${past.length ? `<section class="sec">${head(t('history'))}<div class="hist">${past.map(o => {
        const total = o.total ?? totals(o.items).total, ids = Object.keys(o.items);
        return `<article class="ho">
          <div class="ho-top"><div><b>${dateStr(new Date(o.at), { day: 'numeric', month: 'long' })}</b><small class="muted">${t('order_no', { n: o.no })} · ${plural(Object.values(o.items).reduce((a, b) => a + b, 0))}</small></div><b>${money(total)}</b></div>
          <div class="ho-arts">${ids.slice(0, 5).map(id => `<span style="--tint:${tint(BY_ID[id])}">${ART(id)}</span>`).join('')}${ids.length > 5 ? `<span class="more">+${ids.length - 5}</span>` : ''}</div>
          <button class="btn btn-ghost" data-repeat="${o.no}">${IC.reset}${t('repeat')}</button>
        </article>`;
      }).join('')}</div></section>` : ''}
      ${!S.orders.length ? `<div class="empty">${ART('bag')}<h3>${t('no_orders')}</h3></div>` : ''}`;
  }

  function viewProfile() {
    return `<header class="page-head"><h1>${t('nav_profile')}</h1></header>
      <section class="me">
        <span class="me-ava">А</span>
        <div><h2>${t('user')} Нурланова</h2><p class="muted">+7 701 ••• •• 42</p></div>
      </section>
      <section class="bonus">
        <svg class="bonus-orn" viewBox="-20 -14 40 36" aria-hidden="true">${ART.horn(0, 0, 1, 'currentColor', 1.2)}</svg>
        <small>${t('bonus')}</small><b>${money(1240)}</b><p>${t('bonus_t')}</p>
      </section>
      <section class="box rows">
        <div class="row">${IC.globe}<div><b>${t('lang')}</b></div>
          <div class="seg">${['ru', 'kk'].map(l => `<button class="${S.lang === l ? 'on' : ''}" data-lang="${l}">${l === 'ru' ? 'RU' : 'ҚАЗ'}</button>`).join('')}</div></div>
        <div class="row">${IC.pin}<div><small>${t('addresses')}</small><b>${t('address_full')}</b></div></div>
        <div class="row">${IC.card}<div><small>${t('payment')}</small><b>${t('card')}</b></div></div>
        <label class="row">${IC.bell}<div><b>${t('notif')}</b></div><input type="checkbox" class="sw" data-set="push" ${S.push ? 'checked' : ''}></label>
        <label class="row">${IC.door}<div><b>${t('door_default')}</b></div><input type="checkbox" class="sw" data-set="door" ${S.door ? 'checked' : ''}></label>
      </section>
      <section class="box about">${IC.info}<div><b>${t('about')}</b><p class="muted">${t('about_text')}</p>
        <button class="link" data-reset="1">${IC.reset}${t('reset')}</button></div></section>
      <footer class="foot">${LOGO}<span>${t('foot')}</span></footer>`;
  }

  const VIEWS = { home: viewHome, catalog: viewCatalog, cart: viewCart, orders: viewOrders, profile: viewProfile };

  /* ---------- chrome: rail, tab bar, cart column, minicart ---------- */
  function navItems(cls) {
    const c = count(), live = active().some(o => stageOf(o) < 3);
    return TABS.map(id => `<a href="#/${id}" class="${cls} ${ui.tab === id ? 'on' : ''}" ${id === 'cart' ? 'data-cart-target' : ''} aria-current="${ui.tab === id ? 'page' : 'false'}">
      <span class="ni">${IC[id]}${id === 'cart' && c ? `<em class="badge">${c}</em>` : ''}${id === 'orders' && live ? `<em class="dot"></em>` : ''}</span><span class="nl">${t('nav_' + id)}</span></a>`).join('');
  }

  function renderChrome() {
    $('#rail').innerHTML = `<a class="logo" href="#/home">${LOGO}${wordmark}</a>
      <nav class="rail-nav">${navItems('rn')}</nav>
      <div class="rail-card">${IC.pin}<div><small>${t('deliver_to')}</small><b>${t('address')}</b><span class="eta"><i></i>${t('eta')}</span></div></div>
      <div class="seg rail-lang">${['ru', 'kk'].map(l => `<button class="${S.lang === l ? 'on' : ''}" data-lang="${l}">${l === 'ru' ? 'RU' : 'ҚАЗ'}</button>`).join('')}</div>`;
    $('#tabbar').innerHTML = navItems('tb');
    renderCartCol();
    renderMini();
  }

  function renderCartCol() {
    const ids = cartIds(), tt = totals();
    $('#cartcol').innerHTML = `<div class="cc" data-cart-target>
      <header><h2>${t('summary')}</h2>${ids.length ? `<span class="muted">${plural(count())}</span>` : ''}</header>
      ${ids.length ? `${freeBar(tt.sub)}
        <ul class="cc-lines">${ids.map(id => { const p = BY_ID[id]; return `<li><button class="ln-art" data-open="${id}" style="--tint:${tint(p)}">${ART(id)}</button><div><b>${nm(p.name)}</b><span class="muted">${money(p.price * qty(id))}</span></div><div class="ctl" data-ctl="${id}">${ctl(id)}</div></li>`; }).join('')}</ul>
        ${summaryRows(tt)}
        <a class="btn btn-dark cta" href="#/cart"><span>${t('go_checkout')}</span><b>${money(tt.total)}</b></a>`
        : `<div class="empty small">${ART('bag')}<p class="muted">${t('empty_text')}</p></div>`}
    </div>`;
  }

  function renderMini() {
    const ids = cartIds(), tt = totals(), el = $('#minicart');
    const show = ids.length && (ui.tab === 'home' || ui.tab === 'catalog');
    el.classList.toggle('show', !!show);
    if (!ids.length) return;
    el.innerHTML = `<a href="#/cart" class="mc">
      <span class="mc-arts">${ids.slice(-3).map(id => `<i style="--tint:${tint(BY_ID[id])}">${ART(id)}</i>`).join('')}</span>
      <span class="mc-txt"><b>${money(tt.sub)}</b><small>${tt.sub >= FREE_FROM ? t('free_ok') : t('free_left', { p: money(FREE_FROM - tt.sub) })}</small></span>
      <span class="mc-go">${t('nav_cart')} ${IC.right}</span>
      <span class="mc-bar"><i style="width:${Math.min(100, tt.sub / FREE_FROM * 100)}%"></i></span></a>`;
  }

  /* ---------- render & routing ---------- */
  function render(keepScroll) {
    document.documentElement.lang = S.lang === 'kk' ? 'kk' : 'ru';
    document.body.dataset.tab = ui.tab;
    const v = $('#view');
    v.innerHTML = `<div class="view">${VIEWS[ui.tab]()}</div>`;
    renderChrome();
    if (!keepScroll) window.scrollTo(0, 0);
    if (ui.tab === 'orders') tick();
  }

  function route() {
    const [tab, sub] = location.hash.replace(/^#\/?/, '').split('/');
    ui.tab = TABS.includes(tab) ? tab : 'home';
    if (ui.tab === 'catalog') ui.cat = sub && CATS.some(c => c.id === sub) ? sub : (sub === undefined ? ui.cat : 'all');
    closeSheet(true);
    render();
    if (ui.focusSearch) { ui.focusSearch = false; setTimeout(() => $('#q')?.focus(), 60); }
  }

  /* cart mutations update every visible control in place, so rails keep their scroll position */
  function refreshCart() {
    save();
    $$('[data-ctl]').forEach(el => { el.innerHTML = ctl(el.dataset.ctl); });
    renderChrome();
    if (ui.tab === 'cart') render(true);
    if (ui.sheet) $('#sheet .sheet-foot')?.replaceWith(sheetFoot(ui.sheet));
  }

  function setQty(id, q) {
    if (q <= 0) delete S.cart[id]; else S.cart[id] = Math.min(q, 30);
    refreshCart();
  }

  function fly(from) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = $$('[data-cart-target]').find(el => el.getClientRects().length && el.offsetParent !== null);
    if (!from || !target) return;
    const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
    const dot = document.createElement('i');
    dot.className = 'fly';
    dot.style.left = `${a.left + a.width / 2 - 8}px`; dot.style.top = `${a.top + a.height / 2 - 8}px`;
    document.body.appendChild(dot);
    const dx = b.left + Math.min(b.width, 60) / 2 - (a.left + a.width / 2), dy = b.top + 18 - (a.top + a.height / 2);
    dot.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * .5}px, ${dy * .5 - 80}px) scale(.9)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: .2 },
    ], { duration: 620, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => {
      dot.remove();
      $$('[data-cart-target] .badge, .mc').forEach(x => x.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 320));
    };
  }

  let toastTimer;
  function toast(msg, icon = IC.check) {
    const el = $('#toast');
    el.innerHTML = `${icon}<span>${msg}</span>`;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  /* ---------- product sheet ---------- */
  function sheetFoot(id) {
    const p = BY_ID[id], q = qty(id);
    const f = document.createElement('div');
    f.className = 'sheet-foot';
    f.innerHTML = `<div class="price big"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ''}<small class="muted">${unit(p.unit)}</small></div>
      ${q ? `<div class="ctl wide" data-ctl="${id}">${ctl(id)}</div>` : `<button class="btn btn-dark add-big" data-add="${id}">${IC.plus}${t('add')}</button>`}`;
    return f;
  }

  function openSheet(id) {
    const p = BY_ID[id];
    if (!p) return;
    ui.sheet = id;
    const pairs = PRODUCTS.filter(x => x.id !== id && (x.cat === p.cat || (DASTARKHAN[x.id] && DASTARKHAN[id]))).slice(0, 6);
    const wrap = $('#sheet');
    wrap.innerHTML = `<div class="backdrop" data-close="1"></div>
      <div class="sheet" tabindex="-1" role="dialog" aria-modal="true" aria-label="${esc(nm(p.name))}">
        <div class="grab" data-grab="1"><i></i></div>
        <button class="sheet-x" data-close="1" aria-label="${t('close')}">${IC.x}</button>
        <div class="sheet-scroll">
          <div class="sheet-art" style="--tint:${tint(p)}">${ART(id)}<div class="pc-tags">${tags(p)}${p.tags.includes('hit') ? `<span class="tg tg-hit">${t('tag_hit')}</span>` : ''}</div></div>
          <div class="sheet-body">
            <p class="eyebrow">${nm(CATS.find(c => c.id === p.cat))}</p>
            <h2>${nm(p.name)}</h2>
            <p class="desc">${p.desc[S.lang]}</p>
            <dl class="facts">
              <div><dt>${t('origin')}</dt><dd>${nm(REGIONS[p.region])}</dd></div>
              <div><dt>${t('pack')}</dt><dd>${unit(p.unit)}</dd></div>
              <div><dt>${t('energy')}</dt><dd>${p.kcal} ${t('per100')}</dd></div>
            </dl>
            <h4>${t('pairs')}</h4>
            <div class="rail-x mini">${pairs.map(card).join('')}</div>
          </div>
        </div>
      </div>`;
    $('.sheet', wrap).appendChild(sheetFoot(id));
    wrap.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    requestAnimationFrame(() => wrap.classList.add('open'));
    setTimeout(() => $('.sheet', wrap)?.focus({ preventScroll: true }), 50);
  }

  function closeSheet(instant) {
    const wrap = $('#sheet');
    if (!ui.sheet) return;
    ui.sheet = null;
    wrap.classList.remove('open');
    wrap.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    const sh = $('.sheet', wrap);
    if (sh) sh.style.transform = '';
    setTimeout(() => { if (!ui.sheet) wrap.innerHTML = ''; }, instant ? 0 : 320);
  }

  // drag the bottom sheet down to dismiss (mobile)
  let drag = null;
  document.addEventListener('pointerdown', e => {
    const g = e.target.closest('[data-grab]');
    if (!g) return;
    drag = { y: e.clientY, el: g.parentElement, dy: 0 };
    drag.el.style.transition = 'none';
    g.setPointerCapture(e.pointerId);
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.dy = Math.max(0, e.clientY - drag.y);
    drag.el.style.transform = `translateY(${drag.dy}px)`;
  });
  document.addEventListener('pointerup', () => {
    if (!drag) return;
    const { el, dy } = drag;
    drag = null;
    el.style.transition = '';
    if (dy > 110) closeSheet(); else el.style.transform = '';
  });

  /* ---------- checkout & orders ---------- */
  function checkout() {
    const items = { ...S.cart };
    if (!Object.keys(items).length) return;
    const no = 4800 + Math.floor(Math.random() * 900);
    S.orders.unshift({ no, at: Date.now(), items, live: true, total: totals().total });
    S.cart = {}; S.promo = null;
    save();
    const ov = document.createElement('div');
    ov.className = 'done-ov';
    ov.innerHTML = `<div class="done-card"><svg viewBox="0 0 64 64" class="done-check"><circle cx="32" cy="32" r="29"/><path d="m19 33 9 9 18-19"/></svg>
      <h2>${t('order_placed')}</h2><p class="muted">${t('order_no', { n: no })} · ${t('order_placed_t')}</p></div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('show'));
    setTimeout(() => { location.hash = '#/orders'; }, 1500);
    setTimeout(() => { ov.classList.remove('show'); setTimeout(() => ov.remove(), 300); }, 1800);
  }

  // live tracking: move the courier along the route, re-render when the stage changes
  let tickId;
  function tick() {
    cancelAnimationFrame(tickId);
    const step = () => {
      if (ui.tab !== 'orders') return;
      let rerender = false;
      $$('.track').forEach(el => {
        const o = S.orders.find(x => x.no === +el.dataset.order);
        if (!o) return;
        const st = stageOf(o);
        if (st !== +el.dataset.stage) { rerender = true; return; }
        const path = $('#route', el), done = $('#route-done', el), cur = $('#courier', el);
        if (!path) return;
        const len = path.getTotalLength(), k = st < 2 ? 0 : st === 3 ? 1 : ride(o);
        const pt = path.getPointAtLength(len * k);
        cur.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        done.style.strokeDasharray = len;
        done.style.strokeDashoffset = len * (1 - k);
        const eta = $('.eta-big', el);
        const txt = etaText(o, st);
        if (eta.textContent !== txt) eta.textContent = txt;
      });
      if (rerender) { render(true); return; }
      tickId = requestAnimationFrame(step);
    };
    step();
  }
  // keep the nav "live order" dot honest while on other tabs
  setInterval(() => { if (ui.tab !== 'orders' && S.orders.some(o => o.live)) renderChrome(); }, 4000);

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-add],[data-dec],[data-open],[data-close],[data-cat],[data-sort],[data-slot],[data-lang],[data-go],[data-bundle],[data-promo],[data-unpromo],[data-clear],[data-checkout],[data-repeat],[data-rate],[data-reset],[data-toast]');
    if (!el) return;
    const d = el.dataset;
    if (d.add) { e.preventDefault(); const was = qty(d.add); setQty(d.add, was + 1); if (!was) fly(el); return; }
    if (d.dec) { e.preventDefault(); setQty(d.dec, qty(d.dec) - 1); return; }
    if (d.close) return closeSheet();
    if (d.open) return openSheet(d.open);
    if (d.cat) {
      ui.cat = d.cat;
      history.replaceState(null, '', d.cat === 'all' ? '#/catalog' : `#/catalog/${d.cat}`);
      $$('.chip').forEach(c => c.classList.toggle('on', c.dataset.cat === d.cat));
      $('#grid').innerHTML = gridHTML(); $('#cnt').textContent = plural(filtered().length);
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      return;
    }
    if (d.sort) { ui.sort = d.sort; $$('[data-sort]').forEach(b => b.classList.toggle('on', b === el)); $('#grid').innerHTML = gridHTML(); return; }
    if (d.slot) { S.slot = d.slot; save(); $$('[data-slot]').forEach(b => b.classList.toggle('on', b === el)); return; }
    if (d.lang) { S.lang = d.lang; save(); render(true); return; }
    if (d.go) { if (d.focus) ui.focusSearch = true; location.hash = `#/${d.go}`; return; }
    if (d.bundle) {
      Object.entries(DASTARKHAN).forEach(([id, q]) => { S.cart[id] = Math.max(qty(id), q); });
      refreshCart(); fly(el); toast(t('added_bundle')); return;
    }
    if (d.promo) { S.promo = d.promo; save(); toast(t('promo_ok', { c: d.promo })); render(true); return; }
    if (d.unpromo) { S.promo = null; save(); render(true); return; }
    if (d.clear) { S.cart = {}; refreshCart(); return; }
    if (d.checkout) return checkout();
    if (d.repeat) {
      const o = S.orders.find(x => x.no === +d.repeat);
      Object.entries(o.items).forEach(([id, q]) => { S.cart[id] = qty(id) + q; });
      refreshCart(); toast(t('repeated')); return;
    }
    if (d.rate) { const [no, n] = d.rate.split(':').map(Number); S.orders.find(o => o.no === no).rated = n; save(); render(true); return; }
    if (d.reset) { S = seed(); save(); toast(t('reset_done')); render(); return; }
    if (d.toast) return toast(d.toast);
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'q') { ui.q = e.target.value; $('#grid').innerHTML = gridHTML(); $('#cnt').textContent = plural(filtered().length); }
  });
  document.addEventListener('change', e => {
    const k = e.target.dataset.set;
    if (k) { S[k] = e.target.checked; save(); }
  });
  document.addEventListener('submit', e => {
    if (!e.target.matches('[data-promo-form]')) return;
    e.preventDefault();
    const code = new FormData(e.target).get('code').trim().toUpperCase();
    if (PROMOS[code]) { S.promo = code; save(); toast(t('promo_ok', { c: code })); render(true); }
    else { const f = e.target; f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); toast(t('promo_bad'), IC.x); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ui.sheet) closeSheet(); });
  window.addEventListener('hashchange', route);

  route();
})();
