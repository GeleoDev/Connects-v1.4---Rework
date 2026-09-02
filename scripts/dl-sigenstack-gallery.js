const https = require("https");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial", "stack-gallery");
fs.mkdirSync(dest, { recursive: true });

const urls = [
  "https://wwwstatic.sigenergy.com/upload/2026-08-26/1787739916860_0e337df0-90ee-4efe-bc59-ccc5b52e494b.png",
  "https://wwwstatic.sigenergy.com/upload/2026-08-25/1787622518150_c3bc3762-6d89-4aa1-90b1-4f8c9c42267c.png",
  "https://wwwstatic.sigenergy.com/upload/2026-08-04/1785838270232_2f4c4453-3f4d-486e-88ef-99e1720e846d.png",
  "https://wwwstatic.sigenergy.com/upload/2026-06-11/1781178562987_4dd9eea0-4201-4d0b-9725-079bc1e98e4f.png",
  "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243608388_1a91718b-84f8-4c25-bbdb-3bf6e6762632.png",
  "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243607004_83a265f2-be3c-4a15-8adb-3d364dc06a52.png",
  "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243611261_3c1d3307-3fc0-4a08-8bf1-e95af8028c98.png",
  "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243610196_f5ce6258-733d-43e3-b657-7749d426ae7f.png",
  "https://wwwstatic.sigenergy.com/upload/2026-05-21/1779350588975_97c48169-cfe7-4727-93bf-97029e94f41f.webp",
  "https://wwwstatic.sigenergy.com/upload/2026-05-19/1779178788234_b72e8e43-1106-4a9a-b205-85f3b5a80081.png",
  "https://wwwstatic.sigenergy.com/upload/2026-05-20/1779263081134_60f38f4a-0bc8-4b7f-ab5e-8405d54995c5.webp",
  "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831046953_fb16ede4-fb87-46e8-9a83-a8ddae0d463a.webp",
  "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831048140_eff3f5dd-8292-4d68-a7c6-2590f703a9a2.webp",
  "https://wwwstatic.sigenergy.com/upload/2026-05-15/1778831052414_192b79c7-111e-4d2d-bebe-be24371232da.webp",
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Referer: "https://www.sigenergy.com/en/products/sigenstack",
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
            type: res.headers["content-type"] || "",
            body: Buffer.concat(chunks),
          })
        );
      })
      .on("error", reject);
  });
}

(async () => {
  for (const [i, url] of urls.entries()) {
    const ext = path.extname(new URL(url).pathname) || ".bin";
    const name = "g" + String(i + 1).padStart(2, "0") + ext;
    const r = await get(url);
    console.log(r.status, r.type, r.body.length, name);
    if (r.status !== 200 || !/image\//.test(r.type)) continue;
    const file = path.join(dest, name);
    fs.writeFileSync(file, r.body);
    if (/\.webp$/i.test(name)) {
      const img = await loadImage(file);
      const c = createCanvas(img.width, img.height);
      c.getContext("2d").drawImage(img, 0, 0);
      const png = file.replace(/\.webp$/i, ".png");
      fs.writeFileSync(png, c.toBuffer("image/png"));
      console.log("  ", img.width + "x" + img.height);
    } else {
      const img = await loadImage(file);
      console.log("  ", img.width + "x" + img.height);
    }
  }
})();
