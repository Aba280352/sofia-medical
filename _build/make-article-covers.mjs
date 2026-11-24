// Article cover images (GPT 2.6 via Magnific, no people), 1344x752 source.
// Writes assets/img/articles/<slug>-1200.webp (cover, <=100KB) and -600.webp
// (cards). Source URLs are signed and expire; re-run only to rebuild.
// Run from _build: node make-article-covers.mjs
import sharp from "sharp";
import { mkdirSync, existsSync, statSync } from "node:fs";
const OUT = "../assets/img/articles";
mkdirSync(OUT, { recursive: true });
const P = "https://pikaso.cdnpk.net/private/production/";
const T = "?token=exp=1795737600~hmac=";
const COVERS = [
  ["ambulatory-rehabilitation", "6143974308", "c2452c741b58acf822183b536dec6754d169f07ba1e14df880f26857d169c82c"],
  ["sleep-disorders-driving", "6143973724", "91772d72ed68bc19e756cf7aa13ed38a7545b676766adf94d466253a2f3f44a9"],
  ["sofia-medical-clinic", "6143974931", "3231e3ca676ebc96ccad3e64382c9c7c11278029f8ead3730ad4d45abe6d8e52"],
  ["recoverix-stroke-rehabilitation", "6143975913", "1aa94d9c498c22576522985e8f4aa97251ed199ad99e71fe26cdbbf995b6f330"],
  ["lower-back-pain", "6143975674", "b56a7874a812409abea8bce1320bff84c5668a2477f09667450dbe892872a575"],
  ["chronic-pain", "6143976238", "5a9af85c34035c5fc9a1b6601db92310b7474a1ea6986f6493e9d5c4592505f9"],
  ["chronic-fatigue", "6143977540", "c72cb6e8e4333b0f87225e31b98a7d5a71291ca8829078de9fa7d7dc80b21c96"],
  ["sleep-lab", "6143977604", "6c746ae9f813fc24a8b642d677db27b2a66e0fe0a47447c14e233491f5bda1bd"],
  ["back-of-head-headache", "6143981923", "755b500d7e3d13f766d2985b8d832c6502c6ec8aac5301461765277ed3b7b230"],
  ["muscle-pain", "6143982467", "8cb8f55dd8bd316f13972ab7f295f3a44ebf065f7f135d2ac54af2189d80b6ce"],
  ["numbness-hands-feet", "6143982639", "9a43eb3e9ffc1416c75e24cec0bf3ce382bde55d8f03be2076af13c03dddb776"],
  ["medical-opinion", "6143983126", "ea13f48d6ecd1390f727cfdd24b8d7ec85f279e0b3c8e8fcb5cc05f2f569a7c8"],
  ["snoring-treatment", "6143983706", "a8c39e4a47aa044cb2eb0c228d7a2cba7b10d496c7f840bf3e6927788f4ff8f5"],
  ["snoring-solution", "6143984512", "298785b0652e1eff92eb75df22dbaa1ef651a8381d9d2954566c2b881dd5ce53"],
  ["sleep-apnea-treatment", "6143985005", "1737119cbacb91946e716f7492e6b1f03b671807f1a744d4bc09602cf8a2d1da"],
  ["muscle-weakness", "6143985500", "a3b93e28680d764f015b2472f238da324eb876eeeb66e777d96bff53c2bcae41"],
  ["back-pain-treatment", "6143989584", "d7a31c52cb93f5b42f8ec126612d0957b2deb417f082b0b0490eb538fdf17254"],
  ["neck-pain-treatment", "6143990833", "3e61c97271f2a682cbc9d2b938204ef4a5f4a8fba2a5434c2bdbfe577ef7e9c1"],
  ["nerve-pain-treatment", "6143991241", "e6ff5de32ab5c1245f655ba185e1cba582f4b59d30025a84f5425ad0639ec570"],
  ["enlarged-prostate", "6143991863", "f07613cf658d0c414d7ac847485dd00b3aab8742b36b50dc93ba4cc1efcf5a96"],
  ["vaginal-dryness", "6143992519", "b1f9e2cc05b91a21423030fb58ab469e85810e50d8c45942e4603b3868639c30"],
  ["erectile-dysfunction", "6143992598", "0e0800a32a9ee92d69a365a133c9aeb688959a4be53a1ce85939eb18569072ae"],
  ["physiotherapy", "6143993949", "c75b5e2136e94d48ddbeabcfc2808f4607974cd5604da67c070fc88656602cde"],
  ["sexual-rehabilitation", "6143993963", "462c76fa8c014e319a59ee84c4ebc80eb02b46fb6d5083521fe65cafb8541685"],
  ["pemf-pain-treatment", "6143997966", "b3fbdebafc20efcf96c3cf5ab572882127a6c941e5bfad8b54176d0a9f16c759"],
  ["sleep-disorder-signs", "6143998050", "625ed501e50960e9b84d8c1d46d85b251f105a723d256897174ee27ecbad0a26"],
  ["sleep-institute", "6143999145", "92c1ea6445123ae20ed7df6e24dc634976b367d6e4a504c8d0c96dd1f941ae86"],
  ["erectile-dysfunction-rehabilitation", "6143999752", "295e167eb44dba115ce27135244a90e982909ad58b6e8621f0b0355604e0bfb1"],
  ["chronic-pain-relief", "6144000201", "122d637d828540450dccccf88c6aa359696d69d1be25b65cd1079c24c4ef686a"],
];
export const COVER_SLUGS = COVERS.map((c) => c[0]);

if (import.meta.url.endsWith("make-article-covers.mjs") && process.argv[1]?.endsWith("make-article-covers.mjs")) {
  await Promise.all(COVERS.map(async ([slug, id, h]) => {
    if (existsSync(`${OUT}/${slug}-1200.webp`)) return;
    const buf = Buffer.from(await (await fetch(`${P}${id}/render.png${T}${h}`)).arrayBuffer());
    // keep each cover under 100KB: step the quality down until it fits
    for (const q of [74, 68, 62, 56, 50]) {
      await sharp(buf).resize(1200, 675, { fit: "cover" }).webp({ quality: q, effort: 6 }).toFile(`${OUT}/${slug}-1200.webp`);
      if (statSync(`${OUT}/${slug}-1200.webp`).size <= 100 * 1024) break;
    }
    await sharp(buf).resize(600, 338, { fit: "cover" }).webp({ quality: 70, effort: 6 }).toFile(`${OUT}/${slug}-600.webp`);
    console.log(slug, Math.round(statSync(`${OUT}/${slug}-1200.webp`).size / 1024) + "KB", Math.round(statSync(`${OUT}/${slug}-600.webp`).size / 1024) + "KB");
  }));
}
