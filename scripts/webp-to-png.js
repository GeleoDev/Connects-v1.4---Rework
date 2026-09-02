const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dir = path.join(__dirname, "..", "recursos", "sigenergy-oficial");

(async () => {
  for (const name of fs.readdirSync(dir)) {
    if (!/\.webp$/i.test(name)) continue;
    const src = path.join(dir, name);
    try {
      const img = await loadImage(src);
      const c = createCanvas(img.width, img.height);
      c.getContext("2d").drawImage(img, 0, 0);
      const dest = path.join(dir, name.replace(/\.webp$/i, ".png"));
      fs.writeFileSync(dest, c.toBuffer("image/png"));
      console.log("OK", name, img.width + "x" + img.height, "->", path.basename(dest));
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }
})();
