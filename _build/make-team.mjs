// Downloads the real team portraits from the current site and crops them to 4:5 WebP.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const BASE = "https://files.cdn-files-a.com/uploads/9902251/";
const TEAM = [
  ["ala-mahamid", "1200_69048bfa02e84.png"],
  ["haitham-abu-nagma", "1200_69805e2cbf894.jpg"],
  ["yarona-shefer-yaakov", "1200_6935cebd7ec6c.jpg"],
  ["vlada-guizman", "1200_690475153be57.png"],
  ["mursi-asli", "1200_6904749b90ee9.png"],
  ["hashem-khalifa", "1200_69047469aaae2.png"],
];
mkdirSync("../assets/img/team", { recursive: true });
for (const [slug, file] of TEAM) {
  const buf = Buffer.from(await (await fetch(BASE + file)).arrayBuffer());
  const { width: w, height: h } = await sharp(buf).metadata();
  // 4:5 crop, keep the face high in the frame
  let cw = w, ch = Math.round(w * 5 / 4);
  if (ch > h) { ch = h; cw = Math.round(h * 4 / 5); }
  const left = Math.round((w - cw) / 2), top = Math.round(Math.min(h - ch, Math.max(0, (h - ch) * 0.25)));
  const info = await sharp(buf).extract({ left, top, width: cw, height: ch }).resize({ width: 480, height: 600, fit: "cover" })
    .webp({ quality: 78, effort: 6 }).toFile(`../assets/img/team/${slug}.webp`);
  console.log(slug, `${w}x${h}`, "->", `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
