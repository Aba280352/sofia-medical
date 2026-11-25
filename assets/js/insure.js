/* Insurance arrangements.
   1. Home hero seal: flips between Clalit Mushlam and BWell every 5s.
      Pauses on hover and keyboard focus, the bars pick one, and it does not
      autoplay when the user prefers reduced motion.
   2. Floating strip: shows after the first screen, closes for the session,
      never on the contact page. */
(() => {
  const root = document.querySelector("[data-insure]");
  if (root) {
    const slides = [...root.querySelectorAll("[data-insure-slide]")];
    const dots = [...root.querySelectorAll(".sm-insure__dot")];
    const stopped = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, hold = false, timer = 0;
    const show = (n) => {
      cur = (n + slides.length) % slides.length;
      slides.forEach((el, i) => el.classList.toggle("is-on", i === cur));
      dots.forEach((el, i) => el.setAttribute("aria-pressed", String(i === cur)));
    };
    const start = () => { clearInterval(timer); if (!stopped) timer = setInterval(() => { if (!hold && !document.hidden) show(cur + 1); }, 5000); };
    dots.forEach((d, i) => d.addEventListener("click", () => { show(i); start(); }));
    root.addEventListener("pointerenter", () => { hold = true; });
    root.addEventListener("pointerleave", () => { hold = false; });
    root.addEventListener("focusin", () => { hold = true; });
    root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) hold = false; });
    start();
  }

  const strip = document.querySelector("[data-istrip]");
  if (!strip) return;
  const KEY = "sm-istrip-closed";
  let closed = false;
  try { closed = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  if (closed || decodeURIComponent(location.pathname).includes("/צור-קשר")) return;
  strip.hidden = false;
  const update = () => {
    const on = scrollY > innerHeight * 0.6;
    strip.classList.toggle("is-on", on);
    document.documentElement.classList.toggle("sm-istrip-on", on);
    strip.inert = !on;
  };
  addEventListener("scroll", update, { passive: true });
  update();
  strip.querySelector(".sm-istrip__close").addEventListener("click", () => {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    removeEventListener("scroll", update);
    strip.classList.remove("is-on");
    document.documentElement.classList.remove("sm-istrip-on");
    setTimeout(() => { strip.hidden = true; }, 300);
  });
})();
