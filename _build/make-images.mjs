// Crops and compresses site images into WebP.
// Usage: node make-images.mjs   (from site/_build)
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "../assets/img/hero";
mkdirSync(OUT, { recursive: true });

const save = async (input, file, opts) => {
  const info = await input.webp(opts).toFile(file);
  console.log(file, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
};

// Hero background (generated with GPT image, no people): desktop 16:9, mobile 9:16
for (const w of [1280, 1920, 2560]) {
  await save(sharp("src-img/hero-desktop.png").resize({ width: w }), `${OUT}/hero-clinic-${w}.webp`, { quality: 72, effort: 6 });
}
for (const w of [480, 768, 1080]) {
  await save(sharp("src-img/hero-mobile.png").resize({ width: w }), `${OUT}/hero-clinic-m-${w}.webp`, { quality: 72, effort: 6 });
}

// Clalit Mushlam badge (generated with GPT image), transparent, trimmed
for (const w of [160, 320]) {
  await save(sharp("src-img/badge-clalit.png").trim().resize({ width: w }), `${OUT}/badge-clalit-mushlam-${w}.webp`, { quality: 88, alphaQuality: 100, effort: 6 });
}

// Colour of the empty teal area, so the page background matches the photo edge
const d = await sharp("src-img/hero-desktop.png").extract({ left: 2400, top: 700, width: 40, height: 40 }).stats();
const m = await sharp("src-img/hero-mobile.png").extract({ left: 700, top: 200, width: 40, height: 40 }).stats();
const hex = (s) => "#" + s.channels.slice(0, 3).map((c) => Math.round(c.mean).toString(16).padStart(2, "0")).join("").toUpperCase();
console.log("desktop teal", hex(d), "mobile teal", hex(m));
