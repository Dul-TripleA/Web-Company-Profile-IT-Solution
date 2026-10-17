// Membuat ulang aset merek dari logo di public/images/logo:
//   - public/images/logo/logo-full.png  (logo lengkap, latar transparan, untuk header dan footer)
//   - src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png, public/icons/icon-192.png, icon-512.png
//   - public/og-default.png (gambar OG 1200x630)
// Sumber: doit_logo.png (logo lengkap di latar gelap) dan do_it_logo2.png (lambang di latar putih).
// Jalankan dari root repo setelah mengganti logo: node docs/reference/make-brand-assets.cjs
// Butuh Google Chrome terpasang (memakai Playwright yang sudah ada di devDependencies).
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LOGO_DIR = path.join(ROOT, 'public/images/logo');
const FULL_SRC = path.join(LOGO_DIR, 'doit_logo.png');
const MARK_SRC = path.join(LOGO_DIR, 'do_it_logo2.png');
const LIME = '#99e344';

const dataUrl = (file) => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;

// Dijalankan di dalam halaman: hapus warna latar (diambil dari piksel pojok) menjadi transparan,
// lalu potong ke area berisi. Alfa dihitung sebagai porsi minimum latar yang harus ditimpa agar
// warna asli tetap berada dalam 0-255, sehingga tepi halus tidak berbingkai.
async function keyOutBackground(page, src, padding) {
  return page.evaluate(
    async ({ src, padding }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;
      const bg = [px[0], px[1], px[2]];
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
      for (let i = 0; i < px.length; i += 4) {
        let alpha = 0;
        for (let c = 0; c < 3; c++) {
          const v = px[i + c];
          const b = bg[c];
          const a = v >= b ? (v - b) / Math.max(255 - b, 1) : (b - v) / Math.max(b, 1);
          if (a > alpha) alpha = a;
        }
        if (alpha < 0.02) {
          px[i + 3] = 0;
          continue;
        }
        for (let c = 0; c < 3; c++) {
          const b = bg[c];
          px[i + c] = Math.max(0, Math.min(255, Math.round(b + (px[i + c] - b) / alpha)));
        }
        px[i + 3] = Math.round(Math.min(alpha, 1) * 255);
        const x = (i / 4) % canvas.width;
        const y = Math.floor(i / 4 / canvas.width);
        if (alpha > 0.1) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      ctx.putImageData(data, 0, 0);
      const x0 = Math.max(minX - padding, 0);
      const y0 = Math.max(minY - padding, 0);
      const w = Math.min(maxX + padding, canvas.width - 1) - x0 + 1;
      const h = Math.min(maxY + padding, canvas.height - 1) - y0 + 1;
      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      out.getContext('2d').drawImage(canvas, x0, y0, w, h, 0, 0, w, h);
      return { url: out.toDataURL('image/png'), bg, width: w, height: h };
    },
    { src, padding },
  );
}

async function shot(browser, html, w, h, out, transparent = false) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden">${html}</body></html>`,
  );
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  await page.screenshot({ path: out, omitBackground: transparent });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const keyPage = await browser.newPage();

  // 1) Logo lengkap transparan, dipotong ke area berisi.
  const full = await keyOutBackground(keyPage, dataUrl(FULL_SRC), 8);
  fs.writeFileSync(
    path.join(LOGO_DIR, 'logo-full.png'),
    Buffer.from(full.url.split(',')[1], 'base64'),
  );
  console.log(`logo-full.png ${full.width}x${full.height}, latar asli rgb(${full.bg.join(',')})`);
  const bgCss = `rgb(${full.bg.join(',')})`;

  // 2) Ikon: lambang (latar putih asli) diperbesar agar memenuhi bingkai.
  const markUrl = dataUrl(MARK_SRC);
  const markBox = (size, radius = 0, zoom = 120) =>
    `<div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:#fff url('${markUrl}') center/${zoom}% no-repeat"></div>`;
  fs.mkdirSync(path.join(ROOT, 'public/icons'), { recursive: true });
  await shot(browser, markBox(192), 192, 192, path.join(ROOT, 'public/icons/icon-192.png'));
  await shot(browser, markBox(512), 512, 512, path.join(ROOT, 'public/icons/icon-512.png'));
  await shot(browser, markBox(180), 180, 180, path.join(ROOT, 'src/app/apple-icon.png'));
  await shot(browser, markBox(256, 56, 135), 256, 256, path.join(ROOT, 'src/app/icon.png'), true);

  // Favicon .ico (PNG di dalam ICO) 32 dan 48 px.
  const favPngs = [];
  for (const size of [32, 48]) {
    const out = path.join(os.tmpdir(), `doit-fav-${size}.png`);
    await shot(browser, markBox(size, Math.round(size * 0.22), 140), size, size, out, true);
    favPngs.push({ size, data: fs.readFileSync(out) });
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(favPngs.length, 4);
  let offset = 6 + 16 * favPngs.length;
  const entries = favPngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  fs.writeFileSync(
    path.join(ROOT, 'src/app/favicon.ico'),
    Buffer.concat([header, ...entries, ...favPngs.map((f) => f.data)]),
  );

  // 3) Gambar OG 1200x630: logo lengkap + tagline.
  const og = `
  <div style="width:1200px;height:630px;background:${bgCss};position:relative;font-family:'Segoe UI',Arial,sans-serif;color:#fff;overflow:hidden">
    <div style="position:absolute;top:-140px;right:80px;width:520px;height:520px;border-radius:50%;background:${LIME};opacity:.12;filter:blur(80px)"></div>
    <img src="${full.url}" style="position:absolute;left:80px;top:70px;height:150px" />
    <div style="position:absolute;left:80px;top:290px;width:1000px">
      <div style="font-size:76px;font-weight:800;line-height:1.08;letter-spacing:-2px">We Build Digital Solutions <span style="color:${LIME}">For Your Business</span></div>
      <div style="margin-top:36px;font-size:34px;color:#cbd5e1">Kami Membangun Solusi Digital untuk Bisnis Anda</div>
    </div>
    <div style="position:absolute;left:0;bottom:0;width:1200px;height:14px;background:${LIME}"></div>
  </div>`;
  await shot(browser, og, 1200, 630, path.join(ROOT, 'public/og-default.png'));

  await browser.close();
  console.log('selesai');
})();
