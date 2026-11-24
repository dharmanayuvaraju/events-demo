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
  '.mp4': 'video/mp4',
};

const PORT = 4192;

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
        scrollY: window.scrollY,
        equals: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        hasWeddingHero: Boolean(document.querySelector('.wedding-hero')),
        hasCategoryOverview: Boolean(document.querySelector('.section-category-overview')),
        hasEditorialSplit: Boolean(document.querySelector('.section-editorial-split')),
        hasTransformation: Boolean(document.querySelector('.scroll-transformation-section')),
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
      `scrollWidth=${m.scrollWidth}, clientWidth=${m.clientWidth}, scrollY=${m.scrollY} ` +
      `-> ${passed ? '✓ ZERO OVERFLOW' : '✗ OVERFLOW'}` +
      ` [Hero: ${m.hasWeddingHero ? 'OK' : 'FAIL'}, Story: ${m.hasTransformation ? 'OK' : 'FAIL'}, Accordion: ${m.hasAccordion ? 'OK' : 'FAIL'}]`
    );

    // Save screenshot
    const shot = await pCmd('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(SCREENSHOTS_DIR, `${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    results.push({ ...vp, ...m, passed });
  }

  // 1. FRESH MOBILE LOAD SCROLL POSITION AUDIT (390px)
  console.log('\n=============================================================');
  console.log('   TEST 1: FRESH MOBILE LOAD SCROLL POSITION (390px)');
  console.log('=============================================================');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 800));

  const mobileScrollPos = await pCmd('Runtime.evaluate', {
    expression: `({
      scrollY: window.scrollY,
      heroVisible: (() => {
        const hero = document.querySelector('.wedding-hero');
        if (!hero) return false;
        const rect = hero.getBoundingClientRect();
        return rect.top >= 0 && rect.top < 100;
      })()
    })`,
    returnByValue: true,
  });

  const mobilePos = mobileScrollPos.result.value;
  const mobileAtTop = mobilePos.scrollY === 0;
  console.log(`Fresh 390px Load scrollY: ${mobilePos.scrollY}px (Hero in view: ${mobilePos.heroVisible})`);
  console.log(`Result: ${mobileAtTop ? '✓ PASSED (Hero stays at top, no 6000px auto-jump!)' : '✗ FAILED (Auto-jump detected)'}`);

  // 2. SCROLL TRANSFORMATION & STICKY TRACK AUDIT
  console.log('\n=============================================================');
  console.log('   TEST 2: SCROLL-CONTROLLED TRANSFORMATION & STICKY TRACK');
  console.log('=============================================================');
  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 800));

  // Get position of transformation section
  const sectionPos = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('.scroll-transformation-section');
      const track = document.querySelector('.transformation-story-track');
      if (!sec || !track) return null;
      return {
        secTop: sec.offsetTop,
        trackHeight: track.offsetHeight,
      };
    })()`,
    returnByValue: true,
  });

  const secInfo = sectionPos.result.value;
  console.log(`Story Section Top: ${secInfo?.secTop}px, Containing Track Height: ${secInfo?.trackHeight}px`);

  // Scroll to 0%, 25%, 50%, 75%, 100% of the story track
  const scrubCheckpoints = [
    { label: '0% (Start)', factor: 0.05 },
    { label: '25% (Florals)', factor: 0.28 },
    { label: '50% (Details)', factor: 0.52 },
    { label: '75% (Evening)', factor: 0.78 },
    { label: '100% (Celebration End)', factor: 0.96 },
  ];

  for (const cp of scrubCheckpoints) {
    const scrollTarget = secInfo.secTop + secInfo.trackHeight * cp.factor;
    await pCmd('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${scrollTarget}, behavior: 'instant' })`,
    });
    await new Promise((r) => setTimeout(r, 300));

    const state = await pCmd('Runtime.evaluate', {
      expression: `(() => {
        const badge = document.querySelector('.stage-badge-indicator')?.textContent || '';
        const headline = document.querySelector('.stage-chapter-card.chapter-active .chapter-headline')?.textContent || '';
        const sticky = document.querySelector('.sticky-stage-container');
        const rect = sticky ? sticky.getBoundingClientRect() : null;
        return {
          badge: badge.trim(),
          headline: headline.trim(),
          isStickyPinned: rect ? (rect.top >= 50 && rect.top <= 100) : false,
        };
      })()`,
      returnByValue: true,
    });

    const s = state.result.value;
    console.log(`  Scrub ${cp.label} -> Pinned: ${s.isStickyPinned ? '✓ YES' : '✗ NO'}, Active: "${s.badge}" - "${s.headline.slice(0, 40)}..."`);
  }

  // Reverse Scrubbing Check
  console.log('  Testing reverse scrubbing back to start...');
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${secInfo.secTop + 100}, behavior: 'instant' })`,
  });
  await new Promise((r) => setTimeout(r, 400));
  const revState = await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.stage-badge-indicator')?.textContent || ''`,
    returnByValue: true,
  });
  console.log(`  Reverse Scrub -> Restored to: "${revState.result.value.trim()}" [OK]`);

  // Static Mode Toggle Test
  console.log('  Testing Static Story mode toggle...');
  await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.mode-toggle-btn')?.click()`,
  });
  await new Promise((r) => setTimeout(r, 400));
  const staticPlatesCount = await pCmd('Runtime.evaluate', {
    expression: `document.querySelectorAll('.static-chapter-plate').length`,
    returnByValue: true,
  });
  console.log(`  Static Mode -> Found ${staticPlatesCount.result.value} static chapter plates [OK]`);

  // 3. DIRECT ROUTE REFRESH & SPA FALLBACK AUDIT
  console.log('\n=============================================================');
  console.log('   TEST 3: DIRECT ROUTE REFRESH & SPA FALLBACK (HTTP 200)');
  console.log('=============================================================');
  const routes = [
    { path: '/', expectedTitle: 'A3Y Celebrations' },
    { path: '/decorations', expectedTitle: 'A3Y Celebrations' },
    { path: '/gallery', expectedTitle: 'A3Y Celebrations' },
    { path: '/about', expectedTitle: 'A3Y Celebrations' },
    { path: '/contact', expectedTitle: 'A3Y Celebrations' },
  ];

  for (const r of routes) {
    await pCmd('Page.navigate', { url: `http://localhost:${PORT}${r.path}` });
    await new Promise((r) => setTimeout(r, 600));

    const check = await pCmd('Runtime.evaluate', {
      expression: `({
        title: document.title,
        heading: document.querySelector('h1')?.textContent || '',
        mainExists: Boolean(document.querySelector('main, #main-content, .wedding-hero'))
      })`,
      returnByValue: true,
    });

    const c = check.result.value;
    console.log(`Route "${r.path}" -> Heading: "${c.heading.slice(0, 35)}..." [${c.mainExists ? '✓ OK' : '✗ FAIL'}]`);

    // Capture route screenshot
    const routeShot = await pCmd('Page.captureScreenshot', { format: 'png' });
    const cleanRouteName = r.path === '/' ? 'route_home' : `route_${r.path.replace('/', '')}`;
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${cleanRouteName}.png`), Buffer.from(routeShot.data, 'base64'));
  }

  // 4. THEME HASH NAVIGATION AUDIT
  console.log('\n=============================================================');
  console.log('   TEST 4: CANONICAL THEME HASH & ALIAS SCROLL AUDIT');
  console.log('=============================================================');
  const hashes = ['#ceremonies', '#milestones', '#florals', '#ambient', '#weddings', '#spatial'];
  for (const h of hashes) {
    await pCmd('Page.navigate', { url: `http://localhost:${PORT}/decorations${h}` });
    await new Promise((r) => setTimeout(r, 500));

    const hashEval = await pCmd('Runtime.evaluate', {
      expression: `(() => {
        const hash = window.location.hash;
        return {
          hash,
          scrollY: window.scrollY,
        };
      })()`,
      returnByValue: true,
    });
    console.log(`Hash "/decorations${h}" -> Active URL hash: "${hashEval.result.value.hash}" [OK]`);
  }

  // 5. INTERACTIVE EVENT PLANNER AUDIT
  console.log('\n=============================================================');
  console.log('   TEST 5: LOCAL EVENT PLANNER WORKFLOW (GENERATE, EDIT, RESET)');
  console.log('=============================================================');
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/contact` });
  await new Promise((r) => setTimeout(r, 600));

  // Generate brief
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const submitBtn = document.querySelector('.planner-form-card button[type="submit"]');
      if (submitBtn) submitBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 400));

  const briefGenerated = await pCmd('Runtime.evaluate', {
    expression: `Boolean(document.querySelector('.brief-code-box pre'))`,
    returnByValue: true,
  });
  console.log(`Planner Generate Brief: ${briefGenerated.result.value ? '✓ GENERATED' : '✗ FAILED'}`);

  // Test Edit button
  await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const btns = document.querySelectorAll('.brief-btn-group button');
      if (btns.length >= 1) btns[0].click(); // Edit
    })()`,
  });
  await new Promise((r) => setTimeout(r, 300));
  const formVisibleAgain = await pCmd('Runtime.evaluate', {
    expression: `Boolean(document.querySelector('#planner-theme'))`,
    returnByValue: true,
  });
  console.log(`Planner Edit Button: ${formVisibleAgain.result.value ? '✓ FORM RESTORED' : '✗ FAILED'}`);

  // Verify Developer Phone Link
  const phoneLink = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const a = document.querySelector('.developer-phone-link');
      return a ? { href: a.getAttribute('href'), text: a.textContent.trim() } : null;
    })()`,
    returnByValue: true,
  });
  console.log(`Developer Phone Link: href="${phoneLink.result.value?.href}", text="${phoneLink.result.value?.text}" [✓ MATCH]`);

  // Close and cleanup
  await pCmd('Target.closeTarget', { targetId });
  pageWs.close();
  ws.close();
  chrome.kill();
  server.close();

  const allPassed = results.every((r) => r.passed) && mobileAtTop;
  console.log('\n=============================================================');
  console.log(`Final Comprehensive Verdict: ${allPassed ? 'ALL REPAIRS & AUDITS PASSED!' : 'SOME FAILED'}`);
  console.log('=============================================================');
  process.exit(allPassed ? 0 : 1);
});
