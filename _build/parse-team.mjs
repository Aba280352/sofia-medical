// Parses the downloaded team profile pages (/הצוות/<slug>) of the current
// site into data-team-profiles.mjs. Usage (from site/):
//   node _build/parse-team.mjs <dir with t0.html.. and index.txt> _build/data-team-profiles.mjs
// The three people removed from the site (Kotikov, Khalaila, Mahajna) are skipped.
import fs from "fs";
const S = process.argv[2];
const dec = (s) => s.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n));
const H = "֐-׿";
const clean = (s, head) => {
  s = s.replace(/[\p{Extended_Pictographic}️‏‎]/gu, "").replace(/\s+/g, " ").trim();
  s = s.replace(/ \| /g, ", ");
  s = s.replace(new RegExp(`([${H}])[-־–]([${H}])`, "g"), "$1 $2").replace(new RegExp(`([${H}])[-־–]([${H}])`, "g"), "$1 $2");
  s = s.replace(/(\d)\s*[–-]\s*(\d)(?!\d{4})/g, "$1 עד $2").replace(/כ־(\d)/g, "כ $1");
  const sep = head && !/:/.test(s) ? ": " : ", ";
  s = s.replace(/ [–—-] /g, sep).replace(new RegExp(`([${H}A-Za-z)])[-–] `, "g"), sep === ": " ? "$1: " : "$1, ");
  s = s.replace(/([.:?!])([א-ת])/g, "$1 $2").replace(/\s+([,.:])/g, "$1").replace(/ ?[–—]$/, "").trim();
  return s;
};
const lines = (h) => {
  let b = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<\/strong>\s*<br[^>]*>/gi, "</strong>: ");
  b = b.replace(/<(h[1-6])[^>]*>/gi, "\n[$1] ").replace(/<li[^>]*>/gi, "\n[li] ").replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n").replace(/<br[^>]*>/gi, "\n").replace(/<[^>]+>/g, "");
  return dec(b).split("\n").map((s) => s.trim()).filter(Boolean);
};
// old index -> slug used for the photo and the new data (TEAM_PAGE order)
const KEEP = { 0: "ala-mahamid", 3: "haitham-abu-nagma", 2: "abdallah-watad", 5: "hashem-khalifa", 6: "moamen-khatib",
  7: "yarona-shefer-yaakov", 9: "mursi-asli", 10: "vlada-guizman", 11: "afnan-mohanna", 12: "orna-ohana" };
const idx = Object.fromEntries(fs.readFileSync(`${S}/index.txt`, "utf8").trim().split(/\r?\n/).map((l) => { const [i, n, u] = l.split("\t"); return [+i, u]; }));
const out = {};
for (const [k, slug] of Object.entries(KEEP)) {
  const h = fs.readFileSync(`${S}/t${k}.html`, "utf8");
  const title = dec((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || "").trim();
  const desc = dec((h.match(/name="description" content="([^"]*)/i) || [])[1] || "").trim();
  const L = lines(h);
  const i0 = L.findIndex((x) => /^\[h1\]/i.test(x));
  const end = L.findIndex((x, j) => j > i0 && x.startsWith("סופיה מדיקל – שיקום"));
  const body = L.slice(i0 + 3, end > 0 ? end : undefined);
  const blocks = [];
  for (const x of body) {
    let m;
    if ((m = x.match(/^\[h\d\]\s*(.*)$/i))) { const t = clean(m[1], true); if (t) blocks.push({ t: "h2", x: t }); continue; }
    if ((m = x.match(/^\[li\]\s*(.*)$/))) { const t = clean(m[1]); if (!t) continue; const last = blocks.at(-1); if (last && last.t === "ul") last.x.push(t); else blocks.push({ t: "ul", x: [t] }); continue; }
    if (/^(קרא עוד|לכל הצוות|חזרה)/.test(x)) continue;
    const t = clean(x); if (t) blocks.push({ t: "p", x: t });
  }
  out[slug] = { href: idx[k], title: title.split(" | ").map((x) => clean(x, true)).join(" | "), desc: clean(desc), blocks };
}
fs.writeFileSync(process.argv[3], "// Team profile pages (/הצוות/<slug>): bios of the current profile pages,\n// parsed by parse-team.mjs. Dashes and \"|\" replaced; no other words changed.\nexport const PROFILES = " + JSON.stringify(out, null, 1) + ";\n");
for (const [s, p] of Object.entries(out)) console.log(s, "|", p.title, "| blocks", p.blocks.length, p.blocks.filter((b) => b.t !== "p").map((b) => b.t).join(","));
