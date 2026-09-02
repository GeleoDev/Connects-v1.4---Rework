const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dir = path.join(__dirname, "..", "recursos", "sigenergy-oficial", "stack-gallery");
(async () => {
  for (const name of fs.readdirSync(dir)) {
    if (!/\.webp$/i.test(name)) continue;
    const file = path.join(dir, name);
    try {
      const img = await loadImage(file);
      const c = createCanvas(img.width, img.height);
      c.getContext("2d").drawImage(img, 0, 0);
      const png = file.replace(/\.webp$/i, ".png");
      fs.writeFileSync(png, c.toBuffer("image/png"));
      console.log(name, img.width + "x" + img.height);
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }
})();
