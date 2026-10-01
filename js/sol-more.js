(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function finish(panel, fn) {
    if (reduce) {
      fn();
      return;
    }
    function onEnd(event) {
      if (event.target !== panel || event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onEnd);
      fn();
    }
    panel.addEventListener("transitionend", onEnd);
  }

  function openPanel(details, panel) {
    details.open = true;
    details.classList.add("is-open");
    if (reduce) {
      panel.style.height = "auto";
      return;
    }
    panel.style.height = "0px";
    var target = panel.scrollHeight;
    panel.offsetHeight;
    panel.style.height = target + "px";
    finish(panel, function () {
      if (details.classList.contains("is-open")) panel.style.height = "auto";
    });
  }

  function closePanel(details, panel) {
    details.classList.remove("is-open");
    if (reduce) {
      panel.style.height = "0px";
      details.open = false;
      return;
    }
    panel.style.height = panel.scrollHeight + "px";
    panel.offsetHeight;
    panel.style.height = "0px";
    finish(panel, function () {
      if (!details.classList.contains("is-open")) details.open = false;
    });
  }

  document.querySelectorAll(".sol-tile details.sol-more").forEach(function (details) {
    var summary = details.querySelector("summary");
    var panel = details.querySelector(".sol-more-panel");
    if (!summary || !panel) return;

    summary.addEventListener("click", function (event) {
      event.preventDefault();
      if (details.classList.contains("is-open")) closePanel(details, panel);
      else openPanel(details, panel);
    });
  });
})();
