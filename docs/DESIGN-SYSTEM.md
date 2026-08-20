# Connects Rework C — Design System

## Enfoque

- **Tema oscuro** en todo el sitio (`#050a12` → `#16304d`).
- **Mobile-first**: estilos base para móvil; desktop desde `700px` / `1100px` (navbar).
- Inspirado en la estructura de la home de Connects-v1.4 Peplink **-b** (hero, ofrecemos, alianzas, sobre, contacto), con navegación y visual nuevos.

## Tipografía

| Uso | Familia | Por qué |
|-----|---------|---------|
| Display | Sora | Moderna y tech, sin el ancho extremo de Syne |
| UI / cuerpo | DM Sans | Legible en oscuro |
| Peplink | Noto Sans (+ Sora display) | Brand Book (Averta no es libre) |

## Color

| Token | Hex |
|-------|-----|
| bg-0 | `#050a12` |
| bg-1 | `#0a1524` |
| blue / cyan | `#2e8fd6` / `#3ec6ff` |
| text | `#e8f1f8` |
| Peplink orange | `#FFB81C` |
| MUST mint | `#7CFFB2` |

## Navbar

- Glass: `backdrop-filter: blur(16px)` sobre el contenido.
- **Móvil**: drawer fullscreen bajo el header; Productos = accordion.
- **Desktop ≥1100px**: menú horizontal; Productos = dropdown.
- Toggle Empresas / Individuos siempre visible.

## Audience

`localStorage.connects-audience` + atributos `data-copy-*`, `data-html-*`, `data-img-*`.

## Imágenes guía

| Uso | Ancho sugerido |
|-----|----------------|
| Hero | 1920×1080 |
| Cards | 800×500 |
| Logos | altura display 40–56px (Peplink ≥70px ancho) |

## Archivos

`css/tokens.css`, `base.css`, `navbar.css`, `footer.css`, `home.css`, `pages.css`, `peplink.css`  
`js/inject.js`, `audience.js`, `navbar.js`, `motion.js`
