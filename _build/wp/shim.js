/* ===== WordPress shim: what the static pages had in markup ===== */
(() => {
  // current page in the menus (the header is one shared template)
  const here = decodeURI(location.pathname).replace(/\/+$/, "") || "/";
  document.querySelectorAll(".sm-nav__link, .sm-drawer__nav a, .sm-dropdown a, .sm-footer__links a").forEach((a) => {
    const p = decodeURI(new URL(a.href, location.href).pathname).replace(/\/+$/, "") || "/";
    if (p === here) a.setAttribute("aria-current", "page"); else if (a.getAttribute("aria-current") === "page") a.removeAttribute("aria-current");
  });
  // <details>/<summary> are div.t-details/div.t-summary in Elementor
  const toggle = (s) => {
    const d = s.closest(".t-details");
    if (!d) return;
    const open = !d.hasAttribute("open");
    if (open) d.setAttribute("open", ""); else d.removeAttribute("open");
    s.setAttribute("aria-expanded", String(open));
    d.dispatchEvent(new Event("toggle"));
  };
  document.addEventListener("click", (e) => { const s = e.target.closest(".t-summary"); if (s && !e.target.closest("a")) toggle(s); });
  document.addEventListener("keydown", (e) => {
    const s = e.target.closest?.(".t-summary");
    if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(s); }
  });
})();
