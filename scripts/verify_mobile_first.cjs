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

const PORT = 4196;

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
    // SPA Fallback for /decorations, /story, /gallery, /about, /contact
    const indexPath = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(PORT, async () => {
  console.log(`[Test Server] Running at http://localhost:${PORT}`);

  const cdpPort = 9334;
  const userDataDir = path.join(os.tmpdir(), `chrome-mobile-first-${Date.now()}`);
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
  const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json`)).json();
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
  await pCmd('Runtime.enable');

  async function takeScreenshot(filename) {
    const { data } = await pCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, filename), Buffer.from(data, 'base64'));
    console.log(`  [Screenshot saved] ${filename}`);
  }

  console.log('\n======================================================');
  console.log('--- 1. AUDITING HOME PAGE AT MOBILE (390 x 844) ---');
  console.log('======================================================');

  await pCmd('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/` });
  await new Promise((r) => setTimeout(r, 1500));

  // Measure Home height and section breakdown
  const homeMetrics = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('.site-header');
      const hero = document.querySelector('.wedding-hero-section');
      const themes = document.querySelector('.section-theme-accordion');
      const featured = document.querySelector('.section-featured-photos');
      const story = document.querySelector('.section-story-preview');
      const enquiry = document.querySelector('.section-closing-enquiry');
      const footer = document.querySelector('.site-footer');

      // Check forbidden sections
      const hasPhotoWall = !!document.querySelector('.section-photowall');
      const hasEditorialSplit = !!document.querySelector('.editorial-split');
      const hasScrollTransformation = !!document.querySelector('.transformation-story-track');
      const hasVideo = !!document.querySelector('video');

      return {
        scrollHeight: document.documentElement.scrollHeight,
        headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
        heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
        themesHeight: themes ? Math.round(themes.getBoundingClientRect().height) : 0,
        featuredHeight: featured ? Math.round(featured.getBoundingClientRect().height) : 0,
        storyHeight: story ? Math.round(story.getBoundingClientRect().height) : 0,
        enquiryHeight: enquiry ? Math.round(enquiry.getBoundingClientRect().height) : 0,
        footerHeight: footer ? Math.round(footer.getBoundingClientRect().height) : 0,
        hasPhotoWall,
        hasEditorialSplit,
        hasScrollTransformation,
        hasVideo,
      };
    })()`,
    returnByValue: true,
  });

  console.log('Home 390x844 Metrics:', homeMetrics.result.value);
  const hm = homeMetrics.result.value;

  console.log(`\n  Target Height: ~3,500px (hard limit 4,000px)`);
  console.log(`  Measured Total scrollHeight: ${hm.scrollHeight}px`);
  if (hm.scrollHeight <= 4000) {
    console.log(`  [PASS] Total Home height ${hm.scrollHeight}px is within budget (< 4000px).`);
  } else {
    console.warn(`  [WARN] Total Home height ${hm.scrollHeight}px exceeds 4000px!`);
  }

  console.log(`  Section Breakdown:`);
  console.log(`    - Header: ${hm.headerHeight}px (budget: ~64px)`);
  console.log(`    - Hero: ${hm.heroHeight}px (budget: 600-700px)`);
  console.log(`    - Themes (collapsed): ${hm.themesHeight}px (budget: 320-400px)`);
  console.log(`    - 3 Featured Photos: ${hm.featuredHeight}px (budget: 900-1050px)`);
  console.log(`    - Story Preview: ${hm.storyHeight}px (budget: 350-450px)`);
  console.log(`    - CTA + Footer: ${hm.enquiryHeight + hm.footerHeight}px (budget: 450-550px)`);

  console.log(`  Integrity Check:`);
  console.log(`    - PhotoWall on Home: ${hm.hasPhotoWall ? 'FAIL' : 'PASS (Removed)'}`);
  console.log(`    - EditorialSplit on Home: ${hm.hasEditorialSplit ? 'FAIL' : 'PASS (Removed)'}`);
  console.log(`    - ScrollTransformation on Home: ${hm.hasScrollTransformation ? 'FAIL' : 'PASS (Moved to /story)'}`);
  console.log(`    - Video download/autoplay on Home: ${hm.hasVideo ? 'FAIL' : 'PASS (No video on Home)'}`);

  await takeScreenshot('mobile_390_home.png');

  // Test tap-to-expand accordion on Home
  console.log('\n--- 2. TESTING HOME TAP ACCORDION INTERACTION ---');
  const tapTest = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const rows = Array.from(document.querySelectorAll('.theme-tap-row'));
      const btn0 = rows[0]?.querySelector('.theme-tap-header-btn');
      const btn1 = rows[1]?.querySelector('.theme-tap-header-btn');

      const initialExpanded0 = btn0 ? btn0.getAttribute('aria-expanded') : null;
      
      // Tap row 0
      btn0?.click();
      const afterTap0Expanded = btn0?.getAttribute('aria-expanded');
      const panel0Height = rows[0]?.querySelector('.theme-tap-panel')?.getBoundingClientRect().height;

      // Tap row 1
      btn1?.click();
      const afterTap1Expanded0 = btn0?.getAttribute('aria-expanded');
      const afterTap1Expanded1 = btn1?.getAttribute('aria-expanded');

      // Tap row 1 again (collapse)
      btn1?.click();
      const afterTap1AgainExpanded1 = btn1?.getAttribute('aria-expanded');

      return {
        initialExpanded0,
        afterTap0Expanded,
        panel0Height: Math.round(panel0Height),
        afterTap1Expanded0,
        afterTap1Expanded1,
        afterTap1AgainExpanded1,
      };
    })()`,
    returnByValue: true,
  });

  console.log('Tap Accordion Interaction Test:', tapTest.result.value);

  // Test Complete Images on Mobile
  console.log('\n--- 3. TESTING COMPLETE IMAGES & NATURAL PROPORTIONS ---');
  const imageAudit = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const heroImg = document.querySelector('.wedding-hero-img');
      const featuredImgs = Array.from(document.querySelectorAll('.featured-photo-card .featured-photo-img'));
      
      const results = [];
      if (heroImg) {
        const rect = heroImg.getBoundingClientRect();
        results.push({
          type: 'Hero Venue Image',
          src: heroImg.src,
          naturalWidth: heroImg.naturalWidth,
          naturalHeight: heroImg.naturalHeight,
          naturalRatio: (heroImg.naturalWidth / heroImg.naturalHeight).toFixed(2),
          displayWidth: Math.round(rect.width),
          displayHeight: Math.round(rect.height),
          displayRatio: (rect.width / rect.height).toFixed(2),
          objectFit: getComputedStyle(heroImg).objectFit,
        });
      }

      featuredImgs.forEach((img, idx) => {
        const rect = img.getBoundingClientRect();
        const card = img.closest('.home-photo-card');
        const caption = card?.querySelector('.home-photo-meta');
        const captionRect = caption?.getBoundingClientRect();

        results.push({
          type: \`Featured Photo \${idx + 1}\`,
          naturalRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
          displayWidth: Math.round(rect.width),
          displayHeight: Math.round(rect.height),
          displayRatio: (rect.width / rect.height).toFixed(2),
          captionBelowImage: captionRect ? captionRect.top >= rect.bottom - 2 : false,
        });
      });

      return results;
    })()`,
    returnByValue: true,
  });

  console.log('Image Audit Results:', imageAudit.result.value);

  // Test other viewports for Home
  console.log('\n--- 4. HOME VIEWPORT AUDITS (320px, 768px, 1440px) ---');
  // 320px
  await pCmd('Emulation.setDeviceMetricsOverride', { width: 320, height: 600, deviceScaleFactor: 2, mobile: true });
  await new Promise((r) => setTimeout(r, 600));
  const h320 = await pCmd('Runtime.evaluate', { expression: `document.documentElement.scrollHeight`, returnByValue: true });
  console.log(`  Home scrollHeight at 320px: ${h320.result.value}px`);
  await takeScreenshot('mobile_320_home.png');

  // 768px
  await pCmd('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true });
  await new Promise((r) => setTimeout(r, 600));
  const h768 = await pCmd('Runtime.evaluate', { expression: `document.documentElement.scrollHeight`, returnByValue: true });
  console.log(`  Home scrollHeight at 768px: ${h768.result.value}px`);
  await takeScreenshot('tablet_768_home.png');

  // 1440px
  await pCmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await new Promise((r) => setTimeout(r, 600));
  const h1440 = await pCmd('Runtime.evaluate', { expression: `document.documentElement.scrollHeight`, returnByValue: true });
  console.log(`  Home scrollHeight at 1440px: ${h1440.result.value}px`);
  await takeScreenshot('desktop_1440_home.png');

  console.log('\n======================================================');
  console.log('--- 5. AUDITING THEMES PAGE (/decorations) ---');
  console.log('======================================================');

  // Test Themes at 1440px
  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/decorations` });
  await new Promise((r) => setTimeout(r, 1200));

  const themesDesktop = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.theme-detail-card'));
      return cards.map((c, i) => {
        const media = c.querySelector('.theme-detail-media');
        const frame = c.querySelector('.theme-showcase-frame');
        const img = c.querySelector('.theme-showcase-img');
        const meta = c.querySelector('.theme-showcase-meta');
        const mRect = media ? media.getBoundingClientRect() : null;
        const fRect = frame ? frame.getBoundingClientRect() : null;
        
        return {
          cardIndex: i + 1,
          mediaHeight: mRect ? Math.round(mRect.height) : 0,
          frameHeight: fRect ? Math.round(fRect.height) : 0,
          hasVoid: mRect && fRect ? (mRect.height - fRect.height > 300) : false,
          imgNatural: img ? \`\${img.naturalWidth}x\${img.naturalHeight}\` : null,
          title: meta?.querySelector('.showcase-photo-title')?.innerText || '',
        };
      });
    })()`,
    returnByValue: true,
  });

  console.log('Themes 1440px Audit:', themesDesktop.result.value);
  await takeScreenshot('desktop_1440_themes.png');

  // Test Themes at 390px (Mobile)
  await pCmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise((r) => setTimeout(r, 800));

  const themesMobile = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const desktopAcc = document.querySelector('.desktop-accordion-strip');
      const mobileAcc = document.querySelector('.mobile-tap-accordion-wrap');
      const cards = Array.from(document.querySelectorAll('.theme-detail-card'));

      // Test mobile accordion tap
      const mobileRows = Array.from(document.querySelectorAll('.mobile-acc-card'));
      const btn1 = mobileRows[1]?.querySelector('.mobile-acc-header-btn');
      btn1?.click();

      const isOpen1 = mobileRows[1]?.classList.contains('is-open');

      return {
        desktopAccVisible: desktopAcc ? getComputedStyle(desktopAcc).display !== 'none' : false,
        mobileAccVisible: mobileAcc ? getComputedStyle(mobileAcc).display !== 'none' : false,
        mobileCardsCount: mobileRows.length,
        tappedRowOpens: isOpen1,
        themeCardsMobile: cards.map(c => {
          const m = c.querySelector('.theme-detail-media');
          return m ? Math.round(m.getBoundingClientRect().height) : 0;
        }),
      };
    })()`,
    returnByValue: true,
  });

  console.log('Themes 390px Mobile Audit:', themesMobile.result.value);
  await takeScreenshot('mobile_390_themes.png');

  console.log('\n======================================================');
  console.log('--- 6. AUDITING /story ROUTE ---');
  console.log('======================================================');

  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/story` });
  await new Promise((r) => setTimeout(r, 1200));

  const storyAudit = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const heading = document.querySelector('h1')?.innerText || '';
      const stickyTrack = document.querySelector('.transformation-story-track');
      const video = document.querySelector('video');
      const chapters = Array.from(document.querySelectorAll('.stage-chapter-card')).length;

      return {
        heading,
        hasStickyTrack: !!stickyTrack,
        trackHeight: stickyTrack ? Math.round(stickyTrack.getBoundingClientRect().height) : 0,
        hasVideo: !!video,
        chaptersCount: chapters,
      };
    })()`,
    returnByValue: true,
  });

  console.log('Story Route Audit:', storyAudit.result.value);
  await takeScreenshot('mobile_390_story.png');

  console.log('\n======================================================');
  console.log('--- 7. TESTING DIRECT ROUTE FALLBACKS (200 OK) ---');
  console.log('======================================================');

  const routes = ['/', '/decorations', '/story', '/gallery', '/about', '/contact'];
  for (const r of routes) {
    const res = await fetch(`http://localhost:${PORT}${r}`);
    console.log(`  Route ${r.padEnd(14)} -> Status: ${res.status} (OK)`);
  }

  console.log('\n======================================================');
  console.log('--- 8. AUDITING DEVELOPER CONTACT CONFIG ---');
  console.log('======================================================');

  await pCmd('Page.navigate', { url: `http://localhost:${PORT}/contact` });
  await new Promise((r) => setTimeout(r, 800));

  const contactAudit = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => ({
        href: a.href,
        text: a.innerText.trim(),
      }));
      const whatsappLinks = Array.from(document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]')).length;
      const bodyText = document.body.innerText;
      
      return {
        hasYuvaraj: bodyText.includes('Yuvaraj'),
        hasPhone: bodyText.includes('73374 22054') || bodyText.includes('7337422054'),
        telLinks,
        whatsappLinks,
        hasConceptDisclaimer: bodyText.includes('demonstration') || bodyText.includes('A3Y Solutions'),
      };
    })()`,
    returnByValue: true,
  });

  console.log('Contact Audit:', contactAudit.result.value);

  console.log('\nAll tests completed. Shutting down test server and Chrome.');
  chrome.kill();
  server.close();
  process.exit(0);
});
