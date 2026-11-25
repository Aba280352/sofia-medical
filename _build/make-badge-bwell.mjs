// BWell (Migdal) logo on a white disc, same size and feel as the Clalit Mushlam badge.
import sharp from "sharp";
const SRC = "src-img/bwell-logo.png";
const logo = await sharp(SRC).flatten({ background: "#ffffff" }).extract({ left: 139, top: 435, width: 974, height: 388 }).png().toBuffer(); // bbox of the logo
const D = 640, inner = Math.round(D * 0.8);
const fitted = await sharp(logo).resize({ width: inner }).png().toBuffer();
const { height: lh } = await sharp(fitted).metadata();
const disc = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`);
const out = await sharp(disc).composite([{ input: fitted, left: Math.round((D - inner) / 2), top: Math.round((D - lh) / 2) }]).png().toBuffer();
for (const w of [160, 320]) {
  const info = await sharp(out).resize({ width: w }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(`../assets/img/hero/badge-bwell-${w}.webp`);
  console.log(w, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
