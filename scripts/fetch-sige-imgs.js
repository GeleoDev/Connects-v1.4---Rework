const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const pages = [
  "https://www.sigenergy.com/en/products/sigenstor",
  "https://www.sigenergy.com/en/products/sigenstack",
  "https://www.sigenergy.com/en/products",
  "https://www.sigenergy.com/en/products/ev-charger",
  "https://www.sigenergy.com/en/products/sigen-evac",
  "https://www.sigenergy.com/en/products/sigenstor-evdc",
  "https://www.sigenergy.com/en/products/hybrid-inverter",
  "https://www.sigenergy.com/en/products/sigen-hybrid",
  "https://www.sigenergy.com/en/products/energy-gateway",
  "https://www.sigenergy.com/en/products/sigen-gateway",
  "https://www.sigenergy.com/us/products/sigenstor"
];

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,*/*"
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = new URL(res.headers.location, url).href;
          return get(next).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8"), url }));
      }
    );
    req.on("error", reject);
    req.setTimeout(25000, () => {
      req.destroy(new Error("timeout " + url));
    });
  });
}

(async () => {
  const found = new Set();
  for (const page of pages) {
    try {
      const { status, body, url } = await get(page);
      console.log("\n====", status, url);
      const re = /https?:\/\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi;
      const local = /(?:src|srcset|data-src|content)=["']([^"']+\.(?:png|jpe?g|webp))/gi;
      let m;
      while ((m = re.exec(body))) found.add(m[0]);
      while ((m = local.exec(body))) {
        try {
          found.add(new URL(m[1], url).href);
        } catch (_) {}
      }
      const sample = [...found].filter((u) => /sigen|stor|stack|hybrid|ev|gateway|product/i.test(u));
      console.log("hits", sample.slice(-15).join("\n"));
    } catch (e) {
      console.log("FAIL", page, e.message);
    }
  }
  const out = [...found].filter((u) => /sigen|stor|stack|hybrid|ev|gateway|product|upload/i.test(u));
  console.log("\nALL FILTERED\n" + out.join("\n"));
  fs.writeFileSync(path.join(__dirname, "sige-img-urls.txt"), out.join("\n"));
})();
