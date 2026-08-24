(function () {
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dotsWrap = root.querySelector("[data-hero-dots]");
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var brand = root.querySelector("[data-hero-brand]");
    var title = root.querySelector("[data-hero-title]");
    var lead = root.querySelector("[data-hero-lead]");
    var cta = root.querySelector("[data-hero-cta]");
    var inner = root.querySelector("[data-hero-inner]");
    var copy = root.querySelector(".hero-copy");
    if (!slides.length) return;

    var i = 0;
    var timer;
    var fading = false;
    var fadeTimer;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var FADE_MS = 380;

    function applyCopy(slide) {
      if (brand) brand.textContent = slide.getAttribute("data-brand") || "Connects";
      if (title) {
        var rawTitle = slide.getAttribute("data-title") || "";
        title.innerHTML = rawTitle.replace(/\n/g, "<br>");
      }
      if (lead) lead.textContent = slide.getAttribute("data-lead") || "";
      if (cta) {
        var href = slide.getAttribute("data-cta-href");
        var label = slide.getAttribute("data-cta-label");
        if (href) cta.setAttribute("href", href);
        if (label) cta.textContent = label;
      }
      if (inner) inner.classList.remove("is-right");
      slides.forEach(function (s) {
        s.classList.remove("align-right");
      });
    }

    function renderSlides() {
      slides.forEach(function (s, idx) {
        s.classList.toggle("is-active", idx === i);
      });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, idx) {
          d.classList.toggle("is-active", idx === i);
        });
      }
    }

    function swapCopy() {
      applyCopy(slides[i]);
      if (!copy || reduceMotion) return;
      // force reflow so fade-in always runs after content swap
      void copy.offsetWidth;
      copy.classList.remove("is-fading");
    }

    function render(animate) {
      renderSlides();
      if (!animate || !copy || reduceMotion) {
        if (copy) copy.classList.remove("is-fading");
        applyCopy(slides[i]);
        fading = false;
        return;
      }
      window.clearTimeout(fadeTimer);
      fading = true;
      copy.classList.add("is-fading");
      fadeTimer = window.setTimeout(function () {
        swapCopy();
        fading = false;
      }, FADE_MS);
    }

    function go(n) {
      var nextIndex = (n + slides.length) % slides.length;
      if (nextIndex === i && fading) return;
      i = nextIndex;
      render(true);
      restart();
    }

    function restart() {
      window.clearInterval(timer);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setInterval(function () {
        go(i + 1);
      }, 6500);
    }

    if (dotsWrap) {
      slides.forEach(function (_, idx) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Ir al slide " + (idx + 1));
        b.addEventListener("click", function () {
          go(idx);
        });
        dotsWrap.appendChild(b);
      });
    }

    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });

    render(false);
    restart();
  }

  function initOfferDialog() {
    var dialog = document.querySelector("[data-offer-dialog]");
    if (!dialog) return;
    var panels = Array.prototype.slice.call(dialog.querySelectorAll("[data-offer-panel]"));
    var closeBtn = dialog.querySelector("[data-offer-close]");

    function openOffer(key) {
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-offer-panel") !== key;
      });
      if (typeof dialog.showModal === "function") dialog.showModal();
    }

    document.querySelectorAll("[data-offer]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openOffer(btn.getAttribute("data-offer"));
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        dialog.close();
      });
    }

    dialog.addEventListener("click", function (event) {
      var rect = dialog.getBoundingClientRect();
      var outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside || event.target === dialog) dialog.close();
    });
  }

  function boot() {
    initReveal();
    initHero();
    initOfferDialog();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
