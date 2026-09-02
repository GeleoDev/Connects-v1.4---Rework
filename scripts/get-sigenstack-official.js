const https = require("https");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const dest = path.join(__dirname, "..", "recursos", "sigenergy-oficial");
const outPng = path.join(__dirname, "..", "assets", "img", "productos", "sigenergy", "sigenstack.png");

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.sigenergy.com/en/products/sigenstack",
        },
      },
      (res) => {
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
            url,
          })
        );
      }
    );
    req.on("error", reject);
    req.setTimeout(25000, () => req.destroy(new Error("timeout " + url)));
  });
}

async function saveImage(url, name) {
  const r = await get(url);
  console.log(r.status, r.type, r.body.length, url);
  if (r.status !== 200 || !/image\//.test(r.type)) return null;
  const file = path.join(dest, name);
  fs.writeFileSync(file, r.body);
  if (/\.webp$/i.test(name)) {
    const img = await loadImage(file);
    const c = createCanvas(img.width, img.height);
    c.getContext("2d").drawImage(img, 0, 0);
    const png = file.replace(/\.webp$/i, ".png");
    fs.writeFileSync(png, c.toBuffer("image/png"));
    console.log("png", path.basename(png), img.width + "x" + img.height);
    return png;
  }
  return file;
}

(async () => {
  const pages = [
    "https://www.sigenergy.com/au/products/sigenstack",
    "https://www.sigenergy.com/us/products/sigenstack",
    "https://www.sigenergy.com/en/products/sigenstack",
    "https://web.archive.org/web/2025/https://www.sigenergy.com/en/products/sigenstack",
  ];
  const found = new Set();
  for (const url of pages) {
    try {
      const r = await get(url);
      console.log("PAGE", r.status, r.body.length, url);
      const html = r.body.toString("utf8");
      const imgs = html.match(/https?:\/\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      const rels = html.match(/\/(?:static|upload|uploads)\/[^"'\\\s>]+\.(?:png|jpe?g|webp)/gi) || [];
      imgs.forEach((u) => found.add(u));
      rels.forEach((u) => {
        if (u.startsWith("http")) found.add(u);
        else found.add("https://wwwstatic.sigenergy.com" + u);
      });
    } catch (e) {
      console.log("PAGE FAIL", url, e.message);
    }
  }

  const stackHits = [...found].filter((u) => /sigenstack|SigenStack|stack|BAT|upload\/2026/i.test(u));
  console.log("STACK HITS", stackHits.length);
  stackHits.slice(0, 40).forEach((u) => console.log(" ", u));

  const probes = [];
  for (let i = 1; i <= 12; i++) {
    const n = String(i).padStart(2, "0");
    probes.push("https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img" + n + ".webp");
    probes.push("https://wwwstatic.sigenergy.com/static/images/product-SigenStack/img" + i + ".webp");
  }

  for (const url of probes) {
    try {
      await saveImage(url, "probe-" + path.basename(url));
    } catch (e) {
      console.log("PROBE FAIL", url, e.message);
    }
  }

  const officialWall =
    "https://wwwstatic.sigenergy.com/upload/2026-05-19/1779178788234_b72e8e43-1106-4a9a-b205-85f3b5a80081.png";
  const wallFile = path.join(dest, "sigenstack-official.png");
  if (!fs.existsSync(wallFile)) {
    await saveImage(officialWall, "sigenstack-official.png");
  }

  const src = await loadImage(wallFile);
  const size = 1400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, size, size);

  const cropW = Math.min(src.width, Math.round(src.height * 1.05));
  const cropH = src.height;
  const sx = Math.round((src.width - cropW) * 0.08);
  const sy = 0;
  const pad = 48;
  ctx.drawImage(src, sx, sy, cropW, cropH, pad, pad, size - pad * 2, size - pad * 2);

  fs.writeFileSync(outPng, canvas.toBuffer("image/png"));
  console.log("wrote catalog", outPng, size);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
