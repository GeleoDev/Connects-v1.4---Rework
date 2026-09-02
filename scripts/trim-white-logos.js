const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const SRC = path.join(__dirname, "..", "assets", "img", "logos blancos");
const OUT = path.join(__dirname, "..", "assets", "img", "brand");
const PAD = 16;

const FILES = {
  "sigenergy blanco.png": "sigenergy-blanco.png",
  "samm blanco.png": "samm-blanco.png",
};

function bounds(data, width, height) {
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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [srcName, outName] of Object.entries(FILES)) {
    const image = await loadImage(path.join(SRC, srcName));
    const probe = createCanvas(image.width, image.height);
    const pctx = probe.getContext("2d");
    pctx.drawImage(image, 0, 0);
    const { data } = pctx.getImageData(0, 0, image.width, image.height);
    const box = bounds(data, image.width, image.height);
    if (!box) continue;
    const w = box.width + PAD * 2;
    const h = box.height + PAD * 2;
    const out = createCanvas(w, h);
    const ctx = out.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(image, box.left, box.top, box.width, box.height, PAD, PAD, box.width, box.height);
    const dest = path.join(OUT, outName);
    fs.writeFileSync(dest, out.toBuffer("image/png"));
    console.log(outName, box.width + "x" + box.height, "->", w + "x" + h, fs.statSync(dest).size);
  }
})();
