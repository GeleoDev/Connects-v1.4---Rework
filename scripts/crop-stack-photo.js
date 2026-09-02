const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const srcPath = path.join(__dirname, "..", "recursos", "sigenergy-oficial", "probe-img05.png");
const outPath = path.join(__dirname, "..", "recursos", "sigenergy-oficial", "sigenstack-photo-crop.png");

(async () => {
  const src = await loadImage(srcPath);
  console.log(src.width, src.height);
  const sx = Math.round(src.width * 0.0);
  const sy = Math.round(src.height * 0.38);
  const sw = Math.round(src.width * 0.72);
  const sh = Math.round(src.height * 0.42);
  const size = 1600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(src, sx, sy, sw, sh, 0, 0, size, size);
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
  console.log("wrote crop", sx, sy, sw, sh);
})();
