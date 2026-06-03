const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const IGNORED_DIRS = new Set(['.git', 'node_modules', '.cache', 'dist', 'coverage', 'tmp', 'temp']);
const BLOCKED_EXTENSIONS = new Set(['.xlsx', '.xls', '.csv', '.zip']);
const ALLOWED_FILES = new Set([
  path.normalize('package.json'),
  path.normalize('docs/manual.zh-TW.pdf')
]);
const BLOCKED_NAME_PATTERNS = [
  /backup/i,
  /payroll.*export/i,
  /attendance.*export/i,
  /備份/,
  /薪資.*匯出/,
  /出勤.*匯出/
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function toRepoPath(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function isAllowed(filePath) {
  return ALLOWED_FILES.has(path.normalize(path.relative(ROOT, filePath)));
}

function auditFile(filePath) {
  if (isAllowed(filePath)) return null;
  const repoPath = toRepoPath(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return `${repoPath} uses blocked extension ${ext}`;
  }
  if (ext === '.json' && repoPath !== 'package.json') {
    return `${repoPath} is a JSON data file; commit docs or fixtures only after review`;
  }
  if (BLOCKED_NAME_PATTERNS.some(pattern => pattern.test(repoPath))) {
    return `${repoPath} matches a private-data filename pattern`;
  }
  return null;
}

const findings = walk(ROOT).map(auditFile).filter(Boolean);

if (findings.length) {
  console.error('Privacy audit failed. Review these files before pushing:');
  findings.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Privacy audit passed: no obvious private payroll exports, backups, or spreadsheet dumps found.');
