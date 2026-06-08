const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const APP_PATH = path.join(ROOT, 'src', 'index.html');

function createElementStub(id = '') {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    checked: false,
    disabled: false,
    dataset: {},
    style: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    click() {},
    reset() {},
    setAttribute() {},
    getAttribute() { return null; },
    hasAttribute() { return false; }
  };
}

function extractAppScript(html) {
  const marker = '//  CONSTANTS';
  const markerIndex = html.indexOf(marker);
  const scriptOpen = html.lastIndexOf('<script>', markerIndex);
  const scriptStart = html.indexOf('>', scriptOpen) + 1;
  const scriptEnd = html.indexOf('</script>', scriptStart);
  return html.slice(scriptStart, scriptEnd);
}

function loadAppForAudit(html) {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, createElementStub(id));
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    createElement(tagName) {
      const el = createElementStub(tagName);
      el.tagName = String(tagName).toUpperCase();
      return el;
    },
    title: ''
  };
  const context = {
    console,
    document,
    localStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {},
      clear() {}
    },
    alert() {},
    confirm() { return true; },
    bootstrap: {
      Modal: Object.assign(function Modal() { return { show() {}, hide() {} }; }, {
        getInstance() { return { show() {}, hide() {} }; }
      })
    },
    Blob: class Blob {},
    FileReader: class FileReader {},
    URL: {
      createObjectURL() { return 'blob:audit'; },
      revokeObjectURL() {}
    }
  };
  context.window = { print() {} };
  vm.createContext(context);
  vm.runInContext(extractAppScript(html), context, { filename: APP_PATH });
  return context;
}

function extractStaticChineseText(html) {
  const beforeScript = html.slice(0, html.indexOf('<script>'));
  const text = beforeScript
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
  return [...new Set(text
    .split(/\n+/)
    .map(item => item.trim())
    .filter(item => /[\u4e00-\u9fff]/.test(item)))];
}

const html = fs.readFileSync(APP_PATH, 'utf8');
const app = loadAppForAudit(html);
if (typeof app.translateLiteralText !== 'function') {
  console.log('i18n audit skipped: app does not expose translateLiteralText.');
  process.exit(0);
}
const staticItems = extractStaticChineseText(html);
const untranslated = staticItems.filter(item => /[\u4e00-\u9fff]/.test(app.translateLiteralText(item, 'en')));

if (untranslated.length) {
  console.error('i18n audit failed. These static UI strings still contain Chinese after English translation:');
  untranslated.forEach(item => console.error(`- ${item} => ${app.translateLiteralText(item, 'en')}`));
  process.exit(1);
}

console.log(`i18n audit passed: ${staticItems.length} static Chinese UI strings translate cleanly to English.`);
