const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const srcPath = path.join(
  __dirname,
  "..",
  "recursos",
  "sigenergy-oficial",
  "sigenstack-official.png"
);
const outPath = path.join(
  __dirname,
  "..",
  "assets",
  "img",
  "productos",
  "sigenergy",
  "sigenstack.png"
);

(async () => {
  const src = await loadImage(srcPath);
  console.log("source", src.width, src.height);

  const side = Math.min(src.width, src.height);
  const sx = Math.round(src.width * 0.02);
  const sy = Math.round((src.height - side) * 0.12);
  const sw = Math.min(side, src.width - sx);
  const sh = Math.min(side, src.height - sy);

  const size = 1600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(src, sx, sy, sw, sh, 0, 0, size, size);
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
  console.log("wrote", outPath, size, "from", sx, sy, sw, sh);

  const alt = path.join(path.dirname(outPath), "sigenstack-alt.png");
  if (fs.existsSync(alt)) fs.unlinkSync(alt);
})();
