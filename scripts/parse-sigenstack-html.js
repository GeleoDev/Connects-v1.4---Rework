const https = require("https");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "text/html",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

(async () => {
  const html = await get("https://www.sigenergy.com/en/products/sigenstack");
  const imgs = [...html.matchAll(/<img[^>]+>/gi)].map((m) => m[0]);
  console.log("IMG TAGS", imgs.length);
  imgs.slice(0, 40).forEach((t, i) => {
    const src = (t.match(/src="([^"]+)"/) || [])[1];
    const alt = (t.match(/alt="([^"]*)"/) || [])[1];
    if (src && /upload|SigenStack|product/i.test(src)) {
      console.log(i, alt || "", src.slice(0, 140));
    }
  });

  const og = html.match(/property="og:image"[^>]+content="([^"]+)"/i)
    || html.match(/content="([^"]+)"[^>]+property="og:image"/i);
  console.log("OG", og && og[1]);

  const jsonImgs = html.match(/https:\/\/wwwstatic\.sigenergy\.com\/upload\/2026-05-19[^"']+/g);
  console.log("MAY19", jsonImgs && [...new Set(jsonImgs)]);
})();
