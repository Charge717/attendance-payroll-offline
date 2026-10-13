const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
if (!scripts.length) throw new Error('No inline app scripts found');
for (const [index, match] of scripts.entries()) {
  new vm.Script(match[1], { filename: `inline-script-${index + 1}.js` });
}
for (const match of html.matchAll(/const (xlsxBase64|bootstrapBase64) = '([^']+)'/g)) {
  new vm.Script(Buffer.from(match[2], 'base64').toString('latin1'), { filename: `${match[1]}.js` });
}
console.log(`App syntax passed: ${scripts.length} inline scripts and offline bundles checked.`);
