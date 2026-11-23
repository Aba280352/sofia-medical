/* Reviews carousel: one continuous position f, drag / arrows / autoplay.
   Values from the ANIMTD effect guest-rating-carousel-center, generalised to N cards. */
(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const track = root.querySelector(".sm-carousel__track");
  const cards = [...track.querySelectorAll(".sm-review")];
  const N = cards.length;
  const live = root.querySelector(".sm-carousel__live");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE = (t) => { // cubic-bezier(.22,1,.36,1) approximated by easeOutQuint-like curve
    const p = 1 - t; return 1 - p * p * p * p * p; };
  let f = 0, anim = null, playing = !reduce, hover = false, focusIn = false, dragging = false, timer = null;

  const slot = () => {
    const w = cards[0].offsetWidth;
    return matchMedia("(max-width: 1024px)").matches ? 0.86 * w : 360;
  };
  const wrap = (d) => ((d % N) + N * 1.5) % N - N / 2; // range -N/2 .. N/2

  function render() {
    const s = slot();
    const center = ((Math.round(f) % N) + N) % N;
    cards.forEach((c, i) => {
      const d = wrap(i - f);
      const ad = Math.abs(d), a = Math.min(ad, 1);
      const x = d * -s;                       // RTL: the next card is on the left
      const scale = reduce ? 1 : 1 - 0.2 * a;
      const op = ad <= 1 ? 1 - 0.55 * a : Math.max(0, 0.45 * (1.5 - ad) / 0.5);
      c.style.transform = reduce ? "none" : `translateX(${x}px) scale(${scale})`;
      c.style.opacity = reduce ? (i === center ? 1 : 0) : op;
      c.style.zIndex = String(Math.round(10 - ad * 4));
      c.style.visibility = op <= 0.001 && !reduce ? "hidden" : "visible";
      const isCenter = i === center;
      c.toggleAttribute("inert", !isCenter);
      c.setAttribute("aria-hidden", String(!isCenter));
    });
  }

  function animateTo(target) {
    cancelAnimationFrame(anim);
    const from = f, dist = Math.abs(target - from);
    const dur = reduce ? 150 : 200 + 300 * dist;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      f = from + (target - from) * (reduce ? t : EASE(t));
      render();
      if (t < 1) anim = requestAnimationFrame(step);
      else { f = target; render(); announce(); }
    };
    anim = requestAnimationFrame(step);
  }
  function announce() {
    const n = ((Math.round(f) % N) + N) % N + 1;
    if (live) live.textContent = `ביקורת ${n} מתוך ${N}`;
  }
  const next = () => animateTo(Math.round(f) + 1);
  const prev = () => animateTo(Math.round(f) - 1);

  /* autoplay */
  function schedule() {
    clearTimeout(timer);
    if (playing && !hover && !focusIn && !dragging) timer = setTimeout(() => { next(); schedule(); }, 5000);
  }
  root.addEventListener("mouseenter", () => { hover = true; schedule(); });
  root.addEventListener("mouseleave", () => { hover = false; schedule(); });
  root.addEventListener("focusin", () => { focusIn = true; schedule(); });
  root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) { focusIn = false; schedule(); } });
  root.querySelector("[data-next]").addEventListener("click", () => { next(); schedule(); });
  root.querySelector("[data-prev]").addEventListener("click", () => { prev(); schedule(); });
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); next(); }
    if (e.key === "ArrowRight") { e.preventDefault(); prev(); }
  });

  /* drag */
  let f0 = 0, startX = 0, moved = false, samples = [];
  track.addEventListener("pointerdown", (e) => {
    cancelAnimationFrame(anim);
    dragging = true; moved = false; f0 = f; startX = e.clientX; samples = [{ x: e.clientX, t: performance.now() }];
    track.setPointerCapture(e.pointerId); schedule();
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) { moved = true; track.classList.add("is-dragging"); }
    samples.push({ x: e.clientX, t: performance.now() });
    samples = samples.filter((s) => performance.now() - s.t < 100);
    if (moved && !reduce) { f = f0 + dx / slot(); render(); }
  });
  const end = (e) => {
    if (!dragging) return;
    dragging = false; track.classList.remove("is-dragging");
    const dx = e.clientX - startX;
    const first = samples[0] || { x: e.clientX, t: performance.now() };
    const v = (e.clientX - first.x) / Math.max(1, performance.now() - first.t);
    const delta = dx / slot();
    let stepN = Math.trunc(delta + Math.sign(delta) * 0.75);
    if (stepN === 0 && Math.abs(v) > 0.5) stepN = Math.sign(v);
    animateTo(f0 + (moved ? stepN : 0));
    schedule();
  };
  track.addEventListener("pointerup", end);
  track.addEventListener("pointercancel", end);

  // every card gets the height of the tallest review, so no text overflows
  function fit() {
    cards.forEach((c) => { c.style.height = "auto"; });
    const h = Math.max(...cards.map((c) => c.offsetHeight));
    cards.forEach((c) => { c.style.height = h + "px"; });
    track.style.height = h + "px";
  }
  addEventListener("resize", () => { fit(); render(); });
  document.fonts?.ready.then(() => { fit(); render(); });
  fit(); render(); schedule();
})();

/* Video testimonials: the big play button starts the video (files load only now) */
document.querySelectorAll(".sm-video").forEach((card) => {
  const v = card.querySelector("video"), b = card.querySelector(".sm-video__play");
  b.addEventListener("click", () => { card.classList.add("is-playing"); v.controls = true; v.play(); v.focus(); }); // native controls only once playing
  v.addEventListener("play", () => {
    card.classList.add("is-playing");
    document.querySelectorAll(".sm-video video").forEach((o) => { if (o !== v) o.pause(); });
  });
});
