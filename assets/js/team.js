/* Team grid: highlight one portrait and swap the caption in clipping windows.
   Values from the ANIMTD effect team-grid-focus-blur. */
(() => {
  const root = document.querySelector("[data-team]");
  if (!root) return;
  const list = root.querySelector(".sm-team__list");
  const people = [...list.querySelectorAll(".sm-person")];
  const cap = root.querySelector(".sm-team__cap");
  const wins = { name: cap.querySelector(".sm-team__win--name"), role: cap.querySelector(".sm-team__win--role"), line: cap.querySelector(".sm-team__win--line") };
  const idle = { name: "", role: "", line: cap.dataset.idle };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE_OUT = "cubic-bezier(.22,1,.36,1)", EASE_IN = "cubic-bezier(.4,0,1,1)";
  const DELAY = { name: 60, role: 100, line: 140 };
  let current = null, resetTimer = null;

  function swap(key, text) {
    const win = wins[key];
    const old = win.querySelector("span:not(.is-out)");
    if (old && old.textContent === text) return;
    const next = document.createElement("span");
    next.textContent = text;
    if (reduce) { win.replaceChildren(next); return; }
    if (old) {
      const from = getComputedStyle(old).transform; // continue from where it is
      old.classList.add("is-out"); old.setAttribute("aria-hidden", "true");
      old.getAnimations().forEach((a) => a.cancel());
      old.animate([{ transform: from === "none" ? "translateY(0)" : from }, { transform: "translateY(-100%)" }],
        { duration: 260, easing: EASE_IN, fill: "forwards" });
      setTimeout(() => old.remove(), 280); // remove even if the tab is in the background and animations are paused
    }
    win.querySelectorAll("span.is-out").forEach((s) => { if (s !== old) s.remove(); });
    win.appendChild(next);
    next.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
      { duration: 420, delay: DELAY[key], easing: EASE_OUT, fill: "backwards" });
  }

  function show(data, isIdle) {
    cap.classList.toggle("is-idle", isIdle);
    swap("name", data.name); swap("role", data.role); swap("line", data.line);
  }

  function select(btn) {
    clearTimeout(resetTimer);
    if (current === btn) return;
    current = btn;
    list.classList.add("has-focus");
    people.forEach((p) => p.setAttribute("aria-pressed", String(p === btn)));
    show({ name: btn.dataset.name, role: btn.dataset.role, line: btn.dataset.line }, false);
  }
  function reset(now) {
    clearTimeout(resetTimer);
    const run = () => {
      current = null;
      list.classList.remove("has-focus");
      people.forEach((p) => p.setAttribute("aria-pressed", "false"));
      show(idle, true);
    };
    if (now) run(); else resetTimer = setTimeout(run, 150);
  }

  const touch = matchMedia("(hover: none)");
  people.forEach((btn) => {
    btn.addEventListener("mouseenter", () => { if (!touch.matches) select(btn); });
    btn.addEventListener("mouseleave", () => { if (!touch.matches) reset(); });
    btn.addEventListener("focus", () => select(btn));
    btn.addEventListener("blur", (e) => { if (!list.contains(e.relatedTarget)) reset(); });
    // tap: first tap selects, a second tap on the same portrait resets
    btn.addEventListener("click", () => { if (current === btn && touch.matches) reset(true); else select(btn); });
  });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape") reset(true); });
  show(idle, true);
})();
