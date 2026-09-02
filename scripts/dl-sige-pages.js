const https = require("https");
const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");

const pages = [
  "https://www.sigenergy.com/us/products/ac-charger",
  "https://www.sigenergy.com/en/products/ac-charger",
  "https://www.sigenergy.com/us/products/energy-gateway",
  "https://www.sigenergy.com/en/products/sigen-energy-gateway",
  "https://www.sigenergy.com/us/products/sigenstack",
  "https://www.sigenergy.com/en/products/sigenstack"
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.sigenergy.com/" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(new URL(res.headers.location, url).href).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, url, body: Buffer.concat(chunks).toString("utf8") }));
      })
      .on("error", reject);
  });
}

(async () => {
  const found = new Set();
  for (const page of pages) {
    try {
      const r = await get(page);
      console.log("PAGE", r.status, r.url);
      const imgs = r.body.match(/https:\/\/wwwstatic\.sigenergy\.com\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      const uniq = [...new Set(imgs)].filter((u) => /upload|product-/i.test(u));
      uniq.forEach((u) => found.add(u));
      console.log(uniq.slice(0, 20).join("\n"));
    } catch (e) {
      console.log("FAIL", page, e.message);
    }
  }
  let i = 0;
  for (const url of found) {
    if (!/upload\/2026/.test(url)) continue;
    const ext = path.extname(new URL(url).pathname) || ".bin";
    const name = "page-" + ++i + ext;
    await new Promise((resolve) => {
      const file = path.join(dest, name);
      const out = fs.createWriteStream(file);
      https
        .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.sigenergy.com/" } }, (res) => {
          if (res.statusCode !== 200) {
            out.close();
            fs.unlink(file, () => {});
            console.log("SKIP", res.statusCode, url);
            return resolve();
          }
          res.pipe(out);
          out.on("finish", () =>
            out.close(() => {
              console.log("OK", name, fs.statSync(file).size, url);
              resolve();
            })
          );
        })
        .on("error", () => resolve());
    });
  }
})();
