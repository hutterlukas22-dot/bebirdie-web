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
  wineDark: 'https://images.unsplash.com/photo-1474722883778-792e7990302f',
  polo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  svetr: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
  obuv: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  marker: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
  prsten: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
  kuze: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
  portraitM1: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
  portraitW: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
  portraitM2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
};
const u = (img, w) => `${img}?w=${w || 1400}&q=75&auto=format&fit=crop`;
/* gold grade for grass-heavy shots — no golf-green aesthetic */
const warm = (img) => (img === IMG.aerial || img === IMG.tee) ? ' class="ph-warm"' : '';

/* Official BeBirdie logo (SVG lockup 181×46) + mark + shared icons */
const LOGO_PATHS = `
    <path d="M28.9736 19.3065C31.0972 19.3065 32.8186 17.5851 32.8186 15.4615C32.8186 13.338 31.0972 11.6165 28.9736 11.6165C26.8501 11.6165 25.1287 13.338 25.1287 15.4615C25.1287 17.5851 26.8501 19.3065 28.9736 19.3065Z" fill="#BD1218"/>
    <path d="M8.73812 16.6373C12.2018 16.6754 17.3369 15.9954 21.112 13.3325C21.112 13.3325 20.3748 18.7028 23.9656 21.4292C26.7492 23.5456 29.9968 24.4099 34.3248 22.1919C34.3248 22.1919 32.5898 41.8808 10.6002 35.6779C12.2526 37.235 14.2037 38.4807 16.3455 39.3068C20.9912 41.1054 26.0438 40.8893 30.5052 38.7349C34.7697 36.6694 37.9791 33.0659 39.5298 28.5854C42.7393 19.3447 37.8329 9.21424 28.5923 5.99843C23.8067 4.33968 18.5889 4.82269 14.2419 7.19959C12.6594 8.06392 11.2485 9.22059 9.99648 10.5234L9.72955 10.8031L4.47368 9.36041L5.82737 7.82241C9.50076 3.6533 14.5342 0.831521 20.0507 0.164208C23.4317 -0.242534 26.9144 0.100656 30.2383 1.25733C42.6948 5.58533 49.0184 19.7133 43.5591 32.0236C41.5127 36.644 37.9346 40.4762 33.4732 42.8468C30.1112 44.6326 26.4632 45.5287 22.7898 45.5351C17.4831 45.5351 12.1382 43.6603 7.57509 39.8534C0.507932 33.1485 -1.6656 23.7553 1.27058 15.2963C3.67926 16.1289 6.19597 16.5992 8.74447 16.6309L8.73812 16.6373Z" fill="#BD1218"/>`;
const WORD_PATHS = `
    <path d="M65.576 11.1774C66.9046 11.1774 68.09 11.3362 69.1281 11.6539C70.1702 11.9715 71.0534 12.417 71.7855 12.9981C72.5138 13.5753 73.0677 14.2609 73.4435 15.055C73.8192 15.8491 74.009 16.7207 74.009 17.6698C74.009 18.9597 73.6255 20.056 72.8585 20.9508C72.0915 21.8456 71.1076 22.4848 69.9106 22.8722C71.3943 23.213 72.5912 23.8987 73.5054 24.9291C74.4158 25.9595 74.8729 27.1875 74.8729 28.6169C74.8729 29.593 74.6637 30.4879 74.2492 31.3013C73.8308 32.1187 73.2536 32.8198 72.5099 33.4086C71.7661 33.9974 70.8636 34.4584 69.7944 34.7838C68.7253 35.1131 67.5554 35.2758 66.281 35.2758H56.0466V11.1813H65.576V11.1774ZM64.9523 21.3692C66.3313 21.3692 68.1403 21.0631 68.9073 20.4511C69.6743 19.839 70.0578 19.0256 70.0578 18.0029C70.0578 16.9802 69.6666 16.1668 68.888 15.5547C68.1094 14.9427 66.2655 14.6366 64.8361 14.6366H59.5949V21.3653H64.9523V21.3692ZM65.4597 31.8011C66.8659 31.8011 68.7253 31.495 69.5697 30.883C70.4142 30.2709 70.8403 29.4226 70.8403 28.3341C70.8403 27.2456 70.4568 26.4437 69.6898 25.7852C68.9228 25.1267 67.0751 24.8013 65.6186 24.8013H59.5988V31.8011H65.4636H65.4597Z" fill="#D8AA4C"/>
    <path d="M107.664 11.1774C108.993 11.1774 110.178 11.3362 111.216 11.6539C112.258 11.9715 113.141 12.417 113.873 12.9981C114.602 13.5753 115.156 14.2609 115.531 15.055C115.907 15.8491 116.097 16.7207 116.097 17.6698C116.097 18.9597 115.713 20.056 114.946 20.9508C114.179 21.8456 113.196 22.4848 111.999 22.8722C113.482 23.213 114.679 23.8987 115.593 24.9291C116.504 25.9595 116.961 27.1875 116.961 28.6169C116.961 29.593 116.752 30.4879 116.337 31.3013C115.919 32.1187 115.342 32.8198 114.598 33.4086C113.854 33.9974 112.951 34.4584 111.882 34.7838C110.813 35.1131 109.643 35.2758 108.369 35.2758H98.1345V11.1813H107.664V11.1774ZM107.036 21.3692C108.415 21.3692 110.224 21.0631 110.991 20.4511C111.758 19.839 112.142 19.0256 112.142 18.0029C112.142 16.9802 111.751 16.1668 110.972 15.5547C110.193 14.9427 108.349 14.6366 106.92 14.6366H101.679V21.3653H107.036V21.3692ZM107.544 31.8011C108.95 31.8011 110.809 31.495 111.654 30.883C112.498 30.2709 112.924 29.4226 112.924 28.3341C112.924 27.2456 112.541 26.4437 111.774 25.7852C111.007 25.1267 109.159 24.8013 107.703 24.8013H101.683V31.8011H107.548H107.544Z" fill="#D8AA4C"/>
    <path d="M95.5626 28.6827C95.3728 29.4536 95.0474 30.1935 94.5903 30.9024C94.1293 31.6151 93.5405 32.2698 92.8161 32.8702C92.0917 33.4706 91.224 33.9858 90.213 34.412C89.0625 34.9 87.8926 35.1789 86.7034 35.2525C85.5142 35.3261 84.3792 35.1789 83.3023 34.8109C82.2254 34.4429 81.2337 33.8541 80.335 33.0407C79.4363 32.2272 78.7119 31.1735 78.1658 29.8797C77.6544 28.6711 77.4143 27.478 77.4491 26.3082C77.484 25.1383 77.7319 24.042 78.1967 23.0233C78.6616 22.0045 79.3046 21.0903 80.1336 20.2884C80.9587 19.4827 81.9039 18.859 82.9614 18.4097C84.2514 17.8635 85.4871 17.5652 86.6685 17.5071C87.85 17.449 88.9385 17.6156 89.9341 18.0068C90.9258 18.398 91.8128 19.0023 92.5914 19.8158C93.3701 20.6293 94.0131 21.6442 94.5283 22.8528C94.6523 23.1433 94.7491 23.4068 94.8188 23.6353C94.8886 23.8638 94.9195 24.0033 94.9157 24.0575L82.6244 29.2522C82.8956 29.8255 83.2558 30.302 83.7129 30.6738C84.17 31.0457 84.6775 31.3246 85.243 31.5028C85.8086 31.681 86.4013 31.7585 87.0249 31.7275C87.6486 31.6965 88.2723 31.5493 88.8921 31.2859C90.1123 30.7707 90.9412 30.1199 91.3829 29.3296C91.685 28.7912 91.8709 28.2295 91.9484 27.6523L95.5665 28.6827H95.5626ZM89.845 23.0542C89.6358 22.6243 89.3608 22.2446 89.016 21.9115C88.6713 21.5784 88.2606 21.3266 87.7842 21.16C87.3077 20.9934 86.7731 20.9237 86.1882 20.9469C85.6033 20.9741 84.9641 21.1329 84.2746 21.4234C83.6548 21.6868 83.1357 22.02 82.7251 22.4306C82.3145 22.8373 82.0046 23.275 81.7954 23.7476C81.5862 24.2164 81.4662 24.7006 81.4313 25.1925C81.3964 25.6884 81.4507 26.1377 81.594 26.5445L89.845 23.0581V23.0542Z" fill="#D8AA4C"/>
    <path d="M180.753 28.6827C180.563 29.4536 180.238 30.1935 179.781 30.9024C179.32 31.6151 178.731 32.2698 178.007 32.8702C177.282 33.4706 176.415 33.9858 175.404 34.412C174.253 34.9 173.083 35.1789 171.894 35.2525C170.705 35.3261 169.57 35.1789 168.493 34.8109C167.416 34.4429 166.424 33.8541 165.526 33.0407C164.627 32.2272 163.902 31.1735 163.356 29.8797C162.845 28.6711 162.605 27.478 162.64 26.3082C162.675 25.1383 162.922 24.042 163.387 23.0233C163.852 22.0045 164.495 21.0903 165.324 20.2884C166.149 19.4827 167.094 18.859 168.152 18.4097C169.442 17.8635 170.678 17.5652 171.859 17.5071C173.041 17.449 174.129 17.6156 175.125 18.0068C176.116 18.398 177.003 19.0023 177.782 19.8158C178.561 20.6293 179.204 21.6442 179.719 22.8528C179.843 23.1433 179.94 23.4068 180.009 23.6353C180.079 23.8638 180.11 24.0033 180.106 24.0575L167.815 29.2522C168.086 29.8255 168.446 30.302 168.903 30.6738C169.361 31.0457 169.868 31.3246 170.434 31.5028C170.999 31.681 171.592 31.7585 172.215 31.7275C172.839 31.6965 173.463 31.5493 174.083 31.2859C175.303 30.7707 176.132 30.1199 176.573 29.3296C176.876 28.7912 177.061 28.2295 177.139 27.6523L180.757 28.6827H180.753ZM175.039 23.0542C174.83 22.6243 174.555 22.2446 174.21 21.9115C173.866 21.5784 173.455 21.3266 172.979 21.16C172.502 20.9934 171.968 20.9237 171.383 20.9469C170.798 20.9741 170.159 21.1329 169.469 21.4234C168.849 21.6868 168.33 22.02 167.92 22.4306C167.509 22.8373 167.199 23.275 166.99 23.7476C166.781 24.2164 166.661 24.7006 166.626 25.1925C166.591 25.6884 166.645 26.1377 166.788 26.5445L175.039 23.0581V23.0542Z" fill="#D8AA4C"/>
    <path d="M147.195 10.2594V20.2497C147.044 19.9785 146.831 19.7073 146.56 19.4323C146.285 19.1612 145.928 18.9055 145.491 18.6692C145.053 18.4329 144.534 18.2392 143.933 18.092C143.333 17.9448 142.632 17.8712 141.834 17.8712C140.559 17.8712 139.386 18.0998 138.309 18.5491C137.236 19.0023 136.318 19.626 135.555 20.4201C134.791 21.2142 134.199 22.1362 133.773 23.1898C133.347 24.2435 133.134 25.3591 133.134 26.5367C133.134 27.784 133.347 28.9384 133.773 30.0037C134.199 31.0689 134.791 31.9909 135.555 32.7734C136.318 33.5559 137.236 34.1679 138.309 34.6095C139.382 35.0511 140.583 35.2719 141.907 35.2719C143.232 35.2719 144.317 35.024 145.243 34.5243C146.165 34.0246 146.932 33.4087 147.354 32.7036V35.2758L151.425 35.268V10.2594H147.191H147.195ZM146.533 28.5355C146.285 29.1437 145.94 29.6628 145.495 30.1005C145.049 30.5382 144.514 30.8791 143.891 31.1232C143.263 31.3672 142.585 31.4912 141.853 31.4912C140.288 31.4912 139.041 31.0379 138.111 30.1354C137.185 29.2328 136.721 28.0358 136.721 26.5444C136.721 25.0531 137.209 23.8755 138.189 23C139.169 22.1284 140.401 21.6907 141.888 21.6907C143.376 21.6907 144.584 22.1207 145.51 22.9845C146.436 23.8483 146.901 25.0221 146.901 26.5135C146.901 27.2572 146.777 27.9351 146.529 28.5394L146.533 28.5355Z" fill="#D8AA4C"/>
    <path d="M155.264 14.5824C155.264 13.9859 155.473 13.4823 155.891 13.0717C156.31 12.6611 156.813 12.4558 157.406 12.4558C157.999 12.4558 158.529 12.6611 158.948 13.0717C159.366 13.4823 159.575 13.9859 159.575 14.5824C159.575 15.179 159.366 15.6787 158.948 16.0777C158.529 16.4805 158.014 16.6781 157.406 16.6781C156.798 16.6781 156.31 16.4767 155.891 16.0777C155.473 15.6787 155.264 15.179 155.264 14.5824Z" fill="#D8AA4C"/>
    <path d="M155.264 35.2681V18.7196H159.575V35.2681H155.264Z" fill="#D8AA4C"/>
    <path d="M119.529 14.5824C119.529 13.9859 119.738 13.4823 120.157 13.0717C120.575 12.6611 121.079 12.4558 121.671 12.4558C122.264 12.4558 122.795 12.6611 123.213 13.0717C123.631 13.4823 123.841 13.9859 123.841 14.5824C123.841 15.179 123.631 15.6787 123.213 16.0777C122.795 16.4805 122.28 16.6781 121.671 16.6781C121.063 16.6781 120.575 16.4767 120.157 16.0777C119.738 15.6787 119.529 15.179 119.529 14.5824Z" fill="#D8AA4C"/>
    <path d="M123.84 18.7196H119.529V35.2681H123.84V18.7196Z" fill="#D8AA4C"/>
    <path d="M132.029 20.4589L126.211 23.5578V18.7583L133.099 16.8215L132.029 20.4589Z" fill="#D8AA4C"/>`;

const LOGO_SYMBOL = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="bb-logo" viewBox="0 0 181 46">${LOGO_PATHS}${WORD_PATHS}
  </symbol>
  <symbol id="bb-mark" viewBox="0 0 46 46">${LOGO_PATHS}
  </symbol>
  <symbol id="ic-ig" viewBox="0 0 24 24">
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none"/>
  </symbol>
</svg>`;

const BRAND = `<a class="brand" href="index.html" aria-label="BeBirdie — domů"><svg class="brand__logo" viewBox="0 0 181 46" aria-hidden="true" focusable="false"><use href="#bb-logo"/></svg></a>`;
const CHEV = `<svg class="chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>`;

const nav = (dark) => `<header class="nav${dark ? ' nav--dark' : ''}" id="nav">
  <div class="nav__inner">
    ${BRAND}
    <nav aria-label="Hlavní navigace">
      <ul class="nav__links">
        <li class="has-mega"><button class="nav__link" data-mega="akce" aria-expanded="false" aria-haspopup="true">Akce${CHEV}</button></li>
        <li class="has-mega"><button class="nav__link" data-mega="tury" aria-expanded="false" aria-haspopup="true">Golfové túry${CHEV}</button></li>
        <li class="has-mega"><button class="nav__link" data-mega="shop" aria-expanded="false" aria-haspopup="true">Shop${CHEV}</button></li>
        <li class="has-mega"><button class="nav__link" data-mega="vzdelavani" aria-expanded="false" aria-haspopup="true">Vzdělávání${CHEV}</button></li>
        <li><a class="nav__link" href="o-nas.html">O nás</a></li>
        <li><a class="nav__link" href="partneri.html">Partneři</a></li>
        <li><a class="nav__link" href="kontakt.html">Kontakt</a></li>
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
          <svg class="brand__logo" viewBox="0 0 181 46" aria-hidden="true" focusable="false"><use href="#bb-logo"/></svg>
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
        <h5>Akce</h5>
        <ul>
          <li><a href="kalendar.html">Kalendář akcí</a></li>
          <li><a href="tour.html">BeBirdie Tour</a></li>
          <li><a href="open-tour.html">Open Tour</a></li>
          <li><a href="specialni-turnaje.html">Speciální turnaje</a></li>
          <li><a href="zebricek.html">Žebříček</a></li>
        </ul>
      </div>
      <div>
        <h5>Golfové túry</h5>
        <ul>
          <li><a href="tury.html">Přehled túr</a></li>
          <li><a href="prestizni-tury.html">Prestižní túry</a></li>
          <li><a href="zajezdy.html">Zájezdy &amp; výlety</a></li>
          <li><a href="partnerska-hriste.html">Partnerská hřiště</a></li>
          <li><a href="tabory.html">Tábory pro děti</a></li>
        </ul>
      </div>
      <div>
        <h5>Shop</h5>
        <ul>
          <li><a href="vino.html">Vína</a></li>
          <li><a href="obleceni.html">Oblečení &amp; boty</a></li>
          <li><a href="sperky.html">Šperky &amp; doplňky</a></li>
          <li><a href="poukazy.html">Dárkové poukazy</a></li>
          <li><a href="oblibene.html">Oblíbené</a></li>
          <li><a href="kosik.html">Košík</a></li>
        </ul>
      </div>
      <div>
        <h5>Vzdělávání</h5>
        <ul>
          <li><a href="ai-kurzy.html">Kurzy AI</a></li>
          <li><a href="marketing.html">Marketing</a></li>
          <li><a href="byznys-rozvoj.html">Byznys rozvoj</a></li>
          <li><a href="lektori.html">Naši lektoři</a></li>
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
    <div class="footer__secondary">
      <a href="klub.html">Klub &amp; členství</a>
      <a href="clenska-zona.html">Členská zóna</a>
      <a href="o-nas.html">O nás</a>
      <a href="partneri.html">Partneři</a>
      <a href="galerie.html">Fotogalerie</a>
      <a href="kontakt.html">Kontakt</a>
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
<link rel="icon" href="assets/mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,340;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,340&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="no-js">
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
const EVENT_FLOAT = `<div class="event-float" id="eventFloat" aria-hidden="true"><img src="" alt=""></div>`;

/* ================= SHOP CARD HELPERS ================= */
const wineCards = `
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
      </article>`;

const productCard = (id, name, url, img, origin, note, price, badge) => `
      <article class="wine-card">
        <a class="ph" href="${url}"><img src="${u(img, 900)}" alt="${name}" onerror="this.style.display='none'"></a>
        <button class="wish" data-wish="${id}" aria-label="Přidat ${name} do oblíbených"></button>
        ${badge ? `<span class="badge">${badge}</span>` : ''}
        <h4><a href="${url}">${name}</a></h4>
        <p class="origin">${origin}</p>
        <p class="note">${note}</p>
        <div class="row"><span class="price tnum">${price.toLocaleString('cs-CZ')} Kč</span><a class="add" href="${url}" data-add="${id}">Do košíku →</a></div>
      </article>`;

const voucher = (id, val) => `<article class="wine-card">
  <div class="ph" style="display:grid;place-items:center;background:linear-gradient(135deg,var(--sand),var(--ivory-2))">
    <div style="text-align:center">
      <svg width="46" height="46" viewBox="0 0 46 46" style="margin:0 auto .9rem" aria-hidden="true"><use href="#bb-mark"/></svg>
      <div class="tnum" style="font-family:var(--serif);font-weight:300;font-size:2rem">${val.toLocaleString('cs-CZ')} Kč</div>
    </div>
  </div>
  <button class="wish" data-wish="${id}" aria-label="Přidat poukaz do oblíbených"></button>
  <h4>Dárkový poukaz ${val.toLocaleString('cs-CZ')} Kč</h4>
  <p class="origin">Elektronicky i tištěný</p>
  <div class="row"><span class="price tnum">${val.toLocaleString('cs-CZ')} Kč</span><a class="add" href="#" data-add="${id}">Do košíku →</a></div>
</article>`;

const pages = [];

/* ---- kalendar ---- */
pages.push({
  file: 'kalendar.html', title: 'Kalendář akcí 2026', desc: 'Všechny golfové turnaje, zájezdy a akce BeBirdie v sezóně 2026.',
  body: hero({ kicker: 'Akce · program 2026', title: 'Kalendář akcí', crumb: [['Domů', 'index.html'], ['Akce', 'kalendar.html'], ['Kalendář akcí', '']],
    lede: 'Čtrnáct turnajů, zájezdy za golfem i speciální formáty. Vyberte si akci — členové klubu mají přednostní rezervaci.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="event-rows">${EVENTS.map(eventRow).join('\n')}</div>
    <div class="calendar__foot">
      <a class="btn btn--ink" href="tour.html"><span class="lbl"><span>BeBirdie Tour 2026</span><span>BeBirdie Tour 2026</span></span></a>
      <a class="link-arrow" href="zebricek.html">Žebříček Open Tour <span class="arr">↗</span></a>
      <a class="link-arrow" href="klub.html">Členové rezervují přednostně <span class="arr">↗</span></a>
    </div>
  </div></section>${EVENT_FLOAT}`
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

/* ---- tour (BeBirdie Tour detail) ---- */
pages.push({
  file: 'tour.html', title: 'BeBirdie Tour 2026', desc: 'Celoroční prémiová golfová série BeBirdie Tour 2026. Vyprodáno — zapište se na čekací listinu.',
  dark: true,
  body: hero({ dark: true, kicker: 'Akce · sezónní členství', title: 'BeBirdie Tour 2026', crumb: [['Domů', 'index.html'], ['Akce', 'kalendar.html'], ['BeBirdie Tour', '']],
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
            <a class="btn btn--ghost" href="open-tour.html"><span class="lbl"><span>Otevřená Open Tour</span><span>Otevřená Open Tour</span></span></a>
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

/* ---- open tour ---- */
const openTourEvents = EVENTS.filter((e) => e.tag === 'Open Tour');
pages.push({
  file: 'open-tour.html', title: 'Open Tour 2026', desc: 'BeBirdie Open Tour 2026 — deset hřišť, jedno pořadí, velké finále. Otevřeno všem hráčům.',
  body: hero({ kicker: 'Akce · Open Tour', title: 'Deset hřišť. Jedno pořadí.', crumb: [['Domů', 'index.html'], ['Akce', 'kalendar.html'], ['Open Tour', '']],
    lede: 'Otevřená série pro všechny hráče — každé kolo sbíráte body do celoročního žebříčku. Finále v říjnu na Beřovicích.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="prose" style="margin-bottom:var(--space-lg)">
      <p><strong>Jak Open Tour funguje?</strong> Startovné 2 400 Kč vždy zahrnuje green fee. Za umístění v každém kole získáváte body — a na konci sezóny se sčítá osm nejlepších výsledků. Hrát můžete jedno kolo, nebo celou sérii.</p>
    </div>
    <div class="event-rows">${openTourEvents.map(eventRow).join('\n')}</div>
    <div class="calendar__foot">
      <a class="btn btn--ink" href="zebricek.html"><span class="lbl"><span>Průběžný žebříček</span><span>Průběžný žebříček</span></span></a>
      <a class="link-arrow" href="tour.html">Hledáte uzavřenou Tour? <span class="arr">↗</span></a>
    </div>
  </div></section>${EVENT_FLOAT}`
});

/* ---- specialni turnaje ---- */
const specialEvents = EVENTS.filter((e) => e.tag !== 'Open Tour');
pages.push({
  file: 'specialni-turnaje.html', title: 'Speciální turnaje', desc: 'Miss Golf, Texas Cup, Prague Golf Card CUP a další speciální formáty BeBirdie.',
  body: hero({ kicker: 'Akce · speciály', title: 'Turnaje, které jinde nezažijete', crumb: [['Domů', 'index.html'], ['Akce', 'kalendar.html'], ['Speciální turnaje', '']],
    lede: 'Legendární Miss Golf, roadtrip přes tři hřiště za den nebo víkend vlakem pod Tatry. Formáty, kvůli kterým se o klubu mluví.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="event-rows">${specialEvents.map(eventRow).join('\n')}</div>
    <div class="calendar__foot">
      <a class="btn btn--ink" href="kalendar.html"><span class="lbl"><span>Celý kalendář akcí</span><span>Celý kalendář akcí</span></span></a>
      <a class="link-arrow" href="klub.html">Členové rezervují přednostně <span class="arr">↗</span></a>
    </div>
  </div></section>${EVENT_FLOAT}`
});

/* ---- zebricek ---- */
const STANDINGS = [
  ['Petr Kovář', 'GC Konopiště', 412, '6/6'],
  ['Martin Horák', 'GC Karlštejn', 388, '6/6'],
  ['Jana Nováková', 'GC Zbraslav', 371, '5/6'],
  ['Tomáš Beneš', 'GC Černý Most', 344, '6/6'],
  ['Lukáš Dvořák', 'GC Mladá Boleslav', 329, '5/6'],
  ['Ondřej Šimek', 'GC Pyšely', 301, '6/6'],
  ['David Král', 'GC Vinoř', 287, '4/6'],
  ['Eva Marešová', 'GC Konopiště', 262, '5/6'],
  ['Jakub Poláček', 'GC Beřovice', 244, '4/6'],
  ['Filip Urban', 'GC Black Bridge', 226, '5/6']
];
pages.push({
  file: 'zebricek.html', title: 'Žebříček Open Tour 2026', desc: 'Průběžné pořadí BeBirdie Open Tour 2026 po šesti odehraných kolech.',
  body: hero({ kicker: 'Akce · žebříček', title: 'Žebříček Open Tour 2026', crumb: [['Domů', 'index.html'], ['Akce', 'kalendar.html'], ['Žebříček', '']],
    lede: 'Průběžné pořadí po 6 z 10 kol. Do celkového součtu se počítá osm nejlepších výsledků sezóny.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <table class="rank" style="max-width:52rem">
      <thead><tr><th>Pořadí</th><th>Hráč</th><th>Domovský klub</th><th style="text-align:right">Body</th><th style="text-align:right">Kola</th></tr></thead>
      <tbody>
        ${STANDINGS.map((s, i) => `<tr${i < 3 ? ' class="top"' : ''}><td class="pos tnum">${String(i + 1).padStart(2, '0')}</td><td class="nm">${s[0]}</td><td class="club">${s[1]}</td><td class="pts tnum">${s[2]} b</td><td class="rounds tnum">${s[3]}</td></tr>`).join('\n        ')}
      </tbody>
    </table>
    <p class="muted" style="margin-top:var(--space-md);font-size:.9rem;max-width:48rem">Aktualizováno po kole na Ypsilonu (27. 6. 2026). Kompletní výsledkové listiny jednotlivých kol zasíláme hráčům e-mailem po každém turnaji.</p>
    <div class="detail__actions" style="margin-top:var(--space-lg)">
      <a class="btn btn--ink" href="open-tour.html"><span class="lbl"><span>Zbývající kola Open Tour</span><span>Zbývající kola Open Tour</span></span></a>
      <a class="link-arrow" href="akce-konopiste.html">Nejbližší kolo — Konopiště 11. 7. <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- tury (přehled) ---- */
pages.push({
  file: 'tury.html', title: 'Golfové túry — přehled', desc: 'Přehled golfových túr BeBirdie: prestižní Tour, zájezdy a výlety, partnerská hřiště.',
  body: hero({ kicker: 'Golfové túry', title: 'Golf, který stojí za cestu', crumb: [['Domů', 'index.html'], ['Golfové túry', '']],
    lede: 'Od celoroční prestižní série po víkendový vlak pod Tatry. Vyberte si svou cestu.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="edu__grid" style="margin-bottom:var(--space-lg)">
      <article class="edu-card">
        <img src="${u(IMG.table)}" alt="Prestižní túry" onerror="this.style.display='none'">
        <span class="tag">Prestiž</span>
        <h3 class="h3">Prestižní túry</h3>
        <p>Uzavřená celoroční série BeBirdie Tour — deset kol, gala večer a startovní listina, na kterou se čeká.</p>
        <div class="meta"><span><b>10 kol</b> ročně</span><span><b>uzavřená</b> skupina</span></div>
        <a class="link-arrow" href="prestizni-tury.html">Poznat prestižní túry <span class="arr">↗</span></a>
      </article>
      <article class="edu-card">
        <img src="${u(IMG.toast)}" alt="Zájezdy a výlety" onerror="this.style.display='none'">
        <span class="tag">Zájezdy</span>
        <h3 class="h3">Zájezdy &amp; výlety</h3>
        <p>Golf Train Cup pod Tatrami, roadtrip přes tři hřiště za den — cestování, u kterého se hraje.</p>
        <div class="meta"><span><b>víkendy</b> i jednodenní</span><span><b>vše</b> v ceně</span></div>
        <a class="link-arrow" href="zajezdy.html">Prohlédnout zájezdy <span class="arr">↗</span></a>
      </article>
      <article class="edu-card">
        <img class="ph-warm--dark" src="${u(IMG.aerial)}" alt="Partnerská hřiště" onerror="this.style.display='none'">
        <span class="tag">Hřiště</span>
        <h3 class="h3">Partnerská hřiště</h3>
        <p>Deset hřišť po celém Česku, kde hrajeme Open Tour — a kde mají členové výhody.</p>
        <div class="meta"><span><b>10</b> hřišť</span><span><b>členské</b> výhody</span></div>
        <a class="link-arrow" href="partnerska-hriste.html">Kde všude hrajeme <span class="arr">↗</span></a>
      </article>
      <article class="edu-card">
        <img class="ph-warm--dark" src="${u(IMG.tee)}" alt="Open Tour" onerror="this.style.display='none'">
        <span class="tag">Open Tour</span>
        <h3 class="h3">Open Tour 2026</h3>
        <p>Otevřená série pro všechny hráče. Deset hřišť, jedno pořadí a velké říjnové finále.</p>
        <div class="meta"><span><b>2 400 Kč</b> za kolo</span><span><b>otevřeno</b> všem</span></div>
        <a class="link-arrow" href="open-tour.html">Vstoupit do Open Tour <span class="arr">↗</span></a>
      </article>
    </div>
  </div></section>`
});

/* ---- prestizni tury ---- */
pages.push({
  file: 'prestizni-tury.html', title: 'Prestižní túry', desc: 'Prestižní golfové túry BeBirdie — uzavřená celoroční série pro čtyřicet hráčů.',
  body: hero({ kicker: 'Golfové túry · prestiž', title: 'Túra, na kterou se čeká', crumb: [['Domů', 'index.html'], ['Golfové túry', 'tury.html'], ['Prestižní túry', '']],
    lede: 'BeBirdie Tour není turnaj. Je to celoroční společenství hráčů, kteří se potkávají na nejlepších hřištích Česka.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(IMG.table, 1200)}" alt="Gala večer BeBirdie Tour" onerror="this.style.display='none'"></div>
      <div>
        <p class="body-lg" style="max-width:36rem">Uzavřená startovní listina znamená, že celou sezónu hrajete se stejnými lidmi. Z flightů se stávají přátelství, z přátelství partnerství. Právě proto je Tour rok co rok vyprodaná.</p>
        <ul class="detail__facts">
          <li><span class="k">Formát</span><span class="v">10 kol · duben až říjen</span></li>
          <li><span class="k">Skupina</span><span class="v">uzavřená startovní listina</span></li>
          <li><span class="k">Zahrnuje</span><span class="v">green fee, catering, gala večer</span></li>
          <li><span class="k">Cena</span><span class="v tnum">od 133 000 Kč / sezóna</span></li>
        </ul>
        <div class="detail__actions" style="margin-top:var(--space-md)">
          <a class="btn btn--solid" href="tour.html"><span class="lbl"><span>BeBirdie Tour 2026</span><span>BeBirdie Tour 2026</span></span></a>
          <a class="btn btn--ghost" href="klub.html"><span class="lbl"><span>Členství v klubu</span><span>Členství v klubu</span></span></a>
        </div>
        <p class="muted" style="margin-top:var(--space-md);font-size:.9rem">Ročník 2026 je vyprodaný — na detailu Tour se můžete zapsat na čekací listinu.</p>
      </div>
    </div>
  </div></section>`
});

/* ---- zajezdy ---- */
pages.push({
  file: 'zajezdy.html', title: 'Zájezdy & výlety', desc: 'Golfové zájezdy a výlety BeBirdie — Golf Train Cup pod Tatrami a Prague Golf Card roadtrip.',
  body: hero({ kicker: 'Golfové túry · zájezdy', title: 'Cestování, u kterého se hraje', crumb: [['Domů', 'index.html'], ['Golfové túry', 'tury.html'], ['Zájezdy &amp; výlety', '']],
    lede: 'Nasednete, my se postaráme o zbytek. Green fee, ubytování i večerní program v jedné ceně.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="spread" style="margin-bottom:var(--space-xl)">
      <div class="spread__media"><img src="${u(IMG.toast)}" alt="Golf Train Cup" onerror="this.style.display='none'"></div>
      <div class="spread__body">
        <span class="spread__num">21.–23. 8. 2026 · od 7 900 Kč</span>
        <h3 class="h3">Golf Train Cup — Black Stork</h3>
        <p>Víkend vlakem z Prahy pod Vysoké Tatry. Dvě turnajová kola, ubytování u hřiště a večery, na které se nezapomíná.</p>
        <a class="link-arrow" href="akce-train-cup.html">Detail zájezdu <span class="arr">↗</span></a>
      </div>
    </div>
    <div class="spread spread--rev" style="margin-bottom:var(--space-xl)">
      <div class="spread__media"><img class="ph-warm" src="${u(IMG.tee)}" alt="Prague Golf Card CUP" onerror="this.style.display='none'"></div>
      <div class="spread__body">
        <span class="spread__num">5. 8. 2026 · 3 900 Kč</span>
        <h3 class="h3">Prague Golf Card CUP</h3>
        <p>Tři hřiště, jeden den, jeden autobus. Golfový roadtrip po Praze s obědem na cestě a vyhlášením u večeře.</p>
        <a class="link-arrow" href="akce-prague-golf-card.html">Detail výletu <span class="arr">↗</span></a>
      </div>
    </div>
    <div class="prose">
      <p><strong>Připravujeme: Toskánsko, jaro 2027.</strong> Týden golfu mezi vinicemi — přednost dostanou členové klubu a účastníci letošních zájezdů.</p>
    </div>
    <div class="detail__actions" style="margin-top:var(--space-md)">
      <a class="btn btn--ink" href="kontakt.html"><span class="lbl"><span>Chci vědět jako první</span><span>Chci vědět jako první</span></span></a>
    </div>
  </div></section>`
});

/* ---- partnerska hriste ---- */
pages.push({
  file: 'partnerska-hriste.html', title: 'Partnerská hřiště', desc: 'Deset partnerských hřišť BeBirdie po celém Česku — místa, kde hrajeme Open Tour.',
  body: hero({ kicker: 'Golfové túry · hřiště', title: 'Kde všude hrajeme', crumb: [['Domů', 'index.html'], ['Golfové túry', 'tury.html'], ['Partnerská hřiště', '']],
    lede: 'Deset hřišť, se kterými tvoříme sezónu. Členové klubu zde mají zvýhodněná fee a přednostní tee times v turnajové dny.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="partners-grid partners-grid--5" style="margin-bottom:var(--space-xl)">
      <div>Golf Konopiště</div><div>Golf Karlštejn</div><div>Golf Pyšely</div><div>Golf Mladá Boleslav</div><div>Golf Černý Most</div>
      <div>Golf Zbraslav</div><div>Golf Beřovice</div><div>Golf Vinoř</div><div>Golf Black Bridge</div><div>Ypsilon Golf Liberec</div>
    </div>
    <div class="prose">
      <h2>Výhody pro členy</h2>
      <p>Na partnerských hřištích mají členové BeBirdie zvýhodněná green fee, přednostní rezervace v turnajové dny a přístup na klubové tréninkové večery. Kompletní přehled výhod najdete v <a href="clenska-zona.html" style="text-decoration:underline">členské zóně</a>.</p>
    </div>
    <div class="detail__actions" style="margin-top:var(--space-md)">
      <a class="btn btn--ink" href="open-tour.html"><span class="lbl"><span>Kalendář Open Tour</span><span>Kalendář Open Tour</span></span></a>
      <a class="link-arrow" href="kontakt.html">Provozujete hřiště? Ozvěte se <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- vzdelavani ---- */
pages.push({
  file: 'vzdelavani.html', title: 'Vzdělávání', desc: 'Praktické kurzy AI, marketingu a byznys rozvoje pro podnikatele a lídry.',
  body: hero({ kicker: 'Vzdělávání', title: 'Rosťte rychleji než konkurence', crumb: [['Domů', 'index.html'], ['Vzdělávání', '']],
    lede: 'Posouváme vás v kariéře skrze praktické kurzy — od umělé inteligence po byznys rozvoj. Vedou je lektoři z praxe, ne z prezentací.' }) +
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
        <a class="link-arrow" href="marketing.html">Detail kurzu <span class="arr">↗</span></a>
      </article>
      <article class="edu-card">
        <img src="${u(IMG.dinner)}" alt="Mastermind setkání" onerror="this.style.display='none'">
        <span class="tag">Program</span>
        <h3 class="h3">Byznys rozvoj</h3>
        <p>Mastermind pro majitele firem — šest večerů s lidmi, kteří řeší stejná rozhodnutí jako vy.</p>
        <div class="meta"><span><b>6 setkání</b></span><span><b>max 10</b> účastníků</span><span><b>Praha</b></span></div>
        <a class="link-arrow" href="byznys-rozvoj.html">Detail programu <span class="arr">↗</span></a>
      </article>
      <article class="edu-card">
        <img src="${u(IMG.toast)}" alt="Naši lektoři" onerror="this.style.display='none'">
        <span class="tag">Lidé</span>
        <h3 class="h3">Naši lektoři</h3>
        <p>Podnikatelé a specialisté, kteří technologie a marketing denně používají ve vlastních firmách.</p>
        <div class="meta"><span><b>z praxe</b>, ne z prezentací</span></div>
        <a class="link-arrow" href="lektori.html">Poznat lektory <span class="arr">↗</span></a>
      </article>
    </div>
    <div class="prose">
      <h2>Proč se vzdělávat s BeBirdie</h2>
      <p><strong>Malé skupiny, žádná teorie navíc.</strong> Odcházíte s postupy, ne s certifikátem do šuplíku. Kurzy jsou součástí klubového ekosystému — potkáte na nich stejné lidi jako na greenu. <a href="klub.html" style="text-decoration:underline">Členové klubu</a> mají zvýhodněné ceny a přednostní rezervaci termínů.</p>
    </div>
  </div></section>`
});

/* ---- ai kurzy ---- */
pages.push({
  file: 'ai-kurzy.html', title: 'Kurzy AI — AI pro byznys lídry', desc: 'Jednodenní intenzivní kurz umělé inteligence pro majitele firem a lídry. Praha, max 12 účastníků.',
  body: hero({ kicker: 'Vzdělávání · kurzy AI', title: 'AI pro byznys lídry', crumb: [['Domů', 'index.html'], ['Vzdělávání', 'vzdelavani.html'], ['Kurzy AI', '']],
    lede: 'Jeden den, který změní způsob, jakým vedete firmu. Naučte se delegovat na umělou inteligenci.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(IMG.workshop, 1200)}" alt="AI kurz pro lídry" onerror="this.style.display='none'"></div>
      <div>
        <p class="body-lg" style="max-width:36rem">Žádné slidy o budoucnosti. Celý den pracujete na vlastních firemních úlohách — od přípravy nabídek přes analýzu dat po automatizaci porad. Odpoledne odcházíte s funkčními postupy.</p>
        <ul class="detail__facts">
          <li><span class="k">Délka</span><span class="v">1 den · 9:00–17:00</span></li>
          <li><span class="k">Skupina</span><span class="v">max 12 účastníků</span></li>
          <li><span class="k">Lektor</span><span class="v"><a href="lektori.html" style="text-decoration:underline">Marek Vlach</a></span></li>
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

/* ---- marketing ---- */
pages.push({
  file: 'marketing.html', title: 'Marketing — Digitální marketing prakticky', desc: 'Kurz digitálního marketingu pro majitele firem. Dvě odpoledne, naživo i online.',
  body: hero({ kicker: 'Vzdělávání · marketing', title: 'Digitální marketing prakticky', crumb: [['Domů', 'index.html'], ['Vzdělávání', 'vzdelavani.html'], ['Marketing', '']],
    lede: 'Od strategie po kampaně, které skutečně prodávají. Přestaňte marketing jen platit — začněte mu rozumět.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(IMG.meeting, 1200)}" alt="Kurz digitálního marketingu" onerror="this.style.display='none'"></div>
      <div>
        <p class="body-lg" style="max-width:36rem">Dvě odpoledne nad vaším vlastním marketingem. První den strategie a značka, druhý den výkonnostní kampaně a měření. Pracujete na svých datech, ne na cvičných příkladech.</p>
        <ul class="detail__facts">
          <li><span class="k">Délka</span><span class="v">2 odpoledne · 13:00–18:00</span></li>
          <li><span class="k">Formát</span><span class="v">naživo v Praze i online</span></li>
          <li><span class="k">Lektorka</span><span class="v"><a href="lektori.html" style="text-decoration:underline">Tereza Kovaříková</a></span></li>
          <li><span class="k">Nejbližší termíny</span><span class="v tnum">24. 9. · 22. 10. 2026</span></li>
        </ul>
        <div class="detail__price tnum">od 8 900 Kč <small>členové klubu −20 %</small></div>
        <form class="form" data-form>
          <div class="form__row"><label for="mn2">Jméno a příjmení</label><input id="mn2" type="text" required autocomplete="name"></div>
          <div class="form__row"><label for="me2">E-mail</label><input id="me2" type="email" required autocomplete="email"></div>
          <div class="form__row"><label for="mt2">Preferovaný termín</label><select id="mt2"><option>24. 9. 2026</option><option>22. 10. 2026</option></select></div>
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

/* ---- byznys rozvoj ---- */
pages.push({
  file: 'byznys-rozvoj.html', title: 'Byznys rozvoj — mastermind', desc: 'Mastermind program BeBirdie pro majitele firem. Šest večerů, max deset účastníků.',
  body: hero({ kicker: 'Vzdělávání · byznys rozvoj', title: 'Mastermind pro majitele firem', crumb: [['Domů', 'index.html'], ['Vzdělávání', 'vzdelavani.html'], ['Byznys rozvoj', '']],
    lede: 'Šest večerů s lidmi, kteří řeší stejná rozhodnutí jako vy — najímání, růst, exit. Moderované, důvěrné, bez public relations.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(IMG.dinner, 1200)}" alt="Mastermind setkání u večeře" onerror="this.style.display='none'"></div>
      <div>
        <p class="body-lg" style="max-width:36rem">Každé setkání patří jednomu členovi skupiny a jeho aktuální výzvě. Ostatní přinášejí zkušenost, kontakty a upřímnou zpětnou vazbu. Co zazní u stolu, zůstává u stolu.</p>
        <ul class="detail__facts">
          <li><span class="k">Formát</span><span class="v">6 večerních setkání · pololetí</span></li>
          <li><span class="k">Skupina</span><span class="v">max 10 majitelů firem</span></li>
          <li><span class="k">Moderuje</span><span class="v"><a href="lektori.html" style="text-decoration:underline">Jan Šrámek</a></span></li>
          <li><span class="k">Start</span><span class="v tnum">říjen 2026 · Praha</span></li>
        </ul>
        <div class="detail__price tnum">od 24 000 Kč <small>za pololetí · vč. večeří</small></div>
        <form class="form" data-form>
          <div class="form__row"><label for="bn">Jméno a příjmení</label><input id="bn" type="text" required autocomplete="name"></div>
          <div class="form__row"><label for="be">E-mail</label><input id="be" type="email" required autocomplete="email"></div>
          <div class="form__row"><label for="bf">Firma a role</label><input id="bf" type="text" required autocomplete="organization"></div>
          <div class="detail__actions">
            <button class="btn btn--solid" type="submit"><span class="lbl"><span>Požádat o místo</span><span>Požádat o místo</span></span></button>
            <a class="btn btn--ghost" href="vzdelavani.html"><span class="lbl"><span>Všechny programy</span><span>Všechny programy</span></span></a>
          </div>
          <div class="form__success" data-success style="display:none;margin-top:1.5rem">
            <h2 class="h4">Žádost jsme přijali</h2>
            <p>Skupiny skládáme tak, aby si členové navzájem nekonkurovali. Ozveme se do 48 hodin.</p>
          </div>
        </form>
      </div>
    </div>
  </div></section>`
});

/* ---- lektori ---- */
pages.push({
  file: 'lektori.html', title: 'Naši lektoři', desc: 'Lektoři vzdělávacích programů BeBirdie — lidé z praxe, ne z prezentací.',
  body: hero({ kicker: 'Vzdělávání · lidé', title: 'Lektoři z praxe, ne z prezentací', crumb: [['Domů', 'index.html'], ['Vzdělávání', 'vzdelavani.html'], ['Naši lektoři', '']],
    lede: 'Každý z našich lektorů denně vede vlastní firmu nebo tým. Učí to, co ráno sami dělali.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="people" style="margin-bottom:var(--space-xl)">
      <article class="person">
        <div class="ph"><img src="${u(IMG.portraitM1, 800)}" alt="Marek Vlach" onerror="this.style.display='none'"></div>
        <h4>Marek Vlach</h4>
        <p class="role">AI &amp; automatizace</p>
        <p>Zakladatel softwarového studia. Posledních pět let staví AI nástroje pro české firmy — a učí lídry, jak na ně delegovat. Vede kurz <a href="ai-kurzy.html" style="text-decoration:underline">AI pro byznys lídry</a>.</p>
      </article>
      <article class="person">
        <div class="ph"><img src="${u(IMG.portraitW, 800)}" alt="Tereza Kovaříková" onerror="this.style.display='none'"></div>
        <h4>Tereza Kovaříková</h4>
        <p class="role">Výkonnostní marketing</p>
        <p>Deset let vedla marketing e-commerce značek, dnes konzultuje růst firem od 10 do 500 milionů. Vede kurz <a href="marketing.html" style="text-decoration:underline">Digitální marketing prakticky</a>.</p>
      </article>
      <article class="person">
        <div class="ph"><img src="${u(IMG.portraitM2, 800)}" alt="Jan Šrámek" onerror="this.style.display='none'"></div>
        <h4>Jan Šrámek</h4>
        <p class="role">Byznys mentor</p>
        <p>Vybudoval a v roce 2019 prodal technologickou firmu. Dnes moderuje mastermind skupiny a investuje do českých startupů. Vede program <a href="byznys-rozvoj.html" style="text-decoration:underline">Byznys rozvoj</a>.</p>
      </article>
    </div>
    <div class="detail__actions">
      <a class="btn btn--ink" href="vzdelavani.html"><span class="lbl"><span>Vybrat si kurz</span><span>Vybrat si kurz</span></span></a>
      <a class="link-arrow" href="kontakt.html">Chcete u nás učit? <span class="arr">↗</span></a>
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
            <span class="brand"><svg class="brand__logo" viewBox="0 0 181 46" aria-hidden="true" focusable="false"><use href="#bb-logo"/></svg></span>
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

/* ---- obchod (shop hub) ---- */
pages.push({
  file: 'obchod.html', title: 'Shop', desc: 'Shop BeBirdie — kurátorovaná vinotéka, klubová kolekce, šperky, dárkové poukazy a tábory.',
  body: hero({ kicker: 'Shop', title: 'Obchod pro dobrý vkus', crumb: [['Domů', 'index.html'], ['Shop', '']],
    lede: 'Vína, za kterými si stojíme, klubová kolekce a dárky, které potěší.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail__actions" style="margin-bottom:var(--space-xl)">
      <a class="link-arrow" href="vino.html">Víno <span class="arr">↗</span></a>
      <a class="link-arrow" href="obleceni.html">Oblečení &amp; boty <span class="arr">↗</span></a>
      <a class="link-arrow" href="sperky.html">Šperky &amp; doplňky <span class="arr">↗</span></a>
      <a class="link-arrow" href="poukazy.html">Dárkové poukazy <span class="arr">↗</span></a>
    </div>
    <p class="kicker" id="vino" style="margin-bottom:var(--space-md)">Výběr sommeliera</p>
    <div class="wine__grid" style="margin-bottom:var(--space-2xl)">${wineCards}</div>
    <p class="kicker" style="margin-bottom:var(--space-md)">Klubová kolekce</p>
    <div class="wine__grid" style="margin-bottom:var(--space-2xl)">
      ${productCard('polo', 'Klubové polo BeBirdie', 'produkt-polo.html', IMG.polo, 'Klubová kolekce', 'Pima bavlna, vyšitý birdie na hrudi. V barvách ivory a ink.', 1490)}
      ${productCard('svetr', 'Merino svetr BeBirdie', 'produkt-svetr.html', IMG.svetr, 'Klubová kolekce', 'Jemné merino na chladnější rána na greenu i do kanceláře.', 2990)}
      ${productCard('marker', 'Stříbrný ball marker', 'produkt-marker.html', IMG.marker, 'Šperky & doplňky', 'Stříbro 925 s gravírováním iniciál. Dárek, který se neztratí.', 2490)}
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

/* ---- vino ---- */
pages.push({
  file: 'vino.html', title: 'Víno', desc: 'Kurátorovaná vinotéka BeBirdie — výběr sommeliera pro klubové večery i domácí sklep.',
  body: hero({ kicker: 'Shop · víno', title: 'Výběr sommeliera', crumb: [['Domů', 'index.html'], ['Shop', 'obchod.html'], ['Víno', '']],
    lede: 'Tři láhve, za kterými si stojíme. Každé víno prošlo klubovou degustací — co neobstálo, neprodáváme.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="wine__grid" style="margin-bottom:var(--space-xl)">${wineCards}</div>
    <div class="prose">
      <h2>Jak vybíráme</h2>
      <p>Vína ochutnáváme na klubových degustacích — do vinotéky se dostane jen to, co obstojí před stovkou náročných chutí. Členové klubu nakupují se slevou a mají přístup k limitovaným šaržím.</p>
    </div>
    <div class="detail__actions" style="margin-top:var(--space-md)">
      <a class="btn btn--ink" href="obchod.html"><span class="lbl"><span>Celý shop</span><span>Celý shop</span></span></a>
      <a class="link-arrow" href="poukazy.html">Raději darujete? Poukazy <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- obleceni ---- */
pages.push({
  file: 'obleceni.html', title: 'Oblečení & boty', desc: 'Klubová kolekce BeBirdie — polo, merino svetry a golfová obuv.',
  body: hero({ kicker: 'Shop · oblečení & boty', title: 'Klubová kolekce', crumb: [['Domů', 'index.html'], ['Shop', 'obchod.html'], ['Oblečení &amp; boty', '']],
    lede: 'Navrženo pro green i kancelář. Střídmé střihy, prémiové materiály a birdie tam, kde ho poznají jen zasvěcení.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="wine__grid" style="margin-bottom:var(--space-xl)">
      ${productCard('polo', 'Klubové polo BeBirdie', 'produkt-polo.html', IMG.polo, 'Pima bavlna · ivory / ink', 'Vyšitý birdie na hrudi. Střih, který sedí na odpališti i u večeře.', 1490)}
      ${productCard('svetr', 'Merino svetr BeBirdie', 'produkt-svetr.html', IMG.svetr, '100% merino · ink', 'Jemné merino na chladnější rána na greenu i do kanceláře.', 2990)}
      ${productCard('obuv', 'Klubová golfová obuv', 'produkt-obuv.html', IMG.obuv, 'Limitovaná edice · burgundy', 'Kožený svršek, soft-spike podrážka. Vyrobeno v limitované sérii.', 4490, 'Limited')}
    </div>
    <p class="muted" style="max-width:40rem">Členové klubu nakupují kolekci se slevou 10 %. Velikostní tabulku a výměny řešíme osobně — napište na <a href="mailto:bebirdie@bebirdie.cz" style="text-decoration:underline">bebirdie@bebirdie.cz</a>.</p>
    <div class="detail__actions" style="margin-top:var(--space-md)">
      <a class="btn btn--ink" href="sperky.html"><span class="lbl"><span>Šperky &amp; doplňky</span><span>Šperky &amp; doplňky</span></span></a>
      <a class="link-arrow" href="obchod.html">Celý shop <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- sperky ---- */
pages.push({
  file: 'sperky.html', title: 'Šperky & doplňky', desc: 'Šperky a doplňky BeBirdie — stříbrné ball markery, manžetové knoflíčky a kožené doplňky.',
  body: hero({ kicker: 'Shop · šperky & doplňky', title: 'Detaily, které hrají', crumb: [['Domů', 'index.html'], ['Shop', 'obchod.html'], ['Šperky &amp; doplňky', '']],
    lede: 'Drobnosti, které dělají hráče. Stříbro, mosaz a italská kůže — s gravírováním v ceně.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="wine__grid" style="margin-bottom:var(--space-xl)">
      ${productCard('marker', 'Stříbrný ball marker', 'produkt-marker.html', IMG.marker, 'Stříbro 925', 'Gravírování iniciál v ceně. Dárek, který se na greenu neztratí.', 2490)}
      ${productCard('knoflicky', 'Manžetové knoflíčky Birdie', 'produkt-knoflicky.html', IMG.prsten, 'Mosaz · zlacení', 'Motiv birdie pro slavnostní večery. V klubové dárkové kazetě.', 3990)}
      ${productCard('pouzdro', 'Kožené pouzdro na skórkartu', 'produkt-pouzdro.html', IMG.kuze, 'Italská kůže', 'Ručně šité, s kapsou na tužku a markery. Personalizace ražbou.', 1990)}
    </div>
    <div class="detail__actions">
      <a class="btn btn--ink" href="poukazy.html"><span class="lbl"><span>Dárkové poukazy</span><span>Dárkové poukazy</span></span></a>
      <a class="link-arrow" href="obchod.html">Celý shop <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- poukazy ---- */
pages.push({
  file: 'poukazy.html', title: 'Dárkové poukazy', desc: 'Dárkové poukazy BeBirdie 2 000 až 8 000 Kč — na turnaje, kurzy, vína i kolekci.',
  body: hero({ kicker: 'Shop · dárkové poukazy', title: 'Darujte zážitek', crumb: [['Domů', 'index.html'], ['Shop', 'obchod.html'], ['Dárkové poukazy', '']],
    lede: 'Poukaz lze uplatnit na cokoliv z klubu — turnaj, kurz AI, víno i kolekci. Platí 12 měsíců.' }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="wine__grid wine__grid--4" style="margin-bottom:var(--space-2xl)">
      ${voucher('poukaz-2000', 2000)}${voucher('poukaz-4000', 4000)}${voucher('poukaz-6000', 6000)}${voucher('poukaz-8000', 8000)}
    </div>
    <p class="kicker" style="margin-bottom:var(--space-md)">Jak to funguje</p>
    <ol class="steps" style="margin-bottom:var(--space-xl)">
      <li><span class="n tnum">01</span><b>Vyberete hodnotu</b><p>Od 2 000 do 8 000 Kč. Vyšší hodnotu připravíme na míru — stačí napsat.</p></li>
      <li><span class="n tnum">02</span><b>Poukaz dorazí ihned</b><p>Elektronicky e-mailem, nebo tištěný v klubové obálce poštou do dvou dnů.</p></li>
      <li><span class="n tnum">03</span><b>Obdarovaný si vybere</b><p>Turnaj, kurz, víno nebo kolekci. Poukaz platí 12 měsíců na celý klub.</p></li>
    </ol>
    <div class="detail__actions">
      <a class="btn btn--ink" href="kontakt.html"><span class="lbl"><span>Poukaz na míru</span><span>Poukaz na míru</span></span></a>
      <a class="link-arrow" href="podminky.html">Podmínky poukazů <span class="arr">↗</span></a>
    </div>
  </div></section>`
});

/* ---- products ---- */
const productPage = (slug, name, origin, price, img, notes, facts, unit) => ({
  file: `produkt-${slug}.html`, title: name, desc: `${name} — ${origin}. ${price} Kč v shopu BeBirdie.`,
  body: hero({ kicker: 'Shop', title: name, crumb: [['Domů', 'index.html'], ['Shop', 'obchod.html'], [name, '']] }) +
  `<section class="page-body" data-theme="ivory"><div class="container">
    <div class="detail">
      <div class="detail__media"><img src="${u(img, 1200)}" alt="${name}" onerror="this.style.display='none'"></div>
      <div>
        <p class="origin" style="font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--t-mut-l);font-weight:600;margin-bottom:1rem">${origin}</p>
        <p class="body-lg" style="max-width:34rem;font-family:var(--serif);font-style:italic">${notes}</p>
        <ul class="detail__facts">${facts.map(f => `<li><span class="k">${f[0]}</span><span class="v">${f[1]}</span></li>`).join('')}</ul>
        <div class="detail__price tnum">${price} Kč <small>${unit || 'vč. DPH'}</small></div>
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
  [['Odrůda', 'Sangiovese'], ['Barva', 'červené · suché'], ['Servírovat', '16–18 °C'], ['Snoubení', 'hovězí, zrající sýry']], 'vč. DPH · 0,75 l'));
pages.push(productPage('i-pecorari', 'I Pecorari', 'Friuli · Itálie', '239', IMG.wineGlasses,
  'Svěží, minerální bílé z Friuli. Citrusy, bílé květy a čistý závěr — láhev, kterou otevíráte pro hosty.',
  [['Odrůda', 'Pinot Grigio'], ['Barva', 'bílé · suché'], ['Servírovat', '8–10 °C'], ['Snoubení', 'ryby, předkrmy']], 'vč. DPH · 0,75 l'));
pages.push(productPage('casal', 'Casal da Coelheira 2022', 'Tejo · Portugalsko', '220', IMG.wineDark,
  'Plné, hřejivé červené z údolí Tejo. Zralé ovoce, jemné koření a dlouhý závěr — k večeru u krbu i k jednání.',
  [['Odrůda', 'cuvée · Touriga Nacional'], ['Ročník', '2022'], ['Servírovat', '16–18 °C'], ['Snoubení', 'grilované maso, tmavá čokoláda']], 'vč. DPH · 0,75 l'));
pages.push(productPage('polo', 'Klubové polo BeBirdie', 'Klubová kolekce', '1 490', IMG.polo,
  'Pima bavlna s vyšitým birdie na hrudi. Střih, který sedí na odpališti i u večeře.',
  [['Materiál', '100% pima bavlna'], ['Barvy', 'ivory · ink'], ['Velikosti', 'S–XXL'], ['Údržba', 'praní 30 °C']]));
pages.push(productPage('svetr', 'Merino svetr BeBirdie', 'Klubová kolekce', '2 990', IMG.svetr,
  'Jemné merino na chladnější rána na greenu i do kanceláře. Diskrétní birdie na rukávu.',
  [['Materiál', '100% merino vlna'], ['Barva', 'ink'], ['Velikosti', 'S–XXL'], ['Údržba', 'ruční praní']]));
pages.push(productPage('obuv', 'Klubová golfová obuv', 'Limitovaná edice', '4 490', IMG.obuv,
  'Kožený svršek v klubové burgundy, soft-spike podrážka a číslovaná limitovaná série.',
  [['Svršek', 'prémiová kůže'], ['Podrážka', 'soft-spike'], ['Barva', 'burgundy'], ['Série', 'limitovaná · číslovaná']]));
pages.push(productPage('marker', 'Stříbrný ball marker', 'Šperky & doplňky', '2 490', IMG.marker,
  'Ball marker ze stříbra 925 s gravírováním iniciál v ceně. Dárek, který se na greenu neztratí.',
  [['Materiál', 'stříbro 925'], ['Gravírování', 'iniciály v ceně'], ['Balení', 'klubová kazeta'], ['Dodání', 'do 5 dnů']]));
pages.push(productPage('knoflicky', 'Manžetové knoflíčky Birdie', 'Šperky & doplňky', '3 990', IMG.prsten,
  'Motiv birdie pro slavnostní večery. Mosaz se zlacením, dodáváno v klubové dárkové kazetě.',
  [['Materiál', 'mosaz · zlacení'], ['Motiv', 'birdie'], ['Balení', 'dárková kazeta'], ['Dodání', 'skladem']]));
pages.push(productPage('pouzdro', 'Kožené pouzdro na skórkartu', 'Šperky & doplňky', '1 990', IMG.kuze,
  'Ručně šité pouzdro z italské kůže s kapsou na tužku a markery. Personalizace ražbou.',
  [['Materiál', 'italská kůže'], ['Personalizace', 'ražba iniciál'], ['Barva', 'koňaková'], ['Dodání', 'do 5 dnů']]));

/* ---- tabory ---- */
pages.push({
  file: 'tabory.html', title: 'Příměstské tábory', desc: 'Sportovní příměstský tábor BeBirdie pro děti 6–13 let. Golf s trenéry PGA na Rohanském ostrově.',
  body: hero({ kicker: 'Pro děti · léto 2026', title: 'Sportovní příměstský tábor', crumb: [['Domů', 'index.html'], ['Golfové túry', 'tury.html'], ['Tábory', '']],
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
      <p>Turnaje organizují lidé, kteří golf hrají celý život. Kurzy vedou <a href="lektori.html" style="text-decoration:underline">lektoři z praxe</a> — podnikatelé a specialisté, kteří technologie denně používají ve vlastních firmách. A vína vybírá sommelier, který ochutnal víc láhví, než je zdrávo.</p>
    </div>
    <div class="stats" style="margin-top:var(--space-xl);justify-content:flex-start">
      <div class="stat"><div class="v tnum" style="color:var(--gold-deep)">14<sup style="color:var(--t-mut-l)">+</sup></div><div class="l" style="color:var(--t-mut-l)">turnajů ročně</div></div>
      <div class="stat"><div class="v tnum" style="color:var(--gold-deep)">10</div><div class="l" style="color:var(--t-mut-l)">hřišť Open Tour</div></div>
      <div class="stat"><div class="v tnum" style="color:var(--gold-deep)">25.</div><div class="l" style="color:var(--t-mut-l)">ročník Miss Golf</div></div>
    </div>
    <div class="detail__actions" style="margin-top:var(--space-xl)">
      <a class="btn btn--ink" href="klub.html"><span class="lbl"><span>Požádat o členství</span><span>Požádat o členství</span></span></a>
      <a class="link-arrow" href="partneri.html">Naši partneři <span class="arr">↗</span></a>
      <a class="link-arrow" href="kontakt.html">Kontakt <span class="arr">↗</span></a>
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
      <a class="link-arrow" href="partnerska-hriste.html">Partnerská hřiště <span class="arr">↗</span></a>
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
          <li><span class="k">Působíme</span><span class="v">Praha &amp; střední Čechy</span></li>
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
  'U zboží ze shopu platí zákonná lhůta 14 dnů pro odstoupení od smlouvy. Prodej alkoholu osobám mladším 18 let je zakázán.',
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
