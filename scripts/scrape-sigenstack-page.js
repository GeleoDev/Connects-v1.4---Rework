const https = require("https");
const fs = require("fs");
const path = require("path");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
          Referer: "https://www.sigenergy.com/",
        },
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(new URL(res.headers.location, url).href).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            url,
            type: res.headers["content-type"] || "",
            body: Buffer.concat(chunks),
          })
        );
      })
      .on("error", reject);
  });
}

(async () => {
  const pages = [
    "https://www.sigenergy.com/au/products/sigenstack",
    "https://www.sigenergy.com/us/products/sigenstack",
    "https://www.sigenergy.com/en/products/sigenstack",
    "https://www.sigenergy.com/uk/products/sigenstack",
  ];
  const found = new Set();
  for (const url of pages) {
    try {
      const r = await get(url);
      console.log("PAGE", r.status, r.type, url, r.body.length);
      const html = r.body.toString("utf8");
      const imgs = html.match(/https?:\/\/[^"'\\\s>]+\.(?:png|jpe?g|webp|gif|avif)/gi) || [];
      const rel = html.match(/\/static\/images\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      const uploads = html.match(/\/upload\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      [...imgs, ...rel, ...uploads].forEach((u) => found.add(u));
      const snippet = html.match(/product-SigenStack[^"'\\\s>]{0,80}/gi);
      if (snippet) console.log("stack refs", snippet.slice(0, 20));
    } catch (e) {
      console.log("FAIL", url, e.message);
    }
  }
  const extra = [
    "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img01.webp",
    "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img05.webp",
    "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img06.webp",
    "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/product.webp",
    "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/banner.webp",
    "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/kv.webp",
    "https://wwwstatic.sigenergy.com/static/images/product/sigenstack.png",
    "https://wwwstatic.sigenergy.com/static/images/product/sigenstack.webp",
    "https://wwwstatic.sigenergy.com/static/images/product/SigenStack.png",
  ];
  extra.forEach((u) => found.add(u));
  console.log("FOUND", found.size);
  [...found].forEach((u) => console.log(u));

  const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");
  for (const raw of extra) {
    try {
      const r = await get(raw);
      console.log("PROBE", r.status, r.type, raw, r.body.length);
    } catch (e) {
      console.log("PROBE FAIL", raw, e.message);
    }
  }
})();
