(function () {
  function qs(s, r) {
    return (r || document).querySelector(s);
  }
  function qsa(s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  }

  function closeDrawer() {
    var drawer = qs("[data-nav-drawer]");
    var burger = qs("[data-nav-burger]");
    if (drawer) drawer.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    qsa("[data-nav-sub]").forEach(function (item) {
      item.classList.remove("is-open");
    });
  }

  function isDesktop() {
    return window.matchMedia("(min-width: 1100px)").matches;
  }

  function init() {
    var header = qs("[data-site-header]");
    var burger = qs("[data-nav-burger]");
    var drawer = qs("[data-nav-drawer]");

    if (burger && drawer) {
      burger.addEventListener("click", function () {
        var open = !drawer.classList.contains("is-open");
        if (open) {
          drawer.classList.add("is-open");
          burger.setAttribute("aria-expanded", "true");
          document.body.classList.add("nav-open");
        } else {
          closeDrawer();
        }
      });
    }

    /* Mobile accordion only — desktop uses pure CSS hover */
    qsa("[data-nav-sub] > .nav-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (isDesktop()) return;
        var item = link.closest("[data-nav-sub]");
        if (!item) return;
        e.preventDefault();
        var willOpen = !item.classList.contains("is-open");
        qsa("[data-nav-sub]").forEach(function (other) {
          if (other !== item) other.classList.remove("is-open");
        });
        item.classList.toggle("is-open", willOpen);
      });
    });

    if (drawer) {
      drawer.addEventListener("click", function (e) {
        var a = e.target.closest("a[href]");
        if (a && !a.classList.contains("nav-link") && !isDesktop()) closeDrawer();
        if (a && a.classList.contains("nav-link") && !a.closest("[data-nav-sub]") && !isDesktop()) {
          closeDrawer();
        }
        if (a && a.classList.contains("nav-cta-link")) closeDrawer();
      });
    }

    window.addEventListener("resize", function () {
      if (isDesktop()) closeDrawer();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var path = location.pathname.replace(/\\/g, "/").toLowerCase();
    qsa("[data-nav]").forEach(function (el) {
      var key = el.getAttribute("data-nav");
      if (key && path.indexOf("/" + key) !== -1) el.classList.add("is-active");
      if (key === "soluciones" && path.indexOf("/productos") !== -1) el.classList.add("is-active");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
