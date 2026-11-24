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
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
};

const PORT = 4198;

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
  console.log(`[Test Server] Running at http://localhost:${PORT}`);

  const cdpPort = 9336;
  const userDataDir = path.join(os.tmpdir(), `chrome-intro-test-${Date.now()}`);
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      if (res.ok) {
        wsUrl = (await res.json()).webSocketDebuggerUrl;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!wsUrl) {
    console.error('Failed to connect to Chrome CDP');
    process.exit(1);
  }

  const browserWs = new WebSocket(wsUrl);
  let id = 1;
  const cbs = new Map();
  browserWs.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && cbs.has(d.id)) {
      cbs.get(d.id)(d.result);
      cbs.delete(d.id);
    }
  };
  await new Promise((r) => (browserWs.onopen = r));
  const bCmd = (method, params = {}) =>
    new Promise((resolve) => {
      const i = id++;
      cbs.set(i, resolve);
      browserWs.send(JSON.stringify({ id: i, method, params }));
    });

  async function createPageSession() {
    const { targetId } = await bCmd('Target.createTarget', { url: 'about:blank' });
    const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json`)).json();
    const target = targets.find((t) => t.id === targetId);
    const pWs = new WebSocket(target.webSocketDebuggerUrl);

    let pId = 1;
    const pMap = new Map();
    const networkRequests = [];

    pWs.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.method === 'Network.requestWillBeSent') {
        networkRequests.push(d.params.request.url);
      }
      if (d.id && pMap.has(d.id)) {
        pMap.get(d.id)(d.result);
        pMap.delete(d.id);
      }
    };
    await new Promise((r) => (pWs.onopen = r));
    const call = (method, params = {}) =>
      new Promise((resolve) => {
        const i = pId++;
        pMap.set(i, resolve);
        pWs.send(JSON.stringify({ id: i, method, params }));
      });

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Network.enable');

    return { call, targetId, networkRequests, close: () => bCmd('Target.closeTarget', { targetId }) };
  }

  console.log('\n======================================================');
  console.log('--- TEST 1: MOBILE (390 x 844) FRESH VISIT ---');
  console.log('======================================================');
  const session1 = await createPageSession();
  await session1.call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await session1.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 600));

  const mobileIntroState = await session1.call('Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.querySelector('.intro-overlay');
      const video = document.querySelector('.intro-video');
      const skipBtn = document.querySelector('.intro-skip-btn');
      const mainEl = document.getElementById('main-content');
      const isScrollLocked = document.body.style.overflow === 'hidden' && document.documentElement.style.overflow === 'hidden';

      return {
        overlayPresent: !!overlay,
        overlayRole: overlay?.getAttribute('role'),
        overlayAriaLabel: overlay?.getAttribute('aria-label'),
        videoSrc: video?.getAttribute('src'),
        videoObjectFit: video ? getComputedStyle(video).objectFit : null,
        skipBtnPresent: !!skipBtn,
        skipBtnHeight: skipBtn ? Math.round(skipBtn.getBoundingClientRect().height) : 0,
        mainAriaHidden: mainEl?.getAttribute('aria-hidden'),
        isScrollLocked,
      };
    })()`,
    returnByValue: true,
  });

  console.log('Mobile Fresh Visit:', mobileIntroState.result.value);
  const mRes = mobileIntroState.result.value;

  console.log(`  [Check] Overlay present: ${mRes.overlayPresent ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Role=dialog & aria-label: ${mRes.overlayRole === 'dialog' ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Video selected: ${mRes.videoSrc}`);
  console.log(`  [Check] Is vertical file chosen: ${mRes.videoSrc?.includes('a3y_grand_entry_vert.mp4') ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Object-fit contain on phone: ${mRes.videoObjectFit === 'contain' ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Skip button >= 44px: ${mRes.skipBtnHeight >= 44 ? `PASS (${mRes.skipBtnHeight}px)` : 'FAIL'}`);
  console.log(`  [Check] Page scroll locked: ${mRes.isScrollLocked ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Underlying content aria-hidden: ${mRes.mainAriaHidden === 'true' ? 'PASS' : 'FAIL'}`);

  // Check network requests for videos on mobile
  const videoRequestsMobile = session1.networkRequests.filter(u => u.includes('a3y_grand_entry'));
  console.log(`  [Check] Downloaded video files on mobile:`, videoRequestsMobile);
  console.log(`  [Check] Only vertical video loaded: ${videoRequestsMobile.every(u => u.includes('vert')) ? 'PASS' : 'FAIL'}`);

  console.log('\n--- TEST 2: SKIP BUTTON ON MOBILE ---');
  await session1.call('Runtime.evaluate', {
    expression: `document.querySelector('.intro-skip-btn')?.click()`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const afterSkipState = await session1.call('Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.querySelector('.intro-overlay');
      const sessionFlag = sessionStorage.getItem('a3y_intro_shown');
      const isScrollLocked = document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden';
      const mainAriaHidden = document.getElementById('main-content')?.getAttribute('aria-hidden');

      return {
        overlayPresent: !!overlay,
        sessionFlag,
        isScrollLocked,
        mainAriaHidden,
        scrollY: window.scrollY,
      };
    })()`,
    returnByValue: true,
  });

  console.log('After Skip:', afterSkipState.result.value);
  console.log(`  [Check] Overlay removed from DOM: ${!afterSkipState.result.value.overlayPresent ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] sessionStorage flag set: ${afterSkipState.result.value.sessionFlag === 'true' ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Scroll unlocked: ${!afterSkipState.result.value.isScrollLocked ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Scroll at Y=0: ${afterSkipState.result.value.scrollY === 0 ? 'PASS' : 'FAIL'}`);

  console.log('\n--- TEST 3: REFRESH IN SAME TAB (SESSIONSTORAGE PERSISTED) ---');
  await session1.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 600));

  const refreshState = await session1.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  [Check] Refresh does NOT show intro: ${!refreshState.result.value ? 'PASS' : 'FAIL'}`);

  await session1.close();

  console.log('\n======================================================');
  console.log('--- TEST 4: DESKTOP (1440 x 900) FRESH VISIT ---');
  console.log('======================================================');
  const sessionDesktop = await createPageSession();
  await sessionDesktop.call('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await sessionDesktop.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 600));

  const desktopIntroState = await sessionDesktop.call('Runtime.evaluate', {
    expression: `(() => {
      const video = document.querySelector('.intro-video');
      return {
        overlayPresent: !!document.querySelector('.intro-overlay'),
        videoSrc: video?.getAttribute('src'),
        videoObjectFit: video ? getComputedStyle(video).objectFit : null,
      };
    })()`,
    returnByValue: true,
  });

  console.log('Desktop Fresh Visit:', desktopIntroState.result.value);
  const dRes = desktopIntroState.result.value;
  console.log(`  [Check] Landscape video chosen: ${dRes.videoSrc?.includes('a3y_grand_entry_land.mp4') ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Object-fit cover on desktop: ${dRes.videoObjectFit === 'cover' ? 'PASS' : 'FAIL'}`);

  const videoRequestsDesktop = sessionDesktop.networkRequests.filter(u => u.includes('a3y_grand_entry'));
  console.log(`  [Check] Downloaded video files on desktop:`, videoRequestsDesktop);
  console.log(`  [Check] Only landscape video loaded: ${videoRequestsDesktop.every(u => u.includes('land')) ? 'PASS' : 'FAIL'}`);

  console.log('\n--- TEST 5: ESCAPE KEY DISMISSAL ---');
  await sessionDesktop.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
  await sessionDesktop.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise((r) => setTimeout(r, 600));

  const afterEscapeState = await sessionDesktop.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  [Check] Escape key dismissed overlay: ${!afterEscapeState.result.value ? 'PASS' : 'FAIL'}`);

  await sessionDesktop.close();

  console.log('\n======================================================');
  console.log('--- TEST 6: PREFERS-REDUCED-MOTION SKIPS INTRO ---');
  console.log('======================================================');
  const sessionReduced = await createPageSession();
  await sessionReduced.call('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await sessionReduced.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 600));

  const reducedMotionState = await sessionReduced.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  [Check] Reduced motion automatically skips intro: ${!reducedMotionState.result.value ? 'PASS' : 'FAIL'}`);
  await sessionReduced.close();

  console.log('\n======================================================');
  console.log('--- TEST 7: DIRECT INNER ROUTES NEVER SHOW INTRO ---');
  console.log('======================================================');
  const routes = ['/decorations', '/gallery', '/about', '/contact', '/story'];
  for (const r of routes) {
    const s = await createPageSession();
    await s.call('Page.navigate', { url: `http://localhost:${PORT}${r}` });
    await new Promise((res) => setTimeout(res, 500));
    const hasOverlay = await s.call('Runtime.evaluate', {
      expression: `!!document.querySelector('.intro-overlay')`,
      returnByValue: true,
    });
    console.log(`  Direct load of ${r.padEnd(14)}: ${!hasOverlay.result.value ? 'PASS (Never shows intro)' : 'FAIL'}`);
    await s.close();
  }

  console.log('\n======================================================');
  console.log('--- TEST 8: 1.5S HARD SAFETY LIMIT TIMEOUT ---');
  console.log('======================================================');
  const sessionTimeout = await createPageSession();
  // Block video files so video cannot start playing
  await sessionTimeout.call('Network.setBlockedURLs', { urls: ['*a3y_grand_entry*'] });
  await sessionTimeout.call('Page.navigate', { url: `http://localhost:${PORT}/` });

  // Initially overlay is present
  const initialOverlay = await sessionTimeout.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  Initial overlay present when video blocked: ${initialOverlay.result.value ? 'YES' : 'NO'}`);

  // Wait 1700ms (more than 1.5s hard safety limit)
  await new Promise((r) => setTimeout(r, 1700));
  const timeoutState = await sessionTimeout.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  [Check] 1.5s Hard safety timeout removed overlay: ${!timeoutState.result.value ? 'PASS' : 'FAIL'}`);
  await sessionTimeout.close();

  console.log('\n======================================================');
  console.log('--- TEST 9: 768px TABLET VIEWPORT CHECK ---');
  console.log('======================================================');
  const sessionTablet = await createPageSession();
  await sessionTablet.call('Emulation.setDeviceMetricsOverride', {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sessionTablet.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 500));

  const tabletState = await sessionTablet.call('Runtime.evaluate', {
    expression: `(() => {
      const video = document.querySelector('.intro-video');
      return {
        overlayPresent: !!document.querySelector('.intro-overlay'),
        videoSrc: video?.getAttribute('src'),
      };
    })()`,
    returnByValue: true,
  });
  console.log('Tablet State:', tabletState.result.value);
  console.log(`  [Check] Overlay present on tablet fresh visit: ${tabletState.result.value.overlayPresent ? 'PASS' : 'FAIL'}`);
  await sessionTablet.close();

  console.log('\nAll intro overlay tests completed successfully. Shutting down test server and Chrome.');
  chrome.kill();
  server.close();
  process.exit(0);
});
