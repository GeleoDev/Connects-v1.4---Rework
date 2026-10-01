(function () {
  var forms = document.querySelectorAll('form[action*="formsubmit.co"]');
  if (!forms.length) return;

  function rootPrefix() {
    var depth = Number(document.documentElement.getAttribute("data-root-depth") || "0");
    return depth ? "../".repeat(depth) : "./";
  }

  function go(path) {
    window.location.href = rootPrefix() + path;
  }

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector('[type="submit"]');
      var label = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        button.textContent = "Enviando…";
      }

      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = value;
      });

      var action = form.getAttribute("action") || "";
      var email = action.split("/").filter(Boolean).pop();
      var endpoint = "https://formsubmit.co/ajax/" + encodeURIComponent(email);

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response
            .json()
            .then(function (body) {
              return { ok: response.ok, body: body };
            })
            .catch(function () {
              return { ok: false, body: null };
            });
        })
        .then(function (result) {
          var success =
            result.ok &&
            result.body &&
            (result.body.success === true || result.body.success === "true");
          go(success ? "contacto/enviado/" : "contacto/error/");
        })
        .catch(function () {
          if (button) {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            button.textContent = label;
          }
          go("contacto/error/");
        });
    });
  });
})();
