const https = require("https");
const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");
fs.mkdirSync(dest, { recursive: true });

const files = {
  "sigenstor-hero.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-19/1779170225370_ea41ae75-8c54-4393-b6f4-d2cd42fab0fa.webp",
  "sigenstor-a.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831048140_eff3f5dd-8292-4d68-a7c6-2590f703a9a2.webp",
  "sigenstor-b.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831050076_bd962cb9-649c-4133-9512-c13652f4e330.webp",
  "sigenstor-c.webp": "https://wwwstatic.sigenergy.com/upload/2026-06-23/1782218777524_699d9fb1-0308-4f86-a0ee-b12982628480.webp",
  "product-img101.png": "https://wwwstatic.sigenergy.com/static/images/product/img101.png",
  "sigenstack-img01.webp": "https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img01.webp",
  "sigenstack-png.png": "https://wwwstatic.sigenergy.com/upload/2026-05-19/1779178788234_b72e8e43-1106-4a9a-b205-85f3b5a80081.png",
  "sigenstack-b.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-20/1779263081134_60f38f4a-0bc8-4b7f-ab5e-8405d54995c5.webp",
  "hybrid-img01.webp": "https://wwwstatic.sigenergy.com/static/images/product-SigenHybridInverter/img01.webp",
  "hybrid-a.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-20/1779263614470_784c01a5-8207-465f-bac6-a85ff5e7365c.webp",
  "catalog-a.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831065382_e8b571ec-f9ca-4f59-a00f-dfc5567a4fa8.webp",
  "catalog-b.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831064187_97005dd7-c773-4ee3-aa70-f303190d6edd.webp",
  "catalog-c.webp": "https://wwwstatic.sigenergy.com/upload/2026-06-22/1782105656450_be1e1569-612a-49b3-a3b6-55177e377cce.webp",
  "catalog-d.webp": "https://wwwstatic.sigenergy.com/upload/2026-06-18/1781749640663_f9e40d2b-8a43-48c0-a38d-bb8c39f4efcc.webp",
  "misc-png.png": "https://wwwstatic.sigenergy.com/upload/2026-08-04/1785838270232_2f4c4453-3f4d-486e-88ef-99e1720e846d.png"
};

function download(url, file) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(file);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          out.close();
          fs.unlink(file, () => {});
          return download(res.headers.location, file).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          out.close();
          fs.unlink(file, () => {});
          return reject(new Error(res.statusCode + " " + url));
        }
        res.pipe(out);
        out.on("finish", () => out.close(() => resolve(file)));
      })
      .on("error", reject);
  });
}

(async () => {
  for (const [name, url] of Object.entries(files)) {
    const file = path.join(dest, name);
    try {
      await download(url, file);
      console.log("OK", name, fs.statSync(file).size);
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }

  const extraPages = [
    "https://www.sigenergy.com/en/products/sigen-energy-gateway",
    "https://www.sigenergy.com/en/products/sigen-gateway",
    "https://www.sigenergy.com/en/products/energy-gateway",
    "https://www.sigenergy.com/en/products/sigen-ev-ac-charger",
    "https://www.sigenergy.com/en/products/sigen-ev-charger",
    "https://www.sigenergy.com/en/products/ev-ac-charger",
    "https://www.sigenergy.com/en/products/sigenmicro"
  ];
  for (const page of extraPages) {
    try {
      const body = await new Promise((resolve, reject) => {
        https
          .get(page, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
          })
          .on("error", reject);
      });
      console.log("PAGE", body.status, page);
      const imgs = body.body.match(/https:\/\/wwwstatic\.sigenergy\.com\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      console.log([...new Set(imgs)].filter((u) => /upload|product-/i.test(u)).slice(0, 20).join("\n"));
    } catch (e) {
      console.log("PAGE FAIL", page, e.message);
    }
  }
})();
