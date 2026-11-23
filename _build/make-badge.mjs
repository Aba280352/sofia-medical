// Cuts the white Clalit Mushlam disc out of its (fake checkerboard) background
// and saves it as a transparent WebP badge.
import sharp from "sharp";

const SRC = "src-img/badge-clalit-white.png";
const img = sharp(SRC).removeAlpha();
const { width: W, height: H } = await img.metadata();
const { data } = await img.raw().toBuffer({ resolveWithObject: true });
const white = (x, y) => { const i = (y * W + x) * 3; return data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245; };
// first/last x on the middle row where 60 pixels in a row are white = disc edge
const run = (x, y, dx) => { for (let k = 0; k < 60; k++) if (!white(x + dx * k, y)) return false; return true; };
const cy = Math.round(H / 2), cx = Math.round(W / 2);
let left = 0; while (left < W - 60 && !run(left, cy, 1)) left++;
let right = W - 1; while (right > 60 && !run(right, cy, -1)) right--;
let top = 0; { const col = (y) => { for (let k = 0; k < 60; k++) { const i = ((y + k) * W + cx) * 3; if (!(data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245)) return false; } return true; }; while (top < H - 60 && !col(top)) top++; }
const r = Math.floor((right - left) / 2) - 2;
const ccx = Math.round((left + right) / 2), ccy = top + r + 2;
console.log({ left, right, top, r, ccx, ccy });

const mask = Buffer.from(`<svg width="${W}" height="${H}"><circle cx="${ccx}" cy="${ccy}" r="${r}" fill="#fff"/></svg>`);
const masked = await sharp(SRC).removeAlpha().ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
const cut = await sharp(masked)
  .extract({ left: ccx - r, top: ccy - r, width: 2 * r, height: 2 * r })
  .png().toBuffer();

for (const w of [160, 320]) {
  const info = await sharp(cut).resize({ width: w }).webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(`../assets/img/hero/badge-clalit-mushlam-${w}.webp`);
  console.log(w, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
await sharp(cut).resize({ width: 400 }).png().toFile("src-img/badge-check.png");
