// Paste into a page: returns every element that carries a static class, with its box and key styles.
(() => {
  document.documentElement.style.zoom = "";
  const out = [];
  const els = [...document.querySelectorAll("[class]")].filter((e) => [...e.classList].some((c) => /^(sm-|btn)/.test(c)) && !e.closest("#wpadminbar"));
  const sx = scrollX, sy = scrollY;
  for (const e of els) {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    const own = [...e.classList].filter((c) => /^(sm-|btn|is-|hl$)/.test(c)).sort().join(".");
    out.push([own, Math.round(r.left + sx), Math.round(r.top + sy), Math.round(r.width), Math.round(r.height), cs.display, cs.fontSize, cs.color, cs.backgroundColor, cs.position]);
  }
  return { h: document.documentElement.scrollHeight, w: innerWidth, n: out.length, out };
})()
