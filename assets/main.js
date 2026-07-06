/* BeBirdie — shared behavior: nav, overlays, cart, wishlist, search, motion */
(function () {
'use strict';
document.body.classList.remove('no-js');

var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
var isTouch = matchMedia('(hover: none)').matches;
if (reduced) document.body.classList.add('reduced');

/* ================= DATA ================= */
var PRODUCTS = {
  'la-pieve':   { name: 'La Pieve', sub: 'Toskánsko · Itálie', price: 269, img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=70&auto=format&fit=crop', url: 'produkt-la-pieve.html' },
  'i-pecorari': { name: 'I Pecorari', sub: 'Friuli · Itálie', price: 239, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=70&auto=format&fit=crop', url: 'produkt-i-pecorari.html' },
  'casal':      { name: 'Casal da Coelheira 2022', sub: 'Tejo · Portugalsko', price: 220, img: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=70&auto=format&fit=crop', url: 'produkt-casal.html' },
  'poukaz-2000': { name: 'Dárkový poukaz 2 000 Kč', sub: 'Elektronicky i tištěný', price: 2000, img: '', url: 'obchod.html#poukazy' },
  'poukaz-4000': { name: 'Dárkový poukaz 4 000 Kč', sub: 'Elektronicky i tištěný', price: 4000, img: '', url: 'obchod.html#poukazy' },
  'poukaz-6000': { name: 'Dárkový poukaz 6 000 Kč', sub: 'Elektronicky i tištěný', price: 6000, img: '', url: 'obchod.html#poukazy' },
  'poukaz-8000': { name: 'Dárkový poukaz 8 000 Kč', sub: 'Elektronicky i tištěný', price: 8000, img: '', url: 'obchod.html#poukazy' },
  'tabor':      { name: 'Sportovní příměstský tábor', sub: 'Rohanský ostrov · 6–13 let', price: 6900, img: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&q=70&auto=format&fit=crop', url: 'tabory.html' }
};

var SEARCH_INDEX = [
  { t: 'BeBirdie Open Tour — Golf Konopiště', c: 'Akce · 11. 7.', u: 'akce-konopiste.html' },
  { t: 'BeBirdie Open Tour — Golf Pyšely', c: 'Akce · 25. 7.', u: 'akce-pysely.html' },
  { t: 'BeBirdie Open Tour — Golf Mladá Boleslav', c: 'Akce · 1. 8.', u: 'akce-mlada-boleslav.html' },
  { t: 'Prague Golf Card CUP — 3 hřiště za 1 den', c: 'Akce · 5. 8.', u: 'akce-prague-golf-card.html' },
  { t: 'Golf Train Cup — Black Stork', c: 'Akce · 21.–23. 8.', u: 'akce-train-cup.html' },
  { t: 'BeBirdie Open Tour — Golf Černý Most', c: 'Akce · 29. 8.', u: 'akce-cerny-most.html' },
  { t: 'Miss Golf 2026 — Vinoř', c: 'Akce · 5. 9.', u: 'akce-miss-golf.html' },
  { t: 'Lumina Estates Cup — Black Bridge', c: 'Akce · 15. 9.', u: 'akce-lumina.html' },
  { t: 'BeBirdie Open Tour — Golf Zbraslav', c: 'Akce · 26. 9.', u: 'akce-zbraslav.html' },
  { t: 'BeBirdie Texas Cup 2026', c: 'Akce · 7. 10.', u: 'akce-texas-cup.html' },
  { t: 'BeBirdie Open Tour — Golf Beřovice', c: 'Akce · 10. 10.', u: 'akce-berovice.html' },
  { t: 'BeBirdie Tour 2026', c: 'Sezónní členství', u: 'tour.html' },
  { t: 'Kalendář akcí 2026', c: 'Program', u: 'kalendar.html' },
  { t: 'Členství v klubu', c: 'Klub', u: 'klub.html' },
  { t: 'Vzdělávání', c: 'Kurzy', u: 'vzdelavani.html' },
  { t: 'AI kurzy pro lídry', c: 'Kurzy', u: 'ai-kurzy.html' },
  { t: 'La Pieve', c: 'Vinotéka · 269 Kč', u: 'produkt-la-pieve.html' },
  { t: 'I Pecorari', c: 'Vinotéka · 239 Kč', u: 'produkt-i-pecorari.html' },
  { t: 'Casal da Coelheira 2022', c: 'Vinotéka · 220 Kč', u: 'produkt-casal.html' },
  { t: 'Dárkové poukazy', c: 'Obchod', u: 'obchod.html#poukazy' },
  { t: 'Příměstské tábory', c: 'Golf pro děti', u: 'tabory.html' },
  { t: 'Obchod', c: 'Vína · poukazy · tábory', u: 'obchod.html' },
  { t: 'Fotogalerie z turnajů', c: 'Galerie', u: 'galerie.html' },
  { t: 'Partneři klubu', c: 'O nás', u: 'partneri.html' },
  { t: 'O nás', c: 'Klub', u: 'o-nas.html' },
  { t: 'Členská zóna', c: 'Přihlášení', u: 'clenska-zona.html' },
  { t: 'Kontakt', c: 'bebirdie@bebirdie.cz', u: 'kontakt.html' }
];

/* ================= STORAGE ================= */
function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; } }
var cart = load('bb-cart', {});
var wish = load('bb-wish', []);

function cartCount() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k]; }, 0); }
function czk(n) { return n.toLocaleString('cs-CZ') + ' Kč'; }

/* ================= OVERLAY SHELL ================= */
var iconHeart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5c-4.7-3.2-8.5-6.4-8.5-10.2A4.6 4.6 0 0 1 8.1 5.6c1.6 0 3.1.9 3.9 2.3.8-1.4 2.3-2.3 3.9-2.3a4.6 4.6 0 0 1 4.6 4.7c0 3.8-3.8 7-8.5 10.2z"/></svg>';

var overlayHTML =
'<div class="ovl" id="ovlMenu" aria-hidden="true">' +
  '<div class="ovl__bg" data-close></div>' +
  '<div class="menu__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
    '<div class="menu__head">' +
      '<span class="brand"><svg class="brand__icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#bb-logo"/></svg><span class="brand__word">BeBirdie</span></span>' +
      '<button class="ovl__close" data-close aria-label="Zavřít menu">✕</button>' +
    '</div>' +
    '<nav class="menu__body" aria-label="Hlavní menu">' +
      '<ul class="menu__main">' +
        '<li><a href="kalendar.html"><span class="idx">01</span>Kalendář akcí</a></li>' +
        '<li><a href="tour.html"><span class="idx">02</span>Tour 2026</a></li>' +
        '<li><a href="vzdelavani.html"><span class="idx">03</span>Vzdělávání</a></li>' +
        '<li><a href="klub.html"><span class="idx">04</span>Klub &amp; členství</a></li>' +
        '<li><a href="obchod.html"><span class="idx">05</span>Obchod</a></li>' +
      '</ul>' +
      '<div class="menu__aside">' +
        '<h5>Klub</h5>' +
        '<ul><li><a href="o-nas.html">O nás</a></li><li><a href="partneri.html">Partneři</a></li><li><a href="galerie.html">Fotogalerie</a></li><li><a href="tabory.html">Příměstské tábory</a></li><li><a href="kontakt.html">Kontakt</a></li></ul>' +
        '<h5>Váš účet</h5>' +
        '<ul><li><a href="clenska-zona.html">Členská zóna</a></li><li><a href="oblibene.html">Oblíbené</a></li><li><a href="kosik.html">Košík</a></li></ul>' +
      '</div>' +
    '</nav>' +
  '</div>' +
'</div>' +
'<div class="ovl" id="ovlSearch" aria-hidden="true">' +
  '<div class="ovl__bg" data-close></div>' +
  '<div class="search__panel" role="dialog" aria-modal="true" aria-label="Vyhledávání">' +
    '<button class="ovl__close" data-close aria-label="Zavřít vyhledávání">✕</button>' +
    '<div class="search__inner">' +
      '<form class="search__field" id="searchForm">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>' +
        '<input type="search" id="searchInput" placeholder="Hledat akce, kurzy, vína…" aria-label="Hledat" autocomplete="off">' +
      '</form>' +
      '<div class="search__results">' +
        '<p class="search__hint" id="searchHint">Doporučujeme</p>' +
        '<ul class="search__list" id="searchList"></ul>' +
      '</div>' +
    '</div>' +
  '</div>' +
'</div>' +
'<div class="ovl" id="ovlCart" aria-hidden="true">' +
  '<div class="ovl__bg" data-close></div>' +
  '<aside class="cart__panel" role="dialog" aria-modal="true" aria-label="Košík">' +
    '<div class="cart__head"><h2 class="h4">Košík</h2><button class="ovl__close" style="position:static" data-close aria-label="Zavřít košík">✕</button></div>' +
    '<div class="cart__items" id="cartItems"></div>' +
    '<div class="cart__foot" id="cartFoot"></div>' +
  '</aside>' +
'</div>';

var mount = document.createElement('div');
mount.innerHTML = overlayHTML;
while (mount.firstChild) document.body.appendChild(mount.firstChild);

/* open/close */
var lastFocus = null;
function openOvl(id) {
  var o = document.getElementById(id);
  lastFocus = document.activeElement;
  o.classList.add('open'); o.setAttribute('aria-hidden', 'false');
  document.documentElement.style.overflow = 'hidden';
  if (window._lenis) window._lenis.stop();
  var f = o.querySelector('input,button:not([data-close])') || o.querySelector('button');
  if (id === 'ovlSearch') { setTimeout(function () { document.getElementById('searchInput').focus(); }, 350); }
  else if (f) setTimeout(function () { f.focus(); }, 350);
}
function closeOvl() {
  document.querySelectorAll('.ovl.open').forEach(function (o) {
    o.classList.remove('open'); o.setAttribute('aria-hidden', 'true');
  });
  document.documentElement.style.overflow = '';
  if (window._lenis) window._lenis.start();
  if (lastFocus) { lastFocus.focus(); lastFocus = null; }
}
document.addEventListener('click', function (e) {
  if (e.target.closest('[data-close]')) closeOvl();
  var opener = e.target.closest('[data-open]');
  if (opener) { e.preventDefault(); openOvl(opener.getAttribute('data-open')); }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeOvl(); return; }
  if (e.key !== 'Tab') return;
  var open = document.querySelector('.ovl.open');
  if (!open) return;
  var f = open.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!f.length) return;
  var first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ================= CART ================= */
function saveCart() { store('bb-cart', cart); renderBadge(); renderCart(); renderCartPage(); }
function renderBadge() {
  var b = document.getElementById('cartBadge');
  if (!b) return;
  var n = cartCount();
  b.textContent = n; b.classList.toggle('on', n > 0);
}
function cartItemHTML(id) {
  var p = PRODUCTS[id]; if (!p) return '';
  return '<div class="cart__item" data-id="' + id + '">' +
    (p.img ? '<img src="' + p.img + '" alt="">' : '<div style="width:64px;height:80px;background:var(--sand);display:grid;place-items:center;font-family:var(--serif);color:var(--gold-deep)">✦</div>') +
    '<div><a class="n" href="' + p.url + '">' + p.name + '</a><div class="p">' + czk(p.price) + '</div>' +
    '<div class="cart__qty"><button data-qty="-1" aria-label="Snížit množství">−</button><span class="q tnum">' + cart[id] + '</span><button data-qty="1" aria-label="Zvýšit množství">+</button></div></div>' +
    '<button class="cart__rm" data-rm>Odebrat</button></div>';
}
function renderCart() {
  var wrap = document.getElementById('cartItems'), foot = document.getElementById('cartFoot');
  if (!wrap) return;
  var ids = Object.keys(cart);
  if (!ids.length) {
    wrap.innerHTML = '<div class="cart__empty"><h3 class="h4">Váš košík je prázdný</h3><p>Vyberte si z naší vinotéky nebo darujte zážitek.</p></div>';
    foot.innerHTML = '<a class="btn btn--solid" href="obchod.html" style="width:100%"><span class="lbl"><span>Do obchodu</span><span>Do obchodu</span></span></a>';
    return;
  }
  wrap.innerHTML = ids.map(cartItemHTML).join('');
  var total = ids.reduce(function (s, id) { return s + PRODUCTS[id].price * cart[id]; }, 0);
  foot.innerHTML = '<div class="cart__total"><span>Celkem</span><span class="tnum">' + czk(total) + '</span></div>' +
    '<a class="btn btn--solid" href="pokladna.html"><span class="lbl"><span>Pokračovat k objednávce</span><span>Pokračovat k objednávce</span></span></a>' +
    '<a class="link-arrow" href="kosik.html">Zobrazit celý košík <span class="arr">↗</span></a>';
}
document.addEventListener('click', function (e) {
  var add = e.target.closest('[data-add]');
  if (add) {
    e.preventDefault();
    var id = add.getAttribute('data-add');
    cart[id] = (cart[id] || 0) + 1;
    saveCart(); openOvl('ovlCart');
    return;
  }
  var item = e.target.closest('.cart__item');
  if (item) {
    var id2 = item.getAttribute('data-id');
    if (e.target.closest('[data-rm]')) { delete cart[id2]; saveCart(); }
    else if (e.target.closest('[data-qty]')) {
      cart[id2] = Math.max(0, (cart[id2] || 0) + parseInt(e.target.closest('[data-qty]').getAttribute('data-qty'), 10));
      if (!cart[id2]) delete cart[id2];
      saveCart();
    }
  }
});
/* full cart page */
function renderCartPage() {
  var page = document.getElementById('cartPage');
  if (!page) return;
  var ids = Object.keys(cart);
  if (!ids.length) {
    page.innerHTML = '<div class="empty">' +
      '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8zM8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></svg>' +
      '<h2 class="h4">Váš košík je prázdný</h2><p>Vyberte si z naší vinotéky, darujte poukaz nebo přihlaste dítě na tábor.</p>' +
      '<a class="btn btn--ink" href="obchod.html"><span class="lbl"><span>Do obchodu</span><span>Do obchodu</span></span></a></div>';
    return;
  }
  var total = ids.reduce(function (s, id) { return s + PRODUCTS[id].price * cart[id]; }, 0);
  page.innerHTML = '<div style="max-width:44rem">' + ids.map(cartItemHTML).join('') +
    '<div class="cart__total" style="margin-top:1.5rem"><span>Celkem</span><span class="tnum">' + czk(total) + '</span></div>' +
    '<div class="detail__actions"><a class="btn btn--solid" href="pokladna.html"><span class="lbl"><span>Pokračovat k objednávce</span><span>Pokračovat k objednávce</span></span></a>' +
    '<a class="btn btn--ghost" href="obchod.html"><span class="lbl"><span>Zpět do obchodu</span><span>Zpět do obchodu</span></span></a></div></div>';
}
/* checkout summary */
function renderCheckout() {
  var sum = document.getElementById('checkoutSummary');
  if (!sum) return;
  var ids = Object.keys(cart);
  if (!ids.length) { sum.innerHTML = '<p class="muted">Košík je prázdný — <a href="obchod.html" style="text-decoration:underline">vyberte si v obchodě</a>.</p>'; return; }
  var total = ids.reduce(function (s, id) { return s + PRODUCTS[id].price * cart[id]; }, 0);
  sum.innerHTML = '<ul class="detail__facts">' + ids.map(function (id) {
    return '<li><span class="k">' + PRODUCTS[id].name + ' × ' + cart[id] + '</span><span class="v tnum">' + czk(PRODUCTS[id].price * cart[id]) + '</span></li>';
  }).join('') + '<li><span class="k"><b>Celkem</b></span><span class="v tnum">' + czk(total) + '</span></li></ul>';
}

/* ================= WISHLIST ================= */
function renderWishButtons() {
  document.querySelectorAll('[data-wish]').forEach(function (btn) {
    var id = btn.getAttribute('data-wish');
    var on = wish.indexOf(id) > -1;
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (!btn.innerHTML.trim()) btn.innerHTML = iconHeart;
  });
  var wb = document.getElementById('wishBadge');
  if (wb) { wb.textContent = wish.length; wb.classList.toggle('on', wish.length > 0); }
}
document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-wish]');
  if (!btn) return;
  e.preventDefault();
  var id = btn.getAttribute('data-wish');
  var i = wish.indexOf(id);
  if (i > -1) wish.splice(i, 1); else wish.push(id);
  store('bb-wish', wish);
  renderWishButtons(); renderWishPage();
});
function renderWishPage() {
  var page = document.getElementById('wishPage');
  if (!page) return;
  if (!wish.length) {
    page.innerHTML = '<div class="empty">' +
      '<svg viewBox="0 0 24 24"><path d="M12 20.5c-4.7-3.2-8.5-6.4-8.5-10.2A4.6 4.6 0 0 1 8.1 5.6c1.6 0 3.1.9 3.9 2.3.8-1.4 2.3-2.3 3.9-2.3a4.6 4.6 0 0 1 4.6 4.7c0 3.8-3.8 7-8.5 10.2z"/></svg>' +
      '<h2 class="h4">Zatím žádné oblíbené</h2><p>Uložte si vína a zážitky, ke kterým se chcete vrátit — srdíčkem u produktu.</p>' +
      '<a class="btn btn--ink" href="obchod.html"><span class="lbl"><span>Prozkoumat obchod</span><span>Prozkoumat obchod</span></span></a></div>';
    return;
  }
  page.innerHTML = '<div class="wine__grid">' + wish.map(function (id) {
    var p = PRODUCTS[id]; if (!p) return '';
    return '<article class="wine-card">' +
      '<a class="ph" href="' + p.url + '">' + (p.img ? '<img src="' + p.img + '" alt="' + p.name + '">' : '') + '</a>' +
      '<button class="wish on" data-wish="' + id + '" aria-label="Odebrat z oblíbených">' + iconHeart + '</button>' +
      '<h4><a href="' + p.url + '">' + p.name + '</a></h4><p class="origin">' + p.sub + '</p>' +
      '<div class="row"><span class="price tnum">' + czk(p.price) + '</span><a class="add" href="#" data-add="' + id + '">Do košíku →</a></div></article>';
  }).join('') + '</div>';
}

/* ================= SEARCH ================= */
function renderSearch(q) {
  var list = document.getElementById('searchList'), hint = document.getElementById('searchHint');
  if (!list) return;
  q = (q || '').trim().toLowerCase();
  var res = q
    ? SEARCH_INDEX.filter(function (r) { return (r.t + ' ' + r.c).toLowerCase().indexOf(q) > -1; })
    : SEARCH_INDEX.slice(0, 6);
  hint.textContent = q ? (res.length ? 'Výsledky (' + res.length + ')' : 'Nic jsme nenašli') : 'Doporučujeme';
  list.innerHTML = res.map(function (r) {
    return '<li><a href="' + r.u + '"><span class="t">' + r.t + '</span><span class="c">' + r.c + '</span></a></li>';
  }).join('') || '<li class="search__empty">Zkuste „golf", „víno" nebo „AI".</li>';
}
document.addEventListener('input', function (e) { if (e.target.id === 'searchInput') renderSearch(e.target.value); });
document.addEventListener('submit', function (e) {
  if (e.target.id === 'searchForm') { e.preventDefault(); var f = document.querySelector('#searchList a'); if (f) f.click(); }
  if (e.target.matches('[data-form]')) {
    e.preventDefault();
    var form = e.target;
    if (form.hasAttribute('data-clear-cart')) { cart = {}; store('bb-cart', cart); renderBadge(); }
    var ok = form.querySelector('[data-success]') || (form.parentElement && form.parentElement.querySelector('[data-success]'));
    if (ok) {
      if (form.classList.contains('field')) form.style.display = 'none';
      form.querySelectorAll('.form__row,.detail__actions').forEach(function (el) { el.style.display = 'none'; });
      form.querySelectorAll(':scope > button[type="submit"]').forEach(function (el) { el.style.display = 'none'; });
      ok.style.display = 'block'; ok.setAttribute('tabindex', '-1'); ok.focus();
    }
  }
});
renderSearch('');

/* ================= NAV ================= */
var nav = document.getElementById('nav');
function onScrollNav() {
  if (!nav) return;
  var y = window._lenis ? window._lenis.scroll : window.scrollY;
  nav.classList.toggle('nav--solid', y > 60);
}
window.addEventListener('scroll', onScrollNav, { passive: true });

/* ================= MOTION ================= */
if (!reduced && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  if (!isTouch && window.Lenis) {
    var lenis = new Lenis({ lerp: 0.09 });
    window._lenis = lenis;
    lenis.on('scroll', function () { ScrollTrigger.update(); onScrollNav(); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  /* hero intro */
  if (document.getElementById('heroTitle')) {
    fontsReady.then(function () {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('#heroImg', { scale: 1.06 }, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0);
      var title = document.getElementById('heroTitle');
      var split = new SplitType(title, { types: 'lines', lineClass: 'line' });
      split.lines.forEach(function (l) { var inner = document.createElement('span'); inner.className = 'line-inner'; inner.innerHTML = l.innerHTML; l.innerHTML = ''; l.appendChild(inner); });
      tl.to(title.querySelectorAll('.line-inner'), { y: 0, duration: 0.9, stagger: 0.09 }, 0.2);
      tl.fromTo('[data-hero-fade]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.7);
    });
    gsap.to('.hero__media', { yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* generic reveals */
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });
  document.querySelectorAll('.clip-reveal').forEach(function (el) {
    gsap.to(el, { clipPath: 'inset(0 0% 0 0%)', duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 78%', once: true } });
  });

  /* pinned evening (desktop) */
  if (document.getElementById('eveningTrack')) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', function () {
      var track = document.getElementById('eveningTrack');
      var getDist = function () { return track.scrollWidth - window.innerWidth; };
      var tween = gsap.to(track, { x: function () { return -getDist(); }, ease: 'none',
        scrollTrigger: { trigger: '.evening__pin', start: 'top top', pin: true, scrub: 0.8,
          end: function () { return '+=' + getDist(); }, invalidateOnRefresh: true, anticipatePin: 1 } });
      document.querySelectorAll('[data-ghost]').forEach(function (g) {
        gsap.fromTo(g, { xPercent: 12 }, { xPercent: -12, ease: 'none',
          scrollTrigger: { containerAnimation: tween, trigger: g, start: 'left right', end: 'right left', scrub: true } });
      });
      return function () {};
    });
  }

  /* event rows: floating thumb */
  var float = document.getElementById('eventFloat');
  if (float && !isTouch) {
    var fImg = float.querySelector('img');
    var xTo = gsap.quickTo(float, 'x', { duration: 0.45, ease: 'power3.out' });
    var yTo = gsap.quickTo(float, 'y', { duration: 0.45, ease: 'power3.out' });
    var floatVisible = false;
    var showFloat = function () { if (!floatVisible) { floatVisible = true; gsap.to(float, { opacity: 1, duration: 0.3, overwrite: 'auto' }); } };
    var hideFloat = function () { if (floatVisible) { floatVisible = false; gsap.to(float, { opacity: 0, duration: 0.25, overwrite: 'auto' }); } };
    document.querySelectorAll('.event-row[data-img]').forEach(function (row) {
      row.addEventListener('mouseenter', function () { fImg.src = row.dataset.img; showFloat(); });
      row.addEventListener('mouseleave', hideFloat);
      row.addEventListener('mousemove', function (e) { xTo(e.clientX + 24); yTo(e.clientY - 75); showFloat(); });
    });
    window.addEventListener('scroll', hideFloat, { passive: true });
    if (window._lenis) window._lenis.on('scroll', hideFloat);
  }

  /* membership card tilt */
  var card = document.getElementById('mCard');
  if (card && !isTouch) {
    var rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    var ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    var wrap = card.parentElement;
    wrap.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      ry(gsap.utils.clamp(-6, 6, ((e.clientX - r.left) / r.width - 0.5) * 12));
      rx(gsap.utils.clamp(-6, 6, -((e.clientY - r.top) / r.height - 0.5) * 12));
    });
    wrap.addEventListener('mouseleave', function () { rx(0); ry(0); });
    gsap.from(card, { y: 40, rotationY: -8, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
  }

  /* counters */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = +el.dataset.count;
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true,
      onEnter: function () { gsap.fromTo(el, { innerText: 0 }, { innerText: end, duration: 0.6, ease: 'power1.out', snap: { innerText: 1 } }); } });
  });

  /* invite split */
  var inviteTitle = document.getElementById('inviteTitle');
  if (inviteTitle) {
    fontsReady.then(function () {
      var split = new SplitType(inviteTitle, { types: 'lines', lineClass: 'line' });
      split.lines.forEach(function (l) { var inner = document.createElement('span'); inner.className = 'line-inner'; inner.innerHTML = l.innerHTML; l.innerHTML = ''; l.appendChild(inner); });
      gsap.to(inviteTitle.querySelectorAll('.line-inner'), { y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: inviteTitle, start: 'top 80%', once: true } });
    });
  }
} else {
  document.querySelectorAll('[data-reveal],[data-hero-fade]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  document.querySelectorAll('.split-lines').forEach(function (el) { el.classList.remove('split-lines'); });
  document.querySelectorAll('[data-count]').forEach(function (el) { el.innerText = el.dataset.count; });
}
onScrollNav();

/* ================= QUOTES ================= */
var quotes = [
  { t: 'Přišel jsem kvůli golfu. Zůstal jsem kvůli lidem, kteří přemýšlejí stejně velkoryse, jako hrají.', n: 'Martin H.', r: 'zakladatel investiční skupiny', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=70&auto=format&fit=crop' },
  { t: 'Za jeden večer na turnaji jsem potkal víc relevantních partnerů než za rok konferencí.', n: 'Petr K.', r: 'CEO technologické firmy', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70&auto=format&fit=crop' },
  { t: 'Kurz AI mi ušetřil hodiny denně. A na greenu jsem k tomu získal dva nové klienty.', n: 'Jana N.', r: 'zakladatelka fintech startupu', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=70&auto=format&fit=crop' }
];
var qi = 0;
var stage = document.getElementById('voicesStage');
function renderQuote(dir) {
  var swap = function () {
    document.getElementById('quoteText').innerHTML = '<span class="q">„</span>' + quotes[qi].t + '<span class="q">“</span>';
    document.getElementById('quoteName').textContent = quotes[qi].n;
    document.getElementById('quoteRole').textContent = quotes[qi].r;
    var im = document.getElementById('quoteImg'); im.style.display = ''; im.src = quotes[qi].img;
    document.getElementById('qCount').textContent = String(qi + 1).padStart(2, '0') + ' / ' + String(quotes.length).padStart(2, '0');
  };
  if (!reduced && window.gsap) {
    gsap.to(stage, { opacity: 0, x: dir * -24, duration: 0.3, ease: 'power2.in', onComplete: function () {
      swap(); gsap.fromTo(stage, { opacity: 0, x: dir * 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' });
    } });
  } else swap();
}
var qNext = document.getElementById('qNext'), qPrev = document.getElementById('qPrev');
if (qNext) qNext.addEventListener('click', function () { qi = (qi + 1) % quotes.length; renderQuote(1); });
if (qPrev) qPrev.addEventListener('click', function () { qi = (qi - 1 + quotes.length) % quotes.length; renderQuote(-1); });

/* ================= INIT ================= */
renderBadge(); renderCart(); renderCartPage(); renderCheckout(); renderWishButtons(); renderWishPage();
})();
