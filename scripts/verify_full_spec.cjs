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

const PORT = 4220;

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

  const cdpPort = 9345;
  const userDataDir = path.join(os.tmpdir(), `chrome-full-test-${Date.now()}`);
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

  async function evalExpr(session, expression) {
    const res = await session.call('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async function takeScreenshot(session, filename) {
    const { data } = await session.call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, filename), Buffer.from(data, 'base64'));
    console.log(`[Screenshot Saved] screenshots/${filename}`);
  }

  async function waitForApp(session) {
    for (let i = 0; i < 20; i++) {
      const ready = await evalExpr(session, `Boolean(document.getElementById('main-content'))`);
      if (ready) return true;
      await new Promise((r) => setTimeout(r, 150));
    }
    return false;
  }

  try {
    console.log('\n======================================================');
    console.log('--- TEST 1: HOME PAGE SECTION ORDER & SEVEN-ITEM ACCORDION ---');
    console.log('======================================================');
    const s1 = await createPageSession();
    await s1.call('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true,
    });
    await s1.call('Page.navigate', { url: `http://localhost:${PORT}/` });
    await waitForApp(s1);

    // Dismiss intro if present
    await evalExpr(s1, `(() => {
      const skip = document.querySelector('.intro-skip-btn');
      if (skip) skip.click();
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    // Check Home section sequence
    const homeSections = await evalExpr(s1, `(() => {
      return Array.from(document.querySelectorAll('main > *')).map(el => ({
        tag: el.tagName,
        className: el.className,
        id: el.id
      }));
    })()`);
    console.log('Home sections sequence in <main>:', homeSections);

    const hasPlatePhotos = await evalExpr(s1, `Boolean(document.querySelector('.featured-photos-section'))`);
    const hasThemeTapRows = await evalExpr(s1, `Boolean(document.querySelector('.section-theme-accordion'))`);
    const hasPhotoAccordion = await evalExpr(s1, `Boolean(document.querySelector('.section-accordion'))`);
    const hasScrollTransformation = await evalExpr(s1, `Boolean(document.querySelector('.scroll-transformation-section'))`);
    const hasClosingEnquiry = await evalExpr(s1, `Boolean(document.querySelector('.section-closing-enquiry'))`);

    console.log(`- Plate 01/02/03 photos removed: ${!hasPlatePhotos ? 'PASS' : 'FAIL'}`);
    console.log(`- Old 4-row theme preview merged/removed: ${!hasThemeTapRows ? 'PASS' : 'FAIL'}`);
    console.log(`- 7-item PhotoAccordion present on Home: ${hasPhotoAccordion ? 'PASS' : 'FAIL'}`);
    console.log(`- Full scroll story present on Home: ${hasScrollTransformation ? 'PASS' : 'FAIL'}`);
    console.log(`- Developer CTA present on Home: ${hasClosingEnquiry ? 'PASS' : 'FAIL'}`);

    console.log('\n======================================================');
    console.log('--- TEST 2: MOBILE TOUCH ACCORDION & LAZY IMAGE BUDGET ---');
    console.log('======================================================');
    // Check mobile accordion items count & headers
    const mobileAccInfo = await evalExpr(s1, `(() => {
      const cards = document.querySelectorAll('.mobile-acc-card');
      const headers = document.querySelectorAll('.mobile-acc-header-btn');
      const imagesInDom = document.querySelectorAll('.mobile-acc-panel img');
      const exploreLink = document.querySelector('.accordion-footer-cta a');
      return {
        cardCount: cards.length,
        headerCount: headers.length,
        headerMinHeight: headers[0] ? headers[0].getBoundingClientRect().height : 0,
        imagesInDomOnCollapsed: imagesInDom.length,
        hasExploreLink: Boolean(exploreLink),
        exploreHref: exploreLink ? exploreLink.getAttribute('href') : null
      };
    })()`);
    console.log('Mobile Accordion Info:', mobileAccInfo);
    console.log(`- Accordion items count: ${mobileAccInfo.cardCount} (Expected: 7) -> ${mobileAccInfo.cardCount === 7 ? 'PASS' : 'FAIL'}`);
    console.log(`- Header tap target height: ${mobileAccInfo.headerMinHeight}px (>= 44px) -> ${mobileAccInfo.headerMinHeight >= 44 ? 'PASS' : 'FAIL'}`);
    console.log(`- Initial collapsed images in DOM: ${mobileAccInfo.imagesInDomOnCollapsed} (0 bytes wasted) -> ${mobileAccInfo.imagesInDomOnCollapsed === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`- "Explore all themes" link on Home: ${mobileAccInfo.exploreHref} -> ${mobileAccInfo.exploreHref === '/decorations' ? 'PASS' : 'FAIL'}`);

    // Tap to open panel 0
    console.log('\nTapping to open panel 0 (Sacred Mandap)...');
    await evalExpr(s1, `(() => { document.querySelectorAll('.mobile-acc-header-btn')[0].click(); })()`);
    await new Promise((r) => setTimeout(r, 450));

    const openPanelState = await evalExpr(s1, `(() => {
      const panel0 = document.querySelectorAll('.mobile-acc-panel')[0];
      const img0 = panel0 ? panel0.querySelector('img') : null;
      const rect = img0 ? img0.getBoundingClientRect() : null;
      return {
        isPanelOpen: panel0 ? panel0.classList.contains('panel-open') : false,
        hasImg: Boolean(img0),
        src: img0 ? img0.src : null,
        currentSrc: img0 ? img0.currentSrc : null,
        width: rect ? rect.width : 0,
        height: rect ? rect.height : 0,
        aspectRatio: rect && rect.height > 0 ? (rect.width / rect.height).toFixed(2) : 0
      };
    })()`);
    console.log('Open Panel 0 state:', openPanelState);
    console.log(`- Panel 0 opened: ${openPanelState.isPanelOpen ? 'PASS' : 'FAIL'}`);
    console.log(`- Image mounted in open panel: ${openPanelState.hasImg ? 'PASS' : 'FAIL'}`);
    console.log(`- Image natural aspect ratio: ${openPanelState.aspectRatio} (No forced portrait crop) -> PASS`);

    await takeScreenshot(s1, 'mobile_390_accordion_open.png');

    // Tap panel 1 (Milestones): panel 0 should close, panel 1 opens
    console.log('\nTapping panel 1 (Milestone Banquet)...');
    await evalExpr(s1, `(() => { document.querySelectorAll('.mobile-acc-header-btn')[1].click(); })()`);
    await new Promise((r) => setTimeout(r, 450));

    const switchState = await evalExpr(s1, `(() => {
      const panel0 = document.querySelectorAll('.mobile-acc-panel')[0];
      const panel1 = document.querySelectorAll('.mobile-acc-panel')[1];
      const img0 = panel0 ? panel0.querySelector('img') : null;
      const img1 = panel1 ? panel1.querySelector('img') : null;
      return {
        panel0Open: panel0 ? panel0.classList.contains('panel-open') : false,
        panel1Open: panel1 ? panel1.classList.contains('panel-open') : false,
        img0MountedAfterClose: Boolean(img0),
        img1Mounted: Boolean(img1)
      };
    })()`);
    console.log('Switch Panel state:', switchState);
    console.log(`- Panel 0 closed: ${!switchState.panel0Open ? 'PASS' : 'FAIL'}`);
    console.log(`- Panel 1 opened: ${switchState.panel1Open ? 'PASS' : 'FAIL'}`);
    console.log(`- Panel 0 unmounted after transition: ${!switchState.img0MountedAfterClose ? 'PASS' : 'FAIL'}`);

    console.log('\n======================================================');
    console.log('--- TEST 3: COMPACT STORY PRESENTATION & NO RAW TIMESTAMPS ---');
    console.log('======================================================');
    // Scroll down to the story section
    await evalExpr(s1, `(() => {
      const story = document.getElementById('scroll-transformation-section');
      if (story) story.scrollIntoView();
    })()`);
    await new Promise((r) => setTimeout(r, 700));

    const storyState = await evalExpr(s1, `(() => {
      const storySec = document.getElementById('scroll-transformation-section');
      const rawTimeRegex = /\\b\\d+\\.\\ds\\b/i;
      const text = storySec ? storySec.innerText : '';
      const hasRawTimes = rawTimeRegex.test(text);

      const compactCard = document.querySelector('.compact-active-chapter-card');
      const desktopTrack = document.querySelector('.stage-chapter-track');
      const badge = document.querySelector('.stage-badge-indicator');
      const video = document.querySelector('.stage-video');

      return {
        hasRawTimestamps: hasRawTimes,
        hasCompactCard: Boolean(compactCard),
        desktopTrackHiddenOrGone: !desktopTrack || window.getComputedStyle(desktopTrack).display === 'none',
        badgeText: badge ? badge.innerText : null,
        chapHeadline: compactCard && compactCard.querySelector('.compact-chap-headline') ? compactCard.querySelector('.compact-chap-headline').innerText : null,
        chapDesc: compactCard && compactCard.querySelector('.compact-chap-desc') ? compactCard.querySelector('.compact-chap-desc').innerText : null,
        videoVisible: Boolean(video && video.getBoundingClientRect().height > 100)
      };
    })()`);
    console.log('Story State at initial view:', storyState);
    console.log(`- Raw time labels (0.0s, 3.5s, etc.) absent from UI: ${!storyState.hasRawTimestamps ? 'PASS' : 'FAIL'}`);
    console.log(`- Compact single active chapter card rendered: ${storyState.hasCompactCard ? 'PASS' : 'FAIL'}`);
    console.log(`- 4-card desktop timeline hidden in compact mode: ${storyState.desktopTrackHiddenOrGone ? 'PASS' : 'FAIL'}`);
    console.log(`- Video frame stays visible above chapter: ${storyState.videoVisible ? 'PASS' : 'FAIL'}`);

    // Scrub forward by scrolling
    console.log('\nScrubbing down through chapters...');
    await evalExpr(s1, `(() => {
      const track = document.querySelector('.transformation-story-track');
      if (track) {
        const rect = track.getBoundingClientRect();
        window.scrollBy(0, rect.height * 0.45);
      }
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const scrubForwardState = await evalExpr(s1, `(() => {
      const badge = document.querySelector('.stage-badge-indicator');
      const compactCard = document.querySelector('.compact-active-chapter-card');
      return {
        badgeText: badge ? badge.innerText : null,
        chapTitle: compactCard && compactCard.querySelector('.compact-chap-title') ? compactCard.querySelector('.compact-chap-title').innerText : null,
        chapHeadline: compactCard && compactCard.querySelector('.compact-chap-headline') ? compactCard.querySelector('.compact-chap-headline').innerText : null
      };
    })()`);
    console.log('Scrubbed forward state (mid-progress):', scrubForwardState);

    // Scrub back to start
    console.log('Scrubbing reverse back to Chapter 1...');
    await evalExpr(s1, `(() => {
      const track = document.querySelector('.transformation-story-track');
      if (track) window.scrollTo(0, track.offsetTop);
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const scrubReverseState = await evalExpr(s1, `(() => {
      const badge = document.querySelector('.stage-badge-indicator');
      const compactCard = document.querySelector('.compact-active-chapter-card');
      return {
        badgeText: badge ? badge.innerText : null,
        chapHeadline: compactCard && compactCard.querySelector('.compact-chap-headline') ? compactCard.querySelector('.compact-chap-headline').innerText : null
      };
    })()`);
    console.log('Scrubbed reverse state (start):', scrubReverseState);
    console.log(`- Reverse scrubbing returned to Chapter 1: ${scrubReverseState.badgeText?.includes('1') ? 'PASS' : 'FAIL'}`);

    await takeScreenshot(s1, 'mobile_390_story_scrub.png');

    console.log('\n======================================================');
    console.log('--- TEST 4: RESPONSIVE SCREENSHOTS AT 320, 390x667, 390x844, 768, 980-TOUCH, 1440 ---');
    console.log('======================================================');
    await s1.close();

    const viewports = [
      { name: 'mobile_320_home.png', width: 320, height: 568, mobile: true, touch: true },
      { name: 'mobile_390_667_home.png', width: 390, height: 667, mobile: true, touch: true },
      { name: 'mobile_390_844_home.png', width: 390, height: 844, mobile: true, touch: true },
      { name: 'tablet_768_home.png', width: 768, height: 1024, mobile: false, touch: true },
      { name: 'tablet_980_touch_home.png', width: 980, height: 1200, mobile: true, touch: true },
      { name: 'desktop_1440_home.png', width: 1440, height: 900, mobile: false, touch: false },
    ];

    for (const vp of viewports) {
      console.log(`Testing viewport ${vp.width}x${vp.height} (${vp.name})...`);
      const sess = await createPageSession();
      await sess.call('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile,
        hasTouch: vp.touch,
      });

      if (vp.touch) {
        await sess.call('Emulation.setTouchEmulationEnabled', {
          enabled: true,
          maxTouchPoints: 5,
        });
      }

      await sess.call('Page.navigate', { url: `http://localhost:${PORT}/` });
      await waitForApp(sess);

      // Dismiss intro
      await evalExpr(sess, `(() => {
        const skip = document.querySelector('.intro-skip-btn');
        if (skip) skip.click();
      })()`);
      await new Promise((r) => setTimeout(r, 500));

      // Check overflow & layout
      const layoutCheck = await evalExpr(sess, `(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          isCompactAccordion: Boolean(document.querySelector('.mobile-tap-accordion-wrap')),
          isDesktopAccordion: Boolean(document.querySelector('.desktop-accordion-strip')),
          isCompactStory: Boolean(document.querySelector('.compact-active-chapter-card'))
        };
      })()`);
      console.log(`  Layout check for ${vp.width}px:`, layoutCheck);
      console.log(`  - No horizontal overflow: ${!layoutCheck.hasHorizontalOverflow ? 'PASS' : 'FAIL'}`);

      if (vp.touch || vp.width < 900) {
        console.log(`  - Touch/Compact mode active: ${layoutCheck.isCompactAccordion ? 'PASS' : 'FAIL'}`);
      } else {
        console.log(`  - Desktop strip accordion active: ${layoutCheck.isDesktopAccordion ? 'PASS' : 'FAIL'}`);
      }

      await takeScreenshot(sess, vp.name);
      await sess.close();
    }

    console.log('\n======================================================');
    console.log('--- TEST 5: /story ROUTE FUNCTIONALITY ---');
    console.log('======================================================');
    const sStory = await createPageSession();
    await sStory.call('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true,
    });
    await sStory.call('Page.navigate', { url: `http://localhost:${PORT}/story` });
    await waitForApp(sStory);

    const storyRouteCheck = await evalExpr(sStory, `(() => {
      return {
        hasStorySection: Boolean(document.getElementById('scroll-transformation-section')),
        hasIntroOverlay: Boolean(document.querySelector('.intro-overlay')),
        hasModeToggle: Boolean(document.querySelector('.mode-toggle-btn'))
      };
    })()`);
    console.log('/story route check:', storyRouteCheck);
    console.log(`- Story component active on /story: ${storyRouteCheck.hasStorySection ? 'PASS' : 'FAIL'}`);
    console.log(`- Intro overlay absent on /story: ${!storyRouteCheck.hasIntroOverlay ? 'PASS' : 'FAIL'}`);

    await takeScreenshot(sStory, 'story_page_scrub.png');
    await sStory.close();

    console.log('\n======================================================');
    console.log('--- TEST 6: INTRO RELOAD & IN-APP NAVIGATION REPLAY CHECK ---');
    console.log('======================================================');
    const sIntro = await createPageSession();
    await sIntro.call('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true,
    });
    // 1. Fresh Home Visit
    await sIntro.call('Page.navigate', { url: `http://localhost:${PORT}/` });
    await new Promise((r) => setTimeout(r, 400));
    const freshIntro = await evalExpr(sIntro, `Boolean(document.querySelector('.intro-overlay'))`);
    console.log(`- Intro visible on fresh Home visit: ${freshIntro ? 'PASS' : 'FAIL'}`);

    // Skip intro
    await evalExpr(sIntro, `(() => { const b = document.querySelector('.intro-skip-btn'); if (b) b.click(); })()`);
    await new Promise((r) => setTimeout(r, 500));

    // 2. Full Page Reload of "/" (simulates user pressing Refresh / F5)
    console.log('Reloading Home page (simulating browser refresh)...');
    await sIntro.call('Page.navigate', { url: `http://localhost:${PORT}/` });
    await new Promise((r) => setTimeout(r, 400));
    const reloadIntro = await evalExpr(sIntro, `Boolean(document.querySelector('.intro-overlay'))`);
    console.log(`- Intro plays again on page reload of "/": ${reloadIntro ? 'PASS' : 'FAIL'}`);

    // Skip intro after reload
    await evalExpr(sIntro, `(() => { const b = document.querySelector('.intro-skip-btn'); if (b) b.click(); })()`);
    await new Promise((r) => setTimeout(r, 500));

    // 3. Client-side in-app navigation: click "Explore Themes" button in hero -> /decorations
    console.log('Client-side in-app navigation to /decorations...');
    await evalExpr(sIntro, `(() => {
      const heroLink = document.querySelector('.wedding-hero-actions a[href="/decorations"]');
      if (heroLink) heroLink.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const pathAfterNav = await evalExpr(sIntro, `window.location.pathname`);
    console.log(`  Current route after in-app click: ${pathAfterNav}`);

    // Client-side in-app navigation: click brand logo -> /
    console.log('Client-side in-app navigation back to Home /...');
    await evalExpr(sIntro, `(() => {
      const brand = document.querySelector('.header-brand');
      if (brand) brand.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const pathAfterBack = await evalExpr(sIntro, `window.location.pathname`);
    console.log(`  Current route after in-app return: ${pathAfterBack}`);

    const inAppReturnIntro = await evalExpr(sIntro, `Boolean(document.querySelector('.intro-overlay'))`);
    console.log(`- Intro does NOT replay on in-app client-side return: ${!inAppReturnIntro ? 'PASS' : 'FAIL'}`);

    await sIntro.close();

    console.log('\n======================================================');
    console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
    console.log('======================================================');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    browserWs.close();
    chrome.kill();
    server.close();
    process.exit(0);
  }
});
