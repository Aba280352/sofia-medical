// Static site -> Elementor v4 atomic documents.
// Reads the raw pages exported by build.mjs (WP_EXPORT=1 node build.mjs -> wp/raw),
// and writes wp/out: one JSON tree per page + header + footer, the global class list,
// the combined site CSS (static CSS, scoped to .elementor .sm-doc) and the combined JS.
// Every text, image, icon and link stays a native atomic element so it can be edited
// in the Elementor UI; the static CSS classes become Global Classes with the same names.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { parse } from "node-html-parser";
import * as csstree from "css-tree";

import { fileURLToPath } from "url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw");
const OUT = path.join(HERE, "out");
const ASSETS = path.join(HERE, "..", "..", "assets");
const ICONS = path.join(HERE, "..", "..", "..", "design", "icons");
const UP = "/wp-content/uploads/sofia"; // assets/x -> UP/x on WordPress
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "pages"), { recursive: true });
fs.mkdirSync(path.join(OUT, "svg"), { recursive: true });

const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");
const warn = new Map();
const W = (k) => warn.set(k, (warn.get(k) || 0) + 1);

/* ---------- global classes ---------- */
const CLASSES = new Map(); // label -> id
const gc = (label) => {
  if (!CLASSES.has(label)) CLASSES.set(label, "gc-" + sha("sofia:" + label).slice(0, 16));
  return CLASSES.get(label);
};
const S = (v) => ({ $$type: "string", value: v });
const cls = (labels) => ({ $$type: "classes", value: labels.map(gc) });
const kv = (k, v) => ({ $$type: "key-value", value: { key: S(k), value: S(v) } });

/* ---------- media (all assets live under uploads/sofia/<path under assets>) ---------- */
const MEDIA = new Map(); // key -> { file, kind, alt }
const media = (key, file, kind, alt = "") => {
  if (!MEDIA.has(key)) MEDIA.set(key, { file, kind, alt });
  else if (alt && !MEDIA.get(key).alt) MEDIA.get(key).alt = alt;
  return "M:" + key;
};
const assetKey = (src) => {
  const m = src.match(/\/assets\/(.+?)(?:\?.*)?$/);
  if (!m) return null;
  return m[1];
};

/* ---------- icons ---------- */
const norm = (s) => s.replace(/\s+/g, " ").replace(/>\s+</g, "><").replace(/\s*\/>/g, "/>").trim();
const ICON_BY_BODY = new Map();
for (const f of fs.readdirSync(ICONS)) {
  if (!f.endsWith(".svg")) continue;
  const svg = parse(fs.readFileSync(path.join(ICONS, f), "utf8").replace(/^﻿/, "")).querySelector("svg");
  ICON_BY_BODY.set(norm(svg.innerHTML), f.replace(/\.svg$/, ""));
}
const svgMedia = (node) => {
  const body = norm(node.innerHTML);
  const name = ICON_BY_BODY.get(body);
  if (name) return media("icon/" + name, path.join(ICONS, name + ".svg"), "svg");
  // an inline SVG that is not one of the icon files: save it as its own file
  const h = sha(node.toString()).slice(0, 10);
  const a = { ...node.attributes };
  delete a.class; delete a["aria-hidden"]; delete a.focusable;
  if (!a.xmlns) a.xmlns = "http://www.w3.org/2000/svg";
  const file = path.join(OUT, "svg", `x-${h}.svg`);
  fs.writeFileSync(file, `<svg ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(" ")}>${node.innerHTML}</svg>`);
  W("extra svg x-" + h);
  return media("svgx/x-" + h, file, "svg");
};

/* ---------- element factory ---------- */
let idSeed = "", idN = 0;
const nid = () => sha(idSeed + ":" + idN++).slice(0, 7);
const NATIVE = new Set(["div", "header", "section", "article", "aside", "footer", "a", "button", "main", "nav"]);
const MAPPED = new Set(); // tags rendered as div + t-<tag>
const SKIP_ATTR = new Set(["class", "id", "href", "target", "rel", "src", "srcset", "sizes", "width", "height", "alt", "loading", "decoding", "fetchpriority", "style"]);

const linkOf = (href, target) => {
  let url = href;
  if (/^\/(?!\/)/.test(url) && !/[#?]/.test(url) && !/\.[a-z0-9]{2,4}$/i.test(url) && !url.endsWith("/")) url += "/";
  if (/^\/assets\//.test(url)) url = UP + url.slice(7);
  const v = { destination: { $$type: "url", value: url } };
  if (target === "_blank") v.isTargetBlank = { $$type: "boolean", value: true };
  return { $$type: "link", value: v };
};
const attrsOf = (el, extra = {}) => {
  const out = [];
  const all = { ...el.attributes, ...extra };
  for (const [k, v] of Object.entries(all)) {
    if (SKIP_ATTR.has(k)) { if (k === "style") W("style attr"); continue; }
    out.push(kv(k, v === "" ? k : v));
  }
  return out.length ? { $$type: "attributes", value: out } : null;
};
const classList = (el) => (el.getAttribute?.("class") || "").split(/\s+/).filter(Boolean);

/* ---------- inline (text widget) content ---------- */
const INLINE = new Set(["strong", "b", "em", "i", "u", "s", "del", "sup", "sub", "br", "span", "a"]);
const SUBST = new Map(); // class -> { parent selector, tag } for classed spans inside headings
const inlineOk = (n, heading) => {
  if (n.nodeType === 3) return true;
  if (n.nodeType !== 1) return true;
  const t = n.rawTagName.toLowerCase();
  if (!INLINE.has(t)) return false;
  const c = classList(n);
  const attrs = Object.keys(n.attributes).filter((a) => a !== "class");
  if (t === "a") { if (c.length || attrs.some((a) => !["href", "target", "rel", "dir"].includes(a))) return false; }
  else if (t === "span") {
    if (c.length && !(c.length === 1 && (c[0] === "hl" || heading))) return false;
    if (attrs.some((a) => !["dir", "lang"].includes(a))) return false;
  } else if (c.length || attrs.length) return false;
  return n.childNodes.every((x) => inlineOk(x, heading));
};
const esc = (s) => s.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/</g, "&lt;");
const inlineHtml = (nodes, parentSel) => nodes.map((n) => {
  if (n.nodeType === 3) return n.rawText.replace(/\s+/g, " ");
  if (n.nodeType !== 1) return "";
  const t = n.rawTagName.toLowerCase();
  const inner = inlineHtml(n.childNodes, parentSel);
  if (t === "br") return "<br>";
  if (t === "span") {
    const c = classList(n);
    if (c[0] === "hl") return `<em>${inner}</em>`;
    if (c.length) { // classed span inside a heading: becomes <b>, CSS follows
      SUBST.set(c[0], parentSel);
      return `<b>${inner}</b>`;
    }
    if (n.getAttribute("dir") === "ltr") return `<span>⁦${inner}⁩</span>`;
    return `<span>${inner}</span>`;
  }
  if (t === "a") {
    const href = linkOf(n.getAttribute("href") || "", n.getAttribute("target")).value.destination.value;
    const tgt = n.getAttribute("target") ? ` target="${n.getAttribute("target")}"` : "";
    const txt = n.getAttribute("dir") === "ltr" ? `⁦${inner}⁩` : inner;
    return `<a href="${href}"${tgt}>${txt}</a>`;
  }
  return `<${t}>${inner}</${t}>`;
}).join("");

/* ---------- converter ---------- */
const textWidget = (type, tag, html, el, extraClasses = []) => {
  const st = { tag: S(tag) };
  st[type === "e-paragraph" ? "paragraph" : "title"] = { $$type: "escaped-html", value: html };
  const c = [...extraClasses, ...(el ? classList(el) : [])];
  if (c.length) st.classes = cls(c);
  if (el) {
    const a = attrsOf(el);
    if (a) st.attributes = a;
    if (el.getAttribute("id")) st._cssid = S(el.getAttribute("id"));
  }
  return { id: nid(), elType: "widget", widgetType: type, settings: st, elements: [] };
};
const run = (nodes) => {
  const html = inlineHtml(nodes, "").replace(/^\s+|\s+$/g, "");
  if (!html) return null;
  return textWidget("e-heading", "span", html, null, ["t-run"]);
};

const convert = (el) => {
  if (el.nodeType !== 1) return [];
  const tag = el.rawTagName.toLowerCase();
  const c = classList(el);
  if (["script", "style", "link", "meta", "noscript", "template"].includes(tag)) { W("skip " + tag); return []; }

  if (/^h[1-6]$/.test(tag)) {
    const ok = el.childNodes.every((x) => inlineOk(x, true));
    if (!ok) W("heading with non-inline children " + c.join("."));
    return [textWidget("e-heading", tag, inlineHtml(el.childNodes, c[0] ? "." + c[0] : tag), el)];
  }
  if (tag === "p" && el.childNodes.every((x) => inlineOk(x, false))) {
    return [textWidget("e-paragraph", "p", inlineHtml(el.childNodes, ""), el)];
  }
  if (tag === "span" && el.childNodes.every((x) => inlineOk(x, false)) && el.childNodes.length) {
    if (el.getAttribute("dir") === "ltr") return [textWidget("e-heading", "span", "⁦" + inlineHtml(el.childNodes, "") + "⁩", el)];
    return [textWidget("e-heading", "span", inlineHtml(el.childNodes, ""), el)];
  }
  if (tag === "img") {
    const k = assetKey(el.getAttribute("src") || "");
    if (!k) { W("img outside assets " + el.getAttribute("src")); return []; }
    const st = {
      image: { $$type: "image", value: { src: { $$type: "image-src", value: { id: { $$type: "image-attachment-id", value: media(k, path.join(ASSETS, k), "image", el.getAttribute("alt") || "") }, url: null } }, size: S("full") } },
    };
    if (c.length) st.classes = cls(c);
    return [{ id: nid(), elType: "widget", widgetType: "e-image", settings: st, elements: [] }];
  }
  if (tag === "svg") {
    const st = { svg: { $$type: "svg-src", value: { id: { $$type: "image-attachment-id", value: svgMedia(el) }, url: null } } };
    if (c.length) st.classes = cls(c);
    const a = [];
    if (el.getAttribute("aria-hidden")) a.push(kv("aria-hidden", "true"));
    if (el.getAttribute("role")) a.push(kv("role", el.getAttribute("role")));
    if (el.getAttribute("aria-label")) a.push(kv("aria-label", el.getAttribute("aria-label")));
    if (a.length) st.attributes = { $$type: "attributes", value: a };
    return [{ id: nid(), elType: "widget", widgetType: "e-svg", settings: st, elements: [] }];
  }
  if (tag === "picture") {
    const kids = [];
    for (const s of el.querySelectorAll("source")) {
      const best = (s.getAttribute("srcset") || "").split(",").map((x) => x.trim().split(/\s+/)[0]).pop();
      const k = assetKey(best || "");
      if (!k) continue;
      kids.push({ id: nid(), elType: "widget", widgetType: "e-image", settings: { classes: cls(["t-src-m"]), image: { $$type: "image", value: { src: { $$type: "image-src", value: { id: { $$type: "image-attachment-id", value: media(k, path.join(ASSETS, k), "image") }, url: null } }, size: S("full") } } }, elements: [] });
    }
    const img = el.querySelector("img");
    const im = convert(img)[0];
    im.settings.classes = cls([...classList(img), "t-img-d"]);
    kids.push(im);
    return [{ id: nid(), elType: "e-div-block", settings: { tag: S("div"), classes: cls([...c, "t-picture"]) }, elements: kids }];
  }
  if (tag === "video") {
    const k = assetKey(el.getAttribute("src") || "");
    const p = assetKey(el.getAttribute("poster") || "");
    const st = {
      source: { $$type: "video-src", value: { id: { $$type: "video-attachment-id", value: media(k, path.join(ASSETS, k), "video") }, url: null } },
      controls: { $$type: "boolean", value: el.hasAttribute("controls") },
      playsinline: { $$type: "boolean", value: el.hasAttribute("playsinline") },
      preload: S(el.getAttribute("preload") || "metadata"),
    };
    if (p) { st.poster_enabled = { $$type: "boolean", value: true }; st.poster = { $$type: "image", value: { src: { $$type: "image-src", value: { id: { $$type: "image-attachment-id", value: media(p, path.join(ASSETS, p), "image") }, url: null } }, size: S("full") } }; }
    if (c.length) st.classes = cls(c);
    const a = attrsOf(el, {});
    if (a) st.attributes = { $$type: "attributes", value: a.value.filter((x) => !["poster", "preload", "playsinline", "controls"].includes(x.value.key.value)) };
    return [{ id: nid(), elType: "widget", widgetType: "e-self-hosted-video", settings: st, elements: [] }];
  }
  if (tag === "iframe") {
    const src = el.getAttribute("src") || "";
    const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
    if (yt) {
      const st = { source: S("https://www.youtube.com/watch?v=" + yt[1]), privacy_mode: { $$type: "boolean", value: true }, lazyload: { $$type: "boolean", value: true }, rel: { $$type: "boolean", value: false } };
      if (c.length) st.classes = cls(c);
      return [{ id: nid(), elType: "widget", widgetType: "e-youtube", settings: st, elements: [] }];
    }
    if (/maps\.google/.test(src)) {
      const st = { location: S("יוחנן הסנדלר 6, כפר סבא"), zoom: { $$type: "number", value: 16 } };
      if (c.length) st.classes = cls(c);
      return [{ id: nid(), elType: "widget", widgetType: "e-google-maps", settings: st, elements: [] }];
    }
    W("iframe " + src); return [];
  }
  if (tag === "form") return [convertForm(el)];

  return convertContainer(el);
};
const convertContainer = (el) => {
  const tag = el.rawTagName.toLowerCase();
  const c = classList(el);
  let t = tag;
  const extra = [];
  if (!NATIVE.has(tag)) { t = "div"; extra.push("t-" + tag); MAPPED.add(tag); }
  else if (tag === "a" || tag === "button") extra.push("t-" + tag);
  const st = { tag: S(t) };
  const cl = [...c, ...extra];
  if (cl.length) st.classes = cls(cl);
  const addAttr = {};
  if ((tag === "ul" || tag === "ol") && !el.getAttribute("role")) addAttr.role = "list";
  if (tag === "li" && !el.getAttribute("role")) addAttr.role = "listitem";
  if (tag === "summary") { addAttr.role = "button"; addAttr.tabindex = "0"; addAttr["aria-expanded"] = el.parentNode?.hasAttribute?.("open") ? "true" : "false"; }
  if (tag === "details" && el.hasAttribute("open")) addAttr.open = "open";
  const a = attrsOf(el, addAttr);
  if (a) st.attributes = a;
  if (el.getAttribute("id")) st._cssid = S(el.getAttribute("id"));
  if (tag === "a") st.link = linkOf(el.getAttribute("href") || "#", el.getAttribute("target"));
  // Children keep the static structure: every text node becomes its own span (class t-run,
  // invisible to span rules), every element stays its own element. In flex layouts the static
  // text nodes are separate flex items too, so line breaks and gaps come out the same.
  const kids = [];
  const appendSpace = () => {
    const last = kids[kids.length - 1];
    if (last && last.widgetType === "e-heading" && last.settings.title && !/\s$/.test(last.settings.title.value)) last.settings.title.value += " ";
  };
  // Links and buttons are flex boxes in this design: their text nodes are separate flex items,
  // so they are split node by node. Everywhere else consecutive inline content stays ONE span:
  // Elementor puts line breaks between sibling elements, which would show as extra spaces in inline text.
  const split = tag === "a" || tag === "button";
  if (!split) {
    let buf = [];
    const flush = () => {
      if (!buf.length) return;
      const hasText = buf.some((x) => x.nodeType === 3 && x.rawText.trim());
      if (hasText) { const r = run(buf); if (r) kids.push(r); }
      else for (const x of buf) {
        if (x.nodeType !== 1) continue;
        const xt = x.rawTagName.toLowerCase();
        const ltr = x.getAttribute("dir") === "ltr";
        if (xt === "span") kids.push(textWidget("e-heading", "span", (ltr ? "⁦" : "") + inlineHtml(x.childNodes, "") + (ltr ? "⁩" : ""), x));
        else if (xt === "a") kids.push(...convertContainer(x));
        else if (["strong", "b", "em", "i", "small"].includes(xt)) { MAPPED.add(xt); kids.push(textWidget("e-heading", "span", inlineHtml(x.childNodes, ""), x, ["t-" + xt])); }
        else if (xt !== "br") { const r = run([x]); if (r) kids.push(r); }
      }
      buf = [];
    };
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { buf.push(n); continue; }
      if (n.nodeType !== 1) continue;
      if (inlineOk(n, false) && !(n.rawTagName.toLowerCase() === "span" && classList(n).length)) { buf.push(n); continue; }
      flush();
      kids.push(...convert(n));
    }
    flush();
    return [{ id: nid(), elType: "e-div-block", settings: st, elements: kids }];
  }
  let prevEl = null;
  for (const n of el.childNodes) {
    if (n.nodeType === 3) {
      const txt = n.rawText.replace(/\s+/g, " ");
      if (!txt.trim()) {
        // after a visually hidden span, Chrome keeps the whitespace as an empty flex item
        if (prevEl && classList(prevEl).includes("sm-sr") && (tag === "a" || tag === "button")) kids.push(textWidget("e-heading", "span", "​", null, ["t-run"]));
        else if (prevEl) appendSpace();
        prevEl = null;
        continue;
      }
      kids.push(textWidget("e-heading", "span", txt, null, ["t-run"]));
      prevEl = null;
      continue;
    }
    if (n.nodeType !== 1) continue;
    prevEl = n;
    const xt = n.rawTagName.toLowerCase();
    if (inlineOk(n, false) && !(xt === "span" && classList(n).length)) {
      const ltr = n.getAttribute("dir") === "ltr";
      if (xt === "span") kids.push(textWidget("e-heading", "span", (ltr ? "⁦" : "") + inlineHtml(n.childNodes, "") + (ltr ? "⁩" : ""), n));
      else if (xt === "a") kids.push(...convertContainer(n));
      else if (["strong", "b", "em", "i", "small"].includes(xt)) { MAPPED.add(xt); kids.push(textWidget("e-heading", "span", inlineHtml(n.childNodes, ""), n, ["t-" + xt])); }
      else if (xt === "br") kids.push(textWidget("e-heading", "span", "<br>", null, ["t-run"]));
      else kids.push(textWidget("e-heading", "span", `<${xt}>${inlineHtml(n.childNodes, "")}</${xt}>`, null, ["t-run"]));
      continue;
    }
    kids.push(...convert(n));
  }
  return [{ id: nid(), elType: "e-div-block", settings: st, elements: kids }];
};

/* ---------- forms -> Elementor atomic form ---------- */
const convertForm = (form) => {
  const fieldWidgets = (el) => {
    const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 1) { if (n.nodeType === 3 && n.rawText.trim()) W("form text"); continue; }
      const t = n.rawTagName.toLowerCase();
      const id = n.getAttribute("id");
      const c = classList(n);
      if (t === "label") {
        const st = { tag: S("label"), text: { $$type: "escaped-html", value: inlineHtml(n.childNodes, "") }, "input-id": S(n.getAttribute("for") || "") };
        if (c.length) st.classes = cls(c);
        out.push({ id: nid(), elType: "widget", widgetType: "e-form-label", settings: st, elements: [] });
      } else if (t === "input") {
        const type = n.getAttribute("type") || "text";
        if (type === "checkbox") { W("checkbox"); continue; }
        const st = { type: S(type), required: { $$type: "boolean", value: n.hasAttribute("required") }, _cssid: S(id || n.getAttribute("name")), name: S(n.getAttribute("name") || id), placeholder: S(n.getAttribute("placeholder") || "") };
        if (c.length) st.classes = cls(c);
        const a = [];
        for (const k of ["inputmode", "dir", "autocomplete", "aria-describedby"]) if (n.getAttribute(k)) a.push(kv(k, n.getAttribute(k)));
        if (a.length) st.attributes = { $$type: "attributes", value: a };
        out.push({ id: nid(), elType: "widget", widgetType: "e-form-input", settings: st, elements: [] });
      } else if (t === "textarea") {
        const st = { _cssid: S(id), name: S(n.getAttribute("name") || id), required: { $$type: "boolean", value: n.hasAttribute("required") }, placeholder: S(n.getAttribute("placeholder") || "") };
        if (c.length) st.classes = cls(c);
        out.push({ id: nid(), elType: "widget", widgetType: "e-form-textarea", settings: st, elements: [] });
      } else if (t === "select") {
        const options = n.querySelectorAll("option").map((o) => ({ $$type: "key-value", value: { key: S(o.text.trim()), value: S(o.hasAttribute("value") ? o.getAttribute("value") : o.text.trim()) } }));
        const st = { _cssid: S(id), name: S(n.getAttribute("name") || id), options: { $$type: "options", value: options }, required: { $$type: "boolean", value: n.hasAttribute("required") } };
        if (c.length) st.classes = cls(c);
        out.push({ id: nid(), elType: "widget", widgetType: "e-form-select", settings: st, elements: [] });
      } else if (t === "button") {
        const st = { text: { $$type: "escaped-html", value: inlineHtml(n.childNodes.filter((x) => !(x.nodeType === 1 && x.rawTagName.toLowerCase() === "svg")), "").trim() } };
        if (c.length) st.classes = cls([...c, "t-submit"]);
        out.push({ id: nid(), elType: "widget", widgetType: "e-form-submit-button", settings: st, elements: [] });
      } else if (t === "div" || t === "fieldset" || t === "p" && !n.childNodes.every((x) => inlineOk(x, false))) {
        const d = { id: nid(), elType: "e-div-block", settings: { tag: S("div"), classes: cls([...c, ...(t === "div" ? [] : ["t-" + t])]) }, elements: fieldWidgets(n) };
        const a = attrsOf(n); if (a) d.settings.attributes = a;
        out.push(d);
      } else out.push(...convert(n));
    }
    return out;
  };
  const st = {
    classes: cls(classList(form)),
    "form-name": S(form.getAttribute("aria-label") || "השארת פרטים"),
    "actions-after-submit": { $$type: "string-array", value: [S("collect-submissions"), S("email")] },
  };
  if (form.getAttribute("id")) st._cssid = S(form.getAttribute("id"));
  return { id: nid(), elType: "e-form", settings: st, elements: fieldWidgets(form) };
};

const doc = (seed, nodes) => {
  idSeed = seed; idN = 0;
  const kids = [];
  for (const n of nodes) kids.push(...convert(n));
  return [{ id: nid(), elType: "e-div-block", settings: { tag: S("div"), classes: cls(["sm-doc"]) }, elements: kids }];
};

/* ---------- pages ---------- */
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f === "index.html") files.push(p); } })(RAW);
const manifest = [];
let headerSrc = null, footerSrc = null, landingHeader = null;
for (const f of files) {
  const rel = path.relative(RAW, path.dirname(f)).split(path.sep).join("/");
  const url = "/" + (rel ? rel + "/" : "");
  const html = fs.readFileSync(f, "utf8");
  const root = parse(html, { comment: false, blockTextElements: { script: true, style: true, noscript: true } });
  const body = root.querySelector("body");
  const main = root.querySelector("main");
  const headEl = root.querySelector("head");
  const meta = (n) => headEl.querySelector(`meta[name="${n}"]`)?.getAttribute("content") || "";
  const jsonld = headEl.querySelectorAll('script[type="application/ld+json"]').map((s) => s.rawText.trim()).concat(body.querySelectorAll('script[type="application/ld+json"]').map((s) => s.rawText.trim()));
  // everything in <body> before <main> is the header area, after it the footer area
  const before = [], after = [];
  let seen = false;
  for (const n of body.childNodes) {
    if (n === main) { seen = true; continue; }
    if (n.nodeType !== 1) continue;
    if (n.rawTagName.toLowerCase() === "script") continue;
    (seen ? after : before).push(n);
  }
  const lang = root.querySelector("html").getAttribute("lang");
  const landing = lang !== "he";
  if (!landing && !headerSrc && url === "/") headerSrc = before;
  if (!landing && !footerSrc && url === "/") footerSrc = after;
  const tree = doc("page:" + url, [main]);
  const slug = url === "/" ? "home" : rel.replace(/\//g, "__");
  fs.writeFileSync(path.join(OUT, "pages", slug + ".json"), JSON.stringify(tree));
  manifest.push({
    url, slug, lang, dir: root.querySelector("html").getAttribute("dir"), landing,
    css: [...html.matchAll(/assets\/css\/([\w-]+)\.css/g)].map((m) => m[1]),
    title: headEl.querySelector("title").text, description: meta("description"), robots: meta("robots"),
    jsonld, h1: main.querySelector("h1")?.text.trim() || "",
    header: landing ? doc("lhead:" + url, before) : null,
    footer: landing ? doc("lfoot:" + url, after) : null,
  });
}
fs.writeFileSync(path.join(OUT, "header.json"), JSON.stringify(doc("header", headerSrc)));
fs.writeFileSync(path.join(OUT, "footer.json"), JSON.stringify(doc("footer", footerSrc)));
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest));

/* ---------- CSS ---------- */
const lists = files.map((f) => [...fs.readFileSync(f, "utf8").matchAll(/assets\/css\/([\w-]+)\.css/g)].map((m) => m[1]));
// global order that respects every page's own load order (topological, ties by first use)
const first = [];
for (const l of lists) for (const c of l) if (!first.includes(c)) first.push(c);
const after = new Map(first.map((c) => [c, new Set()]));
for (const l of lists) for (let i = 1; i < l.length; i++) for (let j = 0; j < i; j++) after.get(l[i]).add(l[j]);
const order = [];
while (order.length < first.length) {
  const next = first.find((c) => !order.includes(c) && [...after.get(c)].every((d) => order.includes(d)));
  if (!next) { W("css order cycle"); order.push(...first.filter((c) => !order.includes(c))); break; }
  order.push(next);
}
for (const l of lists) { const idx = l.map((x) => order.indexOf(x)); if (idx.some((v, i) => i && v < idx[i - 1])) W("css order differs " + l.join(",")); }
const ROOTISH = (node) => node.children.toArray().some((x) => (x.type === "TypeSelector" && /^(html|body)$/i.test(x.name)) || (x.type === "PseudoClassSelector" && x.name === "root"))
  || node.children.toArray().every((x) => x.type === "AttributeSelector" && /^(dir|lang)$/.test(x.name.name));
// the class stand-in gets no specificity of its own, so the rule keeps the tag's specificity
const STANDINS = ".t-run,.t-strong,.t-b,.t-em,.t-i,.t-small";
const TAGMAP = (name) => {
  if (name === "span") return `:is(span:not(:where(${STANDINS})),:where(.t-span))`;
  return MAPPED.has(name) ? `:is(${name},:where(.t-${name}))` : null;
};
let css = "";
// a CSS file the static build loads only on some pages applies only to those pages here too
const loadCount = Object.fromEntries(order.map((c) => [c, lists.filter((l) => l.includes(c)).length]));
for (const c of order) {
  const scoped = loadCount[c] < lists.length;
  let src = fs.readFileSync(path.join(ASSETS, "css", c + ".css"), "utf8");
  src = src.replace(/url\((['"]?)\.\.\/([^)'"]+)\1\)/g, (m, q, p) => `url("${UP}/${p}")`);
  const ast = csstree.parse(src);
  csstree.walk(ast, {
    visit: "Rule",
    enter(rule) {
      if (this.atrule && /keyframes$/i.test(this.atrule.name)) return;
      const sels = [];
      rule.prelude.children.forEach((sel) => {
        let s = csstree.generate(sel);
        // split into compounds to find a leading html/body/:root/[dir] part
        const parts = []; let cur = [];
        sel.children.forEach((n) => { if (n.type === "Combinator") { parts.push({ cur, comb: n }); cur = []; } else cur.push(n); });
        parts.push({ cur, comb: null });
        const first = { children: { toArray: () => parts[0].cur } };
        let gen = (list) => list.map((n) => {
          if (n.type === "TypeSelector" && TAGMAP(n.name.toLowerCase())) return TAGMAP(n.name.toLowerCase());
          if (n.type === "ClassSelector" && n.name === "hl") return ":is(.hl,em)";
          if (n.type === "ClassSelector" && SUBST.has(n.name)) return `:is(.${n.name},:where(${SUBST.get(n.name)} > b))`;
          return csstree.generate(n);
        }).join("");
        const comb = (p) => p.comb ? (p.comb.name === " " ? " " : ` ${p.comb.name} `) : "";
        const rootish = ROOTISH(first);
        // html, body, :root, [dir] alone, or html.x body: keep as is
        if (parts.every((p) => ROOTISH({ children: { toArray: () => p.cur } }))) { sels.push(s); return; }
        let outSel = "";
        parts.forEach((p, i) => {
          outSel += gen(p.cur);
          if (i === 0 && rootish) outSel += " .elementor .sm-doc";
          outSel += comb(p);
        });
        if (!rootish) outSel = ".elementor .sm-doc " + outSel;
        if (scoped && !rootish) outSel = ":where(body.sm-css-" + c + ") " + outSel;
        sels.push(outSel.replace(/\s+/g, " ").trim());
      });
      rule.prelude = csstree.parse(sels.join(","), { context: "selectorList" });
    },
  });
  css += `/* ===== ${c}.css ===== */\n` + csstree.generate(ast) + "\n";
}
const RESET = `/* Sofia Medical: static design CSS converted for Elementor v4.
   Atomic containers act as plain HTML elements inside .sm-doc; the static rules below follow. */
body[class*="elementor-kit-"]{font-family:var(--font-main);font-size:var(--fs-body);line-height:var(--lh-body);color:var(--text);background:var(--bg)}
.elementor-location-header,.elementor.elementor-location-header>.sm-doc.e-con{display:contents}
/* Reset layer: specificity (0,2,1). It beats Elementor's own defaults (0,2,0) and loses to every
   static rule (bare tags (0,2,1) come later, classes are (0,3,0)+), like browser defaults do. */
.elementor .sm-doc.e-con{padding:0;margin:0;gap:normal;width:auto;min-width:auto;height:auto;min-height:auto;max-width:none;position:static;overflow:visible;z-index:auto;border-radius:0;transition:none;display:block;--display:block}
.elementor .sm-doc div:where(.e-con),.elementor .sm-doc section:where(.e-con),.elementor .sm-doc header:where(.e-con),.elementor .sm-doc footer:where(.e-con),.elementor .sm-doc article:where(.e-con),.elementor .sm-doc aside:where(.e-con),.elementor .sm-doc nav:where(.e-con),.elementor .sm-doc main:where(.e-con),.elementor .sm-doc a:where(.e-con),.elementor .sm-doc button:where(.e-con),.elementor .sm-doc form:where(.e-con){padding:0;margin:0;gap:normal;width:auto;min-width:auto;height:auto;min-height:auto;max-width:none;position:static;overflow:visible;z-index:auto;border-radius:0;transition:none;flex-direction:row;display:block;--display:block}
.elementor .sm-doc div:where(.e-con)::before,.elementor .sm-doc div:where(.e-con)::after,.elementor .sm-doc section:where(.e-con)::before,.elementor .sm-doc section:where(.e-con)::after,.elementor .sm-doc header:where(.e-con)::before,.elementor .sm-doc header:where(.e-con)::after,.elementor .sm-doc footer:where(.e-con)::before,.elementor .sm-doc footer:where(.e-con)::after,.elementor .sm-doc article:where(.e-con)::before,.elementor .sm-doc article:where(.e-con)::after,.elementor .sm-doc aside:where(.e-con)::before,.elementor .sm-doc aside:where(.e-con)::after,.elementor .sm-doc nav:where(.e-con)::before,.elementor .sm-doc nav:where(.e-con)::after,.elementor .sm-doc main:where(.e-con)::before,.elementor .sm-doc main:where(.e-con)::after,.elementor .sm-doc a:where(.e-con)::before,.elementor .sm-doc a:where(.e-con)::after,.elementor .sm-doc button:where(.e-con)::before,.elementor .sm-doc button:where(.e-con)::after,.elementor .sm-doc form:where(.e-con)::before,.elementor .sm-doc form:where(.e-con)::after{content:none;position:static;display:inline;width:auto;height:auto;top:auto;left:auto;right:auto;bottom:auto;border:0 none;border-radius:0;opacity:1;mix-blend-mode:normal;transition:none;background:none;z-index:auto}
.elementor .sm-doc a:where(.e-con),.elementor .sm-doc div:where(.t-span),.elementor .sm-doc div:where(.t-label){display:inline}
.elementor .sm-doc button:where(.e-con){display:inline-block;font:13.3333px Arial,sans-serif;line-height:normal;color:#000;text-align:center;background:none;border:0;padding:0;border-radius:0;cursor:default;text-transform:none;letter-spacing:normal}
.elementor .sm-doc div:where(.t-li){display:list-item}
.elementor .sm-doc div:where(.t-p){margin-block:1em}
.elementor .sm-doc div:where(.t-ul){margin-block:1em;padding-inline-start:40px;list-style-type:disc}
.elementor .sm-doc div:where(.t-ol){margin-block:1em;padding-inline-start:40px;list-style-type:decimal}
.elementor .sm-doc div:where(.t-figure),.elementor .sm-doc div:where(.t-blockquote){margin:1em 40px}
.elementor .sm-doc div:where(.t-summary){cursor:pointer}
.elementor .sm-doc span:where(.t-strong,.t-b,.t-em,.t-i,.t-small){display:inline}
.elementor .sm-doc span:where(.t-strong,.t-b){font-weight:bolder}
.elementor .sm-doc span:where(.t-em,.t-i){font-style:italic}
.elementor .sm-doc span:where(.t-small){font-size:smaller}
.elementor .sm-doc .t-details:not([open])>:not(.t-summary){display:none!important}
.elementor .sm-doc [hidden]{display:none}
.elementor .sm-doc a{text-decoration:revert}
.elementor .sm-doc input:where(.e-form-input-base),.elementor .sm-doc select:where(.e-form-select-base),.elementor .sm-doc textarea:where(.e-form-textarea-base){height:auto;font-size:13.3333px;color:fieldtext;border-radius:0;border:2px inset light-dark(#767676,#858585);background-color:field}
.elementor .sm-doc label:where(.e-form-label-base){font-size:inherit;color:inherit}
.elementor .sm-doc button:where(.e-form-submit-button-base){color:buttontext;padding:1px 6px;border-radius:0;border:2px outset buttonborder;background-color:buttonface;display:inline-block}
.elementor .sm-doc .e-svg-base{display:block}
.elementor .sm-doc .e-svg-base svg{display:block}
.elementor .sm-doc .e-svg-base svg[stroke="currentColor"][stroke-width]{fill:none}
.elementor .sm-doc .t-picture img.t-src-m{display:none}
@media (max-width:1024px){.elementor .sm-doc .t-picture img.t-src-m{display:block}.elementor .sm-doc .t-picture img.t-img-d{display:none}}
.elementor .sm-doc form:where(.e-form-base){display:block;padding:0;gap:normal}
.elementor .sm-doc .t-submit::after{content:"";width:24px;height:24px;flex:none;background:currentColor;-webkit-mask:url("${UP}/icons/arrow-left.svg") center/contain no-repeat;mask:url("${UP}/icons/arrow-left.svg") center/contain no-repeat}
${[...SUBST.entries()].map(([k, p]) => `.elementor .sm-doc ${p} > b{font-weight:inherit}`).join("\n")}
`;
fs.writeFileSync(path.join(OUT, "site.css"), RESET + css);

/* ---------- JS ---------- */
const JS_ORDER = ["header", "insure", "tabs", "team", "reviews", "hero-rotate", "articles-filter", "article"];
let js = `/* Sofia Medical site scripts (from the static build). */\n`;
js += fs.readFileSync(path.join(HERE, "shim.js"), "utf8") + "\n";
for (const j of JS_ORDER) js += `/* ===== ${j}.js ===== */\n` + fs.readFileSync(path.join(ASSETS, "js", j + ".js"), "utf8") + "\n";
fs.writeFileSync(path.join(OUT, "site.js"), js);

/* ---------- classes + media ---------- */
const labels = [...CLASSES.keys()];
fs.writeFileSync(path.join(OUT, "classes.json"), JSON.stringify(labels.map((l) => ({ id: CLASSES.get(l), label: l }))));
fs.writeFileSync(path.join(OUT, "media.json"), JSON.stringify([...MEDIA.entries()].map(([k, v]) => ({ key: k, file: path.relative(HERE, v.file).split(path.sep).join("/"), kind: v.kind, alt: v.alt }))));
console.log("pages", manifest.length, "classes", labels.length, "media", MEDIA.size, "mapped tags", [...MAPPED].join(","), "subst", [...SUBST.keys()].join(","));
console.log("css KB", Math.round((RESET + css).length / 1024), "js KB", Math.round(js.length / 1024));
for (const [k, v] of warn) console.log("  warn", v, k);
