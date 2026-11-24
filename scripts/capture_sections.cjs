const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const port = 9230;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://localhost:5173/'
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
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Scroll to category overview & editorial split
  await pCmd('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 780, behavior: 'instant' })`
  });
  await new Promise((r) => setTimeout(r, 600));
  const shot1 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/desktop_02_categories_editorial.png', Buffer.from(shot1.data, 'base64'));

  // 2. Scroll to photo accordion
  await pCmd('Runtime.evaluate', {
    expression: `document.getElementById('accordion-section').scrollIntoView({ behavior: 'instant' })`
  });
  await new Promise((r) => setTimeout(r, 600));
  const shot2 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/desktop_03_photo_accordion.png', Buffer.from(shot2.data, 'base64'));

  // 3. Scroll to photo wall & closing enquiry
  await pCmd('Runtime.evaluate', {
    expression: `document.querySelector('.section-photowall').scrollIntoView({ behavior: 'instant' })`
  });
  await new Promise((r) => setTimeout(r, 600));
  const shot3 = await pCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('screenshots/desktop_04_photowall_closing.png', Buffer.from(shot3.data, 'base64'));

  await pCmd('Target.closeTarget', { targetId });
  pageWs.close();
  ws.close();
  chrome.kill();
  process.exit(0);
})();
