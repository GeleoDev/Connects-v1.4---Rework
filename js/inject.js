(function () {
  function root() {
    var depth = Number(document.documentElement.getAttribute("data-root-depth") || "0");
    return depth ? "../".repeat(depth) : "./";
  }

  function navbar(r) {
    return (
      '<header class="site-header" data-site-header>' +
      '<div class="nav-bar">' +
      '<a class="nav-logo" href="' + r + 'index.html" aria-label="Connects">' +
      '<img src="' + r + 'assets/img/brand/ConnectsLogo.png" alt="Connects">' +
      "</a>" +
      '<div class="nav-drawer" data-nav-drawer id="nav-drawer">' +
      '<nav class="nav-list" aria-label="Principal">' +
      '<div class="nav-item has-sub" data-nav-sub>' +
      '<a class="nav-link" data-nav="soluciones" href="' + r + 'soluciones/">Soluciones <span class="chev">▼</span></a>' +
      '<div class="nav-sub" data-sub-panel>' +
      '<a href="' + r + 'soluciones/connects/"><strong>Conectividad — Connects</strong><small>Infraestructura y redes críticas</small></a>' +
      '<a href="' + r + 'soluciones/blackberry/"><strong>Cyberseguridad — Blackberry</strong><small>Protección y control empresarial</small></a>' +
      '<div class="nav-sub-label is-group">Productos disponibles</div>' +
      '<a href="' + r + 'productos/samm/"><strong>Samm Teknoloji</strong><small>Fibra óptica & datacenter</small></a>' +
      '<a href="' + r + 'productos/peplink/"><strong>Peplink</strong><small>SD-WAN · multi-WAN · 5G</small></a>' +
      '<a href="' + r + 'productos/must/"><strong>MUST Energy</strong><small>Solar, storage e inversores</small></a>' +
      "</div></div>" +
      '<div class="nav-item"><a class="nav-link" data-nav="alianzas" href="' + r + 'alianzas/">Alianzas</a></div>' +
      '<div class="nav-item"><a class="nav-link" data-nav="sobre-nosotros" href="' + r + 'sobre-nosotros/">Sobre nosotros</a></div>' +
      '<a class="nav-link nav-cta-link" href="' + r + 'contacto/">Contacto</a>' +
      "</nav></div>" +
      '<div class="nav-right">' +
      '<a class="nav-cta-desktop" href="' + r + 'contacto/">Contacto</a>' +
      '<button class="nav-burger" type="button" data-nav-burger aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-drawer">' +
      "<span></span><span></span><span></span></button>" +
      "</div></div></header>"
    );
  }

  function footer(r) {
    var y = new Date().getFullYear();
    return (
      '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="' + r + 'assets/img/brand/ConnectsLogo.png" alt="Connects">' +
      "<p>Soluciones en tecnología segura, eficaz y sustentable.</p>" +
      "</div>" +
      '<div class="footer-col"><h4>Explorar</h4>' +
      '<a href="' + r + 'soluciones/connects/">Soluciones Connects</a>' +
      '<a href="' + r + 'soluciones/blackberry/">Soluciones Blackberry</a>' +
      '<a href="' + r + 'productos/">Productos</a>' +
      '<a href="' + r + 'alianzas/">Alianzas</a>' +
      '<a href="' + r + 'sobre-nosotros/">Sobre nosotros</a></div>' +
      '<div class="footer-col"><h4>Marcas</h4>' +
      '<a href="' + r + 'productos/peplink/">Peplink</a>' +
      '<a href="' + r + 'productos/samm/">Samm Teknoloji</a>' +
      '<a href="' + r + 'productos/must/">MUST Energy</a></div>' +
      '<div class="footer-col"><h4>Contacto</h4>' +
      "<ul><li>Tacuarí 1777, CABA</li>" +
      '<li><a href="mailto:ventas@connects.com.ar">ventas@connects.com.ar</a></li>' +
      '<li><a href="' + r + 'contacto/">Formulario de contacto</a></li></ul></div>' +
      "</div>" +
      '<div class="container footer-bottom"><span>© ' + y + " Connects. Todos los derechos reservados.</span>" +
      "<span>Rework visual · v1.4-c</span></div></footer>"
    );
  }

  function whatsappFloat() {
    return (
      '<a class="wa-float" href="https://wa.me/541171025861?text=' +
      encodeURIComponent("Hola, quiero consultar con Connects.") +
      '" target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp">' +
      '<i class="fab fa-whatsapp" aria-hidden="true"></i>' +
      '<span class="wa-float-label">WhatsApp</span>' +
      "</a>"
    );
  }

  var r = root();
  var n = document.querySelector("[data-inject-nav]");
  var f = document.querySelector("[data-inject-footer]");
  if (n) n.outerHTML = navbar(r);
  if (f) f.outerHTML = footer(r);
  if (!document.querySelector(".wa-float")) {
    document.body.insertAdjacentHTML("beforeend", whatsappFloat());
  }
})();
