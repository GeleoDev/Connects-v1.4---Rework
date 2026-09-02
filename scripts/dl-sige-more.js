const https = require("https");
const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");

const files = {
  "more-3608.png": "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243608388_1a91718b-84f8-4c25-bbdb-3bf6e6762632.png",
  "more-3607.png": "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243607004_83a265f2-be3c-4a15-8adb-3d364dc06a52.png",
  "more-3611.png": "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243611261_3c1d3307-3fc0-4a08-8bf1-e95af8028c98.png",
  "more-3610.png": "https://wwwstatic.sigenergy.com/upload/2026-06-12/1781243610196_f5ce6258-733d-43e3-b657-7749d426ae7f.png",
  "more-0470.png": "https://wwwstatic.sigenergy.com/upload/2026-06-03/1780470942755_debbe60d-7cf9-4da5-a090-809180e3df5f.png",
  "more-6599.png": "https://wwwstatic.sigenergy.com/upload/2026-08-13/1786599860015_9f47ea54-5c7b-4946-a1b4-eb21b3cf0245.png",
  "more-7739.png": "https://wwwstatic.sigenergy.com/upload/2026-08-26/1787739916860_0e337df0-90ee-4efe-bc59-ccc5b52e494b.png",
  "more-7622.png": "https://wwwstatic.sigenergy.com/upload/2026-08-25/1787622518150_c3bc3762-6d89-4aa1-90b1-4f8c9c42267c.png",
  "more-4612.png": "https://wwwstatic.sigenergy.com/upload/2026-07-21/1784612641739_20e9a65a-3d8a-4484-baec-3d364dc06a52.png",
  "more-4612b.png": "https://wwwstatic.sigenergy.com/upload/2026-07-21/1784612641739_20e9a65a-3d8a-4484-baec-3d364dc06a52.png"
};

function download(url, file) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(file);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.sigenergy.com/" } }, (res) => {
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
    try {
      await download(url, path.join(dest, name));
      console.log("OK", name, fs.statSync(path.join(dest, name)).size);
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }
})();
