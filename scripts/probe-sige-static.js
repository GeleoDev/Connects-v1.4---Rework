const https = require("https");
const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");

const candidates = [
  "https://wwwstatic.sigenergy.com/static/images/product-SigenStor/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenStor/img01.png",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenStor/img02.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenEVAC/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenEVACCharger/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenEV/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenEVACCharger/img01.png",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenEnergyGateway/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenGateway/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenGatewayHome/img01.webp",
  "https://wwwstatic.sigenergy.com/static/images/product-SigenMicroInverter/img01.webp",
  "https://www.sigenergy.com/en/products/sigen-ev-ac",
  "https://www.sigenergy.com/en/products/sigenevaccharger",
  "https://www.sigenergy.com/en/products/sigen-ev-ac-charging",
  "https://www.sigenergy.com/us/products/sigen-ev-ac-charger",
  "https://www.sigenergy.com/en/products/sigen-energy-gateway-home",
  "https://www.sigenergy.com/us/products/sigen-energy-gateway"
];

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ url, status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      })
      .on("error", (e) => resolve({ url, status: 0, error: e.message }));
  });
}

(async () => {
  for (const url of candidates) {
    const r = await get(url);
    const ct = (r.headers && r.headers["content-type"]) || "";
    console.log(r.status, ct, url);
    if (r.status === 200 && /image\//.test(ct)) {
      const ext = ct.includes("png") ? ".png" : ct.includes("webp") ? ".webp" : ".bin";
      const name = "probe-" + url.split("/").slice(-2).join("-").replace(/[^a-zA-Z0-9.-]/g, "_") + ext;
      fs.writeFileSync(path.join(dest, name), r.body);
      console.log("  saved", name, r.body.length);
    }
    if (r.status === 200 && /html/.test(ct)) {
      const html = r.body.toString("utf8");
      const imgs = html.match(/https:\/\/wwwstatic\.sigenergy\.com\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      console.log("  imgs", [...new Set(imgs)].filter((u) => /upload|product-/i.test(u)).slice(0, 25).join("\n  "));
    }
  }
})();
