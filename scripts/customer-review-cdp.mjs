/* global process, fetch, WebSocket, setTimeout, Buffer, console */
import { writeFile } from 'node:fs/promises';

const [url, outputPath, width = '390', height = '844', wait = '3000', reducedMotion = 'no-preference'] = process.argv.slice(2);
if (!url || !outputPath) throw new Error('Usage: node scripts/customer-review-cdp.mjs <url> <output> [width] [height] [waitMs] [reducedMotion]');

const targets = await fetch('http://127.0.0.1:9223/json/list').then((response) => response.json());
const target = targets.find((candidate) => candidate.type === 'page');
if (!target) throw new Error('No Chrome page target is available.');

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const consoleErrors = [];
const networkFailures = [];
let messageId = 0;

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
    return;
  }
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) {
    consoleErrors.push(message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));
  }
  if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params.entry.level)) {
    consoleErrors.push(message.params.entry.text);
  }
  if (message.method === 'Network.loadingFailed' && !message.params.canceled) {
    networkFailures.push({ url: message.params.url, errorText: message.params.errorText });
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

function send(method, params = {}) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await Promise.all([
  send('Page.enable'),
  send('Runtime.enable'),
  send('Log.enable'),
  send('Network.enable'),
]);
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(width),
  height: Number(height),
  deviceScaleFactor: 1,
  mobile: Number(width) < 600,
});
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: reducedMotion }],
});
await send('Page.navigate', { url });
await new Promise((resolve) => setTimeout(resolve, Number(wait)));
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
await new Promise((resolve) => setTimeout(resolve, 100));

const result = await send('Runtime.evaluate', {
  expression: `JSON.stringify((() => {
    const root = document.querySelector('#root');
    const images = [...document.images];
    const controls = [...document.querySelectorAll('a, button, input, select, textarea')];
    const unlabeledControls = controls.filter((control) => {
      if (control.matches('input[type="hidden"]')) return false;
      const text = (control.getAttribute('aria-label') || control.textContent || '').trim();
      const id = control.getAttribute('id');
      return !text && !(id && document.querySelector('label[for="' + CSS.escape(id) + '"]')) && !control.closest('label');
    }).length;
    return {
      title: document.title,
      path: location.pathname + location.search,
      rootTextLength: root?.innerText.length ?? 0,
      h1: [...document.querySelectorAll('h1')].map((item) => item.innerText),
      scrollY: Math.round(window.scrollY),
      homeHeaderTop: Math.round(document.querySelector('.customer-home-header')?.getBoundingClientRect().top ?? -1),
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflowingElements: [...document.querySelectorAll('body *')].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
      }).slice(0, 12).map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === 'string' ? element.className : '',
        left: Math.round(element.getBoundingClientRect().left),
        right: Math.round(element.getBoundingClientRect().right),
      })),
      brokenImages: images.filter((image) => {
        const visibleSoon = image.getBoundingClientRect().top < window.innerHeight + 200;
        return visibleSoon && (!image.complete || image.naturalWidth === 0);
      }).map((image) => image.src),
      unlabeledControls,
      statusRegions: document.querySelectorAll('[role="status"], [aria-live]').length,
      alertRegions: document.querySelectorAll('[role="alert"]').length,
    };
  })())`,
  returnByValue: true,
});
const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
await writeFile(outputPath, Buffer.from(screenshot.data, 'base64'));
socket.close();

console.log(JSON.stringify({
  ...JSON.parse(result.result.value),
  consoleErrors: [...new Set(consoleErrors)].filter(Boolean),
  networkFailures,
  screenshot: outputPath,
}));
