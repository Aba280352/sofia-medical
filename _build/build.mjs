// Builds the static preview pages for the Sofia Medical site.
// Usage: node _build/build.mjs   (run from the site folder)
// Icons come from ../design/icons (ANIMTD icons, Lucide set, stroke 1.25).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TREATMENTS } from "./data-treatments.mjs";
import { TEAM, TEAM_PAGE } from "./data-team.mjs";
import { PROFILES } from "./data-team-profiles.mjs";
import { REVIEWS, REVIEWS_PAGE, VIDEOS } from "./data-reviews.mjs";
import { FAQ, FAQ_PAGE } from "./data-faq.mjs";
import { SERVICES_PAGE } from "./data-services.mjs";
import { NEW_SERVICE_PAGES, NEW_SERVICE_CARDS } from "./data-new-services.mjs";
import { SERVICE_PAGES } from "./data-service-pages.mjs";
import { ARTICLES } from "./data-articles.mjs";
import { AREAS } from "./data-areas.mjs";
import { LEGAL } from "./data-legal.mjs";
import { COVER_SLUGS } from "./make-article-covers.mjs";
import { I18N } from "./data-i18n.mjs";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ICONS = join(SITE, "..", "design", "icons");

const icon = (name, cls = "") =>
  readFileSync(join(ICONS, `${name}.svg`), "utf8")
    .replace(/^﻿/, "")
    .replace(' xmlns="http://www.w3.org/2000/svg"', "")
    .replace("<svg", `<svg aria-hidden="true" focusable="false"${cls ? ` class="${cls}"` : ""}`);

/* ---------- New service pages (2026-11-27): rheumatology (16) and CBT-I (17) ---------- */
SERVICE_PAGES.push(...NEW_SERVICE_PAGES);
SERVICES_PAGE.push(...NEW_SERVICE_CARDS);
// team pages keep the person; the service keyword moves to the new service pages
PROFILES["mohammad-mahajna"].title = 'ד"ר מוחמד מחאג\'נה: מומחה בראומטולוגיה ורפואה פנימית | סופיה מדיקל';
PROFILES["mohammad-mahajna"].blocks.push({ t: "p", x: "פרטים נוספים על הייעוץ, ההכנה לפגישה והשאלות הנפוצות נמצאים בעמוד [[ראומטולוג פרטי בכפר סבא|/שירותים/ראומטולוג-פרטי]]." });
PROFILES["vlada-guizman"].title = "ולאדה גויזמן: מומחית בהפרעות שינה | סופיה מדיקל";
PROFILES["vlada-guizman"].blocks.push({ t: "p", x: "על שלבי הטיפול, מספר המפגשים ולמי הוא מתאים אפשר לקרוא בעמוד [[CBT-I: טיפול בנדודי שינה ללא תרופות|/שירותים/cbt-i-טיפול-בנדודי-שינה]]." });

/* ---------- Business data (from the current site) ---------- */
const CONTACT = {
  mobile: { display: "050-465-1970", href: "tel:+972504651970" },
  landline: { display: "09-7400009", href: "tel:+97297400009" },
  email: "Info@sofia-medical.com",
  address: "יוחנן הסנדלר 6, קומה 5, כפר סבא",
  maps: "https://maps.google.com/?q=%D7%99%D7%95%D7%97%D7%A0%D7%9F+%D7%94%D7%A1%D7%A0%D7%93%D7%9C%D7%A8+6%2C+%D7%A7%D7%95%D7%9E%D7%94+5%2C+%D7%9B%D7%A4%D7%A8+%D7%A1%D7%91%D7%90",
};
const WA = "https://wa.me/972504651970";
// icon on the left of the text: before it in left to right languages, after it in right to left ones
const ibd = (dir, text, ico) => (dir === "ltr" ? ico + text : text + ico);
const waLink = (text) => `${WA}?text=${encodeURIComponent(text)}`;

/* ---------- Main menu: same pages and URLs as the current site ---------- */
const MENU = [
  { label: "בית", href: "/" },
  { label: "אודות", href: "/אודות-סופיה-מדיקל" },
  { label: "הצוות", href: "/הצוות" },
  { label: "שירותים", href: "/שירותים" },
  { label: "מאמרים", href: "/מאמרים" },
  {
    label: "המלצות", href: "/המלצות",
    sub: [
      { label: "המלצות", href: "/המלצות" },
      { label: "המלצות וידאו", href: "/המלצות-וידאו" },
      { label: "בתקשורת", href: "/בתקשורת" },
    ],
  },
  { label: "שאלות נפוצות", href: "/שאלות-נפוצות" },
  { label: "צור קשר", href: "/צור-קשר" },
];

/* ---------- Languages: Hebrew is the full site, others are noindex landing pages ---------- */
const LANGS = {
  he: { name: "עברית", code: "HE", dir: "rtl", href: "/", cta: "השארת פרטים", ctaHref: "/צור-קשר", skip: "דילוג לתוכן", menu: "תפריט", close: "סגירת התפריט", langLabel: "בחירת שפה", home: "סופיה מדיקל, לדף הבית", contactLabel: "פרטי התקשרות", navLabel: "תפריט ראשי", subOpen: "פתיחת תת תפריט" },
  en: { name: "English", code: "EN", dir: "ltr", href: "/en/", cta: "Leave your details", ctaHref: "#lead", skip: "Skip to content", langLabel: "Choose language", home: "Sofia Medical, top of page", contactLabel: "Contact details" },
  ru: { name: "Русский", code: "RU", dir: "ltr", href: "/ru/", cta: "Оставить заявку", ctaHref: "#lead", skip: "Перейти к содержанию", langLabel: "Выбор языка", home: "Sofia Medical, в начало страницы", contactLabel: "Контакты" },
  ar: { name: "العربية", code: "AR", dir: "rtl", href: "/ar/", cta: "اترك تفاصيلك", ctaHref: "#lead", skip: "انتقل إلى المحتوى", langLabel: "اختيار اللغة", home: "صوفيا ميديكال، أعلى الصفحة", contactLabel: "معلومات الاتصال" },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function langSwitcher(cur, id) {
  const items = Object.entries(LANGS).map(([k, l]) =>
    `<li><a href="${l.href}" lang="${k}" hreflang="${k}"${k === cur ? ' aria-current="true"' : ""}>${l.name}</a></li>`).join("");
  return `
      <div class="sm-lang" data-dropdown>
        <button class="sm-lang__btn" type="button" aria-expanded="false" aria-controls="${id}" aria-label="${LANGS[cur].langLabel}: ${LANGS[cur].name}">
          <span aria-hidden="true">${LANGS[cur].code}</span>${icon("globe", "sm-ico")}${icon("chevron-down", "sm-ico sm-ico--chev")}
        </button>
        <ul class="sm-dropdown" id="${id}" role="list">${items}</ul>
      </div>`;
}

function topbar(cur) {
  const L = LANGS[cur], T = I18N[cur];
  // translated landing pages: icon on the left of the text, English address
  if (T) return `
<div class="sm-topbar" role="region" aria-label="${L.contactLabel}">
  <div class="sm-wrap sm-topbar__in">
    <ul class="sm-topbar__list" role="list">
      <li><a href="${CONTACT.mobile.href}">${ibd(L.dir, `<span dir="ltr">${CONTACT.mobile.display}</span>`, icon("smartphone", "sm-ico"))}</a></li>
      <li class="sm-hide-m"><a href="${CONTACT.landline.href}">${ibd(L.dir, `<span dir="ltr">${CONTACT.landline.display}</span>`, icon("phone", "sm-ico"))}</a></li>
      <li><a href="mailto:${CONTACT.email}">${ibd(L.dir, `<span class="sm-hide-xs">${CONTACT.email}</span><span class="sm-sr sm-show-xs">${CONTACT.email}</span>`, icon("mail", "sm-ico"))}</a></li>
    </ul>
    <ul class="sm-topbar__list" role="list"><li class="sm-topbar__addr"><a href="${CONTACT.maps}" target="_blank" rel="noopener">${ibd(L.dir, `<span>${T.address}</span>`, icon("map-pin", "sm-ico"))}<span class="sm-sr">${T.newWin}</span></a></li></ul>
  </div>
</div>`;
  const address = cur === "he"
    ? `<li class="sm-topbar__addr"><a href="${CONTACT.maps}" target="_blank" rel="noopener"><span>${CONTACT.address}</span><span class="sm-sr"> (נפתח בחלון חדש)</span>${icon("map-pin", "sm-ico")}</a></li>`
    : "";
  return `
<div class="sm-topbar" role="region" aria-label="${L.contactLabel}">
  <div class="sm-wrap sm-topbar__in">
    <ul class="sm-topbar__list" role="list">
      <li><a href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span>${icon("smartphone", "sm-ico")}</a></li>
      <li class="sm-hide-m"><a href="${CONTACT.landline.href}"><span dir="ltr">${CONTACT.landline.display}</span>${icon("phone", "sm-ico")}</a></li>
      <li><a href="mailto:${CONTACT.email}"><span class="sm-hide-xs">${CONTACT.email}</span><span class="sm-sr sm-show-xs">${CONTACT.email}</span>${icon("mail", "sm-ico")}</a></li>
    </ul>
    <ul class="sm-topbar__list" role="list">${address}</ul>
  </div>
</div>`;
}

function navDesktop(currentHref) {
  return MENU.map((m, i) => {
    const cur = m.href === currentHref ? ' aria-current="page"' : "";
    if (!m.sub) return `<li><a class="sm-nav__link" href="${m.href}"${cur}>${m.label}</a></li>`;
    const subs = m.sub.map((s) => `<li><a href="${s.href}">${s.label}</a></li>`).join("");
    return `<li class="sm-nav__has-sub" data-dropdown>
          <a class="sm-nav__link" href="${m.href}"${cur}>${m.label}</a>
          <button class="sm-nav__sub-btn" type="button" aria-expanded="false" aria-controls="sm-sub-${i}" aria-label="${LANGS.he.subOpen}: ${m.label}">${icon("chevron-down", "sm-ico sm-ico--chev")}</button>
          <ul class="sm-dropdown" id="sm-sub-${i}" role="list">${subs}</ul>
        </li>`;
  }).join("\n        ");
}

function navDrawer(currentHref) {
  return MENU.map((m, i) => {
    const cur = m.href === currentHref ? ' aria-current="page"' : "";
    if (!m.sub) return `<li><a href="${m.href}"${cur}>${m.label}</a></li>`;
    const subs = m.sub.map((s) => `<li><a href="${s.href}">${s.label}</a></li>`).join("");
    return `<li class="sm-drawer__has-sub">
            <div class="sm-drawer__row"><a href="${m.href}"${cur}>${m.label}</a><button type="button" class="sm-drawer__sub-btn" aria-expanded="false" aria-controls="sm-dsub-${i}" aria-label="${LANGS.he.subOpen}: ${m.label}">${icon("chevron-down", "sm-ico sm-ico--chev")}</button></div>
            <ul id="sm-dsub-${i}" class="sm-drawer__sub" role="list" hidden>${subs}</ul>
          </li>`;
  }).join("\n          ");
}

/* Translated landing page header: the menu jumps to sections of the page and
   the CTA opens WhatsApp. No links to the inner pages (they are in Hebrew). */
function headerLanding(cur) {
  const L = LANGS[cur], T = I18N[cur];
  const waCta = (cls) => `<a class="btn btn-wa ${cls}" href="${waLink(T.waHello)}" target="_blank" rel="noopener">${ibd(L.dir, T.wa, icon("whatsapp", "sm-ico sm-ico--fill"))}<span class="sm-sr">${T.newWin}</span></a>`;
  // "Leave your details" jumps to the form at the bottom of the page (#lead), as the Hebrew header does
  const leadCta = (cls, extra = "") => `<a class="btn btn-cta ${cls}" href="${L.ctaHref}"${extra}>${L.cta}</a>`;
  return `<a class="sm-skip" href="#main">${L.skip}</a>
${topbar(cur)}
<header class="sm-header" id="sm-header">
  <div class="sm-wrap sm-header__in">
    <a class="sm-logo" href="#top" aria-label="${L.home}">
      <img src="/assets/img/logo-icon.png" alt="" width="240" height="293" fetchpriority="high">
    </a>
    <nav class="sm-nav" aria-label="${T.navLabel}">
      <ul class="sm-nav__list" role="list">
        ${T.nav.map(([t, h]) => `<li><a class="sm-nav__link" href="${h}">${t}</a></li>`).join("\n        ")}
      </ul>
    </nav>
    <div class="sm-header__actions">${langSwitcher(cur, `sm-lang-${cur}`)}
      ${waCta("sm-header__wa")}
      ${leadCta("sm-header__cta")}
      <button class="sm-burger" type="button" aria-expanded="false" aria-controls="sm-drawer" aria-label="${T.menu}">${icon("menu", "sm-ico")}</button>
    </div>
  </div>
</header>
<div class="sm-drawer" id="sm-drawer" role="dialog" aria-modal="true" aria-label="${T.menu}" hidden>
  <div class="sm-drawer__scrim" data-close></div>
  <div class="sm-drawer__panel">
    <div class="sm-drawer__head">
      <a class="sm-logo" href="#top" data-close aria-label="${L.home}"><img src="/assets/img/logo-icon.png" alt="" width="240" height="293"></a>
      <button class="sm-drawer__close" type="button" data-close aria-label="${T.close}">${icon("x", "sm-ico")}</button>
    </div>
    <nav aria-label="${T.navLabel}">
      <ul class="sm-drawer__nav" role="list">
          ${T.nav.map(([t, h]) => `<li><a href="${h}" data-close>${t}</a></li>`).join("\n          ")}
      </ul>
    </nav>
    ${leadCta("sm-drawer__cta", " data-close")}
    ${waCta("sm-drawer__cta")}
    <ul class="sm-drawer__contact" role="list">
      <li><a href="${CONTACT.mobile.href}">${ibd(L.dir, `<span dir="ltr">${CONTACT.mobile.display}</span>`, icon("smartphone", "sm-ico"))}</a></li>
      <li><a href="${CONTACT.landline.href}">${ibd(L.dir, `<span dir="ltr">${CONTACT.landline.display}</span>`, icon("phone", "sm-ico"))}</a></li>
      <li><a href="mailto:${CONTACT.email}">${ibd(L.dir, `<span>${CONTACT.email}</span>`, icon("mail", "sm-ico"))}</a></li>
      <li><a href="${CONTACT.maps}" target="_blank" rel="noopener">${ibd(L.dir, `<span>${T.address}</span>`, icon("map-pin", "sm-ico"))}<span class="sm-sr">${T.newWin}</span></a></li>
    </ul>
    <ul class="sm-drawer__langs" role="list" aria-label="${L.langLabel}">
      ${Object.entries(LANGS).map(([k, l]) => `<li><a href="${l.href}" lang="${k}" hreflang="${k}"${k === cur ? ' aria-current="true"' : ""}>${l.name}</a></li>`).join("")}
    </ul>
  </div>
</div>`;
}

function header(cur, currentHref = "/") {
  if (I18N[cur]) return headerLanding(cur);
  const L = LANGS[cur];
  const landing = cur !== "he";
  const logoHref = landing ? "#top" : "/";
  const nav = landing ? "" : `
    <nav class="sm-nav" aria-label="${L.navLabel}">
      <ul class="sm-nav__list" role="list">
        ${navDesktop(currentHref)}
      </ul>
    </nav>`;
  const burger = landing ? "" : `
      <button class="sm-burger" type="button" aria-expanded="false" aria-controls="sm-drawer" aria-label="${L.menu}">${icon("menu", "sm-ico")}</button>`;
  const drawer = landing ? "" : `
<div class="sm-drawer" id="sm-drawer" role="dialog" aria-modal="true" aria-label="${L.menu}" hidden>
  <div class="sm-drawer__scrim" data-close></div>
  <div class="sm-drawer__panel">
    <div class="sm-drawer__head">
      <a class="sm-logo" href="/" aria-label="${L.home}"><img src="/assets/img/logo-icon.png" alt="" width="240" height="293"></a>
      <button class="sm-drawer__close" type="button" data-close aria-label="${L.close}">${icon("x", "sm-ico")}</button>
    </div>
    <nav aria-label="${L.navLabel}">
      <ul class="sm-drawer__nav" role="list">
          ${navDrawer(currentHref)}
      </ul>
    </nav>
    <a class="btn btn-cta sm-drawer__cta" href="${L.ctaHref}">${L.cta} ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
    <ul class="sm-drawer__contact" role="list">
      <li><a href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span>${icon("smartphone", "sm-ico")}</a></li>
      <li><a href="${CONTACT.landline.href}"><span dir="ltr">${CONTACT.landline.display}</span>${icon("phone", "sm-ico")}</a></li>
      <li><a href="mailto:${CONTACT.email}"><span>${CONTACT.email}</span>${icon("mail", "sm-ico")}</a></li>
      <li><a href="${CONTACT.maps}" target="_blank" rel="noopener"><span>${CONTACT.address}</span><span class="sm-sr"> (נפתח בחלון חדש)</span>${icon("map-pin", "sm-ico")}</a></li>
    </ul>
    <ul class="sm-drawer__langs" role="list" aria-label="${L.langLabel}">
      ${Object.entries(LANGS).map(([k, l]) => `<li><a href="${l.href}" lang="${k}" hreflang="${k}"${k === cur ? ' aria-current="true"' : ""}>${l.name}</a></li>`).join("")}
    </ul>
  </div>
</div>`;

  return `<a class="sm-skip" href="#main">${L.skip}</a>
${topbar(cur)}
<header class="sm-header${landing ? " sm-header--landing" : ""}" id="sm-header">
  <div class="sm-wrap sm-header__in">
    <a class="sm-logo" href="${logoHref}" aria-label="${L.home}">
      <img src="/assets/img/logo-icon.png" alt="" width="240" height="293" fetchpriority="high">
    </a>${nav}
    <div class="sm-header__actions">${langSwitcher(cur, `sm-lang-${cur}`)}
      <a class="btn btn-cta sm-header__cta" href="${L.ctaHref}">${L.cta} ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>${burger}
    </div>
  </div>
</header>${drawer}`;
}

/* ---------- Page shell ---------- */
function page({ lang, title, description, robots, canonical, body, head = "" }) {
  const L = LANGS[lang];
  return `<!doctype html>
<html lang="${lang}" dir="${L.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">${canonical ? `\n<link rel="canonical" href="${canonical}">` : ""}
<link rel="preload" href="/assets/fonts/Polin-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/Polin-Medium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/header.css">${lang === "he" || I18N[lang] ? `
<link rel="stylesheet" href="/assets/css/insure.css">
<script src="/assets/js/insure.js" defer></script>` : ""}${head}
<script src="/assets/js/header.js" defer></script>
<script src="/assets/js/form-other.js" defer></script>
</head>
<body id="top">
${body}
</body>
</html>
`;
}

/* ---------- Home hero (Hebrew). All copy is existing text from the current site. ---------- */
const SERVICES = [
  { name: "רפואה שיקומית מתקדמת", href: "/רפואה-שיקומית-מתקדמת", icon: "accessibility" },
  { name: "טיפול בכאב", href: "/גישות-מתקדמות-לטיפול-בכאב", icon: "zap" },
  { name: "אבחון וטיפול בהפרעות שינה", href: "/אבחון-וטיפול-מקצועי-בהפרעות-שינה", icon: "moon" },
  { name: "פיזיותרפיה מתקדמת", href: "/מאמרים/טיפול-פיזיותרפיה-בסופיה-מדיקל", icon: "person-standing" },
  { name: "שיקום נוירולוגי עם recoveriX", href: "/מאמרים/שיקום-לאחר-אירוע-מוחי-עם-recoverix-טכנולוגיה-מתקדמת-לשיקום-נוירולוגי", icon: "brain" },
  { name: "שיקום מיני ואורולוגי", href: "/מאמרים/שיקום-מיני", icon: "heart-pulse" },
];
// Latin words, emails and phone numbers read left to right inside Hebrew text
const latin = (s) => s.replace(/(CBT-I|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\+?\d[\d-]{6,}\d|[A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9])/g, '<span dir="ltr">$1</span>');
// [[anchor|/path]] inside data text becomes a link (the rest goes through latin)
const rich = (s) => {
  const L = [];
  const t = s.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (m, a, h) => { L.push(`<a href="${h}">${latin(a)}</a>`); return "\u0000" + (L.length - 1) + "\u0000"; });
  return latin(t).replace(/\u0000(\d+)\u0000/g, (m, i) => L[+i]);
};

/* ---------- Insurance arrangements (client notes, 2026-11-25) ----------
   Texts from the client's notes document, dashes replaced. Used by the
   rotating seal in the home hero, the card on the relevant service pages
   and the floating strip on every Hebrew page. */
const INSURE = [
  { key: "clalit", img: "badge-clalit-mushlam", alt: "כללית מושלם", name: "כללית מושלם",
    text: 'ייעוץ רפואי אצל ד"ר עלא מחאמיד בתחומי השיקום ורפואת השינה, בהשתתפות עצמית של 150 ש"ח, בכפוף לזכאות ולתנאי ההסדר.' },
  { key: "bwell", img: "badge-bwell", alt: "BWell מבית מגדל", name: '<span dir="ltr">BWell</span> ומגדל',
    text: 'ייעוץ רפואי בתחום רפואת הכאב (ד"ר ירונה), ייעוץ אורולוגי (ד"ר הייתם) וטיפולי פיזיותרפיה, בהשתתפות עצמית ובהתאם לתנאי הפוליסה.' },
];
const seal = (x, w, cls, lazy = false) => `<img class="${cls}" src="/assets/img/hero/${x.img}-160.webp" srcset="/assets/img/hero/${x.img}-160.webp 1x, /assets/img/hero/${x.img}-320.webp 2x" width="${w}" height="${w}" alt="${esc(x.alt)}"${lazy ? ' loading="lazy"' : ""} decoding="async">`;
/* Service page index -> arrangement shown on it */
const SVC_INSURE = { 0: "clalit", 5: "clalit", 3: "bwell", 9: "bwell", 15: "bwell" };
const svcInsure = (i) => {
  const x = INSURE.find((y) => y.key === SVC_INSURE[i]);
  if (!x) return "";
  return `
      <div class="sm-svc-insure">
        ${seal(x, 72, "sm-svc-insure__seal")}
        <p><strong>הסדר עם ${x.name}</strong>${x.text}</p>
      </div>`;
};
const insureStrip = () => `
<aside class="sm-istrip" data-istrip hidden aria-label="הסדרים עם קופות וחברות ביטוח">
  <div class="sm-istrip__in">
    <span class="sm-istrip__seals" aria-hidden="true">${INSURE.map((x) => `<img src="/assets/img/hero/${x.img}-160.webp" width="40" height="40" alt="" loading="lazy" decoding="async">`).join("")}</span>
    <p class="sm-istrip__text"><strong>הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל</strong><span class="sm-istrip__sub"> ייעוץ רפואי בהשתתפות עצמית</span></p>
    <a class="btn btn-cta sm-istrip__cta" href="/צור-קשר">השארת פרטים</a>
    <button class="sm-istrip__close" type="button" aria-label="סגירת ההודעה">${icon("x", "sm-ico")}</button>
  </div>
</aside>`;

const heroHome = () => `
<main id="main" tabindex="-1">
<section class="sm-hero" aria-labelledby="hero-title">
  <div class="sm-hero__stage">
    <picture class="sm-hero__bg">
      <source media="(max-width: 1024px)" type="image/webp"
              srcset="/assets/img/hero/hero-clinic-m-480.webp 480w, /assets/img/hero/hero-clinic-m-768.webp 768w, /assets/img/hero/hero-clinic-m-1080.webp 1080w" sizes="100vw">
      <img src="/assets/img/hero/hero-clinic-1920.webp"
           srcset="/assets/img/hero/hero-clinic-1280.webp 1280w, /assets/img/hero/hero-clinic-1920.webp 1920w, /assets/img/hero/hero-clinic-2560.webp 2560w"
           sizes="100vw" width="1920" height="1086" alt="" fetchpriority="high" decoding="async">
    </picture>
    <div class="sm-wrap sm-hero__grid">
      <div class="sm-hero__content">
        <h1 id="hero-title" class="sm-hero__title"><span class="sm-hero__brand">סופיה מדיקל:</span> מרכז מוביל בישראל לשיקום, טיפול בכאב והפרעות שינה</h1>
        <p class="sm-hero__lead">רפואה מתקדמת, צוות מומחים ופתרונות מותאמים אישית לשיפור תפקוד ובריאות המטופלים</p>
        <div class="sm-hero__actions">
          <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
          <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
        </div>
        <div class="sm-hero__insure" data-insure>
          <div class="sm-insure__stage">
            ${INSURE.map((x, k) => `<div class="sm-insure__slide${k ? "" : " is-on"}" data-insure-slide>
              ${seal(x, 100, "sm-hero__seal")}
              <p><strong>הסדר עם ${x.name}</strong>${x.text}</p>
            </div>`).join("\n            ")}
          </div>
          <div class="sm-insure__nav" role="group" aria-label="בחירת הסדר">
            ${INSURE.map((x, k) => `<button class="sm-insure__dot" type="button" aria-label="${esc(x.alt)}" aria-pressed="${k ? "false" : "true"}"></button>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </div>

</section>
<div class="sm-flow">
  <div class="sm-wrap sm-hero__services">
    <nav class="sm-services" aria-labelledby="services-strip-title">
      <h2 id="services-strip-title" class="sm-sr">השירותים שלנו</h2>
      <ul class="sm-services__list" role="list">
        ${SERVICES.map((s) => `<li><a class="sm-service" href="${s.href}"><span class="sm-service__ico">${icon(s.icon, "sm-ico")}</span><span class="sm-service__name">${latin(s.name)}</span><span class="sm-service__more" aria-hidden="true">למידע נוסף ${icon("chevron-left", "sm-ico")}</span></a></li>`).join("\n        ")}
      </ul>
    </nav>
  </div>


<section class="sm-about" aria-labelledby="about-title">
  <div class="sm-wrap sm-about__grid">
    <div class="sm-about__text">
      <h2 id="about-title" class="sm-about__title">אודות <span class="hl">המרכז</span></h2>
      <p class="sm-about__lead">"סופיה מדיקל" הוא <strong>מרכז רפואי פרטי ומתקדם בכפר סבא</strong>, המתמחה בשיקום אמבולטורי, פיזיותרפיה מתקדמת, טיפולי פיזיותרפיה, שיקום אורתופדי, שיקום נוירולוגי, שיקום מיני ואורולוגי, טיפול בכאב ואבחון וטיפול בהפרעות שינה.</p>
      <p class="sm-about__body">המרכז פועל בהובלת ד"ר עלא מחאמיד, מומחה ברפואה פיזיקלית ושיקום ומומחה להפרעות שינה, ומעניק שירותים רפואיים ושיקומיים מתקדמים למבוגרים ולילדים, באמצעות צוות רב מקצועי וטכנולוגיות חדשניות.</p>
      <div class="sm-ticker" role="region" aria-label="תחומי ההתמחות">
        <div class="sm-ticker__track">
          <ul class="sm-ticker__list" role="list">${["שיקום אמבולטורי", "פיזיותרפיה מתקדמת", "שיקום אורתופדי", "שיקום נוירולוגי", "שיקום מיני ואורולוגי", "טיפול בכאב", "אבחון וטיפול בהפרעות שינה"].map((t) => `<li><span>${t}</span>${icon("check", "sm-ico")}</li>`).join("")}</ul>
          <ul class="sm-ticker__list" role="list" aria-hidden="true">${["שיקום אמבולטורי", "פיזיותרפיה מתקדמת", "שיקום אורתופדי", "שיקום נוירולוגי", "שיקום מיני ואורולוגי", "טיפול בכאב", "אבחון וטיפול בהפרעות שינה"].map((t) => `<li><span>${t}</span>${icon("check", "sm-ico")}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="sm-about__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="/אודות-סופיה-מדיקל">לעמוד האודות המלא</a>
      </div>
    </div>
    <div class="sm-about__media">
      <figure class="sm-about__figure">
        <div class="sm-about__frame">
          <img src="/assets/img/hero/dr-ala-mahamid-720.webp"
               srcset="/assets/img/hero/dr-ala-mahamid-440.webp 440w, /assets/img/hero/dr-ala-mahamid-720.webp 720w"
               sizes="(max-width: 1024px) 90vw, 460px" width="720" height="840"
               alt="ד&quot;ר עלא מחאמיד, מנהל ומייסד מרכז סופיה מדיקל" loading="lazy" decoding="async">
        </div>
        <figcaption class="sm-about__card"><strong>ד"ר עלא מחאמיד</strong><span>מומחה ברפואה פיזיקלית ושיקום ומומחה להפרעות שינה</span></figcaption>
      </figure>
    </div>
  </div>
</section>
</div>

<section class="sm-treat" aria-labelledby="treat-title">
  <div class="sm-wrap">
    <div class="sm-treat__head"><h2 id="treat-title" class="sm-treat__title">תחומי הטיפול <span class="hl">בסופיה מדיקל</span></h2></div>
    <div class="sm-treat__grid" data-tabs>
      <div class="sm-treat__tabs" role="tablist" aria-label="תחומי הטיפול" aria-orientation="vertical">
        ${TREATMENTS.map((t, i) => `<button class="sm-tab" type="button" role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span>${latin(t.tab)}</span>${icon(t.icon, "sm-ico")}</button>`).join("\n        ")}
      </div>
      <div class="sm-treat__panels">
        ${TREATMENTS.map((t, i) => `<div class="sm-panel" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}" tabindex="0"${i === 0 ? "" : " hidden"}>
          <div class="sm-panel__body">
            <h3 class="sm-panel__title">${latin(t.title)}</h3>
            ${t.paras.slice(0, 2).map((p) => `<p>${latin(p)}</p>`).join("")}
            <details class="sm-panel__more">
              <summary><span class="sm-more-open">המשך קריאה</span><span class="sm-more-close">פחות</span>${icon("chevron-down", "sm-ico")}</summary>
              ${t.paras.slice(2).map((p) => `<p>${latin(p)}</p>`).join("")}
            </details>
            <div class="sm-panel__actions">
              <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
              <a class="btn btn-ghost" href="${t.href}">למידע נוסף</a>
            </div>
          </div>
          <div class="sm-panel__media"><img src="/assets/img/${t.img}-600.webp" srcset="/assets/img/${t.img}-600.webp 600w, /assets/img/${t.img}-900.webp 900w" sizes="(max-width: 1024px) 100vw, 360px" width="600" height="800" alt="" loading="lazy" decoding="async"></div>
        </div>`).join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section class="sm-team" aria-labelledby="team-title" data-team>
  <div class="sm-wrap sm-team__grid">
    <div class="sm-team__text">
      <div class="sm-team__head">
        <h2 id="team-title" class="sm-team__title">צוות רב מקצועי</h2>
        <p class="sm-team__intro">במרכז פועל צוות מגוון ומיומן הכולל: רופאי שיקום, רופאים יועצים בתחומים שונים, פיזיותרפיסטים, פסיכולוגים, קלינאי תקשורת, טכנאי שינה ומרפאים בעיסוק.</p>
        <a class="btn btn-ghost sm-team__all" href="/הצוות">לעמוד הצוות המלא</a>
      </div>
      <div class="sm-team__cap is-idle" aria-live="polite" data-idle="רופאים ומטפלים מובילים, כל אחד בתחומו.">
        <div class="sm-team__win sm-team__win--name"></div>
        <div class="sm-team__win sm-team__win--role"></div>
        <div class="sm-team__win sm-team__win--line"></div>
      </div>
    </div>
    <ul class="sm-team__list" role="list">
      ${TEAM.map((m) => `<li><button class="sm-person" type="button" aria-pressed="false" aria-label="${esc(m.name)}, ${esc(m.role)}" data-name="${esc(m.name)}" data-role="${esc(m.role)}" data-line="${esc(m.line)}"><img src="/assets/img/team/${m.slug}.webp" width="480" height="600" alt="" loading="lazy" decoding="async"><span class="sm-person__tag" aria-hidden="true">${m.name}</span></button></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="sm-reviews" aria-labelledby="reviews-title">
  <div class="sm-wrap">
    <div class="sm-reviews__head">
      <h2 id="reviews-title" class="sm-reviews__title">המלצות</h2>
    </div>
    <div class="sm-carousel" data-carousel aria-roledescription="קרוסלה" aria-label="המלצות מטופלים">
      <div class="sm-carousel__track">
        ${REVIEWS.map((r, i) => `<figure class="sm-review" role="group" aria-roledescription="ביקורת" aria-label="${i + 1} מתוך ${REVIEWS.length}"><svg class="sm-review__mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 8c-4 1.5-6 4.5-6 9v3h6v-6H7.5M23 8c-4 1.5-6 4.5-6 9v3h6v-6h-3.5"/></svg><blockquote class="sm-review__quote">${r.quote}</blockquote><figcaption class="sm-review__name">${r.name}</figcaption></figure>`).join("\n        ")}
      </div>
      <div class="sm-carousel__controls">
        <button class="sm-carousel__btn" type="button" data-prev aria-label="ההמלצה הקודמת">${icon("arrow-left", "sm-ico")}</button>
        <button class="sm-carousel__btn" type="button" data-next aria-label="ההמלצה הבאה">${icon("arrow-left", "sm-ico")}</button>
      </div>
      <p class="sm-sr sm-carousel__live" aria-live="off"></p>
    </div>

    <div class="sm-videos">
      <div class="sm-reviews__head">
        <h2 class="sm-reviews__title">המלצות וידאו</h2>
        <p class="sm-videos__sub">כי אין כמו לשמוע ממי שכבר עבר את הדרך</p>
      </div>
      <ul class="sm-videos__list" role="list">
        ${["6989c89a73668", "6989c89d594af"].map((id, i) => `<li class="sm-video">
          <video src="/assets/video/testimonial-${id}.mp4" poster="/assets/video/testimonial-${id}.webp" preload="none" playsinline width="480" height="861" aria-label="המלצת וידאו ${i + 1}"></video>
          <button class="sm-video__play" type="button" aria-label="הפעלת המלצת וידאו ${i + 1}">${icon("play", "sm-ico sm-ico--fill")}</button>
        </li>`).join("\n        ")}
      </ul>
    </div>
    <div class="sm-reviews__head"><a class="btn btn-ghost sm-reviews__all" href="/המלצות">לכל ההמלצות</a> <a class="btn btn-ghost sm-reviews__all" href="/המלצות-וידאו">לכל המלצות הווידאו</a></div>
  </div>
</section>

<section class="sm-faq" aria-labelledby="faq-title">
  <div class="sm-wrap sm-faq__grid">
    <div class="sm-faq__side">
      <h2 id="faq-title" class="sm-faq__title">שאלות נפוצות</h2>
      <p class="sm-faq__lead">לא מצאתם תשובה? השאירו פרטים ונחזור אליכם.</p>
      <form class="sm-form" action="#" method="post" aria-label="השארת פרטים">
        <div class="sm-form__field"><label for="lead-name">שם מלא</label><input id="lead-name" name="name" type="text" autocomplete="name" required></div>
        <div class="sm-form__field"><label for="lead-phone">טלפון</label><input id="lead-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="rtl"></div>
        <div class="sm-form__field"><label for="lead-topic">תחום הטיפול</label>
          <select id="lead-topic" name="topic"><option value="">בחירה</option>${SERVICES.map((x) => `<option>${x.name}</option>`).join("")}<option>אחר</option></select></div>
        ${otherField("lead", "פירוט התלונה")}
        <button class="btn btn-cta" type="submit">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</button>
        <p class="sm-form__note">בשליחת הטופס אני מאשר/ת את <a href="/privacy">מדיניות הפרטיות</a>.</p>
      </form>
    </div>
    <div class="sm-faq__list">
      <div class="sm-acc">
        ${FAQ.map((x, i) => `<details name="faq"${i === 0 ? " open" : ""}><summary><span>${x.q}</span>${icon("plus", "sm-ico")}</summary><p>${latin(x.a)}</p></details>`).join("\n        ")}
      </div>
      <a class="btn btn-ghost sm-faq__all" href="/שאלות-נפוצות">לכל השאלות</a>
    </div>
  </div>
</section>
</main>`;

const placeholder = (lang) => `
<main id="main" tabindex="-1">
  <div class="sm-wip">
    <div class="sm-wrap">
      <p class="sm-wip__note">${lang === "he" ? "כאן ייבנה דף הבית. האזור הזה הוא רק לבדיקת ההדר בגלילה." : "Landing page content will be built here (header test only)."}</p>
    </div>
  </div>
</main>`;


/* ---------- Footer (Hebrew site) ---------- */
const FOOT_NAV = [
  ["בית", "/"], ["אודות סופיה מדיקל", "/אודות-סופיה-מדיקל"], ["הצוות", "/הצוות"], ["צוות רב מקצועי", "/צוות-רב-מקצועי"],
  ["חזון המרכז", "/חזון-המרכז"], ["הסדרים", "/הסדרים"], ["המלצות", "/המלצות"], ["המלצות וידאו", "/המלצות-וידאו"],
  ["בתקשורת", "/בתקשורת"], ["שאלות נפוצות", "/שאלות-נפוצות"], ["צור קשר", "/צור-קשר"],
];
const FOOT_ARTICLES = [
  ["מעבדת שינה", "/מאמרים/מעבדת-שינה"], ["טיפול בדום נשימה בשינה", "/מאמרים/טיפול-בדום-נשימה-בשינה"],
  ["כאב כרוני", "/מאמרים/כאב-כרוני"], ["טיפול בכאבי גב", "/מאמרים/טיפול-בכאבי-גב"],
  ["שיקום מיני", "/מאמרים/שיקום-מיני"], ["כל המאמרים", "/מאמרים"],
];
const WAZE = "https://waze.com/ul?q=" + encodeURIComponent("יוחנן הסנדלר 6, כפר סבא") + "&navigate=yes";
const links = (arr) => arr.map(([t, h]) => `<li><a href="${h}">${latin(t)}</a></li>`).join("");
const footer = () => `
<footer class="sm-footer">
  <div class="sm-wrap sm-footer__grid">
    <div class="sm-footer__brand">
      <a class="sm-footer__logo" href="/" aria-label="סופיה מדיקל, לדף הבית"><img src="/assets/img/logo-icon.png" alt="" width="240" height="293" loading="lazy"><span class="sm-footer__name">סופיה מדיקל</span></a>
      <p class="sm-footer__tag">שיקום, טיפול בכאב והפרעות שינה בהובלת ד"ר עלא מחאמיד</p>
      <ul class="sm-footer__contact" role="list">
        <li><a href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span>${icon("smartphone", "sm-ico")}</a></li>
        <li><a href="${CONTACT.landline.href}"><span dir="ltr">${CONTACT.landline.display}</span>${icon("phone", "sm-ico")}</a></li>
        <li><a href="mailto:${CONTACT.email}"><span>${CONTACT.email}</span>${icon("mail", "sm-ico")}</a></li>
        <li><a href="${CONTACT.maps}" target="_blank" rel="noopener"><span>${CONTACT.address}</span><span class="sm-sr"> (נפתח בחלון חדש)</span>${icon("map-pin", "sm-ico")}</a></li>
      </ul>
      <div class="sm-footer__maps">
        <a href="${CONTACT.maps}" target="_blank" rel="noopener">Google Maps<span class="sm-sr"> (נפתח בחלון חדש)</span></a>
        <a href="${WAZE}" target="_blank" rel="noopener">Waze<span class="sm-sr"> (נפתח בחלון חדש)</span></a>
        <a href="https://www.facebook.com/profile.php?id=61583510784516" target="_blank" rel="noopener">Facebook<span class="sm-sr"> (נפתח בחלון חדש)</span></a>
        <a href="https://www.instagram.com/sofiamedical12/" target="_blank" rel="noopener">Instagram<span class="sm-sr"> (נפתח בחלון חדש)</span></a>
      </div>
    </div>
    <nav aria-labelledby="ft-nav"><p class="sm-footer__col-title" id="ft-nav">ניווט</p><ul class="sm-footer__links" role="list">${links(FOOT_NAV)}</ul></nav>
    <nav aria-labelledby="ft-svc"><p class="sm-footer__col-title" id="ft-svc">תחומי טיפול</p><ul class="sm-footer__links" role="list">${links(SERVICES.map((x) => [x.name, x.href]))}</ul></nav>
    <nav aria-labelledby="ft-art"><p class="sm-footer__col-title" id="ft-art">מאמרים</p><ul class="sm-footer__links" role="list">${links(FOOT_ARTICLES)}</ul></nav>
  </div>
  <div class="sm-footer__bottom">
    <div class="sm-wrap sm-footer__bar">
      <p>זכויות יוצרים © ${new Date().getFullYear()} סופיה מדיקל. כל הזכויות שמורות.</p>
      <p class="sm-footer__credit"><a href="https://tzd-seo.org.il/" target="_blank" rel="noopener">קידום אתרים אורגני - <span dir="ltr">TZD SEO</span><span class="sm-sr"> (נפתח בחלון חדש)</span></a></p>
      <ul class="sm-footer__legal" role="list"><li><a href="/terms">תנאי שימוש</a></li><li><a href="/privacy">פרטיות</a></li><li><a href="/accessibility">נגישות</a></li></ul>
    </div>
  </div>
</footer>${insureStrip()}`;

/* ---------- Translated landing pages (/en/ ...) ----------
   The Hebrew homepage, translated (data-i18n.mjs), same sections and classes.
   Every link stays on the page or goes to WhatsApp / the phone: the inner
   pages are in Hebrew. Left to right languages get their icons before the
   text (on the left); arrows still point forward. */
// Right to left landing pages: Latin words, numbers and emails in the text
// read left to right (same as latin() on the Hebrew pages). Text in tags
// that cannot hold markup (option, svg, script) is left alone.
const bidiHtml = (html) => {
  let skip = null;
  return html.split(/(<[^>]+>)/).map((p) => {
    if (p.startsWith("<")) {
      const m = p.match(/^<(\/?)([a-z0-9]+)/i);
      if (m) {
        const t = m[2].toLowerCase();
        if (!skip && !m[1] && ["option", "svg", "script", "style", "title", "textarea"].includes(t) && !p.endsWith("/>")) skip = t;
        else if (skip && m[1] && t === skip) skip = null;
      }
      return p;
    }
    return skip || !p.trim() ? p : latin(p);
  }).join("");
};

/* "Other" in the treatment list: a free text field, shown only when the last option is chosen (form-other.js) */
const otherField = (id, label) => `<div class="sm-form__field sm-form__other"><label for="${id}-other">${label}</label><input id="${id}-other" name="other" type="text"></div>`;

function homeLanding(k) {
  const T = I18N[k];
  const ltr = LANGS[k].dir === "ltr";
  const ib = (text, ico) => (ltr ? ico + text : text + ico); // icon on the left of the text
  const nw = `<span class="sm-sr">${T.newWin}</span>`;
  const waA = (cls, text, msg) => `<a class="${cls}" href="${waLink(msg)}" target="_blank" rel="noopener">${ib(text, icon("whatsapp", "sm-ico sm-ico--fill"))}${nw}</a>`;
  const callA = (cls) => `<a class="${cls}" href="${CONTACT.mobile.href}">${ib(T.call, icon("phone", "sm-ico"))}</a>`;
  const chev = ltr ? "chevron-right" : "chevron-left";
  const ins = INSURE.map((x) => ({ ...x, ...T.insure[x.key] }));
  const team = TEAM.map((m) => ({ slug: m.slug, ...T.team.people[m.slug] }));
  const ticker = T.about.ticker.map((t) => `<li>${ib(`<span>${t}</span>`, icon("check", "sm-ico"))}</li>`).join("");
  return `
<main id="main" tabindex="-1">
<section class="sm-hero" aria-labelledby="hero-title">
  <div class="sm-hero__stage">
    <picture class="sm-hero__bg">
      <source media="(max-width: 1024px)" type="image/webp"
              srcset="/assets/img/hero/hero-clinic-m-480.webp 480w, /assets/img/hero/hero-clinic-m-768.webp 768w, /assets/img/hero/hero-clinic-m-1080.webp 1080w" sizes="100vw">
      <img src="/assets/img/hero/hero-clinic-1920.webp"
           srcset="/assets/img/hero/hero-clinic-1280.webp 1280w, /assets/img/hero/hero-clinic-1920.webp 1920w, /assets/img/hero/hero-clinic-2560.webp 2560w"
           sizes="100vw" width="1920" height="1086" alt="" fetchpriority="high" decoding="async">
    </picture>
    <div class="sm-wrap sm-hero__grid">
      <div class="sm-hero__content">
        <h1 id="hero-title" class="sm-hero__title"><span class="sm-hero__brand">${T.hero.brand}</span> ${T.hero.h1}</h1>
        <p class="sm-hero__lead">${T.hero.lead}</p>
        <div class="sm-hero__actions">
          ${callA("btn btn-cta")}
          ${waA("btn btn-wa", T.wa, T.waHello)}
        </div>
        <div class="sm-hero__insure" data-insure>
          <div class="sm-insure__stage">
            ${ins.map((x, i) => `<div class="sm-insure__slide${i ? "" : " is-on"}" data-insure-slide>
              ${seal(x, 100, "sm-hero__seal")}
              <p><strong>${T.insureWith} ${x.name}</strong>${x.text}</p>
            </div>`).join("\n            ")}
          </div>
          <div class="sm-insure__nav" role="group" aria-label="${T.insureNav}">
            ${ins.map((x, i) => `<button class="sm-insure__dot" type="button" aria-label="${esc(x.alt)}" aria-pressed="${i ? "false" : "true"}"></button>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </div>

</section>
<div class="sm-flow">
  <div class="sm-wrap sm-hero__services">
    <nav class="sm-services" aria-labelledby="services-strip-title">
      <h2 id="services-strip-title" class="sm-sr">${T.servicesTitle}</h2>
      <ul class="sm-services__list" role="list">
        ${SERVICES.map((s, i) => `<li><a class="sm-service" href="${waLink(T.waAbout(T.services[i].topic))}" target="_blank" rel="noopener"><span class="sm-service__ico">${icon(s.icon, "sm-ico")}</span><span class="sm-service__name">${T.services[i].name}</span><span class="sm-service__more" aria-hidden="true">${T.cardMore || T.ask} ${icon(chev, "sm-ico")}</span>${nw}</a></li>`).join("\n        ")}
      </ul>
    </nav>
  </div>


<section class="sm-about" aria-labelledby="about-title">
  <div class="sm-wrap sm-about__grid">
    <div class="sm-about__text">
      <h2 id="about-title" class="sm-about__title">${T.about.title}</h2>
      <p class="sm-about__lead">${T.about.lead}</p>
      <p class="sm-about__body">${T.about.body}</p>
      <div class="sm-ticker" role="region" aria-label="${T.about.tickerLabel}">
        <div class="sm-ticker__track">
          <ul class="sm-ticker__list" role="list">${ticker}</ul>
          <ul class="sm-ticker__list" role="list" aria-hidden="true">${ticker}</ul>
        </div>
      </div>
      <div class="sm-about__actions">
        ${callA("btn btn-cta")}
        ${waA("btn btn-ghost", T.waLong, T.waHello)}
      </div>
    </div>
    <div class="sm-about__media">
      <figure class="sm-about__figure">
        <div class="sm-about__frame">
          <img src="/assets/img/hero/dr-ala-mahamid-720.webp"
               srcset="/assets/img/hero/dr-ala-mahamid-440.webp 440w, /assets/img/hero/dr-ala-mahamid-720.webp 720w"
               sizes="(max-width: 1024px) 90vw, 460px" width="720" height="840"
               alt="${esc(T.about.alt)}" loading="lazy" decoding="async">
        </div>
        <figcaption class="sm-about__card"><strong>${T.about.name}</strong><span>${T.about.role}</span></figcaption>
      </figure>
    </div>
  </div>
</section>
</div>

<section class="sm-treat" aria-labelledby="treat-title">
  <div class="sm-wrap">
    <div class="sm-treat__head"><h2 id="treat-title" class="sm-treat__title">${T.treat.title}</h2></div>
    <div class="sm-treat__grid" data-tabs>
      <div class="sm-treat__tabs" role="tablist" aria-label="${T.treat.tabsLabel}" aria-orientation="vertical">
        ${TREATMENTS.map((t, i) => `<button class="sm-tab" type="button" role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${ib(`<span>${T.treat.items[t.id].tab}</span>`, icon(t.icon, "sm-ico"))}</button>`).join("\n        ")}
      </div>
      <div class="sm-treat__panels">
        ${TREATMENTS.map((t, i) => { const x = T.treat.items[t.id]; return `<div class="sm-panel" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}" tabindex="0"${i === 0 ? "" : " hidden"}>
          <div class="sm-panel__body">
            <h3 class="sm-panel__title">${x.title}</h3>
            ${x.paras.slice(0, 2).map((p) => `<p>${p}</p>`).join("")}
            <details class="sm-panel__more">
              <summary><span class="sm-more-open">${T.treat.more}</span><span class="sm-more-close">${T.treat.less}</span>${icon("chevron-down", "sm-ico")}</summary>
              ${x.paras.slice(2).map((p) => `<p>${p}</p>`).join("")}
            </details>
            <div class="sm-panel__actions">
              ${callA("btn btn-cta")}
              ${waA("btn btn-ghost", T.ask, T.waAbout(x.topic))}
            </div>
          </div>
          <div class="sm-panel__media"><img src="/assets/img/${t.img}-600.webp" srcset="/assets/img/${t.img}-600.webp 600w, /assets/img/${t.img}-900.webp 900w" sizes="(max-width: 1024px) 100vw, 360px" width="600" height="800" alt="" loading="lazy" decoding="async"></div>
        </div>`; }).join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section class="sm-team" aria-labelledby="team-title" data-team>
  <div class="sm-wrap sm-team__grid">
    <div class="sm-team__text">
      <div class="sm-team__head">
        <h2 id="team-title" class="sm-team__title">${T.team.title}</h2>
        <p class="sm-team__intro">${T.team.intro}</p>
      </div>
      <div class="sm-team__cap is-idle" aria-live="polite" data-idle="${esc(T.team.idle)}">
        <div class="sm-team__win sm-team__win--name"></div>
        <div class="sm-team__win sm-team__win--role"></div>
        <div class="sm-team__win sm-team__win--line"></div>
      </div>
    </div>
    <ul class="sm-team__list" role="list">
      ${team.map((m) => `<li><button class="sm-person" type="button" aria-pressed="false" aria-label="${esc(m.name)}, ${esc(m.role)}" data-name="${esc(m.name)}" data-role="${esc(m.role)}" data-line="${esc(m.line)}"><img src="/assets/img/team/${m.slug}.webp" width="480" height="600" alt="" loading="lazy" decoding="async"><span class="sm-person__tag" aria-hidden="true">${m.name}</span></button></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="sm-reviews" aria-labelledby="reviews-title">
  <div class="sm-wrap">
    <div class="sm-reviews__head">
      <h2 id="reviews-title" class="sm-reviews__title">${T.reviews.title}</h2>
    </div>
    <div class="sm-carousel" data-carousel data-live="${esc(T.reviews.live)}" aria-roledescription="${T.reviews.carousel}" aria-label="${T.reviews.label}">
      <div class="sm-carousel__track">
        ${T.reviews.items.map(([q, n], i) => `<figure class="sm-review" role="group" aria-roledescription="${T.reviews.item}" aria-label="${T.reviews.of(i + 1, T.reviews.items.length)}"><svg class="sm-review__mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 8c-4 1.5-6 4.5-6 9v3h6v-6H7.5M23 8c-4 1.5-6 4.5-6 9v3h6v-6h-3.5"/></svg><blockquote class="sm-review__quote">${q}</blockquote><figcaption class="sm-review__name">${n}</figcaption></figure>`).join("\n        ")}
      </div>
      <div class="sm-carousel__controls">
        <button class="sm-carousel__btn" type="button" data-prev aria-label="${T.reviews.prev}">${icon("arrow-left", "sm-ico")}</button>
        <button class="sm-carousel__btn" type="button" data-next aria-label="${T.reviews.next}">${icon("arrow-left", "sm-ico")}</button>
      </div>
      <p class="sm-sr sm-carousel__live" aria-live="off"></p>
    </div>

    <div class="sm-videos">
      <div class="sm-reviews__head">
        <h2 class="sm-reviews__title">${T.reviews.videosTitle}</h2>
        <p class="sm-videos__sub">${T.reviews.videosSub}</p>
      </div>
      <ul class="sm-videos__list" role="list">
        ${["6989c89a73668", "6989c89d594af"].map((id, i) => `<li class="sm-video">
          <video src="/assets/video/testimonial-${id}.mp4" poster="/assets/video/testimonial-${id}.webp" preload="none" playsinline width="480" height="861" aria-label="${T.reviews.video(i + 1)}" lang="he"></video>
          <button class="sm-video__play" type="button" aria-label="${T.reviews.play(i + 1)}">${icon("play", "sm-ico sm-ico--fill")}</button>
        </li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>

<section class="sm-faq" aria-labelledby="faq-title">
  <div class="sm-wrap sm-faq__grid">
    <div class="sm-faq__side">
      <h2 id="faq-title" class="sm-faq__title">${T.faq.title}</h2>
      <p class="sm-faq__lead">${T.faq.lead}</p>
      <form class="sm-form" id="lead" action="#" method="post" aria-label="${T.faq.form}">
        <div class="sm-form__field"><label for="lead-name">${T.faq.name}</label><input id="lead-name" name="name" type="text" autocomplete="name" required></div>
        <div class="sm-form__field"><label for="lead-phone">${T.faq.phone}</label><input id="lead-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required></div>
        <div class="sm-form__field"><label for="lead-topic">${T.faq.topic}</label>
          <select id="lead-topic" name="topic"><option value="">${T.faq.choose}</option>${T.services.map((x) => `<option>${x.name}</option>`).join("")}<option>${T.faq.other}</option></select></div>
        ${otherField("lead", T.faq.otherLabel)}
        <button class="btn btn-cta" type="submit">${T.faq.send} ${icon("arrow-left", "sm-ico sm-ico--arrow")}</button>
        <p class="sm-form__note">${T.faq.note}</p>
      </form>
    </div>
    <div class="sm-faq__list">
      <div class="sm-acc">
        ${T.faq.items.map(([q, a], i) => `<details name="faq"${i === 0 ? " open" : ""}><summary><span>${q}</span>${icon("plus", "sm-ico")}</summary><p>${a}</p></details>`).join("\n        ")}
      </div>
    </div>
  </div>
</section>
</main>`;
}

function footerLanding(k) {
  const T = I18N[k], F = T.footer;
  const ltr = LANGS[k].dir === "ltr";
  const ib = (text, ico) => (ltr ? ico + text : text + ico);
  const nw = `<span class="sm-sr">${T.newWin}</span>`;
  const li = (h, t, ext) => `<li><a href="${h}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}${ext ? nw : ""}</a></li>`;
  const ins = INSURE.map((x) => ({ ...x, ...T.insure[x.key] }));
  return `
<footer class="sm-footer">
  <div class="sm-wrap sm-footer__grid">
    <div class="sm-footer__brand">
      <a class="sm-footer__logo" href="#top" aria-label="${F.home}"><img src="/assets/img/logo-icon.png" alt="" width="240" height="293" loading="lazy"><span class="sm-footer__name">${F.name}</span></a>
      <p class="sm-footer__tag">${F.tag}</p>
      <ul class="sm-footer__contact" role="list">
        <li><a href="${CONTACT.mobile.href}">${ib(`<span dir="ltr">${CONTACT.mobile.display}</span>`, icon("smartphone", "sm-ico"))}</a></li>
        <li><a href="${CONTACT.landline.href}">${ib(`<span dir="ltr">${CONTACT.landline.display}</span>`, icon("phone", "sm-ico"))}</a></li>
        <li><a href="mailto:${CONTACT.email}">${ib(`<span>${CONTACT.email}</span>`, icon("mail", "sm-ico"))}</a></li>
        <li><a href="${CONTACT.maps}" target="_blank" rel="noopener">${ib(`<span>${T.address}</span>`, icon("map-pin", "sm-ico"))}${nw}</a></li>
      </ul>
      <div class="sm-footer__maps">
        <a href="${CONTACT.maps}" target="_blank" rel="noopener">Google Maps${nw}</a>
        <a href="${WAZE}" target="_blank" rel="noopener">Waze${nw}</a>
        <a href="https://www.facebook.com/profile.php?id=61583510784516" target="_blank" rel="noopener">Facebook${nw}</a>
        <a href="https://www.instagram.com/sofiamedical12/" target="_blank" rel="noopener">Instagram${nw}</a>
      </div>
    </div>
    <nav aria-labelledby="ft-nav"><p class="sm-footer__col-title" id="ft-nav">${F.onPage}</p><ul class="sm-footer__links" role="list">${T.nav.map(([t, h]) => li(h, t)).join("")}</ul></nav>
    <nav aria-labelledby="ft-svc"><p class="sm-footer__col-title" id="ft-svc">${F.areas}</p><ul class="sm-footer__links" role="list">${T.services.map((x) => li(waLink(T.waAbout(x.topic)), x.name, true)).join("")}</ul></nav>
    <nav aria-labelledby="ft-art"><p class="sm-footer__col-title" id="ft-art">${F.contact}</p><ul class="sm-footer__links" role="list">${li(waLink(T.waHello), T.waLong, true)}${li(CONTACT.mobile.href, `${T.call}: <span dir="ltr">${CONTACT.mobile.display}</span>`)}${li(CONTACT.landline.href, `${F.landline}: <span dir="ltr">${CONTACT.landline.display}</span>`)}${li("mailto:" + CONTACT.email, `${F.email}: <span dir="ltr">${CONTACT.email}</span>`)}</ul></nav>
  </div>
  <div class="sm-footer__bottom">
    <div class="sm-wrap sm-footer__bar">
      <p>${F.rights(new Date().getFullYear())}</p>
      <p class="sm-footer__credit"><a href="https://tzd-seo.org.il/" target="_blank" rel="noopener">${F.credit}${nw}</a></p>
      <ul class="sm-footer__legal" role="list">${F.legal.map(([t, h]) => `<li><a href="${h}" hreflang="he">${t}<span class="sm-sr">${T.he}</span></a></li>`).join("")}</ul>
    </div>
  </div>
</footer>
<aside class="sm-istrip" data-istrip hidden aria-label="${T.strip.label}">
  <div class="sm-istrip__in">
    <span class="sm-istrip__seals" aria-hidden="true">${ins.map((x) => `<img src="/assets/img/hero/${x.img}-160.webp" width="40" height="40" alt="" loading="lazy" decoding="async">`).join("")}</span>
    <p class="sm-istrip__text"><strong>${T.strip.title}</strong><span class="sm-istrip__sub">${T.strip.sub}</span></p>
    <a class="btn btn-wa sm-istrip__cta" href="${waLink(T.waHello)}" target="_blank" rel="noopener">${ib(T.wa, icon("whatsapp", "sm-ico sm-ico--fill"))}${nw}</a>
    <button class="sm-istrip__close" type="button" aria-label="${T.strip.close}">${icon("x", "sm-ico")}</button>
  </div>
</aside>`;
}

/* ---------- About page (/אודות-סופיה-מדיקל) ----------
   All body copy is the existing text of the current about page (dashes
   replaced). NEW copy that needs the client's approval: the four card
   titles in the center section. Headings: H1 identical to the current page,
   the existing H2 kept, the other section titles added as H2/H3. */
const ABOUT_URL = "/אודות-סופיה-מדיקל";
const SITE_URL = "https://www.sofia-medical.com";
const ABOUT_CARDS = [
  { title: "שיקום רפואי מותאם אישית", icon: "accessibility", href: "/רפואה-שיקומית-מתקדמת", more: "על רפואה שיקומית מתקדמת",
    text: "המרכז שם דגש על שיקום רפואי מקצועי ומותאם אישית, הכולל ליווי רציף של הצוות הרב תחומי במטרה לשפר את התפקוד הגופני, הקוגניטיבי, התקשורתי והנפשי, להפחית כאב, לשפר יציבה וניידות ולהחזיר את המטופלים לחיים פעילים ועצמאיים." },
  { title: "טכנולוגיה ומכשור מתקדם", icon: "cpu", href: "/מאמרים/שיקום-לאחר-אירוע-מוחי-עם-recoverix-טכנולוגיה-מתקדמת-לשיקום-נוירולוגי", more: "על שיקום נוירולוגי עם recoveriX",
    text: "המרכז עושה שימוש בטכנולוגיה רפואית מתקדמת ובמכשור חדשני לצורך אבחון מדויק, בקרה טיפולית ושיקום יעיל. השילוב בין ידע קליני נרחב, עבודת צוות מתואמת וחדשנות טכנולוגית מאפשר מתן טיפול איכותי, מדויק ובטוח לכל מטופל." },
  { title: "רפואת שינה", icon: "moon", href: "/אבחון-וטיפול-מקצועי-בהפרעות-שינה", more: "על אבחון וטיפול בהפרעות שינה",
    text: "המרכז מתמחה גם בתחום רפואת השינה, ומציע אבחון מקיף, טיפול מותאם וליווי רפואי רציף לשיפור איכות השינה, הפחתת עייפות יומית, ויסות מחזורי שינה וערות והשגת שינה טבעית ובריאה יותר." },
  { title: "מעבדת שינה ובדיקות ביתיות", icon: "activity", href: "/מאמרים/מעבדת-שינה", more: "על מעבדת השינה",
    text: "בנוסף לשירותים בתחומי השיקום, במרכז מתבצעות כל סוגי בדיקות השינה, לרבות בדיקות שינה ביתיות בהתאמה אישית למטופל, וכן פועלת מעבדת שינה מתקדמת לביצוע בדיקות שינה במכון, הכוללות EEG וכל הפרמטרים הפיזיולוגיים של השינה לצורך אבחון מדויק ומקצועי של כלל הפרעות השינה." },
];
const CREDO = [
  "לאורך שנות עבודתי כרופא שיקום וכמומחה לרפואת שינה, למדתי כי המפגש עם המטופל הוא הרבה מעבר לבדיקות ולמכשירים.",
  "הרפואה בעיניי היא קודם כל הקשבה: לראות את האדם שמולי, להבין את סיפורו וללוות אותו במסע חזרה לחיים מלאים, פעילים ומשמעותיים.",
  "אני מאמין כי שיקום אמיתי מתחיל באמונה באדם: ביכולת שלו להשתקם, לשוב לעצמאות ולגלות מחדש את כוחותיו.",
  "כל אדם זכאי לטיפול מקצועי, מכבד ושוויוני ללא הבדל דת, גזע או מין, תוך הערכה אמיתית לערכו האנושי ולסיפור חייו.",
  "במרכז סופיה מדיקל אנו משלבים רפואה מתקדמת עם אנושיות: צוות רב תחומי הפועל יחד, מתוך אחריות, שיתוף פעולה ומסירות.",
  "המטרה שלנו איננה רק לשקם את הגוף או לשפר את השינה, אלא להשיב למטופל את הביטחון, התקווה והאמונה בעצמו.",
];
const ALA_ROLE = "מומחה ברפואה פיזיקלית ושיקום ומומחה להפרעות שינה";

const aboutMain = () => `
<main id="main" tabindex="-1">
<section class="sm-phero" aria-labelledby="about-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">אודות סופיה מדיקל</span></li>
        </ol>
      </nav>
      <h1 id="about-h1" class="sm-phero__title">אודות <span class="hl">סופיה מדיקל</span></h1>
      <p class="sm-phero__lead">רפואה מתקדמת, צוות מומחים ופתרונות מותאמים אישית לשיפור תפקוד ובריאות המטופלים</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
      </div>
    </div>
    <div class="sm-phero__media">
      <figure class="sm-phero__figure">
        <div class="sm-phero__frame">
          <img src="/assets/img/about/dr-ala-mahamid-desk-960.webp"
               srcset="/assets/img/about/dr-ala-mahamid-desk-640.webp 640w, /assets/img/about/dr-ala-mahamid-desk-960.webp 960w, /assets/img/about/dr-ala-mahamid-desk-1400.webp 1400w"
               sizes="(max-width: 1024px) 92vw, 46vw" width="960" height="720"
               alt="ד&quot;ר עלא מחאמיד, מנהל מרכז סופיה מדיקל בכפר סבא" fetchpriority="high" decoding="async">
        </div>
        <figcaption class="sm-phero__card"><strong>ד"ר עלא מחאמיד</strong><span>${ALA_ROLE}</span></figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="sm-intro" aria-labelledby="intro-title">
  <div class="sm-wrap sm-intro__grid">
    <h2 id="intro-title" class="sm-intro__title">סופיה מדיקל: <span class="hl">רפואה מתקדמת, שיקום, טיפול בכאב והפרעות שינה</span></h2>
    <div class="sm-intro__body">
      <p class="sm-intro__lead">סופיה מדיקל הוא <strong>מרכז רפואי פרטי ומתקדם</strong> המתמחה בשיקום אמבולטורי, בטיפול בכאב ובאבחון הפרעות שינה אצל מבוגרים וילדים, בהובלת ד"ר עלא מחאמיד, רופא בכיר, מומחה ברפואה פיזיקלית ושיקום ומנהל השירות ויחידת הפרעות השינה במרכז הרפואי לוינשטיין.</p>
      <p>המרכז משלב רפואה מבוססת מדע, אבחון מתקדם וטכנולוגיות חדשניות לשיקום, להפחתת כאב, שיפור תפקוד והשבת איכות החיים.</p>
      <p class="sm-intro__note">${icon("badge-check", "sm-ico")}<span>כל תוכנית טיפול נבנית באופן אישי בהתאם למצבו הרפואי של המטופל, למטרות השיקום וליעדיו התפקודיים.</span></p>
      <nav class="sm-links" aria-label="תחומי הטיפול">
        <ul role="list">
          ${SERVICES.map((s) => `<li><a href="${s.href}"><span>${latin(s.name)}</span>${icon("chevron-left", "sm-ico")}</a></li>`).join("\n          ")}
        </ul>
      </nav>
    </div>
  </div>
</section>

<section class="sm-center" aria-labelledby="center-title">
  <div class="sm-wrap">
    <h2 id="center-title" class="sm-center__title">מרכז לרפואה מתקדמת, <span class="hl">שיקום והפרעות שינה</span></h2>
    <ul class="sm-center__cards" role="list">
      ${ABOUT_CARDS.map((c) => `<li class="sm-card">
        <div class="sm-card__head"><h3 class="sm-card__title">${c.title}</h3><span class="sm-card__ico">${icon(c.icon, "sm-ico")}</span></div>
        <p class="sm-card__text">${latin(c.text)}</p>
        <a class="sm-card__more" href="${c.href}">למידע נוסף<span class="sm-sr"> ${latin(c.more)}</span>${icon("chevron-left", "sm-ico")}</a>
      </li>`).join("\n      ")}
    </ul>
    <p class="sm-center__belief">בסופיה מדיקל אנו מאמינים כי השילוב בין <span class="hl">מומחיות רפואית, צוות רב תחומי וטכנולוגיה מתקדמת</span> הוא המפתח לשיקום מלא ולשינה מאוזנת, כדי שכל מטופל יוכל לשוב לחיים פעילים, רגועים ובריאים יותר.</p>
  </div>
</section>

<section class="sm-credo" aria-labelledby="credo-title">
  <div class="sm-wrap sm-credo__grid">
    <div class="sm-credo__head">
      <h2 id="credo-title" class="sm-credo__title">האני מאמין של <span class="hl">ד"ר עלא מחאמיד</span></h2>
      <blockquote class="sm-credo__quote"><p>מאחורי כל ממצא רפואי עומד אדם, עם כאב, סיפור ותקווה. תפקידי כרופא הוא לא רק לטפל, אלא להבין, להקשיב ולהחזיר את האיזון בין הגוף לנפש.</p></blockquote>
    </div>
    <div class="sm-credo__media">
      <figure class="sm-credo__figure">
        <div class="sm-credo__frame">
          <img src="/assets/img/about/dr-ala-mahamid-portrait-720.webp"
               srcset="/assets/img/about/dr-ala-mahamid-portrait-440.webp 440w, /assets/img/about/dr-ala-mahamid-portrait-720.webp 720w"
               sizes="(max-width: 1024px) 80vw, 34vw" width="720" height="900"
               alt="ד&quot;ר עלא מחאמיד, ${ALA_ROLE}" loading="lazy" decoding="async">
        </div>
      </figure>
    </div>
    <div class="sm-credo__body">
      ${CREDO.map((p) => `<p>${p}</p>`).join("\n      ")}
      <blockquote class="sm-credo__close"><p>הרפואה האמיתית בעיניי אינה מסתכמת בריפוי הגוף, אלא ביכולת לראות את האדם השלם, להחזיר לו את הכוחות, ואת האמונה בחיים עצמם.</p></blockquote>
      <p class="sm-credo__sign"><strong>ד"ר עלא מחאמיד</strong><span>${ALA_ROLE}</span></p>
    </div>
  </div>
</section>

<section class="sm-cta" aria-labelledby="cta-title">
  <div class="sm-wrap">
    <div class="sm-cta__box">
      <div class="sm-cta__text">
        <h2 id="cta-title" class="sm-cta__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></h2>
        <p>קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
      </div>
      <div class="sm-cta__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </div>
  </div>
</section>
</main>`;


/* ---------- Team page (/הצוות) ----------
   H1 identical to the current page ("הצוות"). The lead is the existing team
   intro from the home page. Each person is an H2 with the existing role and
   line. Ala and Haitham are featured (wide cards). No new copy. */
const TEAM_URL = "/הצוות";
const TEAM_INTRO = "במרכז פועל צוות מגוון ומיומן הכולל: רופאי שיקום, רופאים יועצים בתחומים שונים, פיזיותרפיסטים, פסיכולוגים, קלינאי תקשורת, טכנאי שינה ומרפאים בעיסוק.";
const teamMain = () => `
<main id="main" tabindex="-1">
<section class="sm-phero sm-phero--plain" aria-labelledby="team-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">הצוות</span></li>
        </ol>
      </nav>
      <h1 id="team-h1" class="sm-phero__title">הצוות</h1>
      <p class="sm-phero__lead">${TEAM_INTRO}</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
      </div>
    </div>
  </div>
</section>

<section class="sm-staff" aria-label="אנשי הצוות">
  <div class="sm-wrap">
    <ul class="sm-staff__grid" role="list">
      ${TEAM_PAGE.map((m, i) => `<li class="sm-member${m.featured ? " sm-member--lead" : ""}">
        <div class="sm-member__photo"><img src="/assets/img/team/${m.slug}.webp" width="480" height="600" alt="${esc(m.name)}, ${esc(m.role)}" ${i < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>
        <div class="sm-member__text">
          <h2 class="sm-member__name"><a href="${PROFILES[m.slug].href}">${m.name}</a></h2>
          <p class="sm-member__role">${latin(m.role)}</p>
          <p class="sm-member__line">${m.line}</p>
          <span class="sm-member__more" aria-hidden="true">קרא עוד${icon("chevron-left", "sm-ico")}</span>
        </div>
      </li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="sm-cta" aria-labelledby="cta-title">
  <div class="sm-wrap">
    <div class="sm-cta__box">
      <div class="sm-cta__text">
        <h2 id="cta-title" class="sm-cta__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></h2>
        <p>קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
      </div>
      <div class="sm-cta__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </div>
  </div>
</section>
</main>`;


/* ---------- Services page (/שירותים) ----------
   H1 identical to the current page ("שירותים"), lead = the current meta
   description. 16 services with the existing titles and texts, each title an
   H2 linking on to its service page. Rehab and sleep are wide dark cards.
   Icons instead of the current images (most are Getty stock from SITE123). */
const SERVICES_URL = "/שירותים";
const SERVICES_DESC = "שירותי מרכז רפואי רב תחומי המשלבים פיזיותרפיה, אבחון מתקדם וטיפול טכנולוגי מותאם לכל שלבי ההחלמה בסופיה מדיקל, עם ליווי מקצועי ושירות מסור בפריסה ארצית.";
const SERVICES_WIDE = new Set([0, 5, 17]);
const servicesMain = () => `
<main id="main" tabindex="-1">
<section class="sm-phero" aria-labelledby="services-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">שירותים</span></li>
        </ol>
      </nav>
      <h1 id="services-h1" class="sm-phero__title">שירותים</h1>
      <p class="sm-phero__lead">${SERVICES_DESC}</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
      </div>
    </div>
    <div class="sm-phero__media">
      <figure class="sm-phero__figure sm-rot" data-rot>
        <div class="sm-phero__frame">
          ${TREATMENTS.map((t, i) => `<img class="sm-rot__img${i ? "" : " is-on"}" src="/assets/img/${t.img}-900.webp" srcset="/assets/img/${t.img}-600.webp 600w, /assets/img/${t.img}-900.webp 900w"
               sizes="(max-width: 1024px) 92vw, 46vw" width="900" height="675" alt="${esc(t.tab)} במרכז סופיה מדיקל"${i ? "" : ' fetchpriority="high"'} decoding="async">`).join("\n          ")}
        </div>
        <figcaption class="sm-phero__card sm-rot__card">
          ${TREATMENTS.map((t, i) => `<a class="sm-rot__link" href="${t.href}"${i ? " hidden" : ""}>${icon(t.icon, "sm-ico")}<span>${latin(t.tab)}</span>${icon("chevron-left", "sm-ico sm-rot__arrow")}</a>`).join("\n          ")}
          <div class="sm-rot__ctrl">
            <div class="sm-rot__dots">${TREATMENTS.map((t, i) => `<button type="button" class="sm-rot__dot" aria-label="${esc(t.tab)}"${i ? "" : ' aria-current="true"'}></button>`).join("")}</div>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="sm-center sm-svc" aria-label="השירותים במרכז">
  <div class="sm-wrap">
    <ul class="sm-svc__grid" role="list">
      ${SERVICES_PAGE.map((c, i) => `<li class="sm-card${SERVICES_WIDE.has(i) ? " sm-card--wide" : ""}">
        <div class="sm-card__head"><h2 class="sm-card__title"><a href="${c.href}">${latin(c.title)}</a></h2><span class="sm-card__ico">${icon(c.icon, "sm-ico")}</span></div>
        ${c.text.map((p) => `<p class="sm-card__text">${latin(p)}</p>`).join("")}
        <span class="sm-card__more" aria-hidden="true">למידע נוסף${icon("chevron-left", "sm-ico")}</span>
      </li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="sm-cta" aria-labelledby="cta-title">
  <div class="sm-wrap">
    <div class="sm-cta__box">
      <div class="sm-cta__text">
        <h2 id="cta-title" class="sm-cta__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></h2>
        <p>קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
      </div>
      <div class="sm-cta__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </div>
  </div>
</section>
</main>`;


/* ---------- Single service pages (/שירותים/<slug>) ----------
   Content of the current pages (data-service-pages.mjs, parsed from the live
   site). H1 identical, lead = the current meta description. Extra H1s on the
   old pages became H2, h4 section titles became H2/H3. Hero image only where
   we have a real device photo or one of our GPT treatment images.
   NEW UI copy for approval: "שירותים נוספים" (side box title). */
const SVC_HERO = {
  0: { src: "/assets/img/treat-rehab", w: [600, 900] },
  1: { src: "/assets/img/treat-recoverix", w: [600, 900] },
  2: { src: "/assets/img/services/pemf-device", w: [900, 1400], alt: "מכשיר טיפול PEMF במרכז סופיה מדיקל" },
  3: { src: "/assets/img/treat-physio", w: [600, 900] },
  4: { src: "/assets/img/treat-pain", w: [600, 900] },
  5: { src: "/assets/img/treat-sleep", w: [600, 900] },
  9: { src: "/assets/img/treat-pain", w: [600, 900] },
  15: { person: "haitham-abu-nagma", name: 'ד"ר הייתם אבו נגמה', role: "אורולוג בכיר" },
  16: { person: "mohammad-mahajna", name: 'ד"ר מוחמד עומר מחאג\'נה', role: "מומחה בראומטולוגיה ורפואה פנימית" },
  17: { person: "vlada-guizman", name: "ולאדה גויזמן", role: "מטפלת מוסמכת בשיטת CBT-I" },
};
// device photos inside the text, placed after the H2 that names them
const SVC_FIGS = {
  12: [
    { after: "מכשיר CPAP: לטיפול בדום נשימה בשינה", src: "/assets/img/services/cpap-device-528.webp", w: 528, h: 441, alt: "מכשיר CPAP לטיפול בדום נשימה בשינה" },
    { after: "מחולל חמצן נייד: IGO2", src: "/assets/img/services/oxygen-igo2-696.webp", w: 696, h: 613, alt: "מחולל חמצן נייד IGO2" },
  ],
};
const svcShort = (i) => SERVICES_PAGE[i].title.split(":")[0];
const svcItem = (s) => {
  const m = s.length > 50 && s.match(/^([^:]{3,60}):\s(.+)$/);
  return m ? `<strong>${latin(m[1])}</strong> ${rich(m[2])}` : rich(s);
};
const svcBlocks = (p, i) => {
  const figs = SVC_FIGS[i] || [];
  return p.blocks.map((b) => {
    if (b.t === "h2") {
      const f = figs.find((x) => x.after === b.x);
      return `<h2 class="sm-prose__h2">${latin(b.x)}</h2>` + (f ? `<figure class="sm-prose__fig"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" loading="lazy" decoding="async"></figure>` : "");
    }
    if (b.t === "h3") return `<h3 class="sm-prose__h3">${latin(b.x)}</h3>`;
    if (b.t === "p") return `<p>${rich(b.x)}</p>`;
    if (b.t === "ul") return `<ul class="sm-prose__list" role="list">${b.x.map((x) => `<li>${svcItem(x)}</li>`).join("")}</ul>`;
    if (b.t === "check") return `<ul class="sm-prose__check" role="list">${b.x.map((x) => `<li>${icon("check", "sm-ico")}<span>${svcItem(x)}</span></li>`).join("")}</ul>`;
    return "";
  }).join("\n        ");
};
const svcHero = (i) => {
  const h = SVC_HERO[i];
  if (!h) return "";
  if (h.person) return `
    <div class="sm-phero__media">
      <figure class="sm-phero__figure sm-phero__figure--portrait">
        <div class="sm-phero__frame"><img src="/assets/img/team/${h.person}.webp" width="480" height="600" alt="${esc(h.name)}, ${h.role}" fetchpriority="high" decoding="async"></div>
        <figcaption class="sm-phero__card"><strong>${h.name}</strong><span>${h.role}</span></figcaption>
      </figure>
    </div>`;
  const [a, b] = h.w;
  return `
    <div class="sm-phero__media">
      <figure class="sm-phero__figure">
        <div class="sm-phero__frame"><img src="${h.src}-${b}.webp" srcset="${h.src}-${a}.webp ${a}w, ${h.src}-${b}.webp ${b}w" sizes="(max-width: 1024px) 92vw, 46vw" width="${b}" height="${Math.round(b * 3 / 4)}" alt="${esc(h.alt || svcShort(i) + " במרכז סופיה מדיקל")}" fetchpriority="high" decoding="async"></div>
      </figure>
    </div>`;
};
const servicePageMain = (p, i) => `
<main id="main" tabindex="-1">
<section class="sm-phero${SVC_HERO[i] ? "" : " sm-phero--plain"}" aria-labelledby="svc-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><a href="${SERVICES_URL}">שירותים</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">${latin(svcShort(i))}</span></li>
        </ol>
      </nav>
      <h1 id="svc-h1" class="sm-phero__title sm-phero__title--svc">${latin(p.h1)}</h1>
      <p class="sm-phero__lead">${latin(p.desc)}</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
      </div>${svcInsure(i)}
    </div>${svcHero(i)}
  </div>
</section>

<section class="sm-svcpage">
  <div class="sm-wrap sm-svcpage__grid">
    <article class="sm-prose">
        ${svcBlocks(p, i)}
    </article>
    <aside class="sm-svcpage__side" aria-label="יצירת קשר ושירותים נוספים">
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <p class="sm-side__text">קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
      <nav class="sm-side__box" aria-labelledby="svc-more">
        <p class="sm-side__title" id="svc-more">שירותים נוספים</p>
        <ul class="sm-side__links" role="list">
          ${SERVICES_PAGE.filter((_, k) => k !== i).map((s) => `<li><a href="${s.href}"><span>${latin(s.title.split(":")[0])}</span>${icon("chevron-left", "sm-ico")}</a></li>`).join("\n          ")}
        </ul>
      </nav>
    </aside>
  </div>
</section>
</main>`;


/* ---------- Articles (/מאמרים + /מאמרים/<slug>) ----------
   Listing: H1 "מאמרים" as on the current page, lead = its meta description,
   cards with the existing excerpts, filter by treatment area (labels = the
   existing treatment tab names). Article: content of the current page
   (data-articles.mjs), H1 identical, lead = meta description, FAQ schema
   where the article has questions. All article photos on the old site are
   Getty stock, so none are used. NEW UI copy for approval: "מאמרים נוספים". */
const ARTICLES_URL = "/מאמרים";
const ARTICLES_DESC = "מאמרים מקצועיים על שיקום, כאב והפרעות שינה עם טיפים, מחקרים והסברים מהצוות המומחה של סופיה מדיקל, יחד עם ידע עדכני ומעמיק.";
const TOPICS = {
  rehab: { name: "רפואה שיקומית", icon: "accessibility" },
  pain: { name: "מרפאת כאב", icon: "zap" },
  sleep: { name: "הפרעות שינה", icon: "moon" },
  uro: { name: "שיקום מיני ואורולוגי", icon: "heart-pulse" },
};
const topicTag = (k) => `<span class="sm-topic">${icon(TOPICS[k].icon, "sm-ico")}<span>${TOPICS[k].name}</span></span>`;
const ctaBand = () => `
<section class="sm-cta" aria-labelledby="cta-title">
  <div class="sm-wrap">
    <div class="sm-cta__box">
      <div class="sm-cta__text">
        <h2 id="cta-title" class="sm-cta__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></h2>
        <p>קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
      </div>
      <div class="sm-cta__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </div>
  </div>
</section>`;

const articlesMain = () => `
<main id="main" tabindex="-1">
<section class="sm-phero sm-phero--plain" aria-labelledby="articles-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">מאמרים</span></li>
        </ol>
      </nav>
      <h1 id="articles-h1" class="sm-phero__title">מאמרים</h1>
      <p class="sm-phero__lead">${ARTICLES_DESC}</p>
    </div>
  </div>
</section>

<section class="sm-arts" aria-label="רשימת המאמרים" data-arts>
  <div class="sm-wrap">
    <div class="sm-arts__filter" role="group" aria-label="סינון לפי תחום" hidden>
      <button type="button" class="sm-arts__btn" aria-pressed="true" data-topic="all">הכל</button>
      ${Object.entries(TOPICS).map(([k, t]) => `<button type="button" class="sm-arts__btn" aria-pressed="false" data-topic="${k}">${icon(t.icon, "sm-ico")}<span>${t.name}</span></button>`).join("\n      ")}
    </div>
    <ul class="sm-arts__grid" role="list">
      ${ARTICLES.map((a, i) => `<li class="sm-art" data-topic="${a.topic}">
        <div class="sm-art__img"><img src="/assets/img/articles/${COVER_SLUGS[i]}-600.webp" width="600" height="338" alt="" loading="${i < 3 ? "eager" : "lazy"}" decoding="async"></div>
        ${topicTag(a.topic)}
        <h2 class="sm-art__title"><a href="${a.href}">${latin(a.h1)}</a></h2>
        <p class="sm-art__text">${latin(a.excerpt)}</p>
        <span class="sm-art__more" aria-hidden="true">קרא עוד${icon("chevron-left", "sm-ico")}</span>
      </li>`).join("\n      ")}
    </ul>
    <p class="sm-arts__count" aria-live="polite"></p>
  </div>
</section>
${ctaBand()}
</main>`;

/* Single article template: cover image, reading time, share buttons, table of
   contents (sticky on desktop, collapsible on phones), a lead form inside the
   text, author box, and a carousel of more articles with their covers.
   NEW UI copy for approval: "תוכן עניינים", "זמן קריאה", "שתפו את המאמר",
   "הקישור הועתק", "נכתב על ידי", "מאמרים נוספים". */
const artWords = (a) => a.blocks.reduce((n, b) => n + (Array.isArray(b.x) ? b.x.join(" ") : b.t === "video" ? "" : b.x).split(/\s+/).filter(Boolean).length, 0);
const readTime = (a) => { const m = Math.max(1, Math.round(artWords(a) / 200)); return m === 1 ? "דקה אחת" : `${m} דקות`; };
const artToc = (a) => a.blocks.filter((b) => b.t === "h2").map((b, k) => ({ id: `sec-${k + 1}`, x: b.x }));

const artBlocks = (a) => {
  const h2s = a.blocks.filter((b) => b.t === "h2").length;
  const formAt = h2s >= 3 ? Math.ceil(h2s / 2) + 1 : -1; // before this h2 (1 based)
  let k = 0, out = [], formDone = false;
  for (const b of a.blocks) {
    if (b.t === "h2") {
      k++;
      if (k === formAt) { out.push(artForm()); formDone = true; }
      out.push(`<h2 class="sm-prose__h2" id="sec-${k}">${latin(b.x)}</h2>`);
      continue;
    }
    if (b.t === "h3") out.push(`<h3 class="sm-prose__h3">${latin(b.x)}</h3>`);
    else if (b.t === "p") out.push(`<p>${latin(b.x)}</p>`);
    else if (b.t === "ul") out.push(`<ul class="sm-prose__list" role="list">${b.x.map((x) => `<li>${svcItem(x)}</li>`).join("")}</ul>`);
    else if (b.t === "check") out.push(`<ul class="sm-prose__check" role="list">${b.x.map((x) => `<li>${icon("check", "sm-ico")}<span>${svcItem(x)}</span></li>`).join("")}</ul>`);
    else if (b.t === "video") out.push(`<div class="sm-prose__video"><iframe src="https://www.youtube-nocookie.com/embed/${b.x}" title="סרטון: ${esc(a.h1)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`);
  }
  if (!formDone) out.push(artForm());
  return out.join("\n        ");
};

const artForm = () => `<aside class="sm-inform" aria-labelledby="inform-title">
          <div class="sm-inform__text">
            <p class="sm-inform__title" id="inform-title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
            <p class="sm-inform__sub">קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
          </div>
          <form class="sm-inform__form" action="#" method="post" aria-label="השארת פרטים">
            <div class="sm-inform__field"><label for="in-name">שם מלא</label><input id="in-name" name="name" type="text" autocomplete="name" required></div>
            <div class="sm-inform__field"><label for="in-phone">טלפון</label><input id="in-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="rtl"></div>
            <button class="btn btn-cta" type="submit">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</button>
            <p class="sm-inform__note">בשליחת הטופס אני מאשר/ת את <a href="/privacy">מדיניות הפרטיות</a>.</p>
          </form>
        </aside>`;

const artShare = (a, where) => {
  const url = SITE_URL + encodeURI(a.href), t = encodeURIComponent(a.h1), u = encodeURIComponent(url);
  const nw = `<span class="sm-sr"> (נפתח בחלון חדש)</span>`;
  return `<div class="sm-share" role="group" aria-label="שתפו את המאמר">
        <span class="sm-share__label">שתפו את המאמר</span>
        <a class="sm-share__btn" href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener" aria-label="שיתוף בוואטסאפ">${icon("whatsapp", "sm-ico sm-ico--fill")}${nw}</a>
        <a class="sm-share__btn" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="שיתוף בפייסבוק">${icon("facebook", "sm-ico sm-ico--fill")}${nw}</a>
        <a class="sm-share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" target="_blank" rel="noopener" aria-label="שיתוף בלינקדאין">${icon("linkedin", "sm-ico sm-ico--fill")}${nw}</a>
        <a class="sm-share__btn" href="https://t.me/share/url?url=${u}&amp;text=${t}" target="_blank" rel="noopener" aria-label="שיתוף בטלגרם">${icon("telegram", "sm-ico sm-ico--fill")}${nw}</a>
        <a class="sm-share__btn" href="mailto:?subject=${t}&amp;body=${u}" aria-label="שליחה במייל">${icon("mail", "sm-ico")}</a>
        <button class="sm-share__btn" type="button" data-copy="${url}" aria-label="העתקת קישור">${icon("link", "sm-ico")}</button>
        <span class="sm-share__done" role="status" data-copied${where === "top" ? "" : "-b"}></span>
      </div>`;
};

const artCard = (x) => {
  const k = ARTICLES.indexOf(x);
  return `<li class="sm-rel__item">
          <a class="sm-rel__card" href="${x.href}">
            <span class="sm-rel__img"><img src="/assets/img/articles/${COVER_SLUGS[k]}-600.webp" width="600" height="338" alt="" loading="lazy" decoding="async"><span class="sm-rel__tag">${TOPICS[x.topic].name}</span></span>
            <span class="sm-rel__title">${latin(x.h1)}</span>
            <span class="sm-rel__more" aria-hidden="true">קרא עוד${icon("chevron-left", "sm-ico")}</span>
          </a>
        </li>`;
};

const articleMain = (a, i) => {
  const toc = artToc(a);
  const related = [...ARTICLES.filter((x, k) => k !== i && x.topic === a.topic), ...ARTICLES.filter((x, k) => k !== i && x.topic !== a.topic)].slice(0, 10);
  const tocList = toc.map((t) => `<li><a href="#${t.id}">${latin(t.x)}</a></li>`).join("");
  return `
<main id="main" tabindex="-1">
<section class="sm-phero sm-phero--art" aria-labelledby="art-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><a href="${ARTICLES_URL}">מאמרים</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">${latin(a.h1.split(":")[0])}</span></li>
        </ol>
      </nav>
      <p class="sm-phero__topic">${topicTag(a.topic)}</p>
      <h1 id="art-h1" class="sm-phero__title sm-phero__title--svc">${latin(a.h1)}</h1>
      <p class="sm-phero__lead">${latin(a.desc)}</p>
      <p class="sm-artmeta">${icon("clock", "sm-ico")}<span>זמן קריאה: ${readTime(a)}</span></p>
      ${artShare(a, "top")}
    </div>
    <div class="sm-phero__media">
      <figure class="sm-phero__figure sm-phero__figure--wide">
        <div class="sm-phero__frame"><img src="/assets/img/articles/${COVER_SLUGS[i]}-1200.webp" srcset="/assets/img/articles/${COVER_SLUGS[i]}-600.webp 600w, /assets/img/articles/${COVER_SLUGS[i]}-1200.webp 1200w" sizes="(max-width: 1024px) 92vw, 46vw" width="1200" height="675" alt="${esc(a.h1)}" fetchpriority="high" decoding="async"></div>
      </figure>
    </div>
  </div>
</section>

<section class="sm-svcpage sm-artpage">
  <div class="sm-wrap sm-svcpage__grid">
    <div class="sm-artpage__main">
      ${toc.length ? `<details class="sm-toc sm-toc--mobile"><summary>${icon("list", "sm-ico")}<span>תוכן עניינים</span>${icon("chevron-down", "sm-ico sm-toc__chev")}</summary><ol role="list">${tocList}</ol></details>` : ""}
      <article class="sm-prose">
        ${artBlocks(a)}
      </article>
      <div class="sm-artpage__end">
        ${artShare(a, "bottom")}
        <section class="sm-author" aria-labelledby="author-title">
          <img class="sm-author__logo" src="/assets/img/logo-icon.png" width="240" height="293" alt="" loading="lazy">
          <div class="sm-author__text">
            <p class="sm-author__kicker">נכתב על ידי</p>
            <p class="sm-author__name" id="author-title">סופיה מדיקל</p>
            <p class="sm-author__role">מרכז לרפואה מתקדמת, שיקום והפרעות שינה</p>
            <p class="sm-author__bio">סופיה מדיקל הוא מרכז רפואי פרטי ומתקדם המתמחה בשיקום אמבולטורי, בטיפול בכאב ובאבחון הפרעות שינה אצל מבוגרים וילדים, בהובלת ד"ר עלא מחאמיד, רופא בכיר, מומחה ברפואה פיזיקלית ושיקום ומנהל השירות ויחידת הפרעות השינה במרכז הרפואי לוינשטיין.</p>
            <a class="sm-author__link" href="${ABOUT_URL}">לעמוד האודות${icon("chevron-left", "sm-ico")}</a>
          </div>
        </section>
      </div>
    </div>
    <aside class="sm-svcpage__side" aria-label="תוכן עניינים ויצירת קשר">
      ${toc.length ? `<nav class="sm-side__box sm-toc" aria-labelledby="toc-title"><p class="sm-side__title" id="toc-title">${icon("list", "sm-ico")}תוכן עניינים</p><ol role="list">${tocList}</ol></nav>` : ""}
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </aside>
  </div>
</section>

<section class="sm-rel" aria-labelledby="rel-title" data-rel>
  <div class="sm-wrap">
    <div class="sm-rel__head">
      <h2 class="sm-rel__h2" id="rel-title">מאמרים נוספים</h2>
      <a class="sm-rel__all" href="${ARTICLES_URL}">לכל המאמרים${icon("chevron-left", "sm-ico")}</a>
    </div>
    <div class="sm-rel__viewport">
      <button class="sm-rel__arrow sm-rel__arrow--prev" type="button" aria-label="המאמרים הקודמים" data-dir="-1">${icon("chevron-right", "sm-ico")}</button>
      <ul class="sm-rel__track" role="list">
        ${related.map(artCard).join("\n        ")}
      </ul>
      <button class="sm-rel__arrow sm-rel__arrow--next" type="button" aria-label="המאמרים הבאים" data-dir="1">${icon("chevron-left", "sm-ico")}</button>
    </div>
  </div>
</section>
</main>`;
};


/* ---------- Contact (/צור-קשר) and FAQ (/שאלות-נפוצות) ----------
   Contact: H1 "צור קשר", lead = current meta description, the current
   contact details, opening hours from the current FAQ answer, the lead form
   (same fields as the home form plus email, as on the current contact form),
   Google map. Form not wired yet (WordPress stage).
   FAQ: H1 "שאלות נפוצות", all 14 questions in the 5 current categories,
   category names as H2, FAQPage schema. No new copy. */
const CONTACT_URL = "/צור-קשר";
const FAQ_URL = "/שאלות-נפוצות";
const HOURS = [["ימים א' עד ה'", "09:00 עד 19:00"], ["יום ו'", "09:00 עד 13:00"]];
const MAP_EMBED = "https://maps.google.com/maps?q=" + encodeURIComponent("יוחנן הסנדלר 6, כפר סבא") + "&z=16&output=embed";

const leadForm = (id) => `
      <form class="sm-form" action="#" method="post" aria-label="השארת פרטים">
        <div class="sm-form__field"><label for="${id}-name">שם מלא</label><input id="${id}-name" name="name" type="text" autocomplete="name" required></div>
        <div class="sm-form__field"><label for="${id}-phone">טלפון</label><input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="rtl"></div>
        <div class="sm-form__field"><label for="${id}-email">כתובת הדואר האלקטרוני שלך</label><input id="${id}-email" name="email" type="email" autocomplete="email" dir="ltr"></div>
        <div class="sm-form__field"><label for="${id}-topic">תחום הטיפול</label>
          <select id="${id}-topic" name="topic"><option value="">בחירה</option>${SERVICES.map((x) => `<option>${x.name}</option>`).join("")}<option>אחר</option></select></div>
        ${otherField(id, "פירוט התלונה")}
        <button class="btn btn-cta" type="submit">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</button>
        <p class="sm-form__note">בשליחת הטופס אני מאשר/ת את <a href="/privacy">מדיניות הפרטיות</a>.</p>
      </form>`;

const contactMain = () => `
<main id="main" tabindex="-1">
<section class="sm-contact" aria-labelledby="contact-h1">
  <div class="sm-wrap sm-contact__grid">
    <div class="sm-contact__info">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">צור קשר</span></li>
        </ol>
      </nav>
      <h1 id="contact-h1" class="sm-phero__title">צור קשר</h1>
      <p class="sm-phero__lead">פרטי התקשרות, טלפון וטופס פנייה לתיאום ייעוץ, בדיקות או טיפול בסופיה מדיקל עם מענה מהיר ושירות מסור למטופלים בכל הארץ.</p>
      <ul class="sm-contact__list" role="list">
        <li><span class="sm-contact__ico">${icon("map-pin", "sm-ico")}</span><span><strong>כתובת</strong><a href="${CONTACT.maps}" target="_blank" rel="noopener">${CONTACT.address}<span class="sm-sr"> (נפתח בחלון חדש)</span></a></span></li>
        <li><span class="sm-contact__ico">${icon("smartphone", "sm-ico")}</span><span><strong>נייד</strong><a href="${CONTACT.mobile.href}" dir="ltr">${CONTACT.mobile.display}</a></span></li>
        <li><span class="sm-contact__ico">${icon("phone", "sm-ico")}</span><span><strong>טלפון</strong><a href="${CONTACT.landline.href}" dir="ltr">${CONTACT.landline.display}</a></span></li>
        <li><span class="sm-contact__ico">${icon("mail", "sm-ico")}</span><span><strong>דואר אלקטרוני</strong><a href="mailto:${CONTACT.email}" dir="ltr">${CONTACT.email}</a></span></li>
        <li><span class="sm-contact__ico">${icon("clock", "sm-ico")}</span><span><strong>שעות פעילות</strong>${HOURS.map(([d, h]) => `<span class="sm-contact__hours"><span>${d}</span><span>${h}</span></span>`).join("")}</span></li>
      </ul>
      <div class="sm-contact__actions">
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
        <a class="btn btn-ghost" href="${WAZE}" target="_blank" rel="noopener">ניווט עם Waze<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("map-pin", "sm-ico")}</a>
      </div>
    </div>
    <div class="sm-contact__form sm-faq">
      <p class="sm-contact__form-title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
      <p class="sm-faq__lead">קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
      ${leadForm("contact")}
    </div>
  </div>
</section>
<section class="sm-map" aria-label="מפת הגעה">
  <div class="sm-wrap">
    <div class="sm-map__frame"><iframe src="${MAP_EMBED}" title="מפה: ${CONTACT.address}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>
</main>`;

const faqMain = () => `
<main id="main" tabindex="-1">
<section class="sm-phero sm-phero--plain" aria-labelledby="faq-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">שאלות נפוצות</span></li>
        </ol>
      </nav>
      <h1 id="faq-h1" class="sm-phero__title">שאלות נפוצות</h1>
      <p class="sm-phero__lead">תשובות לשאלות נפוצות על טיפולי שיקום, כאב והפרעות שינה, אופן התיאום, ביטוחים ודרכי הגעה למרכז, עם ליווי מקצועי ומידע מקיף לכל מטופל.</p>
    </div>
  </div>
</section>

<section class="sm-svcpage sm-faqpage">
  <div class="sm-wrap sm-svcpage__grid">
    <div class="sm-faqpage__main">
      <nav class="sm-faqpage__nav" aria-label="נושאי השאלות">
        <ul role="list">${FAQ_PAGE.map((g, i) => `<li><a href="#faq-cat-${i + 1}">${g.cat}</a></li>`).join("")}</ul>
      </nav>
      ${FAQ_PAGE.map((g, i) => `<div class="sm-faqpage__group" id="faq-cat-${i + 1}">
        <h2 class="sm-prose__h2">${g.cat}</h2>
        <div class="sm-qa">
          ${g.items.map((x) => `<details><summary><h3>${x.q}</h3>${icon("plus", "sm-ico")}</summary><p>${latin(x.a)}</p></details>`).join("\n          ")}
        </div>
      </div>`).join("\n      ")}
    </div>
    <aside class="sm-svcpage__side" aria-label="יצירת קשר">
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <p class="sm-side__text">לא מצאתם תשובה? השאירו פרטים ונחזור אליכם.</p>
        <a class="btn btn-cta" href="${CONTACT_URL}">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </aside>
  </div>
</section>
</main>`;


/* ---------- Reviews (/המלצות) and video reviews (/המלצות-וידאו + items) ----------
   H1s as on the current pages ("המלצות", "המלצות וידאו"; the item pages have
   an empty H1 there, so they get "המלצות וידאו" like their title tag). Leads =
   the current meta descriptions, the video subtitle is the current H4 line,
   "לגלריה המלאה" is the current item page link. No new copy. */
const REVIEWS_URL = "/המלצות";
const VIDEOS_URL = "/המלצות-וידאו";
const videoCard = (v, i, big) => `<li class="sm-video${big ? " sm-video--big" : ""}">
          <video src="/assets/video/testimonial-${v.id}.mp4" poster="/assets/video/testimonial-${v.id}.webp" preload="none" playsinline width="480" height="861" aria-label="המלצת וידאו ${i + 1}"></video>
          <button class="sm-video__play" type="button" aria-label="הפעלת המלצת וידאו ${i + 1}">${icon("play", "sm-ico sm-ico--fill")}</button>
        </li>`;
const plainHero = (id, crumbs, h1, lead) => `
<section class="sm-phero sm-phero--plain" aria-labelledby="${id}">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          ${crumbs.map(([t, h]) => h ? `<li><a href="${h}">${t}</a>${icon("chevron-left", "sm-ico")}</li>` : `<li><span aria-current="page">${t}</span></li>`).join("\n          ")}
        </ol>
      </nav>
      <h1 id="${id}" class="sm-phero__title">${h1}</h1>
      <p class="sm-phero__lead">${lead}</p>
    </div>
  </div>
</section>`;

const reviewsMain = () => `
<main id="main" tabindex="-1">
${plainHero("rev-h1", [["המלצות"]], "המלצות", "מטופלים מספרים על תהליכי טיפול, מקצועיות הצוות והתוצאות שהשיגו בסופיה מדיקל, עם דוגמאות לשיפור תפקוד והפחתת כאב וליווי אישי לאורך כל הדרך.")}
<section class="sm-revpage" aria-label="המלצות מטופלים">
  <div class="sm-wrap">
    <ul class="sm-revgrid" role="list">
      ${REVIEWS_PAGE.map((r) => `<li class="sm-revcard">
        <figure>
          <svg class="sm-review__mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 8c-4 1.5-6 4.5-6 9v3h6v-6H7.5M23 8c-4 1.5-6 4.5-6 9v3h6v-6h-3.5"/></svg>
          <blockquote class="sm-revcard__quote">${r.quote}</blockquote>
          <figcaption class="sm-revcard__name">${r.name}</figcaption>
        </figure>
      </li>`).join("\n      ")}
    </ul>
  </div>
</section>
<section class="sm-revvid" aria-labelledby="revvid-title">
  <div class="sm-wrap">
    <div class="sm-revvid__head">
      <h2 class="sm-revvid__title" id="revvid-title">המלצות וידאו</h2>
      <p class="sm-videos__sub">כי אין כמו לשמוע ממי שכבר עבר את הדרך</p>
    </div>
    <ul class="sm-videos__list" role="list">
        ${VIDEOS.map((v, i) => videoCard(v, i)).join("\n        ")}
    </ul>
    <div class="sm-revvid__more"><a class="btn btn-ghost" href="${VIDEOS_URL}">לכל המלצות הווידאו</a></div>
  </div>
</section>
${ctaBand()}
</main>`;

const videosMain = () => `
<main id="main" tabindex="-1">
${plainHero("vid-h1", [["המלצות", REVIEWS_URL], ["המלצות וידאו"]], "המלצות וידאו", "כי אין כמו לשמוע ממי שכבר עבר את הדרך")}
<section class="sm-revvid sm-revvid--page" aria-label="סרטוני המלצות">
  <div class="sm-wrap">
    <ul class="sm-videos__list" role="list">
        ${VIDEOS.map((v, i) => videoCard(v, i, true)).join("\n        ")}
    </ul>
    <div class="sm-revvid__more"><a class="btn btn-ghost" href="${REVIEWS_URL}">לכל ההמלצות</a></div>
  </div>
</section>
${ctaBand()}
</main>`;

const videoItemMain = (v, i) => `
<main id="main" tabindex="-1">
${plainHero("vit-h1", [["המלצות", REVIEWS_URL], ["המלצות וידאו", VIDEOS_URL], [`המלצת וידאו ${i + 1}`]], "המלצות וידאו", v.desc)}
<section class="sm-revvid sm-revvid--page" aria-label="סרטון המלצה">
  <div class="sm-wrap">
    <ul class="sm-videos__list" role="list">
        ${videoCard(v, i, true)}
    </ul>
    <div class="sm-revvid__more"><a class="btn btn-ghost" href="${VIDEOS_URL}">לגלריה המלאה</a></div>
  </div>
</section>
${ctaBand()}
</main>`;


/* ---------- Treatment area pages (4, data-areas.mjs) ----------
   Hero with the area image (vision: Dr. Ala's desk photo), the current text
   as prose, side box with the lead CTA and the area's service pages, and the
   "more articles" carousel of the same topic. NEW UI copy for approval:
   "שירותים בתחום" (side box title). */
const areaMain = (p) => {
  const shortLead = p.text[0].length < 140;
  const lead = shortLead ? p.text[0] : p.desc;
  const body = shortLead ? p.text.slice(1) : p.text;
  const rel = (p.topic ? ARTICLES.filter((x) => x.topic === p.topic) : ARTICLES).slice(0, 10);
  const media = p.img === "about"
    ? `<figure class="sm-phero__figure">
        <div class="sm-phero__frame"><img src="/assets/img/about/dr-ala-mahamid-desk-960.webp" srcset="/assets/img/about/dr-ala-mahamid-desk-640.webp 640w, /assets/img/about/dr-ala-mahamid-desk-960.webp 960w, /assets/img/about/dr-ala-mahamid-desk-1400.webp 1400w" sizes="(max-width: 1024px) 92vw, 46vw" width="960" height="720" alt="ד&quot;ר עלא מחאמיד, מנהל מרכז סופיה מדיקל" fetchpriority="high" decoding="async"></div>
        <figcaption class="sm-phero__card"><strong>ד"ר עלא מחאמיד</strong><span>${ALA_ROLE}</span></figcaption>
      </figure>`
    : `<figure class="sm-phero__figure">
        <div class="sm-phero__frame"><img src="/assets/img/${p.img}-900.webp" srcset="/assets/img/${p.img}-600.webp 600w, /assets/img/${p.img}-900.webp 900w" sizes="(max-width: 1024px) 92vw, 46vw" width="900" height="675" alt="${esc(p.h1)}, סופיה מדיקל" fetchpriority="high" decoding="async"></div>
      </figure>`;
  return `
<main id="main" tabindex="-1">
<section class="sm-phero" aria-labelledby="area-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">${latin(p.h1.split(":")[0])}</span></li>
        </ol>
      </nav>
      <h1 id="area-h1" class="sm-phero__title sm-phero__title--svc">${latin(p.h1)}</h1>
      <p class="sm-phero__lead">${latin(lead)}</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
      </div>
    </div>
    <div class="sm-phero__media">
      ${media}
    </div>
  </div>
</section>

<section class="sm-svcpage">
  <div class="sm-wrap sm-svcpage__grid">
    <div class="sm-prose sm-prose--area">
        ${body.map((t) => `<p>${latin(t)}</p>`).join("\n        ")}
        ${p.more ? `<p class="sm-prose__more"><a class="btn btn-ghost" href="${p.more.href}">${p.more.label}</a></p>` : ""}
    </div>
    <aside class="sm-svcpage__side" aria-label="יצירת קשר ושירותים בתחום">
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <p class="sm-side__text">קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
      <nav class="sm-side__box" aria-labelledby="area-svc">
        <p class="sm-side__title" id="area-svc">שירותים בתחום</p>
        <ul class="sm-side__links" role="list">
          ${p.svc.map((k) => SERVICES_PAGE[k]).map((s) => `<li><a href="${s.href}"><span>${latin(s.title.split(":")[0])}</span>${icon("chevron-left", "sm-ico")}</a></li>`).join("\n          ")}
        </ul>
      </nav>
    </aside>
  </div>
</section>

<section class="sm-rel" aria-labelledby="rel-title" data-rel>
  <div class="sm-wrap">
    <div class="sm-rel__head">
      <h2 class="sm-rel__h2" id="rel-title">מאמרים נוספים</h2>
      <a class="sm-rel__all" href="${ARTICLES_URL}">לכל המאמרים${icon("chevron-left", "sm-ico")}</a>
    </div>
    <div class="sm-rel__viewport">
      <button class="sm-rel__arrow sm-rel__arrow--prev" type="button" aria-label="המאמרים הקודמים" data-dir="-1">${icon("chevron-right", "sm-ico")}</button>
      <ul class="sm-rel__track" role="list">
        ${rel.map(artCard).join("\n        ")}
      </ul>
      <button class="sm-rel__arrow sm-rel__arrow--next" type="button" aria-label="המאמרים הבאים" data-dir="1">${icon("chevron-left", "sm-ico")}</button>
    </div>
  </div>
</section>
</main>`;
};


/* ---------- Arrangements (/הסדרים) and multidisciplinary team (/צוות-רב-מקצועי) ----------
   Both current pages are short: one sentence (arrangements) and an intro plus
   a list of professions (team). Text kept as is; the professions and the
   three arrangements are shown as cards with icons. The images on the current
   pages are a logo and a stock photo with people, so neither is used. */
const ARR_URL = "/הסדרים";
const MDT_URL = "/צוות-רב-מקצועי";
const PROFESSIONS = [
  ["רופאי שיקום", "stethoscope"], ["רופאים יועצים בתחומים שונים", "users"], ["פיזיותרפיסטים", "person-standing"],
  ["פסיכולוגים", "brain"], ["קלינאי תקשורת", "message-circle"], ["טכנאי שינה", "moon"],
  ["מרפאים בעיסוק", "hand-heart"], ["מומחי סדים ופרוטזות", "footprints"], ["מטפלים ברפואה משלימה", "sparkles"],
];

// Each arrangement with what it includes and the price (client, 2026-11-27)
const ARR_TILES = [
  { name: "כללית מושלם", img: "badge-clalit-mushlam", text: 'ייעוץ אצל ד"ר עלא מחאמיד, מומחה ברפואה פיזיקלית ושיקום ומומחה לרפואת שינה.',
    items: ['ביקור במרפאה: 150 ש"ח', 'ביקור טלפוני: 100 ש"ח', "בהתאם לזכאות בביטוח ולתנאי ההסדר"] },
  { name: '<span dir="ltr">BWell</span> ומגדל', img: "badge-bwell", text: "טיפולים וייעוץ רפואי בהשתתפות עצמית, בהתאם לזכאות בביטוח:",
    items: ["טיפולי פיזיותרפיה", 'ייעוץ אצל ד"ר ירונה שפר יעקב, מומחית לרפואת כאב', 'ייעוץ אצל ד"ר הייתם אבו נגמה, אורולוג'] },
];
const ARR_BLOCKS = [
  { t: "h2", x: "מה כולל ההסדר עם כללית מושלם?" },
  { t: "p", x: 'במסגרת ההסדר אפשר להגיע לייעוץ אצל [[ד"ר עלא מחאמיד|/הצוות/ד-ר-עלא-מחאמיד]] בתחומי השיקום ורפואת השינה. בספר השירות של כללית הוא רשום ברפואה פיזיקלית ושיקום, כולל עמוד שדרה, טיפול בכאב, נפגעי ספורט, שליטה בסוגרים, שיקום מיני, נפגעי ראש, שיקום ילדים ושיקום פגועי גפיים, וגם חוות דעת שנייה.' },
  { t: "p", x: "הייעוץ מתאים גם כהערכה מקדימה לפני פיזיותרפיה, כדי לבנות תוכנית טיפול מדויקת ומותאמת אישית. אפשר להגיע לביקור במרפאה בכפר סבא, או לבחור ביקור טלפוני." },
  { t: "h2", x: "מה כולל ההסדר עם BWell?" },
  { t: "p", x: "במסגרת ההסדר עם BWell מבית מגדל אפשר לקבל בסופיה מדיקל [[טיפולי פיזיותרפיה|/שירותים/פיזיותרפיה-מתקדמת-בסופיה-מדיקל-טיפול-מדויק-עם-ראייה-שיקומית-רחבה]], ייעוץ אצל [[ד\"ר ירונה שפר יעקב|/הצוות/ד-ר-ירונה-שפר-יעקב]], מומחית לרפואת כאב, וייעוץ אורולוגי אצל [[ד\"ר הייתם אבו נגמה|/הצוות/ד-ר-הייתם-אבו-נגמה]]. ההשתתפות העצמית נקבעת לפי הזכאות בפוליסה." },
  { t: "h2", x: "איך מזמינים תור במסגרת ההסדר?" },
  { t: "ul", x: [
    "בודקים את הזכאות שלכם מול כללית מושלם או מול BWell.",
    "מתקשרים, שולחים הודעה בוואטסאפ או משאירים פרטים בטופס באתר.",
    "מציינים באיזה הסדר אתם מגיעים, ואנחנו מתאמים איתכם מועד.",
  ] },
  { t: "h2", x: "שאלות נפוצות" },
  { t: "h3", x: "איך יודעים אם אני זכאי להסדר?" },
  { t: "p", x: "הזכאות נקבעת לפי סוג הביטוח שלכם. אפשר לבדוק באתר או במוקד של כללית או של BWell, ואפשר גם לשאול אותנו ונכוון אתכם." },
  { t: "h3", x: "מה ההבדל בין ביקור במרפאה לביקור טלפוני?" },
  { t: "p", x: "בביקור במרפאה הרופא יכול לבצע בדיקה גופנית. ביקור טלפוני מתאים לשיחת ייעוץ, למעבר על בדיקות ולהמשך מעקב, כשאין צורך בבדיקה." },
  { t: "h3", x: "ואם אין לי כללית מושלם או BWell?" },
  { t: "p", x: "אפשר להגיע לכל השירותים במרכז גם באופן פרטי. חלק מהביטוחים המשלימים והפרטיים מחזירים חלק מהעלות, בהתאם לפוליסה." },
];
const arrMain = () => `
<main id="main" tabindex="-1">
${plainHero("arr-h1", [["הסדרים"]], "הסדרים", `קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב`)}
<section class="sm-tiles" aria-label="הסדרים">
  <div class="sm-wrap">
    <ul class="sm-tiles__grid sm-tiles__grid--2" role="list">
      ${ARR_TILES.map((x) => `<li class="sm-tile sm-tile--arr">
        <img class="sm-tile__seal" src="/assets/img/hero/${x.img}-160.webp" srcset="/assets/img/hero/${x.img}-160.webp 1x, /assets/img/hero/${x.img}-320.webp 2x" width="72" height="72" alt="" loading="lazy" decoding="async">
        <h2 class="sm-tile__title">${x.name}</h2>
        <p class="sm-tile__text">${x.text}</p>
        <ul class="sm-tile__list" role="list">${x.items.map((i) => `<li>${icon("check", "sm-ico")}<span>${latin(i)}</span></li>`).join("")}</ul>
      </li>`).join("\n      ")}
    </ul>
  </div>
</section>
<section class="sm-svcpage">
  <div class="sm-wrap sm-svcpage__grid">
    <article class="sm-prose">
        ${ARR_BLOCKS.map((b) => b.t === "h2" ? `<h2 class="sm-prose__h2">${latin(b.x)}</h2>` : b.t === "h3" ? `<h3 class="sm-prose__h3">${latin(b.x)}</h3>` : b.t === "ul" ? `<ul class="sm-prose__list" role="list">${b.x.map((x) => `<li>${rich(x)}</li>`).join("")}</ul>` : `<p>${rich(b.x)}</p>`).join("\n        ")}
    </article>
    <aside class="sm-svcpage__side" aria-label="יצירת קשר">
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <p class="sm-side__text">ספרו לנו באיזה הסדר אתם מגיעים, ונתאם איתכם מועד</p>
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </aside>
  </div>
</section>
${ctaBand()}
</main>`;

/* ---------- In the media (/בתקשורת), 2026-11-27 ----------
   Items from Dr. Alaa's MedReviews profile ("מהתקשורת") and Raanana News.
   Titles as published; no outlet logos or screenshots (not ours to use). */
const MEDIA_URL = "/בתקשורת";
const MEDIA = [
  { kind: "article", outlet: "צומת כפר סבא", title: "השיקום לא מסתיים בבית החולים: סופיה מדיקל מרחיבים את השיקום בקהילה", href: "https://www.tzomet-kfs.co.il/health/78179" },
  { kind: "video", outlet: "חדשות N12", title: 'ישנים מעט? אתם בסיכון לחלות במחלות כרוניות. ד"ר עלא מחאמיד על מחקר שנעשה עם 8,000 מטופלים', href: "https://www.facebook.com/Loewenstein.rehab.medicalcenter/videos/5907477409276055/" },
  { kind: "video", outlet: "רשת 13", title: "נהיגה בהשפעה: איך מתפקדים נהגים שלא ישנו כל הלילה?", href: "https://13tv.co.il/item/news/domestic/internal/driving-tired-903370040/" },
  { kind: "video", outlet: "כאן, בתוכנית על סדר היום", title: "האם תנומה באמת עוזרת לשפר את תפקוד המוח?", href: "https://www.makan.org.il/content/news/makan-news/p-11626/861385/" },
  { kind: "article", outlet: "ynet", title: 'ד"ר עלא מחאמיד מסביר על הפרעות שינה', href: "https://www.ynet.co.il/health/article/rkmy14ysjx" },
  { kind: "article", outlet: "mako", title: "ירידה בעוצמת הפרשת הורמון הגדילה: כך משפיעות היקיצות בלילה על התפתחות הילדים", href: "https://www.mako.co.il/health-news/Article-a7fbe0ffe7c5d91027.htm" },
  { kind: "article", outlet: "בחדרי חרדים", title: "כך תתמודדו עם המעבר לשעון החורף", href: "https://www.bhol.co.il/news/1293257" },
  { kind: "article", outlet: "רעננה ניוז", title: "היחידה לאבחון הפרעות בשינה בלוינשטיין מרחיבה את פעילותה ומוסיפה שירותים חדשים", href: "https://raanana.news/%D7%94%D7%99%D7%97%D7%99%D7%93%D7%94-%D7%9C%D7%90%D7%91%D7%97%D7%95%D7%9F-%D7%94%D7%A4%D7%A8%D7%A2%D7%95%D7%AA-%D7%91%D7%A9%D7%99%D7%A0%D7%94-%D7%91%D7%9E%D7%A8%D7%9B%D7%96-%D7%94%D7%A8%D7%A4%D7%95/" },
  { kind: "video", outlet: "אינסטגרם של המרכז הרפואי לוינשטיין", title: "4 עובדות שלא ידעתם על היחידה לאבחון הפרעות שינה", href: "https://www.instagram.com/loewenstein_medcenter/reel/ChhPC60FVQR/" },
];
const MEDIA_KIND = { video: ["play-line", "צפייה"], article: ["file-text", "קריאה"] };
const mediaMain = () => `
<main id="main" tabindex="-1">
${plainHero("media-h1", [["בתקשורת"]], "בתקשורת", 'כתבות, ראיונות והופעות בתקשורת של ד"ר עלא מחאמיד ושל סופיה מדיקל, בנושאי שינה, שיקום ובריאות')}
<section class="sm-tiles" aria-label="פרסומים בתקשורת">
  <div class="sm-wrap">
    <ul class="sm-tiles__grid" role="list">
      ${MEDIA.map((m) => `<li class="sm-tile sm-tile--media">
        <span class="sm-tile__ico">${icon(MEDIA_KIND[m.kind][0], "sm-ico")}</span>
        <p class="sm-tile__src">${latin(m.outlet)}</p>
        <h2 class="sm-tile__title">${latin(m.title)}</h2>
        <a class="btn btn-ghost sm-tile__btn" href="${m.href}" target="_blank" rel="noopener">${MEDIA_KIND[m.kind][1]}<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
      </li>`).join("\n      ")}
    </ul>
  </div>
</section>
${ctaBand()}
</main>`;

const mdtMain = () => `
<main id="main" tabindex="-1">
<section class="sm-phero" aria-labelledby="mdt-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">צוות רב מקצועי</span></li>
        </ol>
      </nav>
      <h1 id="mdt-h1" class="sm-phero__title">צוות רב מקצועי</h1>
      <p class="sm-phero__lead">הצוות פועל בשיתוף פעולה הדוק ובגישה רב תחומית, מתוך מטרה להעניק לכל מטופל טיפול אישי, מקצועי ומקיף, תחת קורת גג אחת.</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${TEAM_URL}">לעמוד הצוות המלא</a>
      </div>
    </div>
    <div class="sm-phero__media">
      <ul class="sm-mosaic" role="list">
        ${TEAM_PAGE.slice(0, 4).map((m) => `<li><img src="/assets/img/team/${m.slug}.webp" width="480" height="600" alt="${esc(m.name)}, ${esc(m.role)}" decoding="async"></li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>
<section class="sm-tiles" aria-labelledby="mdt-list">
  <div class="sm-wrap">
    <h2 class="sm-tiles__h2" id="mdt-list">במרכז פועל צוות מגוון ומיומן הכולל:</h2>
    <ul class="sm-tiles__grid" role="list">
      ${PROFESSIONS.map(([n, ic]) => `<li class="sm-tile sm-tile--row"><span class="sm-tile__ico">${icon(ic, "sm-ico")}</span><h3 class="sm-tile__title">${n}</h3></li>`).join("\n      ")}
    </ul>
    <p class="sm-tiles__note">הצוות פועל בגישה אינטגרטיבית המשלבת גוף, נפש וטכנולוגיה רפואית מתקדמת, במטרה להעניק טיפול כוללני, אנושי ומותאם אישית לכל מטופל.</p>
  </div>
</section>
${ctaBand()}
</main>`;


/* ---------- Team profile pages (/הצוות/<slug>) ----------
   Same URLs, titles, meta descriptions and H1 as the current profile pages;
   role and short line from the team page, bio from the profile page
   (data-team-profiles.mjs). The removed team members get no page (their
   old URLs need a 301 to /הצוות in WordPress). No new copy. */
const profileMain = (m) => {
  const p = PROFILES[m.slug];
  const others = TEAM_PAGE.filter((x) => x.slug !== m.slug);
  return `
<main id="main" tabindex="-1">
<section class="sm-phero" aria-labelledby="prof-h1">
  <div class="sm-wrap sm-phero__grid">
    <div class="sm-phero__text">
      <nav class="sm-crumbs" aria-label="פירורי לחם">
        <ol role="list">
          <li><a href="/">בית</a>${icon("chevron-left", "sm-ico")}</li>
          <li><a href="${TEAM_URL}">הצוות</a>${icon("chevron-left", "sm-ico")}</li>
          <li><span aria-current="page">${m.name}</span></li>
        </ol>
      </nav>
      <h1 id="prof-h1" class="sm-phero__title sm-phero__title--svc">${m.name}</h1>
      <p class="sm-prof__role">${latin(m.role)}</p>
      <p class="sm-phero__lead">${latin(m.line)}</p>
      <div class="sm-phero__actions">
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-wa" href="https://wa.me/972504651970" target="_blank" rel="noopener">וואטסאפ<span class="sm-sr"> (נפתח בחלון חדש)</span> ${icon("whatsapp", "sm-ico sm-ico--fill")}</a>
      </div>
    </div>
    <div class="sm-phero__media">
      <figure class="sm-phero__figure sm-phero__figure--portrait">
        <div class="sm-phero__frame"><img src="/assets/img/team/${m.slug}.webp" width="480" height="600" alt="${esc(m.name)}, ${esc(m.role)}" fetchpriority="high" decoding="async"></div>
      </figure>
    </div>
  </div>
</section>

<section class="sm-svcpage">
  <div class="sm-wrap sm-svcpage__grid">
    <article class="sm-prose sm-prose--area">
        ${p.blocks.map((b) => b.t === "h2" ? `<h2 class="sm-prose__h2">${latin(b.x)}</h2>` : b.t === "ul" ? `<ul class="sm-prose__list" role="list">${b.x.map((x) => `<li>${svcItem(x)}</li>`).join("")}</ul>` : `<p>${rich(b.x)}</p>`).join("\n        ")}
    </article>
    <aside class="sm-svcpage__side" aria-label="יצירת קשר">
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <p class="sm-side__text">קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
    </aside>
  </div>
</section>

<section class="sm-rel" aria-labelledby="rel-title" data-rel>
  <div class="sm-wrap">
    <div class="sm-rel__head">
      <h2 class="sm-rel__h2" id="rel-title">הצוות</h2>
      <a class="sm-rel__all" href="${TEAM_URL}">לעמוד הצוות המלא${icon("chevron-left", "sm-ico")}</a>
    </div>
    <div class="sm-rel__viewport">
      <button class="sm-rel__arrow sm-rel__arrow--prev" type="button" aria-label="הקודמים" data-dir="-1">${icon("chevron-right", "sm-ico")}</button>
      <ul class="sm-rel__track sm-rel__track--team" role="list">
        ${others.map((x) => `<li class="sm-rel__item"><a class="sm-rel__card" href="${PROFILES[x.slug].href}">
            <span class="sm-rel__img sm-rel__img--portrait"><img src="/assets/img/team/${x.slug}.webp" width="480" height="600" alt="" loading="lazy" decoding="async"></span>
            <span class="sm-rel__title">${x.name}</span>
            <span class="sm-rel__role">${latin(x.role)}</span>
            <span class="sm-rel__more" aria-hidden="true">קרא עוד${icon("chevron-left", "sm-ico")}</span>
          </a></li>`).join("\n        ")}
      </ul>
      <button class="sm-rel__arrow sm-rel__arrow--next" type="button" aria-label="הבאים" data-dir="1">${icon("chevron-left", "sm-ico")}</button>
    </div>
  </div>
</section>
</main>`;
};


/* ---------- Legal pages (/terms, /privacy, /accessibility) ----------
   Text of the current pages (data-legal.mjs), H1 as on the current pages.
   Phone and email lines become links. The accessibility statement is the
   client's current one (updated 29/11/2025); it must be reviewed against the
   new site before go live. */
const legalLink = (t) => {
  const keep = [];
  t = t.replace(/0\d{1,2}-\d{3}-\d{4}/g, (m) => { keep.push(`<a href="tel:+972${m.replace(/-/g, "").slice(1)}" dir="ltr">${m}</a>`); return `§${keep.length - 1}§`; })
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, (m) => { keep.push(`<a href="mailto:${m}" dir="ltr">${m}</a>`); return `§${keep.length - 1}§`; });
  return latin(t).replace(/§(\d+)§/g, (m, i) => keep[+i]);
};
const legalMain = (p) => `
<main id="main" tabindex="-1">
${plainHero("legal-h1", [[p.h1]], p.h1, "")}
<section class="sm-svcpage sm-legal">
  <div class="sm-wrap">
    <article class="sm-prose">
        ${p.blocks.map((b) => b.t === "h2" ? `<h2 class="sm-prose__h2">${latin(b.x)}</h2>` : b.t === "h3" ? `<h3 class="sm-prose__h3">${latin(b.x)}</h3>` : b.t === "ul" ? `<ul class="sm-prose__list" role="list">${b.x.map((x) => `<li>${legalLink(x)}</li>`).join("")}</ul>` : `<p>${legalLink(b.x)}</p>`).join("\n        ")}
    </article>
  </div>
</section>
</main>`;

/* ---------- Thank you page (/thank-you, /en|ru|ar/thank-you) ----------
   Every lead form redirects here after a successful submission (convert.mjs).
   Hebrew copy is the client's own text (2026-11-26); en/ru/ar are its translation. noindex. */
const THANKS_URL = "/thank-you";
const THANKS = {
  he: { title: "תודה על פנייתך | סופיה מדיקל", h1: "תודה על פנייתך לסופיה מדיקל", text: "פנייתך התקבלה בהצלחה, וצוות המרכז יחזור אליך בהקדם במהלך שעות הפעילות.", home: "חזרה לדף הבית", wa: "דברו איתנו בוואטסאפ" },
  en: { title: "Thank you | Sofia Medical", h1: "Thank you for contacting Sofia Medical", text: "Your request has been received, and our team will get back to you as soon as possible during opening hours.", home: "Back to the home page", wa: "Talk to us on WhatsApp" },
  ru: { title: "Спасибо | Sofia Medical", h1: "Спасибо, что обратились в Sofia Medical", text: "Ваша заявка успешно получена, и сотрудники центра свяжутся с вами в ближайшее время в часы работы.", home: "Вернуться на главную", wa: "Написать нам в WhatsApp" },
  ar: { title: "شكرا لكم | صوفيا ميديكال", h1: "شكرا لتواصلكم مع صوفيا ميديكال", text: "تم استلام طلبكم بنجاح، وسيعود إليكم فريق المركز في أقرب وقت خلال ساعات العمل.", home: "العودة إلى الصفحة الرئيسية", wa: "تحدثوا معنا عبر واتساب" },
};
const thanksMain = (k) => {
  const t = THANKS[k], dir = LANGS[k].dir;
  const wa = k === "he" ? WA : waLink(I18N[k].waHello);
  const nw = k === "he" ? " (נפתח בחלון חדש)" : I18N[k].newWin;
  return `
<main id="main" tabindex="-1">
<section class="sm-thanks" aria-labelledby="thanks-h1">
  <div class="sm-wrap">
    <div class="sm-thanks__box">
      <span class="sm-thanks__ico" aria-hidden="true">${icon("badge-check", "sm-ico")}</span>
      <h1 id="thanks-h1" class="sm-thanks__title">${t.h1}</h1>
      <p class="sm-thanks__text">${t.text}</p>
      <div class="sm-thanks__actions">
        <a class="btn btn-cta" href="${LANGS[k].href}">${ibd(dir, t.home, icon("house", "sm-ico"))}</a>
        <a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener">${ibd(dir, t.wa, icon("whatsapp", "sm-ico sm-ico--fill"))}<span class="sm-sr">${nw}</span></a>
      </div>
    </div>
  </div>
</section>
</main>`;
};
// language landings link to anchors on their own page: from a sub page they go back to /xx/#anchor
const landingLinks = (html, k) => html.replace(/href="#(?!main")([^"]*)"/g, (m, h) => h === "top" ? `href="/${k}/"` : `href="/${k}/#${h}"`);

/* ---------- Write pages ---------- */
// PREVIEW: the local build is also published on GitHub Pages for the client,
// so every page is noindex and all site paths are relative (works on
// localhost and under /sofia-medical/). Robots and paths are set again in
// WordPress, this only affects the static preview.
const PREVIEW = true;
const VER = Date.now().toString(36);
const write = (rel, html) => {
  // WP_EXPORT=1: also keep the raw page (root-relative paths, real robots) for the WordPress converter
  if (process.env.WP_EXPORT) { const r = join(SITE, "_build", "wp", "raw", rel); mkdirSync(dirname(r), { recursive: true }); writeFileSync(r, html, "utf8"); }
  const up = "../".repeat(rel.split("/").length - 1);
  html = html
    .replace(/([\s"',(])\/assets\//g, `$1${up}assets/`)
    .replace(/href="\/(en|ru|ar)\/"/g, `href="${up}$1/"`)
    .replace(/href="\/"/g, `href="${up || "./"}"`)
    // inner site pages: /x/y -> ../x/y/ (folder per page on the preview)
    .replace(/href="\/(?!\/)([^"#?]+?)\/?"/g, `href="${up}$1/"`)
    // cache busting: every build gets a new version on CSS and JS
    .replace(/(assets\/(?:css|js)\/[\w-]+\.(?:css|js))"/g, `$1?v=${VER}"`);
  if (PREVIEW) html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
  const p = join(SITE, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, html, "utf8");
  console.log("built", rel);
};

// Hebrew home: same title, description and canonical as the current site
write("index.html", page({
  lang: "he",
  title: "שיקום, פיזיותרפיה, טיפול בכאב והפרעות שינה | סופיה מדיקל",
  // Exact meta description of the current homepage (kept for SEO)
  description: "מרכז מוביל לשיקום רפואי, פיזיותרפיה, טיפול בכאב והפרעות שינה עם צוות רב-תחומי וטכנולוגיות מתקדמות. טיפול מותאם למבוגרים וילדים בכל הארץ. צרו קשר לייעוץ אישי.",
  robots: "index, follow",
  canonical: "https://www.sofia-medical.com/",
  head: `
<link rel="preload" as="image" type="image/webp" media="(min-width: 1025px)" imagesrcset="/assets/img/hero/hero-clinic-1280.webp 1280w, /assets/img/hero/hero-clinic-1920.webp 1920w, /assets/img/hero/hero-clinic-2560.webp 2560w" imagesizes="100vw" fetchpriority="high">
<link rel="preload" as="image" type="image/webp" media="(max-width: 1024px)" imagesrcset="/assets/img/hero/hero-clinic-m-480.webp 480w, /assets/img/hero/hero-clinic-m-768.webp 768w, /assets/img/hero/hero-clinic-m-1080.webp 1080w" imagesizes="100vw" fetchpriority="high">
<link rel="stylesheet" href="/assets/css/hero.css">
<link rel="stylesheet" href="/assets/css/about.css">
<link rel="stylesheet" href="/assets/css/treatments.css">
<script src="/assets/js/tabs.js" defer></script>
<link rel="stylesheet" href="/assets/css/team.css">
<script src="/assets/js/team.js" defer></script>
<link rel="stylesheet" href="/assets/css/reviews.css">
<script src="/assets/js/reviews.js" defer></script>
<link rel="stylesheet" href="/assets/css/faq.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalClinic", "@id": SITE_URL + "/#clinic", name: "סופיה מדיקל", url: "https://www.sofia-medical.com/", logo: "https://www.sofia-medical.com/assets/img/logo-icon.png", telephone: "+972-50-465-1970", email: CONTACT.email, address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" }, medicalSpecialty: ["PhysicalMedicineAndRehabilitation", "SleepMedicine", "PainManagement"], sameAs: ["https://www.facebook.com/profile.php?id=61583510784516", "https://www.instagram.com/sofiamedical12/"] })}</script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) })}</script>`,
  body: header("he", "/") + heroHome() + footer(),
}));

// About: same URL, title and meta description as the current page
{
  const url = SITE_URL + encodeURI(ABOUT_URL);
  const title = "הסיפור שלנו והדרך לרפואה מותאמת אישית | סופיה מדיקל";
  const description = "סיפור ההקמה והחזון של סופיה מדיקל, המרכז הרב תחומי בראשות ד״ר עלא מחאמיד שמחבר מומחים, טכנולוגיה ויחס אישי לטיפול משולב ושירות בפריסה ארצית.";
  const img = SITE_URL + "/assets/img/about/dr-ala-mahamid-desk-1400.webp";
  const clinic = { "@type": "MedicalClinic", "@id": SITE_URL + "/#clinic", name: "סופיה מדיקל", url: SITE_URL + "/", telephone: "+972-50-465-1970", email: CONTACT.email,
    address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" },
    medicalSpecialty: ["PhysicalMedicineAndRehabilitation", "SleepMedicine", "PainManagement"] };
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "AboutPage", "@id": url + "#page", url, name: title, description, inLanguage: "he-IL", primaryImageOfPage: img,
      about: { "@id": clinic["@id"] }, breadcrumb: { "@id": url + "#crumbs" } },
    clinic,
    { "@type": "Person", "@id": SITE_URL + "/#dr-ala-mahamid", name: 'ד"ר עלא מחאמיד', jobTitle: ALA_ROLE, image: img, worksFor: { "@id": clinic["@id"] } },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "אודות סופיה מדיקל", item: url } ] },
  ] };
  write("אודות-סופיה-מדיקל/index.html", page({
    lang: "he", title, description, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="preload" as="image" type="image/webp" imagesrcset="/assets/img/about/dr-ala-mahamid-desk-640.webp 640w, /assets/img/about/dr-ala-mahamid-desk-960.webp 960w, /assets/img/about/dr-ala-mahamid-desk-1400.webp 1400w" imagesizes="(max-width: 1024px) 92vw, 46vw" fetchpriority="high">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", ABOUT_URL) + aboutMain() + footer(),
  }));
}

// Team: same URL, title and meta description as the current page
{
  const url = SITE_URL + encodeURI(TEAM_URL);
  const title = "הכירו את הצוות הרב מקצועי והמומחים של המרכז | סופיה מדיקל";
  const description = "צוות רב מקצועי של רופאים, פיזיותרפיסטים ומטפלים משלבים ניסיון קליני, טכנולוגיות מתקדמות ושירות אישי במרכז סופיה מדיקל לטיפול מקיף ותמיכה מלאה.";
  const img = SITE_URL + "/assets/img/team/ala-mahamid.webp";
  const clinicId = SITE_URL + "/#clinic";
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": url + "#page", url, name: title, description, inLanguage: "he-IL",
      about: { "@id": clinicId }, breadcrumb: { "@id": url + "#crumbs" }, mainEntity: { "@id": url + "#team" } },
    { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/", telephone: "+972-50-465-1970", email: CONTACT.email,
      address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" } },
    { "@type": "ItemList", "@id": url + "#team", numberOfItems: TEAM_PAGE.length, itemListElement: TEAM_PAGE.map((m, i) => ({
      "@type": "ListItem", position: i + 1, item: { "@type": "Person", "@id": SITE_URL + "/#" + m.slug, name: m.name, jobTitle: m.role, description: m.line,
        image: SITE_URL + "/assets/img/team/" + m.slug + ".webp", worksFor: { "@id": clinicId } } })) },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "הצוות", item: url } ] },
  ] };
  write("הצוות/index.html", page({
    lang: "he", title, description, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-team.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", TEAM_URL) + teamMain() + footer(),
  }));
}

// Services: same URL, title and meta description as the current page
{
  const url = SITE_URL + encodeURI(SERVICES_URL);
  const title = "שירותי מרכז שיקום רפואי רב תחומי | סופיה מדיקל";
  const img = SITE_URL + "/assets/img/treat-rehab-900.webp";
  const clinicId = SITE_URL + "/#clinic";
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": url + "#page", url, name: title, description: SERVICES_DESC, inLanguage: "he-IL", primaryImageOfPage: img,
      about: { "@id": clinicId }, breadcrumb: { "@id": url + "#crumbs" }, mainEntity: { "@id": url + "#services" } },
    { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/", telephone: "+972-50-465-1970", email: CONTACT.email,
      address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" } },
    { "@type": "ItemList", "@id": url + "#services", numberOfItems: SERVICES_PAGE.length, itemListElement: SERVICES_PAGE.map((c, i) => ({
      "@type": "ListItem", position: i + 1, item: { "@type": "MedicalProcedure", name: c.title, description: c.text.join(" "), url: SITE_URL + encodeURI(c.href),
        provider: { "@id": clinicId } } })) },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "שירותים", item: url } ] },
  ] };
  write("שירותים/index.html", page({
    lang: "he", title, description: SERVICES_DESC, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(SERVICES_DESC)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-services.css">
<script src="/assets/js/hero-rotate.js" defer></script>
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", SERVICES_URL) + servicesMain() + footer(),
  }));
}

// Single service pages: same URLs, titles and meta descriptions as the current site
SERVICE_PAGES.forEach((p, i) => {
  const url = SITE_URL + encodeURI(p.href);
  const svcUrl = SITE_URL + encodeURI(SERVICES_URL);
  const h = SVC_HERO[i];
  const img = h && h.src ? SITE_URL + `${h.src}-${h.w[1]}.webp` : h && h.person ? SITE_URL + `/assets/img/team/${h.person}.webp` : SITE_URL + "/assets/img/treat-rehab-900.webp";
  const clinicId = SITE_URL + "/#clinic";
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "MedicalWebPage", "@id": url + "#page", url, name: p.title, description: p.desc, inLanguage: "he-IL", primaryImageOfPage: img,
      about: { "@id": url + "#service" }, breadcrumb: { "@id": url + "#crumbs" } },
    { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/", telephone: "+972-50-465-1970", email: CONTACT.email,
      address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" } },
    { "@type": "Service", "@id": url + "#service", name: p.h1, description: p.desc, url, image: img, provider: { "@id": clinicId }, areaServed: "IL" },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "שירותים", item: svcUrl },
      { "@type": "ListItem", position: 3, name: svcShort(i), item: url } ] },
  ] };
  write(p.href.slice(1) + "/index.html", page({
    lang: "he", title: p.title, description: p.desc, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="article">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", SERVICES_URL) + servicePageMain(p, i) + footer(),
  }));
});

// Articles listing: same URL, title and meta description as the current page
{
  const url = SITE_URL + encodeURI(ARTICLES_URL);
  const title = "מאמרים ומדריכים על שיקום רפואי וטיפול בכאב | סופיה מדיקל";
  const clinicId = SITE_URL + "/#clinic";
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": url + "#page", url, name: title, description: ARTICLES_DESC, inLanguage: "he-IL",
      about: { "@id": clinicId }, breadcrumb: { "@id": url + "#crumbs" }, mainEntity: { "@id": url + "#list" } },
    { "@type": "ItemList", "@id": url + "#list", numberOfItems: ARTICLES.length, itemListElement: ARTICLES.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: SITE_URL + encodeURI(a.href), name: a.h1 })) },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "מאמרים", item: url } ] },
  ] };
  write("מאמרים/index.html", page({
    lang: "he", title, description: ARTICLES_DESC, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(ARTICLES_DESC)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/assets/img/treat-rehab-900.webp">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/page-articles.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script src="/assets/js/articles-filter.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", ARTICLES_URL) + articlesMain() + footer(),
  }));
}

// Single articles: same URLs, titles and meta descriptions as the current site
ARTICLES.forEach((a, i) => {
  const url = SITE_URL + encodeURI(a.href);
  const listUrl = SITE_URL + encodeURI(ARTICLES_URL);
  const clinicId = SITE_URL + "/#clinic";
  const img = SITE_URL + `/assets/img/articles/${COVER_SLUGS[i]}-1200.webp`;
  const graph = [
    { "@type": "MedicalWebPage", "@id": url + "#page", url, name: a.title, description: a.desc, inLanguage: "he-IL",
      mainEntity: { "@id": url + "#article" }, primaryImageOfPage: img, breadcrumb: { "@id": url + "#crumbs" } },
    { "@type": "Article", "@id": url + "#article", headline: a.h1, description: a.desc, image: img, wordCount: artWords(a), inLanguage: "he-IL", mainEntityOfPage: url,
      author: { "@id": clinicId }, publisher: { "@id": clinicId } },
    { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/", logo: SITE_URL + "/assets/img/logo-icon.png", telephone: "+972-50-465-1970",
      address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" } },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "מאמרים", item: listUrl },
      { "@type": "ListItem", position: 3, name: a.h1, item: url } ] },
  ];
  if (a.faq.length) graph.push({ "@type": "FAQPage", "@id": url + "#faq", mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  write(a.href.slice(1) + "/index.html", page({
    lang: "he", title: a.title, description: a.desc, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="article">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="preload" as="image" type="image/webp" imagesrcset="/assets/img/articles/${COVER_SLUGS[i]}-600.webp 600w, /assets/img/articles/${COVER_SLUGS[i]}-1200.webp 1200w" imagesizes="(max-width: 1024px) 92vw, 46vw" fetchpriority="high">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/page-articles.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script src="/assets/js/article.js" defer></script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`,
    body: header("he", ARTICLES_URL) + articleMain(a, i) + footer(),
  }));
});

// Contact: same URL, title and meta description as the current page
{
  const url = SITE_URL + encodeURI(CONTACT_URL);
  const title = "צור קשר עם הצוות המוביל לתיאום ייעוץ וטיפול | סופיה מדיקל";
  const description = "פרטי התקשרות, טלפון וטופס פנייה לתיאום ייעוץ, בדיקות או טיפול בסופיה מדיקל עם מענה מהיר ושירות מסור למטופלים בכל הארץ.";
  const clinicId = SITE_URL + "/#clinic";
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "ContactPage", "@id": url + "#page", url, name: title, description, inLanguage: "he-IL", about: { "@id": clinicId }, breadcrumb: { "@id": url + "#crumbs" } },
    { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/", telephone: "+972-50-465-1970", email: CONTACT.email,
      address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" },
      geo: { "@type": "GeoCoordinates", latitude: 32.1753704, longitude: 34.9276833 },
      contactPoint: [{ "@type": "ContactPoint", telephone: "+972-50-465-1970", contactType: "customer service", availableLanguage: ["he", "ar", "ru", "en"] },
        { "@type": "ContactPoint", telephone: "+972-9-740-0009", contactType: "customer service" }],
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "19:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "13:00" }] },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "צור קשר", item: url } ] },
  ] };
  write("צור-קשר/index.html", page({
    lang: "he", title, description, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/faq.css">
<link rel="stylesheet" href="/assets/css/page-contact.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", CONTACT_URL) + contactMain() + footer(),
  }));
}

// FAQ: same URL, title and meta description as the current page
{
  const url = SITE_URL + encodeURI(FAQ_URL);
  const title = "שאלות נפוצות על טיפולים ושירותים | סופיה מדיקל";
  const description = "תשובות לשאלות נפוצות על טיפולי שיקום, כאב והפרעות שינה, אופן התיאום, ביטוחים ודרכי הגעה למרכז, עם ליווי מקצועי ומידע מקיף לכל מטופל.";
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "FAQPage", "@id": url + "#page", url, name: title, description, inLanguage: "he-IL", breadcrumb: { "@id": url + "#crumbs" },
      mainEntity: FAQ_PAGE.flatMap((g) => g.items).map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "שאלות נפוצות", item: url } ] },
  ] };
  write("שאלות-נפוצות/index.html", page({
    lang: "he", title, description, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/page-contact.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", FAQ_URL) + faqMain() + footer(),
  }));
}

// Reviews + video reviews: same URLs, titles and meta descriptions as the current pages
{
  const clinicId = SITE_URL + "/#clinic";
  const crumbs = (items) => ({ "@type": "BreadcrumbList", itemListElement: [["בית", SITE_URL + "/"], ...items].map(([n, u], k) => ({ "@type": "ListItem", position: k + 1, name: n, item: u })) });
  const videoLd = (v, i) => ({ "@type": "VideoObject", name: `המלצת וידאו ${i + 1}, סופיה מדיקל`, description: v.desc, thumbnailUrl: SITE_URL + `/assets/video/testimonial-${v.id}.webp`, contentUrl: SITE_URL + `/assets/video/testimonial-${v.id}.mp4`, publisher: { "@id": clinicId } });
  const head = (title, description, url, extra, ld) => `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
${extra}
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/reviews.css">
<link rel="stylesheet" href="/assets/css/page-reviews.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script src="/assets/js/reviews.js" defer></script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": ld })}</script>`;

  {
    const url = SITE_URL + encodeURI(REVIEWS_URL);
    const title = "המלצות מטופלים על חוויית הטיפול במרכז סופיה מדיקל";
    const description = "מטופלים מספרים על תהליכי טיפול, מקצועיות הצוות והתוצאות שהשיגו בסופיה מדיקל, עם דוגמאות לשיפור תפקוד והפחתת כאב וליווי אישי לאורך כל הדרך.";
    const ld = [
      { "@type": "WebPage", "@id": url + "#page", url, name: title, description, inLanguage: "he-IL", about: { "@id": clinicId } },
      { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/",
        review: REVIEWS_PAGE.map((r) => ({ "@type": "Review", reviewBody: r.quote, author: { "@type": "Person", name: r.name.split(",")[0] } })) },
      crumbs([["המלצות", url]]),
    ];
    write("המלצות/index.html", page({ lang: "he", title, description, robots: "index, follow", canonical: url,
      head: head(title, description, url, `<meta property="og:image" content="${SITE_URL}/assets/img/treat-rehab-900.webp">`, ld),
      body: header("he", REVIEWS_URL) + reviewsMain() + footer() }));
  }
  {
    const url = SITE_URL + encodeURI(VIDEOS_URL);
    const title = "המלצות וידאו | סופיה מדיקל, שיקום וכאב";
    const description = "צפו בהמלצות וידאו של מטופלים בסופיה מדיקל על שיקום, טיפול בכאב והפרעות שינה, עם חוויות ותוצאות אמיתיות.";
    const ld = [{ "@type": "CollectionPage", "@id": url + "#page", url, name: title, description, inLanguage: "he-IL" }, ...VIDEOS.map(videoLd),
      crumbs([["המלצות", SITE_URL + encodeURI(REVIEWS_URL)], ["המלצות וידאו", url]])];
    write("המלצות-וידאו/index.html", page({ lang: "he", title, description, robots: "index, follow", canonical: url,
      head: head(title, description, url, `<meta property="og:image" content="${SITE_URL}/assets/video/testimonial-${VIDEOS[0].id}.webp">`, ld),
      body: header("he", REVIEWS_URL) + videosMain() + footer() }));
  }
  VIDEOS.forEach((v, i) => {
    const url = SITE_URL + encodeURI(v.item);
    const ld = [{ "@type": "WebPage", "@id": url + "#page", url, name: v.title, description: v.desc, inLanguage: "he-IL" }, videoLd(v, i),
      crumbs([["המלצות", SITE_URL + encodeURI(REVIEWS_URL)], ["המלצות וידאו", SITE_URL + encodeURI(VIDEOS_URL)], [`המלצת וידאו ${i + 1}`, url]])];
    write(v.item.slice(1) + "/index.html", page({ lang: "he", title: v.title, description: v.desc, robots: "index, follow", canonical: url,
      head: head(v.title, v.desc, url, `<meta property="og:image" content="${SITE_URL}/assets/video/testimonial-${v.id}.webp">`, ld),
      body: header("he", REVIEWS_URL) + videoItemMain(v, i) + footer() }));
  });
}

// Treatment area pages: same URLs, titles and meta descriptions as the current site
AREAS.forEach((p) => {
  const url = SITE_URL + encodeURI(p.href);
  const clinicId = SITE_URL + "/#clinic";
  const img = p.img === "about" ? SITE_URL + "/assets/img/about/dr-ala-mahamid-desk-1400.webp" : SITE_URL + `/assets/img/${p.img}-900.webp`;
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "MedicalWebPage", "@id": url + "#page", url, name: p.title, description: p.desc, inLanguage: "he-IL", primaryImageOfPage: img,
      about: { "@id": clinicId }, breadcrumb: { "@id": url + "#crumbs" } },
    { "@type": "MedicalClinic", "@id": clinicId, name: "סופיה מדיקל", url: SITE_URL + "/", telephone: "+972-50-465-1970",
      address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" } },
    { "@type": "BreadcrumbList", "@id": url + "#crumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: p.h1.split(":")[0], item: url } ] },
  ] };
  write(p.href.slice(1) + "/index.html", page({
    lang: "he", title: p.title, description: p.desc, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/page-articles.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script src="/assets/js/article.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", p.href) + areaMain(p) + footer(),
  }));
});

// Arrangements + multidisciplinary team: same URLs, titles and meta descriptions as the current pages
[
  { url: ARR_URL, title: "הסדרים עם כללית מושלם, BWell ומגדל | סופיה מדיקל", desc: 'ייעוץ אצל ד"ר עלא מחאמיד דרך כללית מושלם (150 ש"ח, ביקור טלפוני 100 ש"ח), ופיזיותרפיה, רפואת כאב ואורולוגיה דרך BWell, בהשתתפות עצמית לפי הזכאות.', name: "הסדרים", main: arrMain, css: ["page-service"] },
  { url: MEDIA_URL, title: 'בתקשורת: כתבות וראיונות עם ד"ר עלא מחאמיד | סופיה מדיקל', desc: 'ד"ר עלא מחאמיד וסופיה מדיקל בתקשורת: ראיונות בחדשות N12, ברשת 13 ובכאן, וכתבות באתרי החדשות ובעיתונות המקומית על שינה ושיקום.', name: "בתקשורת", main: mediaMain },
  { url: MDT_URL, title: "צוות רב מקצועי עם מומחים ומטפלים מובילים | סופיה מדיקל", desc: "הצוות הרב מקצועי של סופיה מדיקל משלב רופאים, פיזיותרפיסטים ומטפלים משלימים לבניית תוכניות טיפול אישיות ומתואמות, עם תמיכה מסורה לכל אורך הדרך.", name: "צוות רב מקצועי", main: mdtMain },
].forEach((p) => {
  const url = SITE_URL + encodeURI(p.url);
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url + "#page", url, name: p.title, description: p.desc, inLanguage: "he-IL", about: { "@id": SITE_URL + "/#clinic" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: p.name, item: url } ] },
  ] };
  write(p.url.slice(1) + "/index.html", page({
    lang: "he", title: p.title, description: p.desc, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-misc.css">${(p.css || []).map((c) => `
<link rel="stylesheet" href="/assets/css/${c}.css">`).join("")}
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", p.url) + p.main() + footer(),
  }));
});

// Team profiles: same URLs, titles and meta descriptions as the current pages
TEAM_PAGE.forEach((m) => {
  const p = PROFILES[m.slug];
  const url = SITE_URL + encodeURI(p.href);
  const img = SITE_URL + `/assets/img/team/${m.slug}.webp`;
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "ProfilePage", "@id": url + "#page", url, name: p.title, description: p.desc, inLanguage: "he-IL", mainEntity: { "@id": SITE_URL + "/#" + m.slug } },
    { "@type": "Person", "@id": SITE_URL + "/#" + m.slug, name: m.name, jobTitle: m.role, description: m.line, image: img, url, worksFor: { "@id": SITE_URL + "/#clinic" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "הצוות", item: SITE_URL + encodeURI(TEAM_URL) },
      { "@type": "ListItem", position: 3, name: m.name, item: url } ] },
  ] };
  write(p.href.slice(1) + "/index.html", page({
    lang: "he", title: p.title, description: p.desc, robots: "index, follow", canonical: url,
    head: `
<meta property="og:type" content="profile">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="סופיה מדיקל">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/page-articles.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script src="/assets/js/article.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body: header("he", TEAM_URL) + profileMain(m) + footer(),
  }));
});

// Legal pages: same URLs and titles as the current pages (their meta
// description is just the title; kept, worth rewriting later)
LEGAL.forEach((p) => {
  const url = SITE_URL + p.href;
  write(p.href.slice(1) + "/index.html", page({
    lang: "he", title: p.title, description: p.title, robots: "index, follow", canonical: url,
    head: `
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", url, name: p.title, inLanguage: "he-IL", isPartOf: { "@id": SITE_URL + "/#clinic" } })}</script>`,
    body: header("he", p.href) + legalMain(p) + footer(),
  }));
});

// Other languages: one landing page each, noindex, no links to inner pages.
// Translated ones (I18N) are the homepage in that language; the rest are
// still placeholders.
for (const k of ["en", "ru", "ar"]) {
  const T = I18N[k];
  write(`${k}/index.html`, page({
    lang: k,
    title: T ? T.title : "Sofia Medical",
    description: T ? T.description : "Sofia Medical, Kfar Saba",
    robots: "noindex, follow",
    canonical: "",
    head: T ? `
<link rel="preload" as="image" type="image/webp" media="(min-width: 1025px)" imagesrcset="/assets/img/hero/hero-clinic-1280.webp 1280w, /assets/img/hero/hero-clinic-1920.webp 1920w, /assets/img/hero/hero-clinic-2560.webp 2560w" imagesizes="100vw" fetchpriority="high">
<link rel="preload" as="image" type="image/webp" media="(max-width: 1024px)" imagesrcset="/assets/img/hero/hero-clinic-m-480.webp 480w, /assets/img/hero/hero-clinic-m-768.webp 768w, /assets/img/hero/hero-clinic-m-1080.webp 1080w" imagesizes="100vw" fetchpriority="high">
<link rel="stylesheet" href="/assets/css/hero.css">
<link rel="stylesheet" href="/assets/css/about.css">
<link rel="stylesheet" href="/assets/css/treatments.css">
<script src="/assets/js/tabs.js" defer></script>
<link rel="stylesheet" href="/assets/css/team.css">
<script src="/assets/js/team.js" defer></script>
<link rel="stylesheet" href="/assets/css/reviews.css">
<script src="/assets/js/reviews.js" defer></script>
<link rel="stylesheet" href="/assets/css/faq.css">
<link rel="stylesheet" href="/assets/css/footer.css">` : "",
    body: header(k) + (T ? (LANGS[k].dir === "rtl" ? bidiHtml(homeLanding(k) + footerLanding(k)) : homeLanding(k) + footerLanding(k)) : placeholder(k)),
  }));
}

// Thank you pages: where every lead form lands after sending (noindex, not in the sitemap)
for (const k of ["he", "en", "ru", "ar"]) {
  const he = k === "he";
  const rel = (he ? "" : k + "/") + THANKS_URL.slice(1) + "/index.html";
  let body = he ? header("he", THANKS_URL) + thanksMain(k) + footer() : landingLinks(headerLanding(k) + thanksMain(k) + footerLanding(k), k);
  if (!he && LANGS[k].dir === "rtl") body = bidiHtml(body);
  write(rel, page({
    lang: k, title: THANKS[k].title, description: THANKS[k].h1, robots: "noindex, follow", canonical: "",
    head: `
<link rel="stylesheet" href="/assets/css/page-misc.css">
<link rel="stylesheet" href="/assets/css/footer.css">`,
    body,
  }));
}
