/* Single article: copy-link share button and the "more articles" carousel
   (arrows scroll one card, disabled at the ends; the track also scrolls by
   touch and keyboard). RTL: "next" moves toward the left. */
(() => {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const box = btn.closest(".sm-share");
      const done = box && box.querySelector(".sm-share__done");
      try { await navigator.clipboard.writeText(btn.dataset.copy); } catch (e) { return; }
      if (done) { done.textContent = "הקישור הועתק"; setTimeout(() => { done.textContent = ""; }, 2500); }
    });
  });

  const rel = document.querySelector("[data-rel]");
  if (!rel) return;
  const track = rel.querySelector(".sm-rel__track");
  const prev = rel.querySelector("[data-dir='-1']");
  const next = rel.querySelector("[data-dir='1']");
  const step = () => { const c = track.querySelector(".sm-rel__item"); return c ? c.getBoundingClientRect().width + 20 : 300; };
  const rtl = getComputedStyle(track).direction === "rtl";
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const pos = Math.abs(track.scrollLeft);
    prev.disabled = pos <= 2;
    next.disabled = pos >= max - 2;
    rel.classList.toggle("is-static", max <= 2);
  };
  [prev, next].forEach((b) => b.addEventListener("click", () => {
    const dir = +b.dataset.dir;
    track.scrollBy({ left: (rtl ? -1 : 1) * dir * step(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }));
  track.addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();
