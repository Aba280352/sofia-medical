/* Rotating hero image (services page): one image per treatment area,
   crossfade every 5s, caption link follows the image. Pauses on hover and
   keyboard focus, has a pause button (WCAG 2.2.2), and does not autoplay
   when the user prefers reduced motion. */
(() => {
  const root = document.querySelector("[data-rot]");
  if (!root) return;
  const imgs = [...root.querySelectorAll(".sm-rot__img")];
  const links = [...root.querySelectorAll(".sm-rot__link")];
  const dots = [...root.querySelectorAll(".sm-rot__dot")];
  const btn = root.querySelector(".sm-rot__pause");
  const DELAY = 5000;
  let cur = 0, timer = 0, hold = false;
  let stopped = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (n) => {
    cur = (n + imgs.length) % imgs.length;
    imgs.forEach((el, i) => el.classList.toggle("is-on", i === cur));
    links.forEach((el, i) => { el.hidden = i !== cur; });
    dots.forEach((el, i) => i === cur ? el.setAttribute("aria-current", "true") : el.removeAttribute("aria-current"));
  };
  const tick = () => { if (!stopped && !hold && !document.hidden) show(cur + 1); };
  const start = () => { clearInterval(timer); timer = setInterval(tick, DELAY); };
  const setStopped = (v) => {
    stopped = v;
    btn.setAttribute("aria-pressed", String(v));
    btn.setAttribute("aria-label", v ? "הפעלת החלפת התמונות" : "עצירת החלפת התמונות");
    root.classList.toggle("is-stopped", v);
  };

  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); start(); }));
  btn.addEventListener("click", () => { setStopped(!stopped); start(); });
  root.addEventListener("pointerenter", () => { hold = true; });
  root.addEventListener("pointerleave", () => { hold = false; });
  root.addEventListener("focusin", () => { hold = true; });
  root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) hold = false; });

  setStopped(stopped);
  start();
})();
