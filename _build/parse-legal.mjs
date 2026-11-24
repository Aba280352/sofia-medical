// Parses the current terms, privacy and accessibility pages into
// data-legal.mjs. Usage (from site/):
//   node _build/parse-legal.mjs <dir with p52.html p53.html p54.html> _build/data-legal.mjs
import fs from "fs";
const S = process.argv[2];
const dec = (s) => s.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n));
const H = "֐-׿";
const clean = (s, head) => {
  s = s.replace(/[\p{Extended_Pictographic}️‏‎]/gu, "").replace(/\s+/g, " ").trim();
  s = s.replace(/התשמ"א[–-]1981/g, "התשמ\"א 1981");
  s = s.replace(new RegExp(`([${H}])[-־–]([${H}])`, "g"), "$1 $2").replace(new RegExp(`([${H}])[-־–]([${H}])`, "g"), "$1 $2");
  const phones = []; // keep phone numbers like 050-465-1970 out of the range rule
  s = s.replace(/\b0\d{1,2}-\d{3}-\d{4}\b|\b0\d{1,2}-\d{7}\b/g, (m) => { phones.push(m); return `§${phones.length - 1}§`; });
  s = s.replace(/(\d)\s*[–-]\s*(\d)/g, "$1 עד $2").replace(/§(\d+)§/g, (m, i) => phones[+i]);
  const sep = head && !/:/.test(s) ? ": " : ", ";
  s = s.replace(/ [–—-] /g, sep).replace(new RegExp(`([${H}A-Za-z)])[-–] `, "g"), sep === ": " ? "$1: " : "$1, ");
  s = s.replace(/([.:?!])([א-ת])/g, "$1 $2").replace(/\s+([,.:])/g, "$1").replace(/ ?[–—]$/, "").trim();
  return s;
};
const PAGES = [["p52", "/terms"], ["p53", "/privacy"], ["p54", "/accessibility"]];
const out = [];
for (const [f, href] of PAGES) {
  const h = fs.readFileSync(`${S}/${f}.html`, "utf8");
  const title = dec((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || "").trim();
  let b = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  b = b.replace(/<(h[1-6])[^>]*>/gi, "\n[$1] ").replace(/<li[^>]*>/gi, "\n[li] ").replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n").replace(/<br[^>]*>/gi, "\n").replace(/<[^>]+>/g, "");
  const L = dec(b).split("\n").map((s) => s.trim()).filter(Boolean);
  const i0 = L.findIndex((x) => /^\[h1\]/i.test(x));
  const end = L.findIndex((x, j) => j > i0 && x.startsWith("סופיה מדיקל – שיקום, טיפול בכאב והפרעות שינה") && /זכויות/.test(L[j + 1] || ""));
  const h1 = L[i0].replace(/^\[h1\]\s*/i, "");
  const blocks = [];
  for (const x of L.slice(i0 + 1, end > 0 ? end : undefined)) {
    let m;
    if ((m = x.match(/^\[h(\d)\]\s*(.*)$/i))) { const t = clean(m[2], true); if (t) blocks.push({ t: +m[1] <= 2 ? "h2" : "h3", x: t }); continue; }
    if ((m = x.match(/^\[li\]\s*(.*)$/))) { const t = clean(m[1]); if (!t) continue; const last = blocks.at(-1); if (last && last.t === "ul") last.x.push(t); else blocks.push({ t: "ul", x: [t] }); continue; }
    const t = clean(x); if (t) blocks.push({ t: "p", x: t });
  }
  out.push({ href, h1, title: title.replace(" - ", " | ").replace(/ – /g, ", "), blocks });
}
fs.writeFileSync(process.argv[3], "// Terms, privacy and accessibility pages: text of the current pages, parsed\n// by parse-legal.mjs. Dashes replaced; no other words changed.\nexport const LEGAL = " + JSON.stringify(out, null, 1) + ";\n");
for (const p of out) { console.log("=====", p.h1, "|", p.title); for (const b of p.blocks) console.log(" ", b.t, Array.isArray(b.x) ? b.x.map((s) => s.slice(0, 40)).join(" / ") : b.x.slice(0, 100)); }
