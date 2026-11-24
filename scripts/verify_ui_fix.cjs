const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const os = require('os');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DIST_DIR = path.resolve(__dirname, '../dist');
const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
};

const PORT = 4195;

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA Fallback
    const indexPath = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(PORT, async () => {
  console.log(`Verification Server running at http://localhost:${PORT}`);

  const port = 9333;
  const userDataDir = path.join(os.tmpdir(), `chrome-test-profile-${Date.now()}`);
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        wsUrl = (await res.json()).webSocketDebuggerUrl;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const cbs = new Map();
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && cbs.has(d.id)) {
      cbs.get(d.id)(d.result);
      cbs.delete(d.id);
    }
  };
  await new Promise((r) => (ws.onopen = r));
  const cmd = (method, params = {}) =>
    new Promise((resolve) => {
      const i = id++;
      cbs.set(i, resolve);
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  const { targetId } = await cmd('Target.createTarget', { url: `http://localhost:${PORT}/` });
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageWs = new WebSocket(targets.find((t) => t.id === targetId).webSocketDebuggerUrl);

  let pageId = 1;
  const pageCbs = new Map();
  pageWs.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pageCbs.has(d.id)) {
      pageCbs.get(d.id)(d.result);
      pageCbs.delete(d.id);
    }
  };
  await new Promise((r) => (pageWs.onopen = r));
  const pCmd = (method, params = {}) =>
    new Promise((resolve) => {
      const i = pageId++;
      pageCbs.set(i, resolve);
      pageWs.send(JSON.stringify({ id: i, method, params }));
    });

  await pCmd('Page.enable');

  console.log('\n--- 1. AUDITING THEMES PAGE (/decorations) ---');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/decorations` });
  await new Promise((r) => setTimeout(r, 1200));

  const themesAudit = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.theme-detail-card'));
      return cards.map((c, i) => {
        const title = c.querySelector('.theme-title')?.innerText || '';
        const media = c.querySelector('.theme-detail-media');
        const img = c.querySelector('.theme-showcase-img');
        const swatches = Array.from(c.querySelectorAll('.palette-swatch-item')).map(s => s.innerText.trim());
        const thumbs = Array.from(c.querySelectorAll('.variation-thumb-btn')).length;
        
        const mediaRect = media ? media.getBoundingClientRect() : null;
        const imgRect = img ? img.getBoundingClientRect() : null;
        const computedMediaBg = media ? window.getComputedStyle(media).backgroundColor : '';
        const imgComputed = img ? {
          objectFit: window.getComputedStyle(img).objectFit,
          position: window.getComputedStyle(img).position,
          width: img.offsetWidth,
          height: img.offsetHeight
        } : null;

        return {
          index: i + 1,
          title,
          imgSrc: img ? img.getAttribute('src') : null,
          mediaHeight: mediaRect ? Math.round(mediaRect.height) : 0,
          imgHeight: imgRect ? Math.round(imgRect.height) : 0,
          imgWidth: imgRect ? Math.round(imgRect.width) : 0,
          objectFit: imgComputed?.objectFit,
          position: imgComputed?.position,
          fillsEntireMedia: imgRect && mediaRect ? Math.abs(imgRect.height - mediaRect.height) < 4 : false,
          swatchesCount: swatches.length,
          thumbsCount: thumbs
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('Themes audit results:', JSON.stringify(themesAudit.result.value, null, 2));

  // Capture screenshot of Themes page top card
  const themesShot = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'themes_page_desktop_fix.png'), Buffer.from(themesShot.data, 'base64'));
  console.log('Saved screenshots/themes_page_desktop_fix.png');

  // Scroll down to see card 2 & 3
  await pCmd('Runtime.evaluate', { expression: 'window.scrollBy(0, 850)' });
  await new Promise((r) => setTimeout(r, 400));
  const themesShot2 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'themes_page_desktop_card2.png'), Buffer.from(themesShot2.data, 'base64'));

  console.log('\n--- 2. AUDITING PHOTO WALL ON HOME (/) ---');
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 1200));

  // Scroll to photo wall
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const pw = document.querySelector('.section-photowall');
      if (pw) pw.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise((r) => setTimeout(r, 600));

  const photoWallAudit = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('.section-photowall');
      const headerRow = document.querySelector('.photowall-header-row');
      const mosaicViewport = document.querySelector('.photowall-mosaic-viewport');
      const oldScrimCard = document.querySelector('.scrim-card-overlay');
      const tiles = Array.from(document.querySelectorAll('.mosaic-tile'));

      const headerRect = headerRow ? headerRow.getBoundingClientRect() : null;
      const viewportRect = mosaicViewport ? mosaicViewport.getBoundingClientRect() : null;

      // Check if header overlaps mosaic
      const overlaps = headerRect && viewportRect ? !(headerRect.bottom <= viewportRect.top || headerRect.top >= viewportRect.bottom) : false;

      return {
        sectionExists: Boolean(section),
        oldScrimCardExists: Boolean(oldScrimCard),
        headerExists: Boolean(headerRow),
        mosaicViewportExists: Boolean(mosaicViewport),
        tilesCount: tiles.length,
        headerBottom: headerRect ? Math.round(headerRect.bottom) : 0,
        mosaicTop: viewportRect ? Math.round(viewportRect.top) : 0,
        overlaps,
        isHeaderAboveMosaic: headerRect && viewportRect ? headerRect.bottom <= viewportRect.top : false
      };
    })()`,
    returnByValue: true
  });

  console.log('Photo wall audit results:', JSON.stringify(photoWallAudit.result.value, null, 2));

  const pwShot = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'photowall_desktop_fix.png'), Buffer.from(pwShot.data, 'base64'));
  console.log('Saved screenshots/photowall_desktop_fix.png');

  // Mobile Audit (390px)
  console.log('\n--- 3. MOBILE AUDIT (390px) ---');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });

  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/decorations` });
  await new Promise((r) => setTimeout(r, 800));
  const mobThemesShot = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'themes_page_mobile_fix.png'), Buffer.from(mobThemesShot.data, 'base64'));

  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 800));
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const pw = document.querySelector('.section-photowall');
      if (pw) pw.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise((r) => setTimeout(r, 400));
  const mobPwShot = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'photowall_mobile_fix.png'), Buffer.from(mobPwShot.data, 'base64'));

  console.log('\nAll audit screenshots captured successfully!');

  // Cleanup
  chrome.kill();
  server.close();
  process.exit(0);
});
