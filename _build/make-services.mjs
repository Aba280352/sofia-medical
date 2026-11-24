// Product photos for the service pages, from the current site (devices only,
// no people). Run from _build: node make-services.mjs
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
const BASE = "https://files.cdn-files-a.com/uploads/9902251/";
const OUT = "../assets/img/services";
mkdirSync(OUT, { recursive: true });
const JOBS = [
  ["pemf-device", "normal_69f226a52ba9b.jpg", [900, 1400], 4 / 3],
  ["cpap-device", "2000_690c89679281e.png", [528], 0],
  ["oxygen-igo2", "2000_690c89840c337.png", [696], 0],
];
for (const [slug, file, widths, ratio] of JOBS) {
  if (existsSync(`${OUT}/${slug}-${widths[0]}.webp`)) continue;
  const buf = Buffer.from(await (await fetch(BASE + file)).arrayBuffer());
  for (const w of widths) {
    const img = sharp(buf).flatten({ background: "#ffffff" });
    const r = ratio ? img.resize({ width: w, height: Math.round(w / ratio), fit: "cover" }) : img.resize({ width: w, withoutEnlargement: true });
    const info = await r.webp({ quality: 80, effort: 6 }).toFile(`${OUT}/${slug}-${w}.webp`);
    console.log(slug, w, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB");
  }
}
