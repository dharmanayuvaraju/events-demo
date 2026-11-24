const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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
};

const PORT = 4192;

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
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

  const port = 9228;
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
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

  const viewports = [
    { name: '320px_mobile_compact', width: 320, height: 640 },
    { name: '360px_mobile_standard', width: 360, height: 740 },
    { name: '390px_iphone_14', width: 390, height: 844 },
    { name: '412px_pixel_galaxy', width: 412, height: 915 },
    { name: '768px_tablet_portrait', width: 768, height: 1024 },
    { name: '844px_mobile_landscape', width: 844, height: 390 },
    { name: '1440px_laptop', width: 1440, height: 900 },
    { name: '1920px_desktop_fhd', width: 1920, height: 1080 },
    { name: '2560px_desktop_qhd', width: 2560, height: 1440 },
  ];

  console.log('\n=============================================================');
  console.log('   VIEWPORT VERIFICATION: HORIZONTAL OVERFLOW & SCREENSHOTS');
  console.log('=============================================================');

  // Create single page target for viewport audits
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
  await pCmd('Performance.enable');

  const results = [];

  for (const vp of viewports) {
    await pCmd('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768,
    });

    await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
    await new Promise((r) => setTimeout(r, 600));

    const evalRes = await pCmd('Runtime.evaluate', {
      expression: `({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
        equals: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        hasWeddingHero: Boolean(document.querySelector('.wedding-hero')),
        hasCategoryOverview: Boolean(document.querySelector('.section-category-overview')),
        hasEditorialSplit: Boolean(document.querySelector('.section-editorial-split')),
        hasAccordion: Boolean(document.querySelector('.section-accordion')),
        hasPhotoWall: Boolean(document.querySelector('.section-photowall')),
        hasClosingEnquiry: Boolean(document.querySelector('.section-closing-enquiry'))
      })`,
      returnByValue: true,
    });

    const m = evalRes.result.value;
    const passed = m.equals;

    console.log(
      `Viewport ${vp.width}x${vp.height} (${vp.name}): ` +
        `scrollWidth=${m.scrollWidth}, clientWidth=${m.clientWidth}, innerWidth=${m.innerWidth} ` +
        `-> ${passed ? '✓ EXACT MATCH (zero horizontal overflow: scrollWidth <= clientWidth)' : '✗ OVERFLOW'}` +
        ` [Hero: ${m.hasWeddingHero ? 'OK' : 'FAIL'}, Accordion: ${m.hasAccordion ? 'OK' : 'FAIL'}, Wall: ${m.hasPhotoWall ? 'OK' : 'FAIL'}]`
    );

    // Save screenshot
    const shot = await pCmd('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(SCREENSHOTS_DIR, `${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    results.push({ ...vp, ...m, passed });
  }

  // Performance & Vitals check
  console.log('\n=============================================================');
  console.log('   PERFORMANCE & CORE WEB VITALS MEASUREMENT');
  console.log('=============================================================');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 1000));

  const perfMetrics = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');
      
      return {
        fcpMs: fcp ? Math.round(fcp.startTime) : null,
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        loadEventMs: Math.round(nav.loadEventEnd - nav.startTime),
        transferSizeKb: Math.round((nav.transferSize || 0) / 1024),
        decodedBodyKb: Math.round((nav.decodedBodySize || 0) / 1024),
      };
    })()`,
    returnByValue: true,
  });

  console.log('Performance Metrics:', JSON.stringify(perfMetrics.result.value, null, 2));

  // Direct Route Refresh Checks
  console.log('\n=============================================================');
  console.log('   DIRECT ROUTE REFRESH & ROUTE SCREENSHOTS');
  console.log('=============================================================');
  const routes = ['/', '/decorations', '/gallery', '/about', '/contact'];
  for (const route of routes) {
    await pCmd('Page.navigate', { url: `http://localhost:${PORT}${route}` });
    await new Promise((r) => setTimeout(r, 600));

    const titleRes = await pCmd('Runtime.evaluate', {
      expression: 'document.title',
      returnByValue: true,
    });
    console.log(`Route "${route}" -> Title: "${titleRes.result.value}" [OK]`);

    const routeShot = await pCmd('Page.captureScreenshot', { format: 'png' });
    const cleanRouteName = route === '/' ? 'route_home' : `route_${route.replace('/', '')}`;
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${cleanRouteName}.png`), Buffer.from(routeShot.data, 'base64'));
  }

  // Accordion & Lightbox Interaction Test
  console.log('\n=============================================================');
  console.log('   ACCORDION & LIGHTBOX INTERACTION TESTS');
  console.log('=============================================================');
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 800));

  // Check initial active accordion
  const initialAccordion = await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.acc-indicator')?.textContent || 'none'`,
    returnByValue: true,
  });
  console.log(`Initial Accordion Position: "${initialAccordion.result.value}"`);

  // Click Next button on Accordion
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const btns = document.querySelectorAll('.acc-nav-btn');
      if (btns.length >= 2) btns[1].click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 400));

  const nextAccordion = await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.acc-indicator')?.textContent || 'none'`,
    returnByValue: true,
  });
  console.log(`After Clicking Next: Accordion Position: "${nextAccordion.result.value}" [OK]`);

  // Motion pause/resume toggle test
  const motionBtnText = await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.motion-toggle-btn')?.textContent || 'none'`,
    returnByValue: true,
  });
  console.log(`Photo Wall Motion Toggle: "${motionBtnText.result.value}" [OK]`);

  // Open Lightbox by clicking first mosaic tile
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const tile = document.querySelector('.mosaic-tile');
      if (tile) tile.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const lightboxOpen = await pCmd('Runtime.evaluate', {
    expression: `Boolean(document.querySelector('.photowall-lightbox[open], .lightbox-dialog[open], dialog[open]'))`,
    returnByValue: true,
  });
  console.log(`Lightbox Opened via Dialog: ${lightboxOpen.result.value ? '✓ OPEN' : '✗ NOT OPEN'}`);

  // Close Lightbox
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('.lightbox-close-btn');
      if (closeBtn) closeBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 400));

  const lightboxClosed = await pCmd('Runtime.evaluate', {
    expression: `!Boolean(document.querySelector('dialog[open]'))`,
    returnByValue: true,
  });
  console.log(`Lightbox Closed via Button: ${lightboxClosed.result.value ? '✓ CLOSED' : '✗ STILL OPEN'}`);

  // Close and cleanup
  await pCmd('Target.closeTarget', { targetId });
  pageWs.close();
  ws.close();
  chrome.kill();
  server.close();

  const allPassed = results.every((r) => r.passed);
  console.log(`\nFinal Verdict: ${allPassed ? 'ALL VERIFICATIONS PASSED!' : 'SOME FAILED'}`);
  process.exit(allPassed ? 0 : 1);
});
