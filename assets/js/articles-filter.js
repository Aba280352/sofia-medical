/* Articles listing: filter cards by treatment area. Without JS the filter
   stays hidden and every article is shown. */
(() => {
  const root = document.querySelector("[data-arts]");
  if (!root) return;
  const bar = root.querySelector(".sm-arts__filter");
  const btns = [...bar.querySelectorAll("[data-topic]")];
  const cards = [...root.querySelectorAll(".sm-art")];
  const count = root.querySelector(".sm-arts__count");
  bar.hidden = false;
  const apply = (topic) => {
    btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.topic === topic)));
    let n = 0;
    cards.forEach((c) => { const on = topic === "all" || c.dataset.topic === topic; c.hidden = !on; if (on) n++; });
    count.textContent = topic === "all" ? "" : `${n} מאמרים`;
  };
  btns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.topic)));
})();
