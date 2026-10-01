(function () {
  var BATTERY_WH = 5120;
  var EFFICIENCY = 0.93;
  var USABLE_WH = Math.round(BATTERY_WH * EFFICIENCY);
  var MAX_W = 5200;
  var ARC_R = 52;
  var ARC_C = 2 * Math.PI * ARC_R;
  var DAY_H = 24;

  var CATALOG = [
    {
      id: "ac-3000",
      name: "Aire split ~3000 frigorías",
      group: "clima",
      icon: "fa-snowflake",
      variants: [
        { label: "Estándar", runW: 1400, factor: 0.7 },
        { label: "Inverter", runW: 850, factor: 1 }
      ]
    },
    {
      id: "ac-4500",
      name: "Aire split ~4500 frigorías",
      group: "clima",
      icon: "fa-fan",
      variants: [
        { label: "Estándar", runW: 2000, factor: 0.7 },
        { label: "Inverter", runW: 1200, factor: 1 }
      ]
    },
    {
      id: "heladera",
      name: "Heladera no frost",
      group: "frio",
      icon: "fa-temperature-low",
      variants: [
        { label: "Estándar", runW: 150, factor: 55 / 150 },
        { label: "Inverter", runW: 90, factor: 40 / 90 }
      ]
    },
    {
      id: "freezer",
      name: "Freezer",
      group: "frio",
      icon: "fa-icicles",
      variants: [
        { label: "Estándar", runW: 180, factor: 70 / 180 },
        { label: "Inverter", runW: 110, factor: 45 / 110 }
      ]
    },
    {
      id: "tv",
      name: "Televisor LED 55\"",
      group: "trabajo",
      icon: "fa-tv",
      variants: [{ label: "Estándar", runW: 110, factor: 1 }]
    },
    {
      id: "notebook",
      name: "Notebook",
      group: "trabajo",
      icon: "fa-laptop",
      variants: [{ label: "Estándar", runW: 65, factor: 1 }]
    },
    {
      id: "pc",
      name: "PC de escritorio + monitor",
      group: "trabajo",
      icon: "fa-desktop",
      variants: [{ label: "Estándar", runW: 250, factor: 1 }]
    },
    {
      id: "lavarropas",
      name: "Lavarropas (ciclo de lavado)",
      group: "cocina",
      icon: "fa-soap",
      variants: [
        { label: "Estándar", runW: 500, factor: 1 },
        { label: "Inverter", runW: 320, factor: 1 }
      ]
    },
    {
      id: "microondas",
      name: "Microondas",
      group: "cocina",
      icon: "fa-fire-burner",
      variants: [{ label: "Estándar", runW: 1200, factor: 1 }]
    },
    {
      id: "pava",
      name: "Pava eléctrica",
      group: "cocina",
      icon: "fa-mug-hot",
      variants: [{ label: "Estándar", runW: 1500, factor: 1 }]
    },
    {
      id: "luces",
      name: "Iluminación LED del hogar",
      group: "hogar",
      icon: "fa-lightbulb",
      variants: [{ label: "Estándar", runW: 90, factor: 1 }]
    },
    {
      id: "router",
      name: "Router y módem",
      group: "hogar",
      icon: "fa-wifi",
      variants: [{ label: "Estándar", runW: 15, factor: 1 }]
    },
    {
      id: "ventilador",
      name: "Ventilador de pie",
      group: "hogar",
      icon: "fa-wind",
      variants: [{ label: "Estándar", runW: 55, factor: 1 }]
    },
    {
      id: "bomba",
      name: "Bomba de agua 0,5 HP",
      group: "hogar",
      icon: "fa-faucet",
      variants: [{ label: "Estándar", runW: 550, factor: 1 }]
    }
  ];

  var state = {};
  CATALOG.forEach(function (item) {
    state[item.id] = { on: false, qty: 1, variant: 0 };
  });

  var grid = document.getElementById("calc-grid");
  var hoursEl = document.querySelector("[data-hours]");
  var hoursUnit = document.querySelector("[data-hours-unit]");
  var hoursSub = document.querySelector("[data-hours-sub]");
  var avgEl = document.querySelector("[data-avg]");
  var peakEl = document.querySelector("[data-peak]");
  var usableEl = document.querySelector("[data-usable]");
  var warnEl = document.querySelector("[data-warn]");
  var gaugeEl = document.querySelector("[data-gauge]");
  var arcEl = document.querySelector("[data-arc]");
  var clearBtn = document.querySelector("[data-clear]");
  var filter = "todos";
  var shownHours = null;
  var shownAvg = 0;
  var shownPeak = 0;
  var tweenToken = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  usableEl.textContent = fmtWh(USABLE_WH);
  arcEl.style.strokeDasharray = String(ARC_C);
  arcEl.style.strokeDashoffset = "0";

  function fmtW(n) {
    return Math.round(n).toLocaleString("es-AR") + " W";
  }

  function fmtWh(n) {
    return Math.round(n).toLocaleString("es-AR") + " Wh";
  }

  function avgOf(variant) {
    return variant.runW * variant.factor;
  }

  function wattsLabel(variant) {
    var avg = Math.round(avgOf(variant));
    if (Math.abs(avg - variant.runW) < 8) return avg.toLocaleString("es-AR") + " W";
    return "~" + avg.toLocaleString("es-AR") + " W promedio";
  }

  function runLabel(variant) {
    var avg = Math.round(avgOf(variant));
    if (Math.abs(avg - variant.runW) < 8) return "";
    return variant.runW.toLocaleString("es-AR") + " W al funcionar";
  }

  function render() {
    grid.innerHTML = CATALOG.map(function (item, index) {
      var current = state[item.id];
      var variant = item.variants[current.variant];
      var hasVar = item.variants.length > 1;
      var seg = "";
      if (hasVar) {
        seg =
          '<div class="seg' + (current.variant === 1 ? " is-inv" : "") + '" data-seg>' +
          '<span class="seg-pill" aria-hidden="true"></span>' +
          item.variants.map(function (v, i) {
            return '<button type="button" data-variant="' + i + '" class="' + (i === current.variant ? "is-active" : "") + '" aria-pressed="' + (i === current.variant ? "true" : "false") + '">' + v.label + "</button>";
          }).join("") +
          "</div>";
      }
      return (
        '<article class="calc-card' + (current.on ? " is-on" : "") + (hasVar ? " has-var" : "") + (filter !== "todos" && item.group !== filter ? " is-filtered" : "") + '" data-id="' + item.id + '" style="--i:' + index + '">' +
        '<button type="button" class="calc-card-hit" aria-pressed="' + (current.on ? "true" : "false") + '">' +
        '<span class="calc-ico" aria-hidden="true"><i class="fas ' + item.icon + '"></i></span>' +
        '<span class="calc-card-copy"><strong>' + item.name + '</strong>' +
        '<span class="calc-watts" data-watts>' + wattsLabel(variant) + "</span>" +
        '<span class="calc-run" data-run>' + runLabel(variant) + "</span></span>" +
        '<span class="calc-check" aria-hidden="true"><i class="fas fa-check"></i></span>' +
        "</button>" +
        '<div class="calc-extra">' + seg +
        '<div class="calc-qty">' +
        '<button type="button" data-qty="-1" aria-label="Bajar cantidad de ' + item.name + '"' + (!current.on || current.qty <= 1 ? " disabled" : "") + ">−</button>" +
        '<span data-qty-val>' + current.qty + "</span>" +
        '<button type="button" data-qty="1" aria-label="Subir cantidad de ' + item.name + '"' + (!current.on || current.qty >= 5 ? " disabled" : "") + ">+</button>" +
        "</div></div></article>"
      );
    }).join("");
  }

  function totals() {
    var avg = 0;
    var peak = 0;
    var any = false;
    CATALOG.forEach(function (item) {
      var current = state[item.id];
      if (!current.on) return;
      var variant = item.variants[current.variant];
      any = true;
      avg += current.qty * avgOf(variant);
      peak += current.qty * variant.runW;
    });
    return {
      any: any,
      avg: avg,
      peak: peak,
      hours: any && avg > 0 ? USABLE_WH / avg : null,
      overload: peak > MAX_W
    };
  }

  function paintHours(value) {
    if (value == null || !isFinite(value)) {
      hoursEl.textContent = "—";
      hoursUnit.textContent = "horas";
      hoursSub.textContent = "Elegí uno o más equipos para estimar la autonomía.";
      return;
    }
    var rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
    hoursEl.textContent = rounded.toLocaleString("es-AR", {
      minimumFractionDigits: value >= 100 ? 0 : 1,
      maximumFractionDigits: value >= 100 ? 0 : 1
    });
    hoursUnit.textContent = "horas";
    var totalMin = Math.max(0, Math.round(value * 60));
    var hh = Math.floor(totalMin / 60);
    var mm = totalMin % 60;
    hoursSub.textContent = mm ? hh.toLocaleString("es-AR") + " h " + mm + " min con la batería llena" : hh.toLocaleString("es-AR") + " h con la batería llena";
  }

  function paintArc(hours, overload) {
    var fill = hours == null ? 1 : Math.max(0.04, Math.min(1, hours / DAY_H));
    arcEl.style.strokeDashoffset = String(ARC_C * (1 - fill));
    gaugeEl.classList.toggle("is-warn", overload);
  }

  function animateTo(next) {
    tweenToken += 1;
    var token = tweenToken;
    var fromH = shownHours == null ? 0 : shownHours;
    var toH = next.hours == null ? 0 : next.hours;
    var fromAvg = shownAvg;
    var fromPeak = shownPeak;
    var empty = next.hours == null;

    warnEl.hidden = !next.overload;
    clearBtn.hidden = !next.any;

    if (reduceMotion || empty) {
      shownHours = next.hours;
      shownAvg = next.avg;
      shownPeak = next.peak;
      paintHours(next.hours);
      avgEl.textContent = fmtW(next.avg);
      peakEl.textContent = fmtW(next.peak);
      paintArc(next.hours, next.overload);
      return;
    }

    var start = performance.now();
    var dur = 560;
    function frame(now) {
      if (token !== tweenToken) return;
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var h = fromH + (toH - fromH) * e;
      shownHours = h;
      shownAvg = fromAvg + (next.avg - fromAvg) * e;
      shownPeak = fromPeak + (next.peak - fromPeak) * e;
      paintHours(h);
      avgEl.textContent = fmtW(shownAvg);
      peakEl.textContent = fmtW(shownPeak);
      paintArc(h, next.overload);
      if (p < 1) requestAnimationFrame(frame);
      else {
        shownHours = next.hours;
        shownAvg = next.avg;
        shownPeak = next.peak;
      }
    }
    requestAnimationFrame(frame);
  }

  function refreshCard(card) {
    var item = CATALOG.filter(function (entry) { return entry.id === card.getAttribute("data-id"); })[0];
    var current = state[item.id];
    var variant = item.variants[current.variant];
    card.classList.toggle("is-on", current.on);
    var hit = card.querySelector(".calc-card-hit");
    hit.setAttribute("aria-pressed", current.on ? "true" : "false");
    card.querySelector("[data-watts]").textContent = wattsLabel(variant);
    card.querySelector("[data-run]").textContent = runLabel(variant);
    card.querySelector("[data-qty-val]").textContent = String(current.qty);
    var minus = card.querySelector('[data-qty="-1"]');
    var plus = card.querySelector('[data-qty="1"]');
    minus.disabled = !current.on || current.qty <= 1;
    plus.disabled = !current.on || current.qty >= 5;
    var seg = card.querySelector("[data-seg]");
    if (seg) {
      seg.classList.toggle("is-inv", current.variant === 1);
      seg.querySelectorAll("[data-variant]").forEach(function (btn) {
        var active = Number(btn.getAttribute("data-variant")) === current.variant;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
  }

  grid.addEventListener("click", function (event) {
    var card = event.target.closest(".calc-card");
    if (!card) return;
    var id = card.getAttribute("data-id");
    var variantBtn = event.target.closest("[data-variant]");
    var qtyBtn = event.target.closest("[data-qty]");
    if (variantBtn) {
      state[id].variant = Number(variantBtn.getAttribute("data-variant"));
      refreshCard(card);
      animateTo(totals());
      return;
    }
    if (qtyBtn) {
      var nextQty = state[id].qty + Number(qtyBtn.getAttribute("data-qty"));
      state[id].qty = Math.max(1, Math.min(5, nextQty));
      if (!state[id].on) state[id].on = true;
      refreshCard(card);
      animateTo(totals());
      return;
    }
    if (event.target.closest(".calc-card-hit")) {
      state[id].on = !state[id].on;
      refreshCard(card);
      animateTo(totals());
    }
  });

  document.querySelector(".calc-filters").addEventListener("click", function (event) {
    var chip = event.target.closest("[data-filter]");
    if (!chip) return;
    filter = chip.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach(function (btn) {
      var active = btn === chip;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    grid.querySelectorAll(".calc-card").forEach(function (card) {
      var item = CATALOG.filter(function (entry) { return entry.id === card.getAttribute("data-id"); })[0];
      var hide = filter !== "todos" && item.group !== filter;
      card.classList.toggle("is-filtered", hide);
      if (!hide && !reduceMotion) {
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "";
      }
    });
  });

  clearBtn.addEventListener("click", function () {
    CATALOG.forEach(function (item) {
      state[item.id].on = false;
      state[item.id].qty = 1;
    });
    grid.querySelectorAll(".calc-card").forEach(refreshCard);
    animateTo(totals());
  });

  render();
  animateTo(totals());
})();
