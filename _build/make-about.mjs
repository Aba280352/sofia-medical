// About page images. Usage: node make-about.mjs (from site/_build)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const OUT = "../assets/img/about";
mkdirSync(OUT, { recursive: true });
// Real photo of Dr. Ala at his desk (from the current site), cropped 4:3 around him
for (const w of [640, 960, 1400]) {
  const info = await sharp("src-img/ala-desk.png").extract({ left: 200, top: 134, width: 1600, height: 1200 }).resize({ width: w })
    .webp({ quality: 74, effort: 6 }).toFile(`${OUT}/dr-ala-mahamid-desk-${w}.webp`);
  console.log(w, info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
}

// Second real portrait of Dr. Ala (from the current site), 4:5 for the credo section
{
  const buf = Buffer.from(await (await fetch("https://files.cdn-files-a.com/uploads/9902251/1200_69048bfa02e84.png")).arrayBuffer());
  const { width: w, height: h } = await sharp(buf).metadata();
  let cw = w, ch = Math.round(w * 5 / 4);
  if (ch > h) { ch = h; cw = Math.round(h * 4 / 5); }
  const left = Math.round((w - cw) / 2), top = Math.round(Math.min(h - ch, Math.max(0, (h - ch) * 0.25)));
  for (const pw of [440, 720]) {
    const info = await sharp(buf).extract({ left, top, width: cw, height: ch }).resize({ width: pw, height: Math.round(pw * 5 / 4), fit: "cover" })
      .webp({ quality: 76, effort: 6 }).toFile(`${OUT}/dr-ala-mahamid-portrait-${pw}.webp`);
    console.log("portrait", `${w}x${h}`, info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
  }
}
