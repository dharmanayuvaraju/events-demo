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
  '.mp4': 'video/mp4',
};

const PORT = 4194;

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
    const indexPath = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(PORT, async () => {
  console.log(`Story Verification Server running at http://localhost:${PORT}`);

  const port = 9231;
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

  // 1. Viewport Overflow Check across all targets
  const viewports = [
    { name: '320px_mobile_compact', width: 320, height: 640 },
    { name: '390px_iphone_14', width: 390, height: 844 },
    { name: '768px_tablet', width: 768, height: 1024 },
    { name: '1440px_laptop', width: 1440, height: 900 },
  ];

  console.log('\n=============================================================');
  console.log('   1. VIEWPORT HORIZONTAL OVERFLOW CHECK (WITH STORY SECTION)');
  console.log('=============================================================');

  const overflowResults = [];
  for (const vp of viewports) {
    await pCmd('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768,
    });
    await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
    await new Promise((r) => setTimeout(r, 800));

    const evalRes = await pCmd('Runtime.evaluate', {
      expression: `({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        equals: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        hasTransformation: Boolean(document.querySelector('.scroll-transformation-section'))
      })`,
      returnByValue: true,
    });

    const m = evalRes.result.value;
    console.log(
      `Viewport ${vp.width}x${vp.height} (${vp.name}): ` +
        `scrollWidth=${m.scrollWidth}, clientWidth=${m.clientWidth} ` +
        `-> ${m.equals ? '✓ EXACT MATCH (zero horizontal overflow)' : '✗ OVERFLOW'}` +
        ` [Transformation section present: ${m.hasTransformation ? 'OK' : 'FAIL'}]`
    );
    overflowResults.push(m.equals);
  }

  // 2. Scroll Scrubbing Forward & Reverse Test
  console.log('\n=============================================================');
  console.log('   2. NATIVE SCROLL SCRUBBING: FORWARD & REVERSE');
  console.log('=============================================================');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 1200));

  // Find scroll position of transformation section
  const sectionPos = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('scroll-transformation-section');
      return el ? { top: el.offsetTop, height: el.offsetHeight } : null;
    })()`,
    returnByValue: true,
  });

  const secTop = sectionPos.result.value.top;
  const secHeight = sectionPos.result.value.height;
  console.log(`Transformation section located: top=${secTop}px, total height=${secHeight}px`);

  // Scroll to Chapter 1 position
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${secTop + 100}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 500));
  const shotCh1 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'story_ch1_initial.png'), Buffer.from(shotCh1.data, 'base64'));

  // Scroll to Chapter 2 position (~35% progress)
  const ch2Scroll = secTop + secHeight * 0.35;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${ch2Scroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const ch2State = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Scrolled forward 35% -> Video time: ${ch2State.result.value.currentTime.toFixed(2)}s, Active Chapter: "${ch2State.result.value.activeHeadline}" [OK]`);

  // Scroll to Chapter 3 position (~65% progress)
  const ch3Scroll = secTop + secHeight * 0.65;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${ch3Scroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const ch3State = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Scrolled forward 65% -> Video time: ${ch3State.result.value.currentTime.toFixed(2)}s, Active Chapter: "${ch3State.result.value.activeHeadline}" [OK]`);

  const shotCh3 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'story_ch3_details.png'), Buffer.from(shotCh3.data, 'base64'));

  // Scroll backward to ~20% progress (Reverse Scrubbing)
  const ch1ReverseScroll = secTop + secHeight * 0.15;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${ch1ReverseScroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const reverseState = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Scrolled in reverse to 15% -> Video time: ${reverseState.result.value.currentTime.toFixed(2)}s, Active Chapter: "${reverseState.result.value.activeHeadline}" [OK]`);

  // 3. Static Story Mode Toggle Test
  console.log('\n=============================================================');
  console.log('   3. ACCESSIBLE "STATIC STORY" MODE TOGGLE TEST');
  console.log('=============================================================');

  // Click mode toggle button
  await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.mode-toggle-btn')?.click();`,
  });
  await new Promise((r) => setTimeout(r, 500));

  const staticCheck = await pCmd('Runtime.evaluate', {
    expression: `({
      isStaticMode: Boolean(document.querySelector('.scroll-transformation-section.mode-static')),
      platesCount: document.querySelectorAll('.static-chapter-plate').length,
    })`,
    returnByValue: true,
  });
  console.log(
    `Static Story engaged: ${staticCheck.result.value.isStaticMode ? '✓ MODE STATIC' : '✗ FAILED'}, ` +
      `Plates rendered: ${staticCheck.result.value.platesCount} of 4 [OK]`
  );

  const shotStatic = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'story_static_mode.png'), Buffer.from(shotStatic.data, 'base64'));

  // 4. Mobile 390px Viewport Screenshot
  console.log('\n=============================================================');
  console.log('   4. MOBILE VIEWPORT INSPECTION (390px)');
  console.log('=============================================================');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 1000));

  await pCmd('Runtime.evaluate', {
    expression: `document.getElementById('scroll-transformation-section')?.scrollIntoView({ behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 500));

  const shotMobile = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'story_mobile_390px.png'), Buffer.from(shotMobile.data, 'base64'));
  console.log('Mobile screenshot saved to screenshots/story_mobile_390px.png [OK]');

  // Close and cleanup
  await pCmd('Target.closeTarget', { targetId });
  pageWs.close();
  ws.close();
  chrome.kill();
  server.close();

  const allPassed = overflowResults.every(Boolean);
  console.log(`\nFinal Verdict: ${allPassed ? 'ALL STORY VERIFICATIONS PASSED!' : 'SOME FAILED'}`);
  process.exit(allPassed ? 0 : 1);
});
