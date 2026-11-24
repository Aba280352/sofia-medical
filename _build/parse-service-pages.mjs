import fs from "fs";
import { SERVICES_PAGE } from "file:///C:/Users/Owner/Desktop/Claude/%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98%D7%99%D7%9D/%D7%A1%D7%95%D7%A4%D7%99%D7%94%20%D7%9E%D7%93%D7%99%D7%A7%D7%9C/site/_build/data-services.mjs";
const S = process.argv[2];
const dec = s => s.replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&ndash;/g,"–").replace(/&mdash;/g,"—").replace(/&#(\d+);/g,(m,n)=>String.fromCodePoint(+n));
const H = "\u0590-\u05FF";
const clean = (s, head) => {
  s = s.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "").replace(/\s+/g, " ").trim();
  s = s.replace(/טכנולוגיית - recoveriX/g, "טכנולוגיית recoveriX:");
  s = s.replace(new RegExp(`([${H}])[-־]([${H}])`, "g"), "$1 $2").replace(new RegExp(`([${H}])[-־]([${H}])`, "g"), "$1 $2");
  s = s.replace(/ [–—-] /g, head ? ": " : ", ").replace(new RegExp(`([${H}A-Za-z)])[-–] `, "g"), head ? "$1: " : "$1, ");
  s = s.replace(/([.:?!])([א-ת])/g, "$1 $2").replace(/([A-Za-z)])([א-ת])/g, "$1: $2").replace(/::/g, ":");
  s = s.replace(/(\d)\s*[–-]\s*(\d)/g, "$1 עד $2");
  s = s.replace(/ ?[–—]$/, "").replace(/\s+([,.:])/g, "$1").trim();
  return s;
};
const out = [];
for (let n = 0; n < 16; n++) {
  const h = fs.readFileSync(`${S}/svc/s${n}.html`, "utf8");
  const title = dec((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || "").trim();
  const desc = dec((h.match(/name="description" content="([^"]*)/i) || [])[1] || "").trim();
  let b = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<\/strong>\s*<br[^>]*>/gi, "</strong>: ");
  b = b.replace(/<(h[1-6])[^>]*>/gi, "\n[$1] ").replace(/<li[^>]*>/gi, "\n[li] ").replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n").replace(/<br[^>]*>/gi, "\n").replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "\n[IMG $1]\n").replace(/<[^>]+>/g, "");
  const L = dec(b).split("\n").map(s => s.trim()).filter(Boolean);
  const i0 = L.findIndex(x => /^\[h1\]/i.test(x));
  const h1 = L[i0].replace(/^\[h1\]\s*/i, "");
  let end = L.findIndex((x, k) => k > i0 && x.startsWith("סופיה מדיקל – שיקום"));
  const body = L.slice(i0 + 1, end > 0 ? end : undefined);
  const hasH23 = body.some(x => /^\[h[23]\]\s*\S/i.test(x));
  const blocks = [], imgs = [];
  for (let x of body) {
    let m;
    if ((m = x.match(/^\[IMG (.*)\]$/))) { imgs.push(m[1]); continue; }
    if ((m = x.match(/^\[h(\d)\]\s*(.*)$/i))) {
      let lv = +m[1], t = clean(m[2], true);
      if (!t) continue;
      if (/יצירת קשר/.test(t)) break;
      if (lv === 1) lv = 2;
      if (lv === 4) lv = hasH23 ? 3 : 2;
      if (lv > 3) lv = 3;
      blocks.push({ t: "h" + lv, x: t }); continue;
    }
    if (/📍|📞|INFO@SOFIA|^זמינות מהירה/i.test(x)) break;
    if (/^(🔹|•|▪|►|- )/u.test(x)) x = "[li] " + x.replace(/^(🔹|•|▪|►|-)\s*/u, "");
    if ((m = x.match(/^\[li\]\s*(.*)$/))) { const t = clean(m[1]); if (!t) continue; const last = blocks.at(-1); if (last && last.t === "ul") last.x.push(t); else blocks.push({ t: "ul", x: [t] }); continue; }
    if (x.includes("✔") || x.includes("✅") || x.includes("✓")) {
      const items = x.replace(/ \| /g, ", ").split(/[✔✅✓]/).map(s => clean(s)).filter(Boolean);
      while (items.length && items[0].endsWith(":")) blocks.push({ t: "p", x: items.shift() });
      const last = blocks.at(-1); if (last && last.t === "check") last.x.push(...items); else blocks.push({ t: "check", x: items }); continue;
    }
    if ((x.match(/ \| /g) || []).length >= 3 && !/[.,:]/.test(x)) { blocks.push({ t: "ul", x: x.split(" | ").map(v => clean(v)) }); continue; }
    x = x.replace(/ \| /g, ", ");
    const t = clean(x); if (!t || t === "קרא עוד") continue;
    blocks.push({ t: "p", x: t });
  }
  if (!blocks.some(b => b.t === "h2")) blocks.forEach(b => { if (b.t === "h3") b.t = "h2"; });
  const k = blocks.findIndex(b => b.x === "ניתן להגיע להערכה מקדימה על ידי רופא שיקום בכיר");
  if (k >= 0) blocks.splice(k, 3, { t: "h2", x: "ניתן להגיע להערכה מקדימה על ידי רופא שיקום בכיר במסגרת כללית מושלם" }, { t: "p", x: blocks[k + 1].x + "." });
  out.push({ href: SERVICES_PAGE[n].href, h1: clean(h1, true), title: clean(title, true), desc: clean(desc), imgs, blocks });
}
fs.writeFileSync(process.argv[3], "// Service pages (/שירותים/<slug>): content of the current pages, parsed\n// from the live site. Dashes replaced, emojis and the contact block removed,\n// extra H1s demoted to H2, h4 section titles mapped to H2/H3.\nexport const SERVICE_PAGES = " + JSON.stringify(out, null, 1) + ";\n");
for (const p of out) { console.log("\n=====", p.h1, "|", p.title); for (const b of p.blocks) console.log(" ", b.t, Array.isArray(b.x) ? b.x.map(s => s.slice(0, 50)).join(" / ") : b.x.slice(0, 110)); }
