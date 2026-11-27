// Outlet logos for /בתקשורת (2026-11-27, approved by Dr. Alaa).
// Every logo becomes the same 128x128 square (shown at 64px): logos with their own
// background fill the square, transparent ones sit on white with the same margin.
// usage: node make-media-logos.mjs <folder with the downloaded originals>
import sharp from "sharp";
import { join } from "path";
import { mkdirSync } from "fs";

const SRC = process.argv[2];
const OUT = join(import.meta.dirname, "..", "assets", "img", "media");
mkdirSync(OUT, { recursive: true });
const S = 128;
const WHITE = { r: 254, g: 254, b: 254, alpha: 1 };

// fill: crop (optional) and cover the square; pad: fit inside S - 2*pad on white
const LOGOS = {
  tzomet: { file: "tzomet.png", mode: "fill" },
  n12: { file: "n12-commons.jpg", mode: "fill", crop: { left: 0, top: 0, width: 150, height: 134 }, bg: "edge" },
  "13tv": { file: "13tv.png", mode: "fill" },
  kan: { file: "kan-ipbc.png", mode: "pad", pad: 20 },
  ynet: { file: "ynet-commons.png", mode: "pad", pad: 10, crop: { left: 0, top: 0, width: 412, height: 412 } },
  mako: { file: "mako-commons.png", mode: "fill", crop: { left: 57, top: 50, width: 300, height: 300 } },
  bhol: { file: "bhol.png", mode: "pad", pad: 22 },
  raanana: { file: "raanana.jpg", mode: "fill", crop: { left: 26, top: 20, width: 140, height: 140 } },
  instagram: { file: "instagram.png", mode: "pad", pad: 10 },
};

for (const [key, L] of Object.entries(LOGOS)) {
  let img = sharp(join(SRC, L.file)).flatten({ background: WHITE });
  if (L.crop) img = img.extract(L.crop);
  let buf;
  if (L.mode === "fill" && L.bg === "edge") {
    // keep the whole mark: fit inside, extend with the logo's own background colour
    const { data } = await sharp(await img.toBuffer()).extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    buf = await sharp(await img.toBuffer()).resize(S, S, { fit: "contain", background: { r: data[0], g: data[1], b: data[2], alpha: 1 } }).webp({ quality: 92 }).toBuffer();
  } else if (L.mode === "fill") {
    buf = await img.resize(S, S, { fit: "cover" }).webp({ quality: 92 }).toBuffer();
  } else {
    const inner = S - 2 * L.pad;
    const mark = await img.resize(inner, inner, { fit: "contain", background: WHITE }).toBuffer();
    buf = await sharp({ create: { width: S, height: S, channels: 4, background: WHITE } })
      .composite([{ input: mark, gravity: "centre" }]).webp({ quality: 92 }).toBuffer();
  }
  await sharp(buf).toFile(join(OUT, `${key}-128.webp`));
  console.log(key, buf.length);
}
