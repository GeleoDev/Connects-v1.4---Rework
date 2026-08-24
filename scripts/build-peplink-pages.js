const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "productos", "peplink");

const products = [
  {
    slug: "b-one-plus",
    name: "B One Plus",
    title: "Peplink B One Plus",
    category: "branch",
    tags: ["Branch", "LTE"],
    image: "b-one-plus.png",
    official: "https://www.peplink.com/products/enterprise-branch-routers/b-one-plus/",
    lead: "Router Dual WAN gigabit con módem LTE CAT-4 embebido (Latinoamérica), Wi-Fi 6 y 1 Gbps de throughput. Respaldo celular para sucursales, retail y POS.",
    description:
      "El B One Plus es el router de sucursal de Peplink pensado para no perder conectividad. Combina 2x Ethernet WAN, 4x Ethernet LAN y un módem 4G LTE CAT-4 para Latinoamérica, con Wi-Fi 6 2x2 MIMO y 1 Gbps de ruteo. Si cae la fibra, el LTE toma el tráfico. Incluye set completo de antenas y se gestiona con InControl 2.",
    features: [
      "1 Gbps de throughput de ruteo",
      "Módem LTE CAT-4 embebido para Latinoamérica",
      "2x Ethernet WAN + 4x Ethernet LAN",
      "Wi-Fi 6 dual-band 2x2 MIMO",
      "eSIM y doble slot SIM",
      "SpeedFusion: bonding, hot failover y WAN smoothing",
      "Gestión cloud InControl 2 y PrimeCare",
    ],
    specs: [
      ["Modelo", "Peplink B One Plus (B-ONE-PLUS-LTE-MX)"],
      ["WAN", "2x Gigabit Ethernet + LTE CAT-4 + USB-C"],
      ["LAN", "4x Gigabit Ethernet"],
      ["Wi-Fi", "Wi-Fi 6, dual-band, 2x2 MIMO"],
      ["Throughput", "1 Gbps"],
      ["Gestión", "InControl 2"],
      ["Contenido", "Router, 2x antenas LTE/5G, 2x antenas Wi-Fi, fuente 12V 3A"],
    ],
    ideal: ["Sucursales y retail con POS", "Respaldo LTE ante cortes de fibra", "Oficinas que necesitan Dual WAN + celular"],
  },
  {
    slug: "b-one-5g",
    name: "B One 5G",
    title: "Peplink B One 5G",
    category: "branch 5g",
    tags: ["Branch", "5G"],
    image: "b-one-5g.png",
    official: "https://www.peplink.com/products/enterprise-branch-routers/b-one-5g/",
    lead: "Router Dual WAN gigabit con módem 5G, Wi-Fi 6 y 1 Gbps de throughput. Continuidad 5G para sucursales y aplicaciones de alto ancho de banda.",
    description:
      "El B One 5G suma un módem 5G al diseño Dual WAN del B One. 2x Ethernet WAN, 4x Ethernet LAN, Wi-Fi 6 2x2 MIMO y 1 Gbps de ruteo. Ideal cuando el respaldo celular tiene que ser rápido: el 5G cubre la caída de la línea principal o funciona como WAN primaria de acceso fijo inalámbrico. Compatible con SIM física y eSIM.",
    features: [
      "Módem 5G embebido (NSA y SA Sub-6)",
      "2x Ethernet WAN + 4x Ethernet LAN",
      "Wi-Fi 6 dual-band 2x2 MIMO",
      "1 Gbps de throughput de ruteo",
      "SpeedFusion VPN, bonding y hot failover",
      "Firewall stateful, QoS y VLANs",
      "InControl 2 y PrimeCare",
    ],
    specs: [
      ["Modelo", "Peplink B One 5G (B-ONE-5GN-T-PRM)"],
      ["WAN", "2x Gigabit Ethernet + 1x módem 5G + USB-C"],
      ["LAN", "4x Gigabit Ethernet"],
      ["Wi-Fi", "Wi-Fi 6, dual-band, 2x2 MIMO"],
      ["Throughput", "1 Gbps"],
      ["Gestión", "InControl 2"],
      ["Contenido", "Router, set completo de antenas"],
    ],
    ideal: ["Sucursales con demanda de ancho de banda", "Backup 5G de fibra o Starlink", "Retail y oficinas críticas"],
  },
  {
    slug: "b-one",
    name: "B One",
    title: "Peplink B One",
    category: "branch",
    tags: ["Branch"],
    image: "b-one.png",
    official: "https://www.peplink.com/products/enterprise-branch-routers/b-one/",
    lead: "Router Dual WAN gigabit con Wi-Fi 6 y 1 Gbps de throughput, sin módem celular interno. Para cuando ya tenés Starlink, fibra u otro módem externo.",
    description:
      "El B One ofrece la misma potencia de ruteo y Wi-Fi 6 que el resto de la familia, sin módem celular embebido. 2x Ethernet WAN, 4x Ethernet LAN y 1 Gbps. Es la opción más económica si ya tenés un módem externo (Starlink, fibra o cablemódem) y no necesitás respaldo LTE/5G interno. Una tercera WAN se puede sumar por USB o usando Wi-Fi as WAN.",
    features: [
      "2x Ethernet WAN + 4x Ethernet LAN",
      "Wi-Fi 6 dual-band 2x2 MIMO",
      "1 Gbps de throughput de ruteo",
      "SpeedFusion, VPN y firewall de sucursal",
      "Wi-Fi as WAN o USB para una tercera conexión",
      "Gestión InControl 2",
      "Set completo de antenas Wi-Fi",
    ],
    specs: [
      ["Modelo", "Peplink B One (B-ONE-T-PRM)"],
      ["WAN", "2x Gigabit Ethernet + USB / Wi-Fi WAN"],
      ["LAN", "4x Gigabit Ethernet"],
      ["Wi-Fi", "Wi-Fi 6, dual-band, 2x2 MIMO"],
      ["Throughput", "1 Gbps"],
      ["Celular", "Sin módem interno"],
      ["Gestión", "InControl 2"],
    ],
    ideal: ["Sucursales con fibra o Starlink ya instalados", "Proyectos que no requieren LTE interno", "Dual WAN de alto rendimiento a menor costo"],
  },
  {
    slug: "max-br2-pro",
    name: "MAX BR2 Pro",
    title: "Peplink MAX BR2 Pro",
    category: "5g movilidad",
    tags: ["5G", "Movilidad"],
    image: "max-br2-pro.png",
    official: "https://www.peplink.com/products/mobile-routers/max-br2-pro/",
    lead: "Router móvil dual 5G con Wi-Fi 6, 2x Ethernet WAN, USB 3.0 y 1 Gbps de throughput. Dos módems 5G globales para no cortar en campo.",
    description:
      "El MAX BR2 Pro (el MAX BR2 de 5G del catálogo Connects) combina 2x módems 5G globales, 2x Ethernet WAN, USB 3.0 y Wi-Fi 6 2x2 MIMO, con 1 Gbps de ruteo. Pensado para vehículos, flotas y sitios remotos: failover entre celulares, satélite y Ethernet. Certificaciones de carriers de EE.UU. (AT&T y otros) y set completo de antenas.",
    features: [
      "2x módems 5G (Global) con SIM redundante",
      "2x Ethernet WAN (uno puede usarse como LAN)",
      "1x USB 3.0 WAN",
      "Wi-Fi 6 dual-band 2x2 MIMO",
      "1 Gbps de throughput",
      "PoE input 802.3at e ignition sensing",
      "SpeedFusion e InControl 2",
    ],
    specs: [
      ["Modelo", "Peplink MAX BR2 Pro 5G (MAX-BR2-PRO-5GN-T-PRM)"],
      ["Módems", "2x 5G Global"],
      ["WAN", "2x Ethernet 2.5G/1G + USB 3.0 + Wi-Fi WAN"],
      ["Wi-Fi", "Wi-Fi 6, 2x2 MIMO"],
      ["Throughput", "1 Gbps"],
      ["Certificaciones", "AT&T, T-Mobile, Verizon, FirstNet"],
      ["Contenido", "Router, 8x antenas LTE/5G, 2x Wi-Fi, GPS, fuente 12V 3A"],
    ],
    ideal: ["Flotas y vehículos", "Sitios remotos dual-celular", "Bonding 5G + Starlink / Ethernet"],
  },
  {
    slug: "max-br1-mini-5g",
    name: "MAX BR1 Mini 5G",
    title: "Peplink MAX BR1 Mini 5G",
    category: "5g compacto",
    tags: ["5G", "Compacto"],
    image: "max-br1-mini-5g.jpg",
    official: "https://www.peplink.com/products/mobile-routers/max-br1-mini-5g/",
    lead: "Router celular 5G compacto con Wi-Fi (sin GPS). Un módem 5G CAT-20 para despliegues masivos, IoT y respaldo 5G.",
    description:
      "El MAX BR1 Mini 5G con Wi-Fi es el 5G compacto del catálogo: un módem 5G, conectividad Wi-Fi y formato reducido. No incluye GPS. Sirve como router, como adaptador 5G sobre una red existente o como WAN celular de bajo costo a escala. Compatible con SIM y eSIM.",
    features: [
      "1x módem 5G (CAT-20 / 5G Sub-6)",
      "Wi-Fi integrado (versión con Wi-Fi, sin GPS)",
      "Ethernet WAN opcional y failover",
      "Formato compacto para IoT y kioscos",
      "InControl 2 y Feature Pack SpeedFusion",
      "PoE 802.3at",
    ],
    specs: [
      ["Modelo", "MAX BR1 Mini 5G Wi-Fi (MAX-BR1-MINI-5GN-T-PRM)"],
      ["Celular", "1x 5G / LTE CAT-20"],
      ["Wi-Fi", "Integrado (HW2)"],
      ["GPS", "No"],
      ["Throughput", "Hasta 300 Mbps de ruteo"],
      ["Gestión", "InControl 2"],
      ["Contenido", "Router, 4x antenas LTE/5G, 2x Wi-Fi, fuente 12V 2A"],
    ],
    ideal: ["Despliegues 5G masivos", "IoT y kioscos", "Adaptador 5G sobre una red existente"],
  },
  {
    slug: "max-br1-mini",
    name: "MAX BR1 Mini",
    title: "Peplink MAX BR1 Mini",
    category: "compacto",
    tags: ["Compacto", "LTE"],
    image: "MAX-BR1-Mini.png",
    official: "https://www.peplink.com/products/mobile-routers/br1-mini-hw3/",
    lead: "Router móvil LTE CAT-4 compacto con Wi-Fi dual-band, GPS/flota y gestión cloud. Telemetría y respaldo celular en formato reducido.",
    description:
      "El MAX BR1 Mini es el router LTE compacto con GPS integrado: módem 4G CAT-4, 2x Ethernet LAN, Ethernet WAN opcional, Wi-Fi 5 2x2 MIMO y tracking de flota. Rugged, con gestión InControl 2. Pensado para IoT, vehículos, kioscos y sucursales chicas que necesitan celular + telemetría.",
    features: [
      "Módem LTE CAT-4 embebido",
      "GPS / fleet tracking integrado",
      "2x Ethernet LAN + WAN Ethernet opcional",
      "Wi-Fi 5 dual-band 2x2 MIMO",
      "Failover WAN opcional",
      "Gestión cloud InControl 2",
      "Set completo de antenas",
    ],
    specs: [
      ["Modelo", "Peplink MAX BR1 Mini LTE"],
      ["Celular", "1x LTE CAT-4"],
      ["LAN / WAN", "2x Ethernet LAN + 1x Ethernet WAN opcional"],
      ["Wi-Fi", "Wi-Fi 5 dual-band, 2x2 MIMO"],
      ["GPS", "Sí, tracking de flota"],
      ["Gestión", "InControl 2"],
      ["Contenido", "Router, antenas LTE, Wi-Fi, GPS y fuente"],
    ],
    ideal: ["Vehículos y telemetría", "Kioscos e IoT", "Respaldo LTE compacto"],
  },
  {
    slug: "antenna-max-s",
    name: "Antenna MAX S",
    title: "Peplink Antenna MAX S",
    category: "antenas",
    tags: ["Antena", "Starlink"],
    image: "antenna-max-s.png",
    official: "https://www.peplink.com/products/accessories/antenna-max-s/",
    lead: "Enclosure IP con antenas 4x LTE/5G, 2x Wi-Fi y GPS para alojar el router Peplink y un Starlink Mini en un solo equipo híbrido.",
    description:
      "Antenna MAX S es el enclosure integrado para conectividad híbrida celular + satélite. Antenas 4x 5G/LTE, 2x Wi-Fi y GPS, conectores SMA (celular/GPS) y RP-SMA (Wi-Fi), 600–6000 MHz. Adentro van el router (BR1 Mini, Transit Duo Pro, BR1 Pro 5G / CAT-20) y el Starlink Mini, sin cables RF externos. Incluye set completo de prensaestopas y cables.",
    features: [
      "4x LTE/5G + 2x Wi-Fi + 1x GPS",
      "Compatible con Starlink Mini",
      "Compatible BR1 Mini, Transit Duo Pro, BR1 Pro 5G / CAT-20",
      "Rango 600–6000 MHz",
      "Conectores SMA macho (celular/GPS) y RP-SMA (Wi-Fi)",
      "Montaje adhesivo, magnético, deck, poste o superficie",
    ],
    specs: [
      ["Modelo", "ANT-MAX-S"],
      ["Antenas", "4x 5G/LTE, 2x Wi-Fi, 1x GPS"],
      ["Frecuencia celular", "600–6000 MHz"],
      ["Conectores", "SMA macho / RP-SMA Wi-Fi"],
      ["Routers", "BR1 Mini Series, Transit Duo Pro, BR1 Pro 5G, BR1 Pro CAT-20"],
      ["Uso", "Híbrido celular + Starlink Mini"],
    ],
    ideal: ["Flotas con Starlink Mini", "Sitios remotos híbridos", "Instalación única router + satélite"],
  },
  {
    slug: "mobility-82g",
    name: "Mobility 82G",
    title: "Peplink Mobility 82G",
    category: "antenas",
    tags: ["Antena", "5G"],
    image: "mobility-82g.png",
    official: "https://www.peplink.com/products/accessories/mobility-82g/",
    lead: "Sistema de antena 11-en-1: 8x LTE/5G, 2x Wi-Fi y GPS. IP68, 600–6000 MHz, cables de 2 m. Para routers dual 5G como el BR2 Pro.",
    description:
      "Mobility 82G es la antena omnidireccional 8x8 MIMO para 5G. 8 elementos celulares, 2 Wi-Fi y GPS con LNA, IP68, color blanco, cables de 6.5 ft / 2 m. Conectores SMA macho (celular y GPS) y RP-SMA (Wi-Fi). Una sola carcasa para dual 5G en vehículos, público y sitios exigentes.",
    features: [
      "11-en-1: 8x LTE/5G + 2x Wi-Fi + 1x GPS",
      "Rango 600–6000 MHz",
      "IP68, perfil bajo",
      "Cables de 2 m",
      "SMA macho / RP-SMA Wi-Fi",
      "Pensada para dual 5G (BR2 Pro y similares)",
    ],
    specs: [
      ["Modelo", "ANT-MB-82G-S-W-6"],
      ["Elementos", "8x LTE/5G, 2x Wi-Fi, 1x GPS"],
      ["Frecuencia", "600–6000 MHz"],
      ["Protección", "IP68"],
      ["Color / cable", "Blanco, 6.5 ft / 2 m"],
      ["Conectores", "SMA macho (celular/GPS), RP-SMA (Wi-Fi)"],
    ],
    ideal: ["Routers dual 5G", "Vehículos y public safety", "Cobertura de largo alcance"],
  },
  {
    slug: "mobility-22g",
    name: "Mobility 22G",
    title: "Peplink Mobility 22G",
    category: "antenas",
    tags: ["Antena"],
    image: "mobility-22g.png",
    official: "https://www.peplink.com/products/accessories/mobility-antenna-series/",
    lead: "Antena 5-en-1: 2x LTE/5G, 2x Wi-Fi y GPS. IP68, 600–6000 MHz, cables de 2 m. Para BR1 Mini y routers de un módem.",
    description:
      "Mobility 22G concentra 2x celular, 2x Wi-Fi y GPS en una sola antena 2x2 MIMO. IP68, 600–6000 MHz, blanco, cables de 2 m, SMA macho y RP-SMA. Es la antena todo-en-uno para routers de un módem (BR1 Mini, B One Plus, etc.) en techo de vehículo o sitio.",
    features: [
      "5-en-1: 2x LTE/5G + 2x Wi-Fi + 1x GPS",
      "2x2 MIMO celular y Wi-Fi dual-band",
      "Rango 600–6000 MHz",
      "IP68",
      "Cables de 2 m",
      "SMA macho / RP-SMA Wi-Fi",
    ],
    specs: [
      ["Modelo", "ANT-MB-22G-S-W-6"],
      ["Elementos", "2x LTE/5G, 2x Wi-Fi, 1x GPS"],
      ["Frecuencia", "600–6000 MHz"],
      ["Protección", "IP68"],
      ["Color / cable", "Blanco, 6.5 ft / 2 m"],
      ["Conectores", "SMA macho (celular/GPS), RP-SMA (Wi-Fi)"],
    ],
    ideal: ["BR1 Mini y un módem", "Vehículos livianos", "Instalación techo todo-en-uno"],
  },
  {
    slug: "switch-8-poe-10g",
    name: "8 PoE 10G Switch",
    title: "Peplink 8 PoE 10G Switch",
    category: "switch",
    tags: ["Switch", "PoE"],
    image: "switch-8-poe-10g.png",
    official: "https://www.peplink.com/products/wifi-poe/switch-series/",
    lead: "Switch gestionable 8x 10GE PoE++ (802.3bt) y 4x 10GE SFP+, con 720 W de presupuesto PoE. Para APs, cámaras y backbone 10G.",
    description:
      "El 8 PoE 10G Switch de Peplink entrega 8 puertos 10 Gigabit RJ45 con PoE++ 802.3bt y 4 uplinks SFP+ 10G, con 720 W de presupuesto. Capacidad de switching 240 Gbps. Se gestiona con InControl 2, igual que routers y APs, para una red Peplink unificada.",
    features: [
      "8x 10GE RJ45 PoE++ 802.3bt",
      "4x 10GE SFP+",
      "720 W de presupuesto PoE",
      "Capacidad 240 Gbps",
      "LACP, RSTP, VLANs e inter-VLAN",
      "InControl 2",
    ],
    specs: [
      ["Modelo", "PLS-8-10G-720W"],
      ["RJ45", "8x 10GE 802.3bt PoE++"],
      ["SFP+", "4x 10GE"],
      ["PoE", "720 W"],
      ["Switching", "240 Gbps"],
      ["Alimentación", "100–240 V AC, PSU 900 W"],
      ["Medidas", "230 x 330 x 44 mm"],
    ],
    ideal: ["Access points Wi-Fi 6 de alta potencia", "Cámaras y edge 10G", "Campus y sucursales densas"],
  },
  {
    slug: "ap-one-rugged",
    name: "AP One Rugged",
    title: "Peplink AP One Rugged",
    category: "wifi",
    tags: ["Wi-Fi", "Rugged"],
    image: "ap-one-rugged.png",
    official: "https://www.peplink.com/products/ap-one-rugged/",
    lead: "Access point Wi-Fi 5 profesional en gabinete metálico. Dual-band 2x2 MIMO, para entornos industriales y exigentes.",
    description:
      "AP One Rugged es el AP de negocio de Peplink en chasis de metal: Wi-Fi 5 dual-band 2x2 MIMO, 3x Gigabit Ethernet, PoE 802.3at y rango térmico amplio. Se gestiona con InControl 2 junto al resto de la WLAN. Incluye fuente y 2 antenas Wi-Fi.",
    features: [
      "Wi-Fi 5 dual-band 2x2 MIMO",
      "Gabinete metálico rugged",
      "3x Gigabit Ethernet",
      "PoE 802.3at o 12 V",
      "Mesh y WDS",
      "InControl 2 / AP Controller",
    ],
    specs: [
      ["Modelo", "APO-AC-RUG"],
      ["Wi-Fi", "802.11ac, 2x2 MIMO (hasta 300 / 866 Mbps)"],
      ["Ethernet", "3x Gigabit"],
      ["Alimentación", "12 V / 802.3at PoE"],
      ["Gabinete", "Metal, industrial"],
      ["Gestión", "InControl 2"],
      ["Contenido", "AP, fuente 12V 2A, 2x antenas Wi-Fi"],
    ],
    ideal: ["Plantas e industriales", "Depósitos y talleres", "WLAN Peplink en ambiente hostil"],
  },
  {
    slug: "ap-one-ax",
    name: "AP One AX",
    title: "Peplink AP One AX",
    category: "wifi",
    tags: ["Wi-Fi 6"],
    image: "ap-one-ax.png",
    official: "https://www.peplink.com/products/wifi-poe/ap-one-ax/",
    lead: "Access point Wi-Fi 6 4x4 MU-MIMO para interiores. Hasta 256 usuarios por radio, plenum rated, gestionable con InControl 2.",
    description:
      "AP One AX es el AP indoor Wi-Fi 6 de Peplink: 4x4 MU-MIMO, hasta 1148 Mbps en 2.4 GHz y 2400 Mbps en 5 GHz, puerto 2.5 GbE y gabinete plenum de plástico. Hasta 256 clientes concurrentes por radio y 16 SSIDs. Se administra desde InControl 2 como el resto de la red.",
    features: [
      "Wi-Fi 6 4x4 MU-MIMO",
      "Hasta 1148 / 2400 Mbps",
      "1x 2.5 GbE",
      "Hasta 256 usuarios por radio",
      "Plenum rated, indoor",
      "InControl 2",
    ],
    specs: [
      ["Modelo", "APO-AX"],
      ["Wi-Fi", "802.11ax, 4x4 MU-MIMO"],
      ["Ethernet", "1x 2.5 Multigigabit"],
      ["Usuarios", "256 por radio"],
      ["Alimentación", "12 V o 802.3at PoE"],
      ["Gabinete", "Indoor plástico, plenum rated"],
      ["Gestión", "InControl 2"],
    ],
    ideal: ["Oficinas y sucursales", "WLAN de alta densidad", "Integración SD-WAN Peplink"],
  },
];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function wa(name) {
  return "https://wa.me/541171025861?text=" + encodeURIComponent("Hola, quiero consultar por " + name + ".");
}

function page(p) {
  const feats = p.features.map((f) => `              <li><i class="fas fa-check"></i><span>${esc(f)}</span></li>`).join("\n");
  const specs = p.specs
    .map(
      ([l, v]) => `              <div class="pd-spec">
                <span class="pd-spec-label">${esc(l)}</span>
                <span class="pd-spec-value">${esc(v)}</span>
              </div>`
    )
    .join("\n");
  const ideal = p.ideal.map((f) => `            <li><i class="fas fa-check"></i><span>${esc(f)}</span></li>`).join("\n");
  return `<!DOCTYPE html>
<html lang="es" data-root-depth="3">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(p.title)} — Connects</title>
  <meta name="description" content="${esc(p.lead)}">
  <link rel="icon" type="image/png" href="../../../favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Sora:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="../../../css/tokens.css">
  <link rel="stylesheet" href="../../../css/base.css">
  <link rel="stylesheet" href="../../../css/navbar.css">
  <link rel="stylesheet" href="../../../css/footer.css">
  <link rel="stylesheet" href="../../../css/pages.css">
  <link rel="stylesheet" href="../../../css/peplink.css">
  <link rel="stylesheet" href="../../../css/product-detail.css">
</head>
<body class="peplink-scope">
  <div class="page">
    <div data-inject-nav></div>
    <section class="pd-wrap container">
      <nav class="crumbs">
        <a href="../../../">Inicio</a><span>/</span>
        <a href="../../../productos/">Productos</a><span>/</span>
        <a href="../../../productos/peplink/">Peplink</a><span>/</span>
        <span>${esc(p.name)}</span>
      </nav>

      <div class="pd-layout">
        <div class="pd-main">
          <div class="pd-gallery peplink">
            <img src="../../../assets/img/productos/peplink/${esc(p.image)}" alt="${esc(p.title)}" width="640" height="360">
          </div>
          <div class="pd-block">
            <h3>Descripción del producto</h3>
            <p>${esc(p.description)}</p>
          </div>
          <div class="pd-drop peplink" data-pd-drop>
            <button class="pd-drop-toggle" type="button" aria-expanded="false">
              <h3>Características generales</h3>
              <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="pd-drop-panel">
              <ul>
${feats}
              </ul>
            </div>
          </div>
          <div class="pd-drop peplink" data-pd-drop>
            <button class="pd-drop-toggle" type="button" aria-expanded="false">
              <h3>Características técnicas</h3>
              <i class="fas fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="pd-drop-panel">
              <div class="pd-specs">
${specs}
              </div>
            </div>
          </div>
        </div>

        <aside class="pd-aside peplink">
          <span class="pd-eyebrow"><i class="fas fa-network-wired"></i> Conectividad · Peplink</span>
          <h1>${esc(p.title)}</h1>
          <div class="pd-price">
            <strong>CONSULTAR PRECIO</strong>
            <p>Precio sujeto a disponibilidad de stock e importación.</p>
          </div>
          <a class="btn btn-peplink" href="${wa(p.title)}" target="_blank" rel="noopener">
            <i class="fab fa-whatsapp"></i> Consultar disponibilidad
          </a>
          <p class="pd-note">Te conectamos con el equipo de ventas por WhatsApp para dimensionar el equipo ideal.</p>
          <div class="pd-box">
            <h3><i class="fas fa-shield-halved"></i> Garantía y soporte</h3>
            <ul>
              <li><i class="fas fa-check"></i><span>Garantía de fábrica Peplink.</span></li>
              <li><i class="fas fa-check"></i><span>Acompañamiento técnico Connects durante el proyecto.</span></li>
            </ul>
          </div>
          <div class="pd-box">
            <h3><i class="fas fa-certificate"></i> Reseller autorizado</h3>
            <p>Connects es Reseller Autorizado de Peplink en Argentina. Equipos originales, gestión de importación y acompañamiento técnico durante todo el proyecto.</p>
          </div>
        <div class="pd-box">
          <h3><i class="fas fa-bullseye"></i> Ideal para</h3>
          <ul>
${ideal}
          </ul>
        </div>
          <div class="pd-box">
            <a class="btn btn-ghost" href="${esc(p.official)}" target="_blank" rel="noopener" style="width:100%;justify-content:center">Ficha oficial Peplink</a>
          </div>
          <div class="pd-box">
            <a class="btn btn-ghost" href="../../../contacto/" style="width:100%;justify-content:center">Formulario de contacto</a>
          </div>
        </aside>
      </div>

      <div class="pd-social">
        <div class="section-head center">
          <span class="eyebrow">Comunidad</span>
          <h2>Seguinos en redes</h2>
        </div>
        <div class="social-row">
          <a href="https://www.facebook.com/profile.php?id=61584716262408" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/connects.ar/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.linkedin.com/company/connects" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://pin.it/6niYQjteq" target="_blank" rel="noopener" aria-label="Pinterest"><i class="fab fa-pinterest-p"></i></a>
        </div>
      </div>
    </section>
    <div data-inject-footer></div>
  </div>
  <script src="../../../js/inject.js"></script>
  <script src="../../../js/navbar.js"></script>
  <script src="../../../js/motion.js"></script>
  <script src="../../../js/product-detail.js"></script>
</body>
</html>
`;
}

function card(p, withCat) {
  const tags = p.tags
    .map((t) => `              <span class="tag">${esc(t)}</span>`)
    .join("\n");
  const cat = withCat ? ` data-category="${esc(p.category)}"` : "";
  return `        <a class="card-dark reveal"${cat} href="./${p.slug}/" style="text-decoration:none;color:inherit">
          <div class="media" style="background:#111;display:grid;place-items:center;padding:1.25rem">
            <img src="../../assets/img/productos/peplink/${esc(p.image)}" alt="${esc(p.name)}" style="max-height:150px;width:auto;object-fit:contain">
          </div>
          <div class="body">
            <div class="card-tags">
${tags}
              <span class="tag tag-ship"><i class="fas fa-truck-fast"></i> Entrega inmediata</span>
            </div>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.lead)}</p>
            <span class="go" style="color:var(--peplink-orange);font-weight:700">Ver ficha →</span>
          </div>
        </a>`;
}

const featured = ["b-one-5g", "max-br2-pro", "antenna-max-s"].map((s) => products.find((p) => p.slug === s));

const index = `<!DOCTYPE html>
<html lang="es" data-root-depth="2">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Peplink — Connects | Reseller Autorizado Argentina</title>
  <meta name="description" content="Reseller autorizado Peplink en Argentina. Catálogo B One, MAX BR, antenas Mobility, AP One y switch PoE 10G. SpeedFusion e InControl 2.">
  <link rel="icon" type="image/png" href="../../favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Noto+Sans:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="../../css/tokens.css">
  <link rel="stylesheet" href="../../css/base.css">
  <link rel="stylesheet" href="../../css/navbar.css">
  <link rel="stylesheet" href="../../css/footer.css">
  <link rel="stylesheet" href="../../css/pages.css">
  <link rel="stylesheet" href="../../css/peplink.css">
</head>
<body class="peplink-scope">
  <div class="page">
    <div data-inject-nav></div>

    <header class="page-hero has-bg">
      <div class="page-hero-bg">
        <img src="../../assets/img/productos/peplink/peplink-home-card.png" alt="Conectividad Peplink">
      </div>
      <div class="container">
        <nav class="crumbs"><a href="../../">Inicio</a><span>/</span><a href="../">Productos</a><span>/</span><span>Peplink</span></nav>
        <div class="logo-row brand-hero-logo">
          <img class="peplink-logo" src="../../assets/img/alianzas/PEPLINK.svg" alt="Peplink">
        </div>
        <span class="eyebrow">Reseller autorizado</span>
        <h1>Conectividad <span class="peplink-accent">sin interrupciones</span>, estés donde estés.</h1>
        <p class="lead">Routers Dual WAN y 5G, antenas, Wi-Fi y switching. La misma plataforma SpeedFusion e InControl 2.</p>
        <p class="peplink-suite">Catálogo alineado a los equipos que comercializa Connects.</p>
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.35rem">
          <a class="btn btn-peplink" href="#catalogo">Ver catálogo</a>
          <a class="btn btn-peplink-line" href="https://www.peplink.com/" target="_blank" rel="noopener">Sitio oficial Peplink</a>
          <a class="btn btn-peplink-line" href="../../contacto/">Hablar con un asesor</a>
        </div>
      </div>
    </header>

    <section class="section container">
      <div class="feature-grid cols-4" style="margin-bottom:2.25rem">
        <div class="panel feature-card reveal"><i class="fas fa-bolt" style="color:var(--peplink-orange)"></i><h3>SpeedFusion</h3><p>Bonding, hot failover y WAN smoothing sobre varias WAN.</p></div>
        <div class="panel feature-card reveal"><i class="fas fa-globe" style="color:var(--peplink-orange)"></i><h3>Multi-WAN</h3><p>Fibra, LTE/5G, Wi-Fi y Starlink en un solo pipe.</p></div>
        <div class="panel feature-card reveal"><i class="fas fa-wifi" style="color:var(--peplink-orange)"></i><h3>Wi-Fi 5 y 6</h3><p>APs y routers con SSIDs múltiples y gestión unificada.</p></div>
        <div class="panel feature-card reveal"><i class="fas fa-cloud" style="color:var(--peplink-orange)"></i><h3>InControl 2</h3><p>Gestión y monitoreo cloud de toda la flota.</p></div>
      </div>

      <div class="section-head featured-block reveal">
        <span class="eyebrow">Selección Connects</span>
        <h2>Productos destacados</h2>
        <p class="lead">Tres equipos clave del catálogo: sucursal 5G, movilidad dual 5G e híbrido Starlink.</p>
      </div>
      <div class="grid grid-3">
${featured.map((p) => card(p, false)).join("\n")}
      </div>

      <div class="catalog-block" data-catalog-root="peplink">
        <div class="section-head reveal" id="catalogo">
          <h2>Catálogo</h2>
          <p class="lead">Los equipos que Connects comercializa, con ficha e imagen oficial Peplink.</p>
        </div>
        <div class="catalog-filters" data-catalog-filters>
          <button class="filter-chip is-active" type="button" data-filter="all" aria-pressed="true">Todos</button>
          <button class="filter-chip" type="button" data-filter="branch" aria-pressed="false">Branch</button>
          <button class="filter-chip" type="button" data-filter="5g" aria-pressed="false">5G</button>
          <button class="filter-chip" type="button" data-filter="compacto" aria-pressed="false">Compacto</button>
          <button class="filter-chip" type="button" data-filter="antenas" aria-pressed="false">Antenas</button>
          <button class="filter-chip" type="button" data-filter="wifi" aria-pressed="false">Wi-Fi</button>
          <button class="filter-chip" type="button" data-filter="switch" aria-pressed="false">Switch</button>
        </div>
        <div class="grid grid-3" data-catalog>
${products.map((p) => card(p, true)).join("\n")}
        </div>
        <p class="catalog-empty" data-catalog-empty hidden>No hay equipos en esta categoría.</p>
      </div>

      <div class="cta-bar reveal" style="margin-top:2rem;background:#000;border-color:rgba(255,255,255,.12)">
        <div>
          <h3>¿Dimensionamos tu red Peplink?</h3>
          <p>Te ayudamos a elegir modelo según WAN, sites y criticidad.</p>
        </div>
        <a class="btn btn-peplink" href="../../contacto/">Contactar</a>
      </div>
    </section>

    <div data-inject-footer></div>
  </div>
  <script src="../../js/inject.js"></script>
  <script src="../../js/navbar.js"></script>
  <script src="../../js/motion.js"></script>
  <script src="../../js/catalog.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), index);
products.forEach((p) => {
  const dir = path.join(root, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(p));
});
console.log("Wrote", products.length, "product pages + catalog");
