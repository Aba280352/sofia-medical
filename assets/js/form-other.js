/* Lead forms: "Other" (the last option of the treatment list) shows a free text field. */
(() => {
  const sync = (sel) => {
    const field = sel.form && sel.form.querySelector(".sm-form__other");
    if (!field) return;
    const on = sel.selectedIndex > 0 && sel.selectedIndex === sel.options.length - 1;
    field.classList.toggle("is-on", on);
    const input = field.querySelector("input");
    if (!on && input) input.value = "";
    return on && input;
  };
  document.querySelectorAll("form select[name='topic']").forEach((sel) => {
    sync(sel);
    sel.addEventListener("change", () => { const input = sync(sel); if (input) input.focus(); });
  });
})();
