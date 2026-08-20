(function () {
  function initDrops() {
    document.querySelectorAll("[data-pd-drop]").forEach(function (drop) {
      var btn = drop.querySelector(".pd-drop-toggle");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var open = drop.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDrops);
  } else {
    initDrops();
  }
})();
