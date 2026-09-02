const https = require("https");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");
const urls = [
  "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img02.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img03.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img04.webp",
  "https://www.sigenergy.com/en/products/sigenstack",
  "https://www.sigenergy.com/la/products/sigenstack"
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: "https://www.sigenergy.com/en/products/sigenstack"
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(new URL(res.headers.location, url).href).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, url, type: res.headers["content-type"] || "", body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}

(async () => {
  const extra = new Set();
  for (const url of urls) {
    const r = await get(url);
    console.log(r.status, r.type, url, r.body.length);
    if (/image\//.test(r.type) && r.status === 200) {
      const name = "stack-" + path.basename(url);
      const file = path.join(dest, name);
      fs.writeFileSync(file, r.body);
      if (/\.webp$/i.test(name)) {
        const img = await loadImage(file);
        const c = createCanvas(img.width, img.height);
        c.getContext("2d").drawImage(img, 0, 0);
        const png = file.replace(/\.webp$/i, ".png");
        fs.writeFileSync(png, c.toBuffer("image/png"));
        console.log("saved", path.basename(png), img.width + "x" + img.height);
      }
    }
    if (/html/.test(r.type)) {
      const html = r.body.toString("utf8");
      const imgs = html.match(/https:\/\/wwwstatic\.sigenergy\.com\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      imgs.filter((u) => /SigenStack|upload\/2026-05-19|upload\/2026-05-20/i.test(u)).forEach((u) => extra.add(u));
      console.log("page imgs", [...new Set(imgs.filter((u) => /SigenStack|upload/i.test(u)))].slice(0, 15).join("\n"));
    }
  }
})();
