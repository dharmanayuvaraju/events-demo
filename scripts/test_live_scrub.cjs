const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots');

(async () => {
  const port = 9235;
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

  const { targetId } = await cmd('Target.createTarget', { url: 'http://localhost:5173/' });
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
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await pCmd('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise((r) => setTimeout(r, 1500));

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
  console.log(`Live Dev Server: section top=${secTop}px, height=${secHeight}px`);

  // Scroll to Chapter 2 position (~35% progress)
  const ch2Scroll = secTop + secHeight * 0.35;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${ch2Scroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const ch2State = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
        activeTag: activeCard ? activeCard.querySelector('.chapter-tag')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Live Scrolled 35% -> Video time: ${ch2State.result.value.currentTime.toFixed(2)}s, Active Chapter: "${ch2State.result.value.activeTag} - ${ch2State.result.value.activeHeadline}"`);

  // Scroll to Chapter 3 position (~65% progress)
  const ch3Scroll = secTop + secHeight * 0.65;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${ch3Scroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const ch3State = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
        activeTag: activeCard ? activeCard.querySelector('.chapter-tag')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Live Scrolled 65% -> Video time: ${ch3State.result.value.currentTime.toFixed(2)}s, Active Chapter: "${ch3State.result.value.activeTag} - ${ch3State.result.value.activeHeadline}"`);

  // Scroll to Chapter 4 position (~95% progress)
  const ch4Scroll = secTop + secHeight * 0.95;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${ch4Scroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const ch4State = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
        activeTag: activeCard ? activeCard.querySelector('.chapter-tag')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Live Scrolled 95% -> Video time: ${ch4State.result.value.currentTime.toFixed(2)}s, Active Chapter: "${ch4State.result.value.activeTag} - ${ch4State.result.value.activeHeadline}"`);

  // Reverse scroll to Chapter 1 (~10% progress)
  const reverseScroll = secTop + secHeight * 0.10;
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${reverseScroll}, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const revState = await pCmd('Runtime.evaluate', {
    expression: `(() => {
      const vid = document.querySelector('.stage-video');
      const activeCard = document.querySelector('.stage-chapter-card.chapter-active');
      return {
        currentTime: vid ? vid.currentTime : -1,
        activeHeadline: activeCard ? activeCard.querySelector('.chapter-headline')?.textContent : 'none',
        activeTag: activeCard ? activeCard.querySelector('.chapter-tag')?.textContent : 'none',
      };
    })()`,
    returnByValue: true,
  });
  console.log(`Live Reverse to 10% -> Video time: ${revState.result.value.currentTime.toFixed(2)}s, Active Chapter: "${revState.result.value.activeTag} - ${revState.result.value.activeHeadline}"`);

  // Capture final screenshots
  const shot1 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'live_ch1_reverse.png'), Buffer.from(shot1.data, 'base64'));

  // Test Skip Animation
  await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.skip-animation-link')?.click();`,
  });
  await new Promise((r) => setTimeout(r, 600));
  const skipPos = await pCmd('Runtime.evaluate', {
    expression: `window.scrollY >= document.getElementById('accordion-section').offsetTop - 120`,
    returnByValue: true,
  });
  console.log(`Skip animation smooth scroll verified: ${skipPos.result.value ? '✓ REACHED ACCORDION' : '✗ FAILED'}`);

  await pCmd('Target.closeTarget', { targetId });
  pageWs.close();
  ws.close();
  chrome.kill();
  process.exit(0);
})();
