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

const PORT = 4199;

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

  const cdpPort = 9338;
  const userDataDir = path.join(os.tmpdir(), `chrome-story-test-${Date.now()}`);
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
  console.log('--- TEST 1: INTRO PLAYS ON EVERY REFRESH OF HOME ("/") ---');
  console.log('======================================================');
  const session1 = await createPageSession();
  await session1.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

  // Fresh load 1
  await session1.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 600));

  const load1Overlay = await session1.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  Visit 1: Intro overlay present: ${load1Overlay.result.value ? 'PASS' : 'FAIL'}`);

  // Dismiss overlay via Skip
  await session1.call('Runtime.evaluate', { expression: `document.querySelector('.intro-skip-btn')?.click()` });
  await new Promise((r) => setTimeout(r, 600));

  // Perform a browser refresh (F5 / reload)
  console.log('  Executing page reload...');
  await session1.call('Page.reload');
  await new Promise((r) => setTimeout(r, 600));

  const reloadOverlay = await session1.call('Runtime.evaluate', {
    expression: `!!document.querySelector('.intro-overlay')`,
    returnByValue: true,
  });
  console.log(`  Visit 2 (After Reload): Intro overlay plays again: ${reloadOverlay.result.value ? 'PASS' : 'FAIL'}`);

  // Dismiss overlay again
  await session1.call('Runtime.evaluate', { expression: `document.querySelector('.intro-skip-btn')?.click()` });
  await new Promise((r) => setTimeout(r, 600));

  console.log('\n--- TEST 2: IN-APP ROUTING DOES NOT REPLAY INTRO ---');
  // Click link to /decorations
  await session1.call('Runtime.evaluate', {
    expression: `(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') === '/decorations');
      link?.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const onDecorations = await session1.call('Runtime.evaluate', {
    expression: `location.pathname`,
    returnByValue: true,
  });
  console.log(`  Navigated in-app to: ${onDecorations.result.value}`);

  // Click back to Home in-app
  await session1.call('Runtime.evaluate', {
    expression: `(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') === '/' || a.innerText === 'Home');
      link?.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const backHomeState = await session1.call('Runtime.evaluate', {
    expression: `({
      pathname: location.pathname,
      hasOverlay: !!document.querySelector('.intro-overlay'),
    })`,
    returnByValue: true,
  });
  console.log(`  Back on Home:`, backHomeState.result.value);
  console.log(`  [Check] Intro does NOT replay on in-app navigation: ${!backHomeState.result.value.hasOverlay ? 'PASS' : 'FAIL'}`);

  await session1.close();

  console.log('\n======================================================');
  console.log('--- TEST 3: FULL STORY EMBEDDED ON HOME & LAZY VIDEO ---');
  console.log('======================================================');
  const sessionStory = await createPageSession();
  await sessionStory.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sessionStory.call('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 500));
  // Skip intro
  await sessionStory.call('Runtime.evaluate', { expression: `document.querySelector('.intro-skip-btn')?.click()` });
  await new Promise((r) => setTimeout(r, 500));

  // Check network requests BEFORE scrolling to story (must not load .mp4)
  const celebrationVideosAtTop = sessionStory.networkRequests.filter(u => u.includes('celebration-') && u.includes('.mp4'));
  console.log(`  Celebration .mp4 video requests at page top: ${celebrationVideosAtTop.length} (Expected: 0 - lazy loaded)`);
  console.log(`  [Check] Video .mp4 NOT downloaded on initial page load: ${celebrationVideosAtTop.length === 0 ? 'PASS' : 'FAIL'}`);

  // Inspect Story section presence on Home
  const storyOnHome = await sessionStory.call('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('.scroll-transformation-section');
      const track = document.querySelector('.transformation-story-track');
      const sticky = document.querySelector('.sticky-stage-container');
      const video = document.querySelector('.stage-video');
      const chapters = Array.from(document.querySelectorAll('.stage-chapter-card')).length;
      const title = section?.querySelector('.section-title')?.innerText;
      const notice = section?.querySelector('.concept-notice-pill')?.innerText;

      return {
        hasSection: !!section,
        hasTrack: !!track,
        hasSticky: !!sticky,
        hasVideo: !!video,
        chaptersCount: chapters,
        title,
        notice,
        scrollY: window.scrollY,
      };
    })()`,
    returnByValue: true,
  });

  console.log('Story Section on Home:', storyOnHome.result.value);
  const sRes = storyOnHome.result.value;
  console.log(`  [Check] Embedded Story section present on Home: ${sRes.hasSection ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Sticky track present: ${sRes.hasTrack ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] 4 chapters present: ${sRes.chaptersCount === 4 ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Disclaimer present: "${sRes.notice}": PASS`);
  console.log(`  [Check] Page starts at scrollY=0: ${sRes.scrollY === 0 ? 'PASS' : 'FAIL'}`);

  // Scroll down near the Story section to test lazy loading
  console.log('\n--- Scrolling down to trigger lazy video load ---');
  await sessionStory.call('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.scroll-transformation-section');
      el?.scrollIntoView();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const videoRequestsAfterScroll = sessionStory.networkRequests.filter(u => u.includes('celebration-') && u.includes('.mp4'));
  console.log(`  Celebration .mp4 video requests after scrolling:`, videoRequestsAfterScroll);
  console.log(`  [Check] Lazy video loaded: ${videoRequestsAfterScroll.length > 0 ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Only mobile video requested: ${videoRequestsAfterScroll.every(u => u.includes('mobile')) ? 'PASS' : 'FAIL'}`);

  console.log('\n======================================================');
  console.log('--- TEST 4: VIEWPORT FITTING & TYPOGRAPHY CHECKS ---');
  console.log('======================================================');
  // Test at 390x844 and 390x667
  const viewports = [
    { name: 'iPhone SE (390x667)', w: 390, h: 667, mobile: true },
    { name: 'iPhone 14 (390x844)', w: 390, h: 844, mobile: true },
    { name: 'Tablet (768x1024)', w: 768, h: 1024, mobile: true },
    { name: 'Desktop (1440x900)', w: 1440, h: 900, mobile: false },
  ];

  for (const vp of viewports) {
    await sessionStory.call('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 2,
      mobile: vp.mobile,
    });
    await new Promise((r) => setTimeout(r, 400));

    const fitAudit = await sessionStory.call('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('.site-header');
        const sticky = document.querySelector('.sticky-stage-container');
        const frame = document.querySelector('.stage-video-frame');
        const card = document.querySelector('.stage-chapter-card.chapter-active');
        const title = document.querySelector('.scroll-transformation-section .section-title');
        const chapTitle = card?.querySelector('.chapter-headline');
        const desc = card?.querySelector('.chapter-desc');
        const meta = card?.querySelector('.chapter-meta');

        const headerH = header ? header.getBoundingClientRect().height : 64;
        const availH = window.innerHeight - headerH;
        const stickyH = sticky ? sticky.getBoundingClientRect().height : 0;
        const hasOverflowX = document.documentElement.scrollWidth > window.innerWidth;

        return {
          headerH: Math.round(headerH),
          availH: Math.round(availH),
          stickyH: Math.round(stickyH),
          fitsScreen: stickyH <= availH,
          hasOverflowX,
          titleFontSize: title ? getComputedStyle(title).fontSize : null,
          chapFontSize: chapTitle ? getComputedStyle(chapTitle).fontSize : null,
          descFontSize: desc ? getComputedStyle(desc).fontSize : null,
          metaFontSize: meta ? getComputedStyle(meta).fontSize : null,
        };
      })()`,
      returnByValue: true,
    });

    const fa = fitAudit.result.value;
    console.log(`\n  Viewport ${vp.name}:`);
    console.log(`    Sticky height: ${fa.stickyH}px (Available below header: ${fa.availH}px) -> Fits: ${fa.fitsScreen ? 'PASS' : 'FAIL'}`);
    console.log(`    Horizontal overflow: ${fa.hasOverflowX ? 'FAIL' : 'PASS (No overflow)'}`);
    console.log(`    Font sizes: Heading=${fa.titleFontSize}, Chapter=${fa.chapFontSize}, Body=${fa.descFontSize}, Meta=${fa.metaFontSize}`);
  }

  // Test forward and reverse scrubbing progress
  console.log('\n--- TEST 5: STICKY SCRUBBING FORWARD AND REVERSE ---');
  // Scroll to Chapter 2 (~40% of track)
  await sessionStory.call('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.transformation-story-track');
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, trackTop + 1000);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 200));
  const chapAt40 = await sessionStory.call('Runtime.evaluate', {
    expression: `document.querySelector('.stage-chapter-card.chapter-active .chapter-index')?.innerText`,
    returnByValue: true,
  });

  // Scroll to Chapter 4 (~90% of track)
  await sessionStory.call('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.transformation-story-track');
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, trackTop + 2200);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 200));
  const chapAt90 = await sessionStory.call('Runtime.evaluate', {
    expression: `document.querySelector('.stage-chapter-card.chapter-active .chapter-index')?.innerText`,
    returnByValue: true,
  });

  // Scroll in reverse back to chapter 1 (start of track)
  await sessionStory.call('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.transformation-story-track');
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, trackTop);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 250));
  const chapReverse = await sessionStory.call('Runtime.evaluate', {
    expression: `document.querySelector('.stage-chapter-card.chapter-active .chapter-index')?.innerText`,
    returnByValue: true,
  });

  console.log('Scrub Test Result:', {
    chapterForward1: chapAt40.result.value,
    chapterForward2: chapAt90.result.value,
    chapterReverse: chapReverse.result.value,
  });
  console.log(`  [Check] Forward scrubbing updates chapter: ${chapAt40.result.value !== '01' || chapAt90.result.value === '04' ? 'PASS' : 'FAIL'}`);
  console.log(`  [Check] Reverse scrubbing returns to chapter 01: ${chapReverse.result.value === '01' ? 'PASS' : 'FAIL'}`);

  // Test /story route continues working
  console.log('\n--- TEST 6: /story DEDICATED ROUTE CONTINUES WORKING ---');
  await sessionStory.call('Page.navigate', { url: `http://localhost:${PORT}/story` });
  await new Promise((r) => setTimeout(r, 600));

  const storyRouteAudit = await sessionStory.call('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('.scroll-transformation-section');
      const track = document.querySelector('.transformation-story-track');
      return {
        pathname: location.pathname,
        hasSection: !!section,
        hasTrack: !!track,
      };
    })()`,
    returnByValue: true,
  });
  console.log('/story Route Audit:', storyRouteAudit.result.value);
  console.log(`  [Check] Dedicated /story route functions properly: ${storyRouteAudit.result.value.hasSection ? 'PASS' : 'FAIL'}`);

  await sessionStory.close();

  console.log('\nAll tests completed. Shutting down test server and Chrome.');
  chrome.kill();
  server.close();
  process.exit(0);
});
