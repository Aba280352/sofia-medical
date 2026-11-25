// node compare-all.mjs meas/static-all.json meas/wp-all.json [filter]
import fs from "fs";
const A = JSON.parse(fs.readFileSync(process.argv[2], "utf8")), B = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const filt = process.argv[4] || "";
const sig = (x) => x[0].replace(/\.?is-[\w-]+/g, "");
const F = ["x", "y", "w", "h", "display", "font", "color", "bg", "pos", "weight", "lh"];
const agg = new Map(); const pages = [];
for (const key of Object.keys(A)) {
  if (filt && !key.includes(filt)) continue;
  const a = A[key], b = B[key];
  if (!b || a.err || b.err) { pages.push([key, "missing/err", a.err || b?.err]); continue; }
  let i = 0, j = 0, n = 0, miss = 0;
  while (i < a.out.length && j < b.out.length) {
    const X = a.out[i], Y = b.out[j];
    if (sig(X) !== sig(Y)) {
      const k = b.out.slice(j, j + 40).findIndex((x) => sig(x) === sig(X));
      const l = a.out.slice(i, i + 40).findIndex((x) => sig(x) === sig(Y));
      if (k > 0 && (l < 0 || k <= l)) { j += k; miss++; continue; }
      if (l > 0) { i += l; miss++; const kk = "MISSING " + sig(X); agg.set(kk, (agg.get(kk) || 0) + 1); continue; }
      i++; j++; miss++; continue;
    }
    const d = [];
    // only size and style: positions follow from earlier differences
    for (let f = 3; f <= 4; f++) if (Math.abs(X[f] - Y[f]) > 1) d.push(F[f - 1]);
    for (let f = 5; f < X.length; f++) if (X[f] !== Y[f]) d.push(`${F[f - 1]}:${X[f]}→${Y[f]}`);
    if (d.length) { n++; const kk = sig(X) + " :: " + d.join(";"); agg.set(kk, (agg.get(kk) || 0) + 1); }
    i++; j++;
  }
  pages.push([key, `h ${a.h}→${b.h}`, `sw ${a.sw}→${b.sw}`, `diff ${n}`, `resync ${miss}`]);
}
const bad = pages.filter((p) => p[1] === "missing/err" || /h (\d+)→(\d+)/.test(p[1]) && Math.abs(+p[1].match(/h (\d+)/)[1] - +p[1].match(/→(\d+)/)[1]) > 2 || +String(p[3]).replace(/\D/g, "") > 0);
console.log("pages", pages.length, "with differences", bad.length);
for (const p of bad.slice(0, 60)) console.log(p.join(" | "));
console.log("\n--- most frequent differences ---");
for (const [k, v] of [...agg.entries()].sort((x, y) => y[1] - x[1]).slice(0, 60)) console.log(v, k);
