const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const SRC = path.join(__dirname, "..", "assets", "img", "nuevos logos");
const OUT = path.join(__dirname, "..", "assets", "img", "brand");
const PAD = 8;
const WHITE = 240;

function contentBounds(data, width, height) {
  let top = height;
  let left = width;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const a = data[(y * width + x) * 4 + 3];
      if (a < 16) continue;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
  if (right < 0) return null;
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function punchWhiteAndPrepare(image, mode) {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const img = ctx.getImageData(0, 0, image.width, image.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    if (r >= WHITE && g >= WHITE && b >= WHITE) {
      d[i + 3] = 0;
      continue;
    }
    if (mode === "peplink") {
      const isOrange = r > 180 && g > 90 && b < 140 && r - b > 50;
      if (isOrange) continue;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      d[i] = 255;
      d[i + 1] = 255;
      d[i + 2] = 255;
      if (lum <= 205) {
        d[i + 3] = 255;
      } else {
        d[i + 3] = Math.round(((WHITE - lum) / (WHITE - 205)) * 255);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

async function process(srcName, outName, mode) {
  const image = await loadImage(path.join(SRC, srcName));
  const prepared = punchWhiteAndPrepare(image, mode);
  const { data } = prepared.getContext("2d").getImageData(0, 0, prepared.width, prepared.height);
  const box = contentBounds(data, prepared.width, prepared.height);
  if (!box) throw new Error("sin contenido: " + srcName);
  const w = box.width + PAD * 2;
  const h = box.height + PAD * 2;
  const out = createCanvas(w, h);
  const ctx = out.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(prepared, box.left, box.top, box.width, box.height, PAD, PAD, box.width, box.height);
  const dest = path.join(OUT, outName);
  fs.writeFileSync(dest, out.toBuffer("image/png"));
  console.log(outName, box.width + "x" + box.height, "->", w + "x" + h);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await process("11.png", "peplink-hero.png", "peplink");
})();
