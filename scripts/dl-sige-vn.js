const https = require("https");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");
const pages = [
  "https://sigenergy.vn/en/products/ev-ac-charger",
  "https://www.sigenergy.com/uploads/en_download/1758200575536364.pdf"
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(new URL(res.headers.location, url).href).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, url, body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}

(async () => {
  const r = await get(pages[0]);
  console.log("VN", r.status, r.url);
  const html = r.body.toString("utf8");
  const imgs = [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi)].map((m) => m[0]);
  const uniq = [...new Set(imgs)].filter((u) => /ev|charger|sigen|upload|product/i.test(u));
  console.log(uniq.join("\n"));
  let i = 0;
  for (const url of uniq.slice(0, 12)) {
    try {
      const imgRes = await get(url);
      if (imgRes.status !== 200 || imgRes.body.length < 8000) {
        console.log("skip", imgRes.status, url);
        continue;
      }
      const name = "vn-" + ++i + path.extname(new URL(url).pathname);
      const file = path.join(dest, name);
      fs.writeFileSync(file, imgRes.body);
      console.log("OK", name, imgRes.body.length);
      if (/\.webp$/i.test(name)) {
        const img = await loadImage(file);
        const c = createCanvas(img.width, img.height);
        c.getContext("2d").drawImage(img, 0, 0);
        fs.writeFileSync(file.replace(/\.webp$/i, ".png"), c.toBuffer("image/png"));
      }
    } catch (e) {
      console.log("fail", url, e.message);
    }
  }
})();
