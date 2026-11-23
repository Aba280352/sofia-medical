/* Header behaviour: dropdowns, mobile drawer, sticky shadow. No dependencies. */
(() => {
  const header = document.getElementById("sm-header");
  if (!header) return;

  /* ---------- Dropdowns (submenu, language) ---------- */
  const dropdowns = [...document.querySelectorAll("[data-dropdown]")];
  const closeAll = (except) => dropdowns.forEach((d) => {
    if (d === except) return;
    d.classList.remove("is-open");
    const b = d.querySelector(":scope > button");
    if (b) b.setAttribute("aria-expanded", "false");
  });

  dropdowns.forEach((d) => {
    const btn = d.querySelector(":scope > button");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !d.classList.contains("is-open");
      closeAll(d);
      d.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (open) d.querySelector(".sm-dropdown a")?.focus({ preventScroll: true });
    });
    // Keyboard: leaving the dropdown closes it
    d.addEventListener("focusout", (e) => {
      if (!d.contains(e.relatedTarget)) {
        d.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown]")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = dropdowns.find((d) => d.classList.contains("is-open"));
    if (open) { closeAll(); open.querySelector(":scope > button")?.focus(); }
  });

  /* ---------- Sticky shadow (no scroll listener) ---------- */
  // The contact strip above the header scrolls away; once it is out of view the header is stuck.
  const topbar = document.querySelector(".sm-topbar");
  if (topbar) {
    new IntersectionObserver(([en]) => header.classList.toggle("is-stuck", !en.isIntersecting))
      .observe(topbar);
  }

  /* ---------- Mobile drawer ---------- */
  const drawer = document.getElementById("sm-drawer");
  const burger = header.querySelector(".sm-burger");
  if (!drawer || !burger) return;
  const panel = drawer.querySelector(".sm-drawer__panel");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocus = null;

  const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')]
    .filter((el) => el.offsetParent !== null);

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.documentElement.classList.add("sm-lock");
    burger.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add("is-open")));
    drawer.querySelector(".sm-drawer__close").focus({ preventScroll: true });
  }
  function close() {
    drawer.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("sm-lock");
    const done = () => { drawer.hidden = true; };
    if (reduce) done(); else panel.addEventListener("transitionend", done, { once: true });
    (lastFocus || burger).focus({ preventScroll: true });
  }

  burger.addEventListener("click", open);
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
  drawer.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Sub lists inside the drawer
  drawer.querySelectorAll(".sm-drawer__sub-btn").forEach((b) => {
    b.addEventListener("click", () => {
      const list = document.getElementById(b.getAttribute("aria-controls"));
      const openNow = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(openNow));
      list.hidden = !openNow;
    });
  });

  // Close the drawer if the screen grows to desktop
  matchMedia("(min-width: 1025px)").addEventListener("change", (m) => {
    if (m.matches && !drawer.hidden) close();
  });
})();
