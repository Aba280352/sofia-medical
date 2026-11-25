// Parses the downloaded article pages of the current site into
// data-articles.mjs. Usage (from site/):
//   node _build/parse-articles.mjs <dir with a0.html..a29.html, list2/3.html, index.txt> _build/data-articles.mjs
// a0 = the /מאמרים listing (page 1), list2/list3 = listing pages 2 and 3.
import fs from "fs";
const S = process.argv[2];
const dec = (s) => s.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&raquo;/g, "»").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n));
const H = "֐-׿";
export const clean = (s, head) => {
  s = s.replace(/[\p{Extended_Pictographic}️‏‎]/gu, "").replace(/\s+/g, " ").trim();
  s = s.replace(new RegExp(`([${H}])[-־–]([${H}])`, "g"), "$1 $2").replace(new RegExp(`([${H}])[-־–]([${H}])`, "g"), "$1 $2");
  s = s.replace(/(\d)\s*[–-]\s*(\d)(?!\d{4})/g, "$1 עד $2"); // a long digit group after the dash is a phone number
  if (head) s = s.replace(/ \| /g, ", ");
  const sep = head && !/:/.test(s) ? ": " : ", ";
  s = s.replace(/ [–—-] /g, sep).replace(new RegExp(`([${H}A-Za-z)])[-–] `, "g"), sep === ": " ? "$1: " : "$1, ");
  s = s.replace(/([.:?!])([א-ת])/g, "$1 $2").replace(/([A-Za-z)])([א-ת])/g, "$1: $2").replace(/::/g, ":");
  s = s.replace(/ ?[–—]$/, "").replace(/\s+([,.:])/g, "$1").replace(/:\s*:/g, ":").trim();
  return s;
};
const lines = (h) => {
  let b = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<\/strong>\s*<br[^>]*>/gi, "</strong>: ");
  b = b.replace(/<(h[1-6])[^>]*>/gi, "\n[$1] ").replace(/<li[^>]*>/gi, "\n[li] ").replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n").replace(/<br[^>]*>/gi, "\n")
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "\n[IMG $1]\n").replace(/<[^>]+>/g, "");
  return dec(b).split("\n").map((s) => s.trim()).filter(Boolean);
};

// Topic of each article (index in index.txt order), for the listing filter
const TOPIC = { 1: "rehab", 2: "sleep", 3: "rehab", 4: "rehab", 5: "pain", 6: "pain", 7: "sleep", 8: "sleep", 9: "pain", 10: "pain",
  11: "pain", 12: "rehab", 13: "sleep", 14: "sleep", 15: "sleep", 16: "rehab", 17: "pain", 18: "pain", 19: "pain", 20: "uro",
  21: "uro", 22: "uro", 23: "rehab", 24: "uro", 25: "pain", 26: "sleep", 27: "sleep", 28: "uro", 29: "pain" };

const idx = Object.fromEntries(fs.readFileSync(`${S}/index.txt`, "utf8").trim().split(/\r?\n/).map((l) => { const [i, u] = l.split("\t"); return [+i, u.replace("https://www.sofia-medical.com", "")]; }));

// Excerpts from the 3 listing pages (title -> excerpt)
const excerpts = {};
for (const f of ["a0.html", "list2.html", "list3.html"]) {
  const L = lines(fs.readFileSync(`${S}/${f}`, "utf8"));
  L.forEach((x, k) => {
    if (!x.startsWith("[h4]")) return;
    const t = x.slice(5).trim(), next = L[k + 1];
    if (next && !next.startsWith("[") && next !== "קרא עוד") excerpts[t] = next;
  });
}

const out = [];
for (let n = 1; n <= 29; n++) {
  const h = fs.readFileSync(`${S}/a${n}.html`, "utf8");
  const title = dec((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || "").trim();
  const desc = dec((h.match(/name="description" content="([^"]*)/i) || [])[1] || "").trim();
  const L = lines(h);
  const i0 = L.findIndex((x) => /^\[h1\]/i.test(x));
  const h1raw = L[i0].replace(/^\[h1\]\s*/i, "");
  let end = L.findIndex((x, k) => k > i0 && x === "[li]");
  const body = L.slice(i0 + 1, end > 0 ? end - 1 : undefined); // drop the tag line before the empty items
  const hasH23 = body.some((x) => /^\[h[23]\]\s*\S/i.test(x));
  const blocks = [], videos = [];
  let inFaq = false; const faq = [];
  for (let x of body) {
    let m;
    if ((m = x.match(/^\[IMG (.*)\]$/))) {
      const yt = m[1].match(/img\.youtube\.com\/vi\/([\w-]+)\//);
      if (yt) blocks.push({ t: "video", x: yt[1] });
      continue;
    }
    if (/^(כתובת:|טלפון לתיאום|טלפון:|אתר:|www\.sofia|סופיה מדיקל – מרכז לרפואה מתקדמת, שיקום והפרעות שינה$)/.test(x)) continue;
    if ((m = x.match(/^\[h(\d)\]\s*(.*)$/i))) {
      let lv = +m[1], t = clean(m[2], true);
      if (!t) continue;
      if (lv === 1) lv = 2;
      if (lv === 4) lv = hasH23 ? 3 : 2;
      if (lv > 3) lv = 3;
      if (lv === 2) { inFaq = /^(FAQ|שאלות נפוצות|שאלות ותשובות)/i.test(t); if (/^FAQ$/i.test(t)) t = "שאלות נפוצות"; }
      if (inFaq && lv === 3) faq.push({ q: t, a: [] });
      blocks.push({ t: "h" + lv, x: t }); continue;
    }
    if (/^(🔹|•|▪|►|- )/u.test(x)) x = "[li] " + x.replace(/^(🔹|•|▪|►|-)\s*/u, "");
    if ((m = x.match(/^\[li\]\s*(.*)$/))) { const t = clean(m[1]); if (!t) continue; const last = blocks.at(-1); if (last && last.t === "ul") last.x.push(t); else blocks.push({ t: "ul", x: [t] }); continue; }
    if (/[✔✅✓]/.test(x)) {
      const items = x.replace(/ \| /g, ", ").split(/[✔✅✓]/).map((s) => clean(s)).filter(Boolean);
      while (items.length && items[0].endsWith(":")) blocks.push({ t: "p", x: items.shift() });
      const last = blocks.at(-1); if (last && last.t === "check") last.x.push(...items); else blocks.push({ t: "check", x: items }); continue;
    }
    x = x.replace(/ \| /g, ", ");
    const t = clean(x); if (!t || t === "קרא עוד") continue;
    if (inFaq && faq.length) faq.at(-1).a.push(t);
    blocks.push({ t: "p", x: t });
  }
  if (!blocks.some((b) => b.t === "h2")) blocks.forEach((b) => { if (b.t === "h3") b.t = "h2"; });
  const h1 = clean(h1raw, true);
  out.push({ href: idx[n], topic: TOPIC[n], h1, title: title.split(" | ").map((x) => clean(x, true)).join(" | "), desc: clean(desc), excerpt: clean(excerpts[h1raw] || desc),
    blocks, faq: faq.filter((f) => f.a.length).map((f) => ({ q: f.q, a: f.a.join(" ") })) });
}
fs.writeFileSync(process.argv[3], "// Articles (/מאמרים/<slug>): content of the current pages, parsed by\n// parse-articles.mjs. Dashes replaced, emojis, tag lines and contact\n// blocks removed, extra H1s demoted to H2, h4 titles mapped to H2/H3.\nexport const ARTICLES = " + JSON.stringify(out, null, 1) + ";\n");
for (const p of out) console.log(p.topic, "|", p.h1, "| blocks", p.blocks.length, "| faq", p.faq.length, "| exc", p.excerpt.slice(0, 40));
