/**
 * Normaliza los logos de alianzas: recorta el margen blanco que traen los PNG
 * originales y los reencuadra en un lienzo 640x256 común, para que todas las
 * marcas tengan el mismo peso óptico en el marquee y en las fichas.
 */
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const SRC_DIR = path.join(__dirname, "..", "assets", "img", "nuevos logos");
const OUT_DIR = path.join(__dirname, "..", "assets", "img", "alianzas");

const CANVAS_W = 640;
const CANVAS_H = 256;
const BOX_W = 576;
const BOX_H = 184;

// Un pixel cuenta como contenido si se aleja del blanco puro del fondo.
const WHITE_TOLERANCE = 24;

const FILES = {
  "5.png": "samm.png",
  "6.png": "cdp.png",
  "7.png": "fuplastic.png",
  "8.png": "sigenergy.png",
  "9.png": "fibramerica.png",
  "10.png": "vertiv.png",
  "11.png": "peplink.png",
  "12.png": "must.png",
  "13.png": "blackberry.png",
};

function contentBounds(data, width, height) {
  let top = height;
  let left = width;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const alpha = data[i + 3];
      if (alpha < 16) continue;
      const distance = 765 - (data[i] + data[i + 1] + data[i + 2]);
      if (distance <= WHITE_TOLERANCE) continue;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }

  if (right < 0) return null;
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [srcName, outName] of Object.entries(FILES)) {
    const srcPath = path.join(SRC_DIR, srcName);
    const image = await loadImage(srcPath);

    const probe = createCanvas(image.width, image.height);
    const probeCtx = probe.getContext("2d");
    probeCtx.drawImage(image, 0, 0);
    const { data } = probeCtx.getImageData(0, 0, image.width, image.height);

    const box = contentBounds(data, image.width, image.height);
    if (!box) {
      console.log("SKIP (sin contenido)", srcName);
      continue;
    }

    const scale = Math.min(BOX_W / box.width, BOX_H / box.height);
    const drawW = Math.round(box.width * scale);
    const drawH = Math.round(box.height * scale);
    const dx = Math.round((CANVAS_W - drawW) / 2);
    const dy = Math.round((CANVAS_H - drawH) / 2);

    const out = createCanvas(CANVAS_W, CANVAS_H);
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.drawImage(image, box.left, box.top, box.width, box.height, dx, dy, drawW, drawH);

    const outPath = path.join(OUT_DIR, outName);
    fs.writeFileSync(outPath, out.toBuffer("image/png"));
    console.log(
      outName,
      "recorte " + box.width + "x" + box.height,
      "-> " + drawW + "x" + drawH,
      fs.statSync(outPath).size + " bytes"
    );
  }
})();
