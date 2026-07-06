/* Generates all BeBirdie subpages from one template. Run: node build.js */
const fs = require('fs');
const path = require('path');

const IMG = {
  aerial: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b',
  tee: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa',
  toast: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
  dinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  table: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
  workshop: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
  meeting: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
  winePour: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
  wineGlasses: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
  wineDark: 'https://images.unsplash.com/photo-1474722883778-792e7990302f'
};
const u = (img, w) => `${img}?w=${w || 1400}&q=75&auto=format&fit=crop`;
/* gold grade for grass-heavy shots — no golf-green aesthetic */
const warm = (img) => (img === IMG.aerial || img === IMG.tee) ? ' class="ph-warm"' : '';

const LOGO_SYMBOL = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="bb-logo" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#BD1218"/>
    <path fill="#fff" d="M22 30A38 38 0 0 1 57 13 30 30 0 0 0 29 44 38 38 0 0 1 22 30Z"/>
    <path fill="#fff" d="M42 30c13-3 25 5 28 16 8 3 17 0 22-6-1 16-13 27-27 28-4 12-16 20-28 19C22 86 12 73 13 59 14 44 27 33 42 30Z"/>
    <circle cx="61" cy="46" r="6.5" fill="#BD1218"/>
  </symbol>
  <symbol id="ic-ig" viewBox="0 0 24 24">
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none"/>
  </symbol>
</svg>`;

const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23BD1218'/%3E%3Cpath fill='%23fff' d='M22 30A38 38 0 0 1 57 13 30 30 0 0 0 29 44 38 38 0 0 1 22 30Z'/%3E%3Cpath fill='%23fff' d='M42 30c13-3 25 5 28 16 8 3 17 0 22-6-1 16-13 27-27 28-4 12-16 20-28 19C22 86 12 73 13 59 14 44 27 33 42 30Z'/%3E%3Ccircle cx='61' cy='46' r='6.5' fill='%23BD1218'/%3E%3C/svg%3E`;

const nav = (dark) => `<header class="nav${dark ? ' nav--dark' : ''}" id="nav">
  <div class="nav__inner">
    <a class="brand${dark ? '' : ' brand--onlight'}" href="index.html" aria-label="BeBirdie — domů">
      <svg class="brand__icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#bb-logo"/></svg>
      <span class="brand__word">BeBirdie</span>
    </a>
    <nav aria-label="Hlavní navigace">
      <ul class="nav__links">
        <li><a href="kalendar.html">Kalendář</a></li>
        <li><a href="tour.html">Tour 2026</a></li>
        <li><a href="vzdelavani.html">Vzdělávání</a></li>
        <li><a href="klub.html">Klub</a></li>
        <li><a href="obchod.html">Obchod</a></li>
      </ul>
    </nav>
    <div class="nav__right">
      <button class="nav__icon nav__icon--search" data-open="ovlSearch" aria-label="Hledat">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>
      </button>
      <a class="nav__icon nav__icon--wish" href="oblibene.html" aria-label="Oblíbené">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5c-4.7-3.2-8.5-6.4-8.5-10.2A4.6 4.6 0 0 1 8.1 5.6c1.6 0 3.1.9 3.9 2.3.8-1.4 2.3-2.3 3.9-2.3a4.6 4.6 0 0 1 4.6 4.7c0 3.8-3.8 7-8.5 10.2z"/></svg>
        <span class="nav__badge" id="wishBadge">0</span>
      </a>
      <a class="nav__icon nav__icon--user" href="clenska-zona.html" aria-label="Členská zóna">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>
      </a>
      <button class="nav__icon" data-open="ovlCart" aria-label="Košík">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8L6 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
        <span class="nav__badge" id="cartBadge">0</span>
      </button>
      <a class="btn btn--solid" href="klub.html"><span class="lbl"><span>Požádat o členství</span><span>Požádat o členství</span></span></a>
      <button class="nav__burger" data-open="ovlMenu" aria-label="Otevřít menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;

const footer = `<footer class="footer" data-theme="ink">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand brand--lg" href="index.html" aria-label="BeBirdie — domů">
          <svg class="brand__icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#bb-logo"/></svg>
          <span class="brand__word">BeBirdie</span>
        </a>
        <p>Propojujeme svět sportu, osobního rozvoje a lifestylu. Buď, kým chceš.</p>
        <div class="contact">
          <a href="mailto:bebirdie@bebirdie.cz">bebirdie@bebirdie.cz</a>
          <a href="tel:+420606790905">+420 606 790 905</a>
        </div>
        <div class="footer__soc">
          <a href="https://www.instagram.com/bebirdie.cz/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><use href="#ic-ig"/></svg></a>
          <a href="https://www.facebook.com/bebirdie.cz" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H7.8V13h2.7v8h3z"/></svg></a>
          <a href="https://www.linkedin.com/company/bebirdie" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M6.5 8.8H3.6V21h2.9V8.8zM5 7.4a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zM21 14.3c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V8.8h-2.9V21h2.9v-6.5c0-1.7.8-2.7 2.2-2.7 1.3 0 2.1.9 2.1 2.7V21H21v-6.7z"/></svg></a>
        </div>
      </div>
      <div>
        <h5>Klub</h5>
        <ul>
          <li><a href="klub.html">Členství</a></li>
          <li><a href="o-nas.html">O nás</a></li>
          <li><a href="partneri.html">Partneři</a></li>
          <li><a href="galerie.html">Fotogalerie</a></li>
          <li><a href="kontakt.html">Kontakt</a></li>
        </ul>
      </div>
      <div>
        <h5>Program</h5>
        <ul>
          <li><a href="kalendar.html">Kalendář akcí</a></li>
          <li><a href="tour.html">Tour 2026</a></li>
          <li><a href="vzdelavani.html">Vzdělávání</a></li>
          <li><a href="ai-kurzy.html">AI kurzy</a></li>
          <li><a href="tabory.html">Tábory pro děti</a></li>
        </ul>
      </div>
      <div>
        <h5>Obchod</h5>
        <ul>
          <li><a href="obchod.html">Vína</a></li>
          <li><a href="obchod.html#poukazy">Dárkové poukazy</a></li>
          <li><a href="oblibene.html">Oblíbené</a></li>
          <li><a href="kosik.html">Košík</a></li>
          <li><a href="clenska-zona.html">Členská zóna</a></li>
        </ul>
      </div>
      <div class="footer__news">
        <h5>Občasník klubu</h5>
        <p>Jednou měsíčně, žádný spam. Jen to, co se chystá.</p>
        <form class="field" data-form>
          <input type="email" placeholder="Váš e-mail" aria-label="Váš e-mail" required>
          <button type="submit">Odeslat →</button>
        </form>
        <div class="form__success" data-success style="display:none;background:transparent;border:none;padding:.6rem 0;text-align:left">
          <p style="color:var(--gold-soft)">Děkujeme. Jste na seznamu.</p>
        </div>
        <p class="footer__consent">Odesláním souhlasíte s <a href="soukromi.html">podmínkami ochrany osobních údajů</a>.</p>
      </div>
    </div>
    <div class="footer__legal">
      <span>© 2026 BeBirdie. Všechna práva vyhrazena.</span>
      <div class="row">
        <a href="podminky.html">Obchodní podmínky</a>
        <a href="soukromi.html">Ochrana osobních údajů</a>
      </div>
    </div>
  </div>
</footer>`;

function page({ file, title, desc, dark, body }) {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | BeBirdie</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#1b1214">
<meta property="og:title" content="${title} | BeBirdie">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="cs_CZ">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,340;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,340&family=Inter:wght@400;500;600;700&family=Quicksand:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="no-js">
<noscript><style>.nav__links{display:flex!important;flex-wrap:wrap}.nav__burger{display:none!important}</style></noscript>
${LOGO_SYMBOL}
<a class="skip-link" href="#main">Přeskočit na obsah</a>
${nav(dark)}
<main id="main">
${body}
</main>
${footer}
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script>
<script src="assets/main.js"></script>
</body>
</html>`;
}

const crumbs = (items) => `<p class="crumbs">${items.map((c, i) =>
  i === items.length - 1 ? `<span>${c[0]}</span>` : `<a href="${c[1]}">${c[0]}</a><span class="sep">/</span>`
).join('')}</p>`;

const hero = ({ kicker, title, lede, crumb, dark }) => `<section class="page-hero${dark ? ' page-hero--ink' : ''}">
  <div class="container">
    ${crumb ? crumbs(crumb) : ''}
    <p class="kicker">${kicker}</p>
    <h1 class="display">${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
  </div>
</section>`;

/* ================= EVENTS ================= */
const EVENTS = [
  { slug: 'konopiste', d: '11/07', m: 'ČERVENEC', dt: '11. 7. 2026', name: 'BeBirdie Open Tour — Golf Konopiště', tag: 'Open Tour', place: 'Golf Konopiště', price: '2 400 Kč', pnote: 'vč. green fee', img: IMG.aerial,
    about: 'Šesté zastavení Open Tour 2026. Osmnáct jamek na jednom z nejkrásnějších hřišť středních Čech, společný oběd v klubovně a vyhlášení výsledků s partnery tour.' },
  { slug: 'pysely', d: '25/07', m: 'ČERVENEC', dt: '25. 7. 2026', name: 'BeBirdie Open Tour — Golf Pyšely', tag: 'Open Tour', place: 'Golf Pyšely', price: '2 400 Kč', pnote: 'vč. green fee', img: IMG.tee,
    about: 'Sedmé kolo Open Tour na technickém hřišti v Pyšelích. Body do celoročního žebříčku, doprovodné soutěže o ceny partnerů a večerní posezení.' },
  { slug: 'mlada-boleslav', d: '01/08', m: 'SRPEN', dt: '1. 8. 2026', name: 'BeBirdie Open Tour — Golf Mladá Boleslav', tag: 'Open Tour', place: 'Golf Mladá Boleslav', price: '2 400 Kč', pnote: 'vč. green fee', img: IMG.aerial,
    about: 'Osmé kolo Open Tour. Rychlé greeny, férové fairwaye a atmosféra, kvůli které se na tour vracíte.' },
  { slug: 'prague-golf-card', d: '05/08', m: 'SRPEN', dt: '5. 8. 2026', name: 'Prague Golf Card CUP — 3 hřiště za 1 den', tag: 'Speciál', place: 'Praha a okolí', price: '3 900 Kč', pnote: 'celodenní roadtrip', img: IMG.tee,
    about: 'Golfový roadtrip: tři hřiště, jeden den, jeden autobus. Devítky na třech pražských hřištích, oběd na cestě a vyhlášení u večeře. Formát, který jinde nezažijete.' },
  { slug: 'train-cup', d: '21/08', m: 'SRPEN', dt: '21.–23. 8. 2026', name: 'Golf Train Cup — Black Stork', tag: 'Zájezd', place: 'Veľká Lomnica · Slovensko', price: 'od 7 900 Kč', pnote: 'vč. ubytování', img: IMG.toast,
    about: 'Víkendový zájezd vlakem z Prahy pod Vysoké Tatry. Dvě turnajová kola na resortu Black Stork, ubytování přímo u hřiště a večery, na které se nezapomíná.' },
  { slug: 'cerny-most', d: '29/08', m: 'SRPEN', dt: '29. 8. 2026', name: 'BeBirdie Open Tour — Golf Černý Most', tag: 'Open Tour', place: 'Golf Černý Most', price: '2 400 Kč', pnote: 'vč. green fee', img: IMG.aerial,
    about: 'Deváté kolo Open Tour v Praze. Ideální turnaj pro první start — přátelská atmosféra a hráči všech úrovní.' },
  { slug: 'miss-golf', d: '05/09', m: 'ZÁŘÍ', dt: '5. 9. 2026', name: 'Miss Golf 2026 — 25. ročník', tag: 'Speciál', place: 'Golf Vinoř', price: '15 000 Kč', pnote: 'flight pro 2 hráče', img: IMG.table,
    about: 'Elegance, krása a golf. Jubilejní 25. ročník legendárního turnaje ve Vinoři — startovné pro dvojici, gala večer a společenský program, který přesahuje sport.' },
  { slug: 'lumina', d: '15/09', m: 'ZÁŘÍ', dt: '15. 9. 2026', name: 'Lumina Estates Cup — Black Bridge', tag: 'Turnaj', place: 'Praha · Black Bridge', price: '5 000 Kč', pnote: 'vč. večerního rautu', img: IMG.dinner,
    about: 'Partnerský turnaj s Lumina Estates na pražském Black Bridge. Osmnáct jamek, večerní raut a networking s lidmi z realit, financí a developmentu.' },
  { slug: 'zbraslav', d: '26/09', m: 'ZÁŘÍ', dt: '26. 9. 2026', name: 'BeBirdie Open Tour — Golf Zbraslav', tag: 'Open Tour', place: 'Golf Zbraslav', price: '2 400 Kč', pnote: 'vč. green fee', img: IMG.tee,
    about: 'Předposlední kolo Open Tour. Poslední šance nasbírat body do žebříčku před říjnovým finále.' },
  { slug: 'texas-cup', d: '07/10', m: 'ŘÍJEN', dt: '7. 10. 2026', name: 'BeBirdie Texas Cup 2026', tag: 'Speciál', place: 'bude upřesněno', price: '1 980 Kč', pnote: 'formát texas scramble', img: IMG.toast,
    about: 'Uvolněný týmový formát texas scramble na závěr sezóny. Hraje se ve čtveřicích — ideální turnaj, na který vezmete kolegy i klienty.' },
  { slug: 'berovice', d: '10/10', m: 'ŘÍJEN', dt: '10. 10. 2026', name: 'BeBirdie Open Tour — Golf Beřovice', tag: 'Open Tour', place: 'Golf Beřovice', price: '2 400 Kč', pnote: 'velké finále', img: IMG.aerial,
    about: 'Velké finále Open Tour 2026. Rozhodne se o celkovém pořadí žebříčku — a večer oslavíme celou sezónu.' }
];

const eventRow = (e) => `<a class="event-row" href="akce-${e.slug}.html" data-img="${u(e.img, 600)}">
  <div class="date tnum">${e.d}<small>${e.m}</small></div>
  <div><div class="ttl">${e.name}</div><div class="meta"><span class="tag">${e.tag}</span><span>${e.place}</span></div></div>
  <div class="price tnum">${e.price}<small>${e.pnote}</small></div>
  <span class="act">Detail akce <span class="arr">→</span></span>
</a>`;

const pages = [];

/* ---- kalendar ---- */
pages.push({
  file: 'kalendar.html', title: 'Kalendář akcí 2026', desc: 'Všechny golfové turnaje, zájezdy a akce BeBirdie v sezóně 2026.',
  body: hero({ kicker: 'Program 2026', title: 'Kalendář akcí', crumb: [['Domů', 'index.html'], ['Kalendář akcí', '']],
    lede: 'Čtrnáct turnajů, zájezdy za golfem i speciální formáty. Vyberte si akci — členové klubu mají přednostní rezervaci.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="event-rows">${EVENTS.map(eventRow).join('\n')}</div>
    <div class="calendar__foot">
      <a class="btn btn--ink" href="tour.html"><span class="lbl"><span>BeBirdie Tour 2026</span><span>BeBirdie Tour 2026</span></span></a>
      <a class="link-arrow" href="klub.html">Členové rezervují přednostně <span class="arr">↗</span></a>
    </div>
  </div></section>
  <div class="event-float" id="eventFloat" aria-hidden="true"><img src="" alt=""></div>`
});

/* ---- event details ---- */
EVENTS.forEach((e) => {
  pages.push({
    file: `akce-${e.slug}.html`, title: e.name, desc: `${e.name} — ${e.dt}, ${e.place}. ${e.pnote}, ${e.price}.`,
    body: hero({ kicker: e.tag, title: e.name, crumb: [['Domů', 'index.html'], ['Kalendář akcí', 'kalendar.html'], [e.name, '']] }) +
    `<section class="page-body" data-theme="ivory"><div class="container">
      <div class="detail">
        <div class="detail__media"><img${warm(e.img)} src="${u(e.img, 1200)}" alt="${e.name}" onerror="this.style.display='none'"></div>
        <div>
          <p class="body-lg" style="max-width:36rem">${e.about}</p>
          <ul class="detail__facts">
            <li><span class="k">Datum</span><span class="v tnum">${e.dt}</span></li>
            <li><span class="k">Místo</span><span class="v">${e.place}</span></li>
            <li><span class="k">Formát</span><span class="v">${e.tag === 'Zájezd' ? 'Vícedenní zájezd' : '18 jamek · stableford'}</span></li>
            <li><span class="k">Kapacita</span><span class="v">omezená — rozhoduje pořadí přihlášek</span></li>
          </ul>
          <div class="detail__price tnum">${e.price} <small>${e.pnote}</small></div>
          <form class="form" data-form id="rezervace">
            <div class="form__row"><label for="rn">Jméno a příjmení</label><input id="rn" type="text" required autocomplete="name"></div>
            <div class="form__row"><label for="re">E-mail</label><input id="re" type="email" required autocomplete="email"></div>
            <div class="form__row"><label for="rp">Počet hráčů</label><select id="rp"><option>1</option><option>2</option><option>3</option><option>4</option></select></div>
            <div class="detail__actions">
              <button class="btn btn--solid" type="submit"><span class="lbl"><span>Rezervovat místo</span><span>Rezervovat místo</span></span></button>
              <a class="btn btn--ghost" href="kalendar.html"><span class="lbl"><span>Zpět na kalendář</span><span>Zpět na kalendář</span></span></a>
            </div>
            <div class="form__success" data-success style="display:none;margin-top:1.5rem">
              <h2 class="h4">Rezervaci jsme přijali</h2>
              <p>Do 24 hodin vám na e-mail pošleme potvrzení a platební údaje. Těšíme se na hřišti.</p>
            </div>
          </form>
        </div>
      </div>
    </div></section>`
  });
});

/* ---- tour ---- */
pages.push({
  file: 'tour.html', title: 'BeBirdie Tour 2026', desc: 'Celoroční prémiová golfová série BeBirdie Tour 2026. Vyprodáno — zapište se na čekací listinu.',
  dark: true,
  body: hero({ dark: true, kicker: 'Sezónní členství', title: 'BeBirdie Tour 2026', crumb: [['Domů', 'index.html'], ['Tour 2026', '']],
    lede: 'Celoroční série pro uzavřenou skupinu hráčů. Nejlepší hřiště, nejlepší lidé, celý rok.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img class="ph-warm" src="${u(IMG.aerial, 1200)}" alt="BeBirdie Tour" onerror="this.style.display='none'"></div>
      <div>
        <span class="badge-soldout">Vyprodáno</span>
        <p class="body-lg" style="max-width:36rem">Deset turnajových kol na nejlepších hřištích Česka, uzavřená startovní listina, celoroční žebříček a závěrečné gala. Tour je místem, kde se ze spoluhráčů stávají partneři.</p>
        <ul class="detail__facts">
          <li><span class="k">Formát</span><span class="v">celoroční série · 10 kol</span></li>
          <li><span class="k">Sezóna</span><span class="v tnum">duben — říjen 2026</span></li>
          <li><span class="k">Součást ceny</span><span class="v">green fee, catering, gala večer</span></li>
          <li><span class="k">Stav</span><span class="v" style="color:var(--burgundy)">vyprodáno</span></li>
        </ul>
        <div class="detail__price tnum">133 000 Kč <small>za sezónu</small></div>
        <form class="form" data-form>
          <div class="form__row"><label for="we">E-mail</label><input id="we" type="email" required autocomplete="email"></div>
          <div class="detail__actions">
            <button class="btn btn--burgundy" type="submit"><span class="lbl"><span>Zapsat na čekací listinu</span><span>Zapsat na čekací listinu</span></span></button>
            <a class="btn btn--ghost" href="kalendar.html"><span class="lbl"><span>Otevřené turnaje</span><span>Otevřené turnaje</span></span></a>
          </div>
          <div class="form__success" data-success style="display:none;margin-top:1.5rem">
            <h2 class="h4">Jste na čekací listině</h2>
            <p>Jakmile se uvolní místo, ozveme se vám jako prvním. Mezitím vás rádi uvidíme na Open Tour.</p>
          </div>
        </form>
      </div>
    </div>
  </div></section>`
});

/* ---- vzdelavani ---- */
pages.push({
  file: 'vzdelavani.html', title: 'Vzdělávání', desc: 'Praktické kurzy AI a digitálního marketingu pro podnikatele a lídry.',
  body: hero({ kicker: 'Vzdělávání', title: 'Rostěte rychleji než konkurence', crumb: [['Domů', 'index.html'], ['Vzdělávání', '']],
    lede: 'Posouváme vás v kariéře skrze praktické kurzy — od umělé inteligence po digitální marketing. Vedou je lektoři z praxe, ne z prezentací.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="edu__grid" style="margin-bottom:var(--space-xl)">
      <article class="edu-card">
        <img src="${u(IMG.workshop)}" alt="AI workshop pro lídry" onerror="this.style.display='none'">
        <span class="tag">AI kurz</span>
        <h3 class="h3">AI pro byznys lídry</h3>
        <p>Naučte se delegovat na umělou inteligenci. Konkrétní nástroje a postupy, které v pondělí nasadíte ve firmě.</p>
        <div class="meta"><span><b>1 den</b> intenzivně</span><span><b>max 12</b> účastníků</span><span><b>Praha</b></span></div>
        <a class="link-arrow" href="ai-kurzy.html">Detail kurzu <span class="arr">↗</span></a>
      </article>
      <article class="edu-card">
        <img src="${u(IMG.meeting)}" alt="Workshop digitálního marketingu" onerror="this.style.display='none'">
        <span class="tag">Kurz</span>
        <h3 class="h3">Digitální marketing prakticky</h3>
        <p>Od strategie po kampaně, které skutečně prodávají. Pro majitele firem, kteří chtějí marketingu rozumět, ne ho jen platit.</p>
        <div class="meta"><span><b>2 odpoledne</b></span><span><b>naživo</b> i online</span><span><b>Praha</b></span></div>
        <a class="link-arrow" href="kontakt.html">Rezervovat termín <span class="arr">↗</span></a>
      </article>
    </div>
    <div class="prose">
      <h2>Proč se vzdělávat s BeBirdie</h2>
      <p><strong>Malé skupiny, žádná teorie navíc.</strong> Naše kurzy vedou lektoři, kteří technologie a marketing denně používají ve vlastních firmách. Odcházíte s postupy, ne s certifikátem do šuplíku.</p>
      <p>Kurzy jsou součástí klubového ekosystému — potkáte na nich stejné lidi jako na greenu. <a href="klub.html" style="text-decoration:underline">Členové klubu</a> mají zvýhodněné ceny a přednostní rezervaci termínů.</p>
    </div>
  </div></section>`
});

/* ---- ai kurzy ---- */
pages.push({
  file: 'ai-kurzy.html', title: 'AI pro byznys lídry', desc: 'Jednodenní intenzivní kurz umělé inteligence pro majitele firem a lídry. Praha, max 12 účastníků.',
  body: hero({ kicker: 'AI kurz', title: 'AI pro byznys lídry', crumb: [['Domů', 'index.html'], ['Vzdělávání', 'vzdelavani.html'], ['AI pro byznys lídry', '']],
    lede: 'Jeden den, který změní způsob, jakým vedete firmu. Naučte se delegovat na umělou inteligenci.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(IMG.workshop, 1200)}" alt="AI kurz pro lídry" onerror="this.style.display='none'"></div>
      <div>
        <p class="body-lg" style="max-width:36rem">Žádné slidy o budoucnosti. Celý den pracujete na vlastních firemních úlohách — od přípravy nabídek přes analýzu dat po automatizaci porad. Odpoledne odcházíte s funkčními postupy.</p>
        <ul class="detail__facts">
          <li><span class="k">Délka</span><span class="v">1 den · 9:00–17:00</span></li>
          <li><span class="k">Skupina</span><span class="v">max 12 účastníků</span></li>
          <li><span class="k">Místo</span><span class="v">Praha</span></li>
          <li><span class="k">Nejbližší termíny</span><span class="v tnum">18. 9. · 16. 10. · 13. 11. 2026</span></li>
        </ul>
        <div class="detail__price tnum">od 12 000 Kč <small>členové klubu −20 %</small></div>
        <form class="form" data-form>
          <div class="form__row"><label for="an">Jméno a příjmení</label><input id="an" type="text" required autocomplete="name"></div>
          <div class="form__row"><label for="ae">E-mail</label><input id="ae" type="email" required autocomplete="email"></div>
          <div class="form__row"><label for="at">Preferovaný termín</label><select id="at"><option>18. 9. 2026</option><option>16. 10. 2026</option><option>13. 11. 2026</option></select></div>
          <div class="detail__actions">
            <button class="btn btn--solid" type="submit"><span class="lbl"><span>Rezervovat místo</span><span>Rezervovat místo</span></span></button>
            <a class="btn btn--ghost" href="vzdelavani.html"><span class="lbl"><span>Všechny kurzy</span><span>Všechny kurzy</span></span></a>
          </div>
          <div class="form__success" data-success style="display:none;margin-top:1.5rem">
            <h2 class="h4">Rezervaci jsme přijali</h2>
            <p>Do 24 hodin vám pošleme potvrzení termínu a podklady ke kurzu.</p>
          </div>
        </form>
      </div>
    </div>
  </div></section>`
});

/* ---- klub ---- */
pages.push({
  file: 'klub.html', title: 'Klub & členství', desc: 'Členství v klubu BeBirdie — přednostní rezervace, uzavřené akce a síť podnikatelů.',
  dark: true,
  body: hero({ dark: true, kicker: 'Klub & členství', title: 'Klub, do kterého se nevstupuje. Do kterého jste přijati.', crumb: [['Domů', 'index.html'], ['Klub', '']],
    lede: 'Členství není vstupenka. Je to místo v komunitě, kde rostete obchodně i lidsky.' }) +
  `<section class="membership" data-theme="ink" style="padding-top:0"><div class="container">
    <div class="membership__grid">
      <div class="membership__text">
        <ul class="benefits">
          <li><span class="n">I.</span> Přednostní rezervace turnajů a zájezdů</li>
          <li><span class="n">II.</span> Uzavřené večery a degustace pouze pro členy</li>
          <li><span class="n">III.</span> Síť podnikatelů, investorů a partnerů klubu</li>
          <li><span class="n">IV.</span> Členské ceny na kurzy, vína i poukazy</li>
          <li><span class="n">V.</span> Osobní concierge pro golf, víno i vzdělávání</li>
        </ul>
      </div>
      <div class="membership__card-wrap">
        <div class="m-card" id="mCard">
          <div class="top">
            <span class="brand"><svg class="brand__icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#bb-logo"/></svg><span class="brand__word">BeBirdie</span></span>
            <span class="tier">Founding member</span>
          </div>
          <span class="serial tnum">Nº 041</span>
          <div class="bottom"><span>Členství 2026</span><span>Praha · CZ</span></div>
        </div>
      </div>
    </div>
  </div></section>
  <section class="page-body" data-theme="ivory"><div class="container">
    <h2 class="h3" style="margin-bottom:var(--space-md)">Požádat o členství</h2>
    <p class="muted" style="max-width:38rem;margin-bottom:var(--space-md)">Žádosti posuzujeme individuálně — záleží nám na tom, kdo u stolu sedí. Ozveme se vám do 48 hodin.</p>
    <form class="form" data-form>
      <div class="form__row"><label for="mn">Jméno a příjmení</label><input id="mn" type="text" required autocomplete="name"></div>
      <div class="form__row"><label for="me">E-mail</label><input id="me" type="email" required autocomplete="email"></div>
      <div class="form__row"><label for="mf">Firma / role</label><input id="mf" type="text" required autocomplete="organization"></div>
      <div class="form__row"><label for="mm">Proč chcete být členem?</label><textarea id="mm" required></textarea></div>
      <button class="btn btn--solid" type="submit"><span class="lbl"><span>Odeslat žádost</span><span>Odeslat žádost</span></span></button>
      <div class="form__success" data-success style="display:none;margin-top:1.5rem">
        <h2 class="h4">Žádost jsme přijali</h2>
        <p>Děkujeme za důvěru. Ozveme se vám do 48 hodin — a možná se brzy potkáme na prvním odpališti.</p>
      </div>
    </form>
  </div></section>`
});

/* ---- obchod ---- */
const voucher = (id, val) => `<article class="wine-card">
  <div class="ph" style="display:grid;place-items:center;background:linear-gradient(135deg,var(--sand),var(--ivory-2))">
    <div style="text-align:center">
      <svg width="44" height="44" viewBox="0 0 100 100" style="margin:0 auto .8rem" aria-hidden="true"><use href="#bb-logo"/></svg>
      <div class="tnum" style="font-family:var(--serif);font-weight:300;font-size:2rem">${val.toLocaleString('cs-CZ')} Kč</div>
    </div>
  </div>
  <button class="wish" data-wish="${id}" aria-label="Přidat poukaz do oblíbených"></button>
  <h4>Dárkový poukaz ${val.toLocaleString('cs-CZ')} Kč</h4>
  <p class="origin">Elektronicky i tištěný</p>
  <div class="row"><span class="price tnum">${val.toLocaleString('cs-CZ')} Kč</span><a class="add" href="obchod.html#poukazy" data-add="${id}">Do košíku →</a></div>
</article>`;

pages.push({
  file: 'obchod.html', title: 'Obchod', desc: 'Kurátorovaná vinotéka, dárkové poukazy a golfové tábory BeBirdie.',
  body: hero({ kicker: 'Obchod', title: 'Vinotéka & dárky', crumb: [['Domů', 'index.html'], ['Obchod', '']],
    lede: 'Vína, za kterými si stojíme, poukazy, které potěší, a tábory, na které děti vzpomínají.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <p class="kicker" id="vino" style="margin-bottom:var(--space-md)">Výběr sommeliera</p>
    <div class="wine__grid" style="margin-bottom:var(--space-2xl)">
      <article class="wine-card">
        <a class="ph" href="produkt-la-pieve.html"><img src="${u(IMG.winePour, 900)}" alt="Víno La Pieve" onerror="this.style.display='none'"></a>
        <button class="wish" data-wish="la-pieve" aria-label="Přidat La Pieve do oblíbených"></button>
        <h4><a href="produkt-la-pieve.html">La Pieve</a></h4>
        <p class="origin">Toskánsko · Itálie</p>
        <p class="note">Sangiovese s tichým, přesným finišem — víno na dlouhé rozhovory.</p>
        <div class="row"><span class="price tnum">269 Kč</span><a class="add" href="produkt-la-pieve.html" data-add="la-pieve">Do košíku →</a></div>
      </article>
      <article class="wine-card">
        <a class="ph" href="produkt-i-pecorari.html"><img src="${u(IMG.wineGlasses, 900)}" alt="Víno I Pecorari" onerror="this.style.display='none'"></a>
        <button class="wish" data-wish="i-pecorari" aria-label="Přidat I Pecorari do oblíbených"></button>
        <h4><a href="produkt-i-pecorari.html">I Pecorari</a></h4>
        <p class="origin">Friuli · Itálie</p>
        <p class="note">Svěží, minerální, sebevědomé. Láhev, kterou otevíráte pro hosty.</p>
        <div class="row"><span class="price tnum">239 Kč</span><a class="add" href="produkt-i-pecorari.html" data-add="i-pecorari">Do košíku →</a></div>
      </article>
      <article class="wine-card">
        <a class="ph" href="produkt-casal.html"><img src="${u(IMG.wineDark, 900)}" alt="Víno Casal da Coelheira" onerror="this.style.display='none'"></a>
        <button class="wish" data-wish="casal" aria-label="Přidat Casal do oblíbených"></button>
        <span class="badge">Červené</span>
        <h4><a href="produkt-casal.html">Casal da Coelheira 2022</a></h4>
        <p class="origin">Tejo · Portugalsko</p>
        <p class="note">Plné, hřejivé, s dlouhým závěrem. K večeru u krbu i k jednání.</p>
        <div class="row"><span class="price tnum">220 Kč</span><a class="add" href="produkt-casal.html" data-add="casal">Do košíku →</a></div>
      </article>
    </div>
    <p class="kicker" id="poukazy" style="margin-bottom:var(--space-md)">Dárkové poukazy</p>
    <p class="muted" style="max-width:38rem;margin-bottom:var(--space-md)">Darujte zážitek — poukaz lze uplatnit na turnaje, kurzy i vína. Platí 12 měsíců.</p>
    <div class="wine__grid wine__grid--4" style="margin-bottom:var(--space-2xl)">
      ${voucher('poukaz-2000', 2000)}${voucher('poukaz-4000', 4000)}${voucher('poukaz-6000', 6000)}${voucher('poukaz-8000', 8000)}
    </div>
    <p class="kicker" id="tabory" style="margin-bottom:var(--space-md)">Pro děti</p>
    <div class="spread">
      <div class="spread__media"><img class="ph-warm" src="${u(IMG.aerial)}" alt="Golfový tábor pro děti" onerror="this.style.display='none'"></div>
      <div class="spread__body">
        <span class="spread__num">Léto 2026</span>
        <h3 class="h3">Sportovní příměstský tábor</h3>
        <p>All-inclusive program pro děti 6–13 let na Rohanském ostrově. Golf s trenéry PGA a sport, který baví.</p>
        <a class="link-arrow" href="tabory.html">Detail tábora <span class="arr">↗</span></a>
      </div>
    </div>
  </div></section>`
});

/* ---- products ---- */
const productPage = (slug, name, origin, price, img, notes, facts) => ({
  file: `produkt-${slug}.html`, title: name, desc: `${name} — ${origin}. ${price} Kč v klubové vinotéce BeBirdie.`,
  body: hero({ kicker: 'Vinotéka', title: name, crumb: [['Domů', 'index.html'], ['Obchod', 'obchod.html'], [name, '']] }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(img, 1200)}" alt="${name}" onerror="this.style.display='none'"></div>
      <div>
        <p class="origin" style="font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--t-mut-l);font-weight:600;margin-bottom:1rem">${origin}</p>
        <p class="body-lg" style="max-width:34rem;font-family:var(--serif);font-style:italic">${notes}</p>
        <ul class="detail__facts">${facts.map(f => `<li><span class="k">${f[0]}</span><span class="v">${f[1]}</span></li>`).join('')}</ul>
        <div class="detail__price tnum">${price} Kč <small>vč. DPH · 0,75 l</small></div>
        <div class="detail__actions">
          <button class="btn btn--solid" data-add="${slug}"><span class="lbl"><span>Do košíku</span><span>Do košíku</span></span></button>
          <button class="btn btn--ghost" data-wish="${slug}" style="gap:.6rem"><span class="lbl"><span>Do oblíbených</span><span>Do oblíbených</span></span></button>
        </div>
        <p class="muted" style="margin-top:var(--space-md);font-size:.88rem">Osobní odběr v Praze zdarma · doručení po ČR do 3 pracovních dnů.</p>
      </div>
    </div>
  </div></section>`
});
pages.push(productPage('la-pieve', 'La Pieve', 'Toskánsko · Itálie', '269', IMG.winePour,
  'Sangiovese s tichým, přesným finišem. Červené ovoce, jemné taniny a závěr, který nechává prostor rozhovoru.',
  [['Odrůda', 'Sangiovese'], ['Barva', 'červené · suché'], ['Servírovat', '16–18 °C'], ['Snoubení', 'hovězí, zrající sýry']]));
pages.push(productPage('i-pecorari', 'I Pecorari', 'Friuli · Itálie', '239', IMG.wineGlasses,
  'Svěží, minerální bílé z Friuli. Citrusy, bílé květy a čistý závěr — láhev, kterou otevíráte pro hosty.',
  [['Odrůda', 'Pinot Grigio'], ['Barva', 'bílé · suché'], ['Servírovat', '8–10 °C'], ['Snoubení', 'ryby, předkrmy']]));
pages.push(productPage('casal', 'Casal da Coelheira 2022', 'Tejo · Portugalsko', '220', IMG.wineDark,
  'Plné, hřejivé červené z údolí Tejo. Zralé ovoce, jemné koření a dlouhý závěr — k večeru u krbu i k jednání.',
  [['Odrůda', 'cuvée · Touriga Nacional'], ['Ročník', '2022'], ['Servírovat', '16–18 °C'], ['Snoubení', 'grilované maso, tmavá čokoláda']]));

/* ---- tabory ---- */
pages.push({
  file: 'tabory.html', title: 'Příměstské tábory', desc: 'Sportovní příměstský tábor BeBirdie pro děti 6–13 let. Golf s trenéry PGA na Rohanském ostrově.',
  body: hero({ kicker: 'Pro děti · léto 2026', title: 'Sportovní příměstský tábor', crumb: [['Domů', 'index.html'], ['Obchod', 'obchod.html'], ['Tábory', '']],
    lede: 'All-inclusive týden, po kterém bude vaše dítě mluvit jen o golfu.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img class="ph-warm" src="${u(IMG.aerial, 1200)}" alt="Golfový tábor" onerror="this.style.display='none'"></div>
      <div>
        <p class="body-lg" style="max-width:36rem">Dopoledne golf s trenéry PGA, odpoledne sport a hry. Program kombinuje trénink se zábavou tak, aby děti sportovaly celý den — a večer měly co vyprávět.</p>
        <ul class="detail__facts">
          <li><span class="k">Věk</span><span class="v tnum">6–13 let</span></li>
          <li><span class="k">Místo</span><span class="v">Rohanský ostrov · Praha</span></li>
          <li><span class="k">Program</span><span class="v">all-inclusive · golf + sport</span></li>
          <li><span class="k">Trenéři</span><span class="v">PGA professional</span></li>
        </ul>
        <div class="detail__price tnum">6 900 Kč <small>za turnus · vč. obědů</small></div>
        <div class="detail__actions">
          <button class="btn btn--solid" data-add="tabor"><span class="lbl"><span>Rezervovat turnus</span><span>Rezervovat turnus</span></span></button>
          <a class="btn btn--ghost" href="kontakt.html"><span class="lbl"><span>Zeptat se na termíny</span><span>Zeptat se na termíny</span></span></a>
        </div>
      </div>
    </div>
  </div></section>`
});

/* ---- o nas ---- */
pages.push({
  file: 'o-nas.html', title: 'O nás', desc: 'BeBirdie propojuje svět sportu, osobního rozvoje a lifestylu. Poznejte náš příběh.',
  body: hero({ kicker: 'O nás', title: 'Buď, kým chceš.', crumb: [['Domů', 'index.html'], ['O nás', '']],
    lede: 'Náš slogan není fráze. Je to pozvánka do komunity, kde rostete obchodně i lidsky.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="prose">
      <p><strong>Propojujeme svět sportu, osobního rozvoje a lifestylu.</strong> Jsme vaše brána ke golfovým turnajům a exkluzivním zájezdům za golfem — a zároveň vás posouváme v kariéře skrze praktické vzdělávací kurzy, od umělé inteligence po digitální marketing.</p>
      <p>BeBirdie vznikl z jednoduchého pozorování: nejcennější obchodní vztahy nevznikají na konferencích, ale při společném zážitku. Na greenu, u sklenky vína, na cestách. Proto stavíme klub, kde se tyto tři světy potkávají.</p>
      <h2>Náš tým a lektoři</h2>
      <p>Turnaje organizují lidé, kteří golf hrají celý život. Kurzy vedou lektoři z praxe — podnikatelé a specialisté, kteří technologie denně používají ve vlastních firmách. A vína vybírá sommelier, který ochutnal víc láhví, než je zdrávo.</p>
    </div>
    <div class="stats" style="margin-top:var(--space-xl);justify-content:flex-start">
      <div class="stat"><div class="v tnum" style="color:var(--gold-deep)">14<sup style="color:var(--t-mut-l)">+</sup></div><div class="l" style="color:var(--t-mut-l)">turnajů ročně</div></div>
      <div class="stat"><div class="v tnum" style="color:var(--gold-deep)">10</div><div class="l" style="color:var(--t-mut-l)">hřišť Open Tour</div></div>
      <div class="stat"><div class="v tnum" style="color:var(--gold-deep)">25.</div><div class="l" style="color:var(--t-mut-l)">ročník Miss Golf</div></div>
    </div>
    <div class="detail__actions" style="margin-top:var(--space-xl)">
      <a class="btn btn--ink" href="klub.html"><span class="lbl"><span>Požádat o členství</span><span>Požádat o členství</span></span></a>
      <a class="link-arrow" href="partneri.html">Naši partneři <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- partneri ---- */
pages.push({
  file: 'partneri.html', title: 'Partneři', desc: 'Partneři klubu BeBirdie — hřiště, resorty a značky, se kterými tvoříme sezónu.',
  body: hero({ kicker: 'Partneři', title: 'Značky, se kterými hrajeme', crumb: [['Domů', 'index.html'], ['Partneři', '']],
    lede: 'Sezónu 2026 tvoříme společně s hřišti, resorty a partnery, kteří sdílejí náš vkus.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="partners-grid" style="margin-bottom:var(--space-xl)">
      <div>PXG</div><div>Prague Golf Card</div><div>Lumina Estates</div><div>Black Stork Resort</div>
      <div>Golf Konopiště</div><div>Ypsilon Golf Liberec</div><div>Golf Vinoř</div><div>Golf Black Bridge</div>
    </div>
    <div class="prose">
      <h2>Staňte se partnerem</h2>
      <p>Partnerství s BeBirdie znamená rok kontaktu s komunitou podnikatelů a lídrů — na turnajích, kurzech i klubových večerech. Rádi vám připravíme nabídku na míru.</p>
    </div>
    <div class="detail__actions" style="margin-top:var(--space-md)">
      <a class="btn btn--ink" href="kontakt.html"><span class="lbl"><span>Domluvit partnerství</span><span>Domluvit partnerství</span></span></a>
    </div>
  </div></section>`
});

/* ---- galerie ---- */
const gal = [IMG.aerial, IMG.toast, IMG.tee, IMG.table, IMG.workshop, IMG.dinner, IMG.wineGlasses, IMG.meeting, IMG.winePour];
pages.push({
  file: 'galerie.html', title: 'Fotogalerie', desc: 'Fotogalerie z turnajů a akcí BeBirdie.',
  body: hero({ kicker: 'Fotogalerie', title: 'Z turnajů a akcí', crumb: [['Domů', 'index.html'], ['Fotogalerie', '']],
    lede: 'Momenty, kvůli kterým to děláme. Kompletní alba najdete na našem Instagramu.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="g-grid" style="margin-bottom:var(--space-xl)">
      ${gal.map((g, i) => `<a href="https://www.instagram.com/bebirdie.cz/" target="_blank" rel="noopener" aria-label="Otevřít album na Instagramu"><img${warm(g)} src="${u(g, 900)}" alt="Fotografie z akce BeBirdie ${i + 1}" loading="lazy" onerror="this.style.display='none'"></a>`).join('\n')}
    </div>
    <div class="detail__actions">
      <a class="btn btn--ink" href="https://www.instagram.com/bebirdie.cz/" target="_blank" rel="noopener"><span class="lbl"><span>Sledovat @bebirdie.cz</span><span>Sledovat @bebirdie.cz</span></span></a>
      <a class="link-arrow" href="index.html#komunita">Ze života klubu <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- kontakt ---- */
pages.push({
  file: 'kontakt.html', title: 'Kontakt', desc: 'Kontaktujte klub BeBirdie — bebirdie@bebirdie.cz, +420 606 790 905.',
  body: hero({ kicker: 'Kontakt', title: 'Napište nám', crumb: [['Domů', 'index.html'], ['Kontakt', '']],
    lede: 'Ozveme se do 24 hodin. Ať jde o turnaj, kurz, víno nebo partnerství.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div>
        <form class="form" data-form>
          <div class="form__row"><label for="kn">Jméno a příjmení</label><input id="kn" type="text" required autocomplete="name"></div>
          <div class="form__row"><label for="ke">E-mail</label><input id="ke" type="email" required autocomplete="email"></div>
          <div class="form__row"><label for="km">Zpráva</label><textarea id="km" required></textarea></div>
          <button class="btn btn--solid" type="submit"><span class="lbl"><span>Odeslat zprávu</span><span>Odeslat zprávu</span></span></button>
          <div class="form__success" data-success style="display:none;margin-top:1.5rem">
            <h2 class="h4">Zprávu jsme přijali</h2>
            <p>Děkujeme — ozveme se vám do 24 hodin.</p>
          </div>
        </form>
      </div>
      <div>
        <ul class="detail__facts" style="margin-top:0">
          <li><span class="k">E-mail</span><span class="v"><a href="mailto:bebirdie@bebirdie.cz" style="text-decoration:underline">bebirdie@bebirdie.cz</a></span></li>
          <li><span class="k">Telefon</span><span class="v"><a href="tel:+420606790905" style="text-decoration:underline">+420 606 790 905</a></span></li>
          <li><span class="k">Působíme</span><span class="v">Praha & střední Čechy</span></li>
          <li><span class="k">Sociální sítě</span><span class="v"><a href="https://www.instagram.com/bebirdie.cz/" target="_blank" rel="noopener" style="text-decoration:underline">@bebirdie.cz</a></span></li>
        </ul>
        <p class="muted" style="font-size:.9rem">Zajímá vás členství? Nejrychlejší cesta je <a href="klub.html" style="text-decoration:underline">žádost o členství</a>.</p>
      </div>
    </div>
  </div></section>`
});

/* ---- clenska zona ---- */
pages.push({
  file: 'clenska-zona.html', title: 'Členská zóna', desc: 'Přihlášení do členské zóny klubu BeBirdie.',
  dark: true,
  body: hero({ dark: true, kicker: 'Členská zóna', title: 'Vítejte zpět', crumb: [['Domů', 'index.html'], ['Členská zóna', '']],
    lede: 'Rezervace, žebříček tour a klubové výhody na jednom místě.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div>
        <form class="form" data-form>
          <div class="form__row"><label for="le">Členský e-mail</label><input id="le" type="email" required autocomplete="email"></div>
          <button class="btn btn--solid" type="submit"><span class="lbl"><span>Poslat přihlašovací odkaz</span><span>Poslat přihlašovací odkaz</span></span></button>
          <div class="form__success" data-success style="display:none;margin-top:1.5rem">
            <h2 class="h4">Odkaz je na cestě</h2>
            <p>Pokud je e-mail registrovaný, najdete v něm přihlašovací odkaz. Platí 15 minut.</p>
          </div>
        </form>
        <p class="muted" style="margin-top:var(--space-md);font-size:.9rem">Přihlašujeme bez hesel — pošleme vám jednorázový odkaz.</p>
      </div>
      <div>
        <h2 class="h4" style="margin-bottom:1rem">Ještě nejste členem?</h2>
        <p class="muted" style="margin-bottom:var(--space-md)">Členství přináší přednostní rezervace, uzavřené akce a síť lidí, které jinde nepotkáte.</p>
        <a class="btn btn--ink" href="klub.html"><span class="lbl"><span>Požádat o členství</span><span>Požádat o členství</span></span></a>
      </div>
    </div>
  </div></section>`
});

/* ---- oblibene / kosik / pokladna ---- */
pages.push({
  file: 'oblibene.html', title: 'Oblíbené', desc: 'Vaše oblíbené produkty a zážitky BeBirdie.',
  body: hero({ kicker: 'Váš výběr', title: 'Oblíbené', crumb: [['Domů', 'index.html'], ['Oblíbené', '']] }) +
  `<section class="page-body" data-theme="ivory"><div class="container"><div id="wishPage"></div></div></section>`
});
pages.push({
  file: 'kosik.html', title: 'Košík', desc: 'Váš nákupní košík BeBirdie.',
  body: hero({ kicker: 'Objednávka', title: 'Košík', crumb: [['Domů', 'index.html'], ['Košík', '']] }) +
  `<section class="page-body" data-theme="ivory"><div class="container"><div id="cartPage"></div></div></section>`
});
pages.push({
  file: 'pokladna.html', title: 'Pokladna', desc: 'Dokončení objednávky BeBirdie.',
  body: hero({ kicker: 'Objednávka', title: 'Pokladna', crumb: [['Domů', 'index.html'], ['Košík', 'kosik.html'], ['Pokladna', '']] }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div>
        <form class="form" data-form data-clear-cart>
          <div class="form__row"><label for="on">Jméno a příjmení</label><input id="on" type="text" required autocomplete="name"></div>
          <div class="form__row"><label for="oe">E-mail</label><input id="oe" type="email" required autocomplete="email"></div>
          <div class="form__row"><label for="oa">Doručovací adresa</label><input id="oa" type="text" required autocomplete="street-address"></div>
          <div class="form__row"><label for="op">Platba</label><select id="op"><option>Kartou online</option><option>Bankovním převodem</option></select></div>
          <button class="btn btn--solid" type="submit"><span class="lbl"><span>Odeslat objednávku</span><span>Odeslat objednávku</span></span></button>
          <div class="form__success" data-success style="display:none;margin-top:1.5rem">
            <h2 class="h4">Objednávku jsme přijali</h2>
            <p>Potvrzení a platební údaje najdete v e-mailu. Děkujeme!</p>
          </div>
        </form>
      </div>
      <div>
        <h2 class="h4" style="margin-bottom:1rem">Souhrn objednávky</h2>
        <div id="checkoutSummary"></div>
      </div>
    </div>
  </div></section>`
});

/* ---- legal ---- */
const legal = (file, title, paras) => ({
  file, title, desc: `${title} klubu BeBirdie.`,
  body: hero({ kicker: 'Dokumenty', title, crumb: [['Domů', 'index.html'], [title, '']] }) +
  `<section class="page-body" data-theme="ivory"><div class="container"><div class="prose">${paras.map(p => `<p>${p}</p>`).join('')}</div></div></section>`
});
pages.push(legal('podminky.html', 'Obchodní podmínky', [
  '<strong>Provozovatel:</strong> BeBirdie, kontakt bebirdie@bebirdie.cz, +420 606 790 905.',
  'Rezervace turnajů a kurzů je závazná po uhrazení startovného. Storno do 14 dnů před akcí je bezplatné, poté účtujeme 50 % ceny; při neúčasti bez omluvy startovné propadá.',
  'U zboží z vinotéky platí zákonná lhůta 14 dnů pro odstoupení od smlouvy. Prodej alkoholu osobám mladším 18 let je zakázán.',
  'Dárkové poukazy platí 12 měsíců od data vystavení a lze je uplatnit na všechny služby klubu.'
]));
pages.push(legal('soukromi.html', 'Ochrana osobních údajů', [
  '<strong>Správce údajů:</strong> BeBirdie, kontakt bebirdie@bebirdie.cz.',
  'Osobní údaje (jméno, e-mail, telefon) zpracováváme výhradně pro vyřízení rezervací, objednávek a zasílání občasníku, ke kterému jste se přihlásili.',
  'Údaje nepředáváme třetím stranám mimo nezbytné zpracovatele (platební brána, dopravce). Z občasníku se můžete kdykoli odhlásit jedním kliknutím.',
  'Máte právo na přístup, opravu i výmaz svých údajů — stačí napsat na bebirdie@bebirdie.cz.'
]));

/* ================= WRITE ================= */
const outDir = __dirname;
pages.forEach((p) => {
  fs.writeFileSync(path.join(outDir, p.file), page(p), 'utf8');
  console.log('✓', p.file);
});
console.log(`\n${pages.length} pages generated.`);
