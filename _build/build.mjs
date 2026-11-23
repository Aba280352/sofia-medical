// Builds the static preview pages for the Sofia Medical site.
// Usage: node _build/build.mjs   (run from the site folder)
// Icons come from ../design/icons (ANIMTD icons, Lucide set, stroke 1.25).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TREATMENTS } from "./data-treatments.mjs";
import { TEAM } from "./data-team.mjs";
import { REVIEWS } from "./data-reviews.mjs";
import { FAQ } from "./data-faq.mjs";

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

/* ---------- Write pages ---------- */
// PREVIEW: the local build is also published on GitHub Pages for the client,
// so every page is noindex and all site paths are relative (works on
// localhost and under /sofia-medical/). Robots and paths are set again in
// WordPress, this only affects the static preview.
const PREVIEW = true;
const write = (rel, html) => {
  const up = "../".repeat(rel.split("/").length - 1);
  html = html
    .replace(/([\s"',(])\/assets\//g, `$1${up}assets/`)
    .replace(/href="\/(en|ru|ar)\/"/g, `href="${up}$1/"`)
    .replace(/href="\/"/g, `href="${up || "./"}"`);
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
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "MedicalClinic", name: "סופיה מדיקל", url: "https://www.sofia-medical.com/", logo: "https://www.sofia-medical.com/assets/img/logo-icon.png", telephone: "+972-50-465-1970", email: CONTACT.email, address: { "@type": "PostalAddress", streetAddress: "יוחנן הסנדלר 6, קומה 5", addressLocality: "כפר סבא", addressCountry: "IL" }, medicalSpecialty: ["PhysicalMedicineAndRehabilitation", "SleepMedicine", "PainManagement"], sameAs: ["https://www.facebook.com/profile.php?id=61583510784516", "https://www.instagram.com/sofiamedical12/"] })}</script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) })}</script>`,
  body: header("he", "/") + heroHome() + footer(),
}));

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
