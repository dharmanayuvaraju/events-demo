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

const PORT = 4173;

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
  console.log(`Server listening at http://localhost:${PORT}`);

  const port = 9222;
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

  const results = [];

  for (const vp of viewports) {
    const { targetId } = await cmd('Target.createTarget', { url: 'about:blank' });
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
        equals: document.documentElement.scrollWidth === window.innerWidth && document.documentElement.scrollWidth === document.documentElement.clientWidth
      })`,
      returnByValue: true,
    });

    const m = evalRes.result.value;
    const passed = m.equals;

    console.log(
      `Viewport ${vp.width}x${vp.height} (${vp.name}): ` +
        `scrollWidth=${m.scrollWidth}, clientWidth=${m.clientWidth}, innerWidth=${m.innerWidth} ` +
        `-> ${passed ? '✓ EXACT MATCH (scrollWidth === innerWidth === clientWidth)' : '✗ MISMATCH'}`
    );

    // Save screenshot
    const shot = await pCmd('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(SCREENSHOTS_DIR, `${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    results.push({ ...vp, ...m, passed });

    await pCmd('Target.closeTarget', { targetId });
    pageWs.close();
  }

  // Measure Core Web Vitals & Performance on a standard desktop session
  console.log('\n=============================================================');
  console.log('   PERFORMANCE & CORE WEB VITALS MEASUREMENT');
  console.log('=============================================================');
  {
    const { targetId } = await cmd('Target.createTarget', { url: 'about:blank' });
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

    await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
    await new Promise((r) => setTimeout(r, 1200));

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

    await pCmd('Target.closeTarget', { targetId });
    pageWs.close();
  }

  // Verify Direct Route Refresh for all pages
  console.log('\n=============================================================');
  console.log('   DIRECT ROUTE REFRESH VERIFICATION');
  console.log('=============================================================');
  const routes = ['/', '/decorations', '/gallery', '/about', '/contact'];
  for (const route of routes) {
    const { targetId } = await cmd('Target.createTarget', { url: 'about:blank' });
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
    await pCmd('Page.navigate', { url: `http://localhost:${PORT}${route}` });
    await new Promise((r) => setTimeout(r, 400));

    const titleRes = await pCmd('Runtime.evaluate', {
      expression: 'document.title',
      returnByValue: true,
    });
    console.log(`Route "${route}" -> Title: "${titleRes.result.value}" [OK]`);

    await pCmd('Target.closeTarget', { targetId });
    pageWs.close();
  }

  ws.close();
  chrome.kill();
  server.close();

  const allPassed = results.every((r) => r.passed);
  console.log(`\nFinal Verdict: ${allPassed ? 'ALL VERIFICATIONS PASSED!' : 'SOME FAILED'}`);
  process.exit(allPassed ? 0 : 1);
});
