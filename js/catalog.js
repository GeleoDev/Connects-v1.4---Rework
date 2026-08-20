(function () {
  function initCatalog(root) {
    var filters = root.querySelector("[data-catalog-filters]");
    var grid = root.querySelector("[data-catalog]");
    if (!filters || !grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll("[data-category]"));
    var empty = root.querySelector("[data-catalog-empty]");

    function apply(filter) {
      var visible = 0;
      items.forEach(function (item) {
        var cats = (item.getAttribute("data-category") || "")
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        item.classList.toggle("is-filtered-out", !show);
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
    }

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var filter = (btn.getAttribute("data-filter") || "all").toLowerCase();
      Array.prototype.forEach.call(filters.querySelectorAll("[data-filter]"), function (chip) {
        var active = chip === btn;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
      });
      apply(filter);
    });
  }

  function boot() {
    document.querySelectorAll("[data-catalog-root]").forEach(initCatalog);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
