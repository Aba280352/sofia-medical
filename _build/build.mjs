// Builds the static preview pages for the Sofia Medical site.
// Usage: node _build/build.mjs   (run from the site folder)
// Icons come from ../design/icons (ANIMTD icons, Lucide set, stroke 1.25).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TREATMENTS } from "./data-treatments.mjs";
import { TEAM, TEAM_PAGE } from "./data-team.mjs";
import { REVIEWS } from "./data-reviews.mjs";
import { FAQ } from "./data-faq.mjs";
import { SERVICES_PAGE } from "./data-services.mjs";
import { SERVICE_PAGES } from "./data-service-pages.mjs";
import { ARTICLES } from "./data-articles.mjs";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ICONS = join(SITE, "..", "design", "icons");

const icon = (name, cls = "") =>
  readFileSync(join(ICONS, `${name}.svg`), "utf8")
    .replace(/^﻿/, "")
    .replace(' xmlns="http://www.w3.org/2000/svg"', "")
    .replace("<svg", `<svg aria-hidden="true" focusable="false"${cls ? ` class="${cls}"` : ""}`);

/* ---------- Business data (from the current site) ---------- */
const CONTACT = {
  mobile: { display: "050-465-1970", href: "tel:+972504651970" },
  landline: { display: "09-7400009", href: "tel:+97297400009" },
  email: "Info@sofia-medical.com",
  address: "יוחנן הסנדלר 6, קומה 5, כפר סבא",
  maps: "https://maps.google.com/?q=%D7%99%D7%95%D7%97%D7%A0%D7%9F+%D7%94%D7%A1%D7%A0%D7%93%D7%9C%D7%A8+6%2C+%D7%A7%D7%95%D7%9E%D7%94+5%2C+%D7%9B%D7%A4%D7%A8+%D7%A1%D7%91%D7%90",
};

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
  const L = LANGS[cur];
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

function header(cur, currentHref = "/") {
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
<link rel="stylesheet" href="/assets/css/header.css">${head}
<script src="/assets/js/header.js" defer></script>
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
const latin = (s) => s.replace(/([A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9])/g, '<span dir="ltr">$1</span>');

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
        <div class="sm-hero__insure">
          <img class="sm-hero__seal" src="/assets/img/hero/badge-clalit-mushlam-160.webp"
               srcset="/assets/img/hero/badge-clalit-mushlam-160.webp 1x, /assets/img/hero/badge-clalit-mushlam-320.webp 2x"
               width="100" height="100" alt="כללית מושלם" decoding="async">
          <p><strong>קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל</strong>לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
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
          <select id="lead-topic" name="topic"><option value="">בחירה</option>${SERVICES.map((x) => `<option>${x.name}</option>`).join("")}</select></div>
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
  ["שאלות נפוצות", "/שאלות-נפוצות"], ["צור קשר", "/צור-קשר"],
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
</footer>`;

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
          <h2 class="sm-member__name">${m.name}</h2>
          <p class="sm-member__role">${latin(m.role)}</p>
          <p class="sm-member__line">${m.line}</p>
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
const SERVICES_WIDE = new Set([0, 5]);
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
  return m ? `<strong>${latin(m[1])}</strong> ${latin(m[2])}` : latin(s);
};
const svcBlocks = (p, i) => {
  const figs = SVC_FIGS[i] || [];
  return p.blocks.map((b) => {
    if (b.t === "h2") {
      const f = figs.find((x) => x.after === b.x);
      return `<h2 class="sm-prose__h2">${latin(b.x)}</h2>` + (f ? `<figure class="sm-prose__fig"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" loading="lazy" decoding="async"></figure>` : "");
    }
    if (b.t === "h3") return `<h3 class="sm-prose__h3">${latin(b.x)}</h3>`;
    if (b.t === "p") return `<p>${latin(b.x)}</p>`;
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
      </div>
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
      ${ARTICLES.map((a) => `<li class="sm-art" data-topic="${a.topic}">
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

const artBlocks = (a) => a.blocks.map((b) => {
  if (b.t === "h2") return `<h2 class="sm-prose__h2">${latin(b.x)}</h2>`;
  if (b.t === "h3") return `<h3 class="sm-prose__h3">${latin(b.x)}</h3>`;
  if (b.t === "p") return `<p>${latin(b.x)}</p>`;
  if (b.t === "ul") return `<ul class="sm-prose__list" role="list">${b.x.map((x) => `<li>${svcItem(x)}</li>`).join("")}</ul>`;
  if (b.t === "check") return `<ul class="sm-prose__check" role="list">${b.x.map((x) => `<li>${icon("check", "sm-ico")}<span>${svcItem(x)}</span></li>`).join("")}</ul>`;
  if (b.t === "video") return `<div class="sm-prose__video"><iframe src="https://www.youtube-nocookie.com/embed/${b.x}" title="סרטון: ${esc(a.h1)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
  return "";
}).join("\n        ");

const articleMain = (a, i) => {
  const related = ARTICLES.filter((x, k) => k !== i && x.topic === a.topic).slice(0, 6);
  return `
<main id="main" tabindex="-1">
<section class="sm-phero sm-phero--plain" aria-labelledby="art-h1">
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
    </div>
  </div>
</section>

<section class="sm-svcpage">
  <div class="sm-wrap sm-svcpage__grid">
    <article class="sm-prose">
        ${artBlocks(a)}
    </article>
    <aside class="sm-svcpage__side" aria-label="יצירת קשר ומאמרים נוספים">
      <div class="sm-side__box sm-side__box--cta">
        <p class="sm-side__title">השאירו פרטים <span class="hl">ונחזור אליכם</span></p>
        <p class="sm-side__text">קיימים הסדרים עם כללית מושלם, <span dir="ltr">BWell</span> ומגדל לייעוץ רפואי בתחום השיקום וטיפול בכאב</p>
        <a class="btn btn-cta" href="/צור-קשר">השארת פרטים ${icon("arrow-left", "sm-ico sm-ico--arrow")}</a>
        <a class="btn btn-ghost" href="${CONTACT.mobile.href}"><span dir="ltr">${CONTACT.mobile.display}</span> ${icon("smartphone", "sm-ico")}</a>
      </div>
      <nav class="sm-side__box" aria-labelledby="art-more">
        <p class="sm-side__title" id="art-more">מאמרים נוספים</p>
        <ul class="sm-side__links" role="list">
          ${related.map((x) => `<li><a href="${x.href}"><span>${latin(x.h1)}</span>${icon("chevron-left", "sm-ico")}</a></li>`).join("\n          ")}
        </ul>
      </nav>
    </aside>
  </div>
</section>
</main>`;
};

/* ---------- Write pages ---------- */
// PREVIEW: the local build is also published on GitHub Pages for the client,
// so every page is noindex and all site paths are relative (works on
// localhost and under /sofia-medical/). Robots and paths are set again in
// WordPress, this only affects the static preview.
const PREVIEW = true;
const VER = Date.now().toString(36);
const write = (rel, html) => {
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
  const graph = [
    { "@type": "MedicalWebPage", "@id": url + "#page", url, name: a.title, description: a.desc, inLanguage: "he-IL",
      mainEntity: { "@id": url + "#article" }, breadcrumb: { "@id": url + "#crumbs" } },
    { "@type": "Article", "@id": url + "#article", headline: a.h1, description: a.desc, inLanguage: "he-IL", mainEntityOfPage: url,
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
<link rel="stylesheet" href="/assets/css/page-about.css">
<link rel="stylesheet" href="/assets/css/page-service.css">
<link rel="stylesheet" href="/assets/css/page-articles.css">
<link rel="stylesheet" href="/assets/css/footer.css">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`,
    body: header("he", ARTICLES_URL) + articleMain(a, i) + footer(),
  }));
});

// Other languages: one landing page each, noindex, no links to inner pages
for (const k of ["en", "ru", "ar"]) {
  write(`${k}/index.html`, page({
    lang: k,
    title: "Sofia Medical",
    description: "Sofia Medical, Kfar Saba",
    robots: "noindex, follow",
    canonical: "",
    body: header(k) + placeholder(k),
  }));
}
