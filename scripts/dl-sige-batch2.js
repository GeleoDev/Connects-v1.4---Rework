const https = require("https");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");

const files = {
  "batch-46953.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831046953_fb16ede4-fb87-46e8-9a83-a8ddae0d463a.webp",
  "batch-51246.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831051246_b70abcb8-62a2-487c-9a42-7b5fbfe9bfd6.webp",
  "batch-59473.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831059473_3d422ec7-d30c-4955-a4bd-61db8be1d895.webp",
  "batch-58303.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831058303_8a3cb6a0-5f4f-4b3f-a71b-9400c7db5be5.webp",
  "batch-53561.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831053561_36b3595a-4258-4f42-8806-c4d13f77949c.webp",
  "batch-52414.webp": "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831052414_192b79c7-111e-4d2d-bebe-be24371232da.webp",
  "batch-78562.png": "https://wwwstatic.sigenergy.com/upload/2026-06-11/1781178562987_4dd9eea0-4201-4d0b-9725-079bc1e98e4f.png",
  "batch-12641.png": "https://wwwstatic.sigenergy.com/upload/2026-07-21/1784612641739_20e9a65a-3d8a-4484-baec-3e2a4d4d8b7b.png",
  "batch-3571.jpg": "https://wwwstatic.sigenergy.com/upload/2026-06-09/1780973571161_7221e1f8-2b40-41d4-a6b0-0b2175b07b26.jpg",
  "batch-3906.jpg": "https://wwwstatic.sigenergy.com/upload/2026-06-09/1780973906145_eba60060-50de-46e7-a3f5-867db5b997d3.jpg"
};

function download(url, file) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(file);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.sigenergy.com/en/products/sigenstor" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          out.close();
          fs.unlink(file, () => {});
          return download(res.headers.location, file).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          out.close();
          fs.unlink(file, () => {});
          return reject(new Error(String(res.statusCode)));
        }
        res.pipe(out);
        out.on("finish", () => out.close(() => resolve()));
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
      if (/\.webp$/i.test(name)) {
        const img = await loadImage(file);
        const c = createCanvas(img.width, img.height);
        c.getContext("2d").drawImage(img, 0, 0);
        const png = file.replace(/\.webp$/i, ".png");
        fs.writeFileSync(png, c.toBuffer("image/png"));
        console.log("  png", img.width + "x" + img.height);
      }
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }
})();
