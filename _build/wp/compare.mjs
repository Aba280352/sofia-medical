// node compare.mjs static.json wp.json [tolerance]
import fs from "fs";
const [a, b] = [process.argv[2], process.argv[3]].map((f) => JSON.parse(fs.readFileSync(f, "utf8")));
const tol = +(process.argv[4] || 2);
console.log("page height static", a.h, "wp", b.h, "| elements", a.out.length, b.out.length);
const sig = (x) => x[0].replace(/\.?is-[\w-]+/g, "");
let i = 0, j = 0, shown = 0, diffs = 0;
const F = ["x", "y", "w", "h"];
while (i < a.out.length && j < b.out.length) {
  const A = a.out[i], B = b.out[j];
  if (sig(A) !== sig(B)) {
    // look ahead for resync
    let k = b.out.slice(j, j + 40).findIndex((x) => sig(x) === sig(A));
    let l = a.out.slice(i, i + 40).findIndex((x) => sig(x) === sig(B));
    if (k > 0 && (l < 0 || k <= l)) { if (shown++ < 60) console.log("  WP extra:", b.out.slice(j, j + k).map(sig).join(" | ")); j += k; continue; }
    if (l > 0) { if (shown++ < 60) console.log("  WP missing:", a.out.slice(i, i + l).map(sig).join(" | ")); i += l; continue; }
    if (shown++ < 60) console.log("  mismatch", sig(A), "vs", sig(B)); i++; j++; continue;
  }
  const d = [];
  for (let f = 1; f <= 4; f++) if (Math.abs(A[f] - B[f]) > tol) d.push(`${F[f - 1]} ${A[f]}→${B[f]}`);
  for (let f = 5; f < A.length; f++) if (A[f] !== B[f]) d.push(`${["display", "font", "color", "bg", "pos", "weight", "lh"][f - 5]} ${A[f]}→${B[f]}`);
  if (d.length) { diffs++; if (shown++ < 120) console.log(sig(A), "::", d.join("; ")); }
  i++; j++;
}
console.log("diff elements:", diffs);
