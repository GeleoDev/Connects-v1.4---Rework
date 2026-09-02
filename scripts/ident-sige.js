const fs = require("fs");
const path = require("path");
const dest = path.join(__dirname, "..", "assets", "img", "productos", "sigenergy");
const srcDir = path.join(__dirname, "..", "recursos", "sigenergy-oficial");

const map = {
  "sigenstor.png": "product-img101.png",
  "sigen-gateway.png": "sigenstor-a.png",
  "sigen-hybrid.png": "sigenstor-b.png"
};

for (const [out, src] of Object.entries(map)) {
  fs.copyFileSync(path.join(srcDir, src), path.join(dest, out));
  console.log("copied", src, "->", out, fs.statSync(path.join(dest, out)).size);
}
