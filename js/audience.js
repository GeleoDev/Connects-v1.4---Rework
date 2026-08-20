(function () {
  var KEY = "connects-audience";

  function get() {
    return localStorage.getItem(KEY) || "empresas";
  }

  function syncButtons(a) {
    document.querySelectorAll("[data-audience-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-audience-btn") === a));
    });
  }

  function apply(a) {
    document.documentElement.dataset.audience = a;
    document.querySelectorAll("[data-copy-empresas]").forEach(function (el) {
      var t = a === "individuos" ? el.getAttribute("data-copy-individuos") : el.getAttribute("data-copy-empresas");
      if (t != null) el.textContent = t;
    });
    document.querySelectorAll("[data-html-empresas]").forEach(function (el) {
      var t = a === "individuos" ? el.getAttribute("data-html-individuos") : el.getAttribute("data-html-empresas");
      if (t != null) el.innerHTML = t;
    });
    document.querySelectorAll("[data-img-empresas]").forEach(function (el) {
      var s = a === "individuos" ? el.getAttribute("data-img-individuos") : el.getAttribute("data-img-empresas");
      if (s) el.setAttribute("src", s);
    });
    syncButtons(a);
  }

  function set(a) {
    a = a === "individuos" ? "individuos" : "empresas";
    localStorage.setItem(KEY, a);
    document.body.classList.add("is-swapping");
    apply(a);
    window.setTimeout(function () {
      document.body.classList.remove("is-swapping");
    }, 180);
    window.dispatchEvent(new CustomEvent("connects:audience", { detail: { audience: a } }));
  }

  function bind() {
    document.querySelectorAll("[data-audience-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        set(btn.getAttribute("data-audience-btn"));
      });
    });
  }

  function init() {
    apply(get());
    bind();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.ConnectsAudience = { get: get, set: set, apply: apply };
})();
