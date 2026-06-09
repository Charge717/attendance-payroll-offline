# 出勤薪資管理系統 · Attendance Payroll Offline

Offline-first attendance and payroll software with a tested Taiwan payroll preset, configurable rules, and multilingual documentation.

離線優先的出勤薪資工具，內建已測試的台灣薪資規則預設，並保留規則調整與多語文件的擴充空間。

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with HTML](https://img.shields.io/badge/built%20with-HTML%20only-orange.svg)](src/index.html)
[![No Server](https://img.shields.io/badge/server-not%20required-brightgreen.svg)](#quick-start)
[![Offline First](https://img.shields.io/badge/offline-first-lightblue.svg)](#privacy-and-data)
[![Taiwan Preset](https://img.shields.io/badge/payroll%20preset-Taiwan%202026-red.svg)](#scope)
[![Version](https://img.shields.io/badge/version-v2.1-informational.svg)](CHANGELOG.md)

<p align="center">
  <a href="https://charge717.github.io/attendance-payroll-offline/"><strong>Try the demo</strong></a>
  ·
  <a href="src/index.html"><strong>Download the single HTML app</strong></a>
  ·
  <a href="docs/README.zh-TW.md">中文說明</a>
  ·
  <a href="docs/README.en.md">English overview</a>
</p>

> The app runs in your browser. Payroll data is stored locally by default and is not uploaded to any server.

![操作演示](docs/demo.gif)

## Scope

This project is internationalized at the interface and documentation level, but the built-in payroll preset is Taiwan-focused.

- The maintained preset is for Taiwan attendance and payroll workflows.
- Users outside Taiwan should treat the Taiwan preset as a reference implementation.
- Other jurisdictions require local review and custom configuration.
- This project is not legal, tax, HR, or payroll compliance advice.

That boundary is intentional: translation can be community-driven, but payroll rules must stay explicit, testable, and jurisdiction-aware.

## Why This Project Exists

Small teams often need a transparent payroll tool that does not require a SaaS subscription, backend server, or external database. This project keeps the app portable as a single HTML file while preserving regression tests for sensitive payroll calculations.

| Need | This Project |
|---|---|
| Install | Open a single HTML file in a browser |
| Data storage | Local browser storage and user-controlled backups |
| Default rules | Tested Taiwan payroll preset |
| Customization | Manual payroll adjustments and future rule preset path |
| Privacy | No server upload by default |
| Reviewability | Open source code, tests, and documentation |

## Features

### Attendance and Employees

- Monthly and hourly employee records
- Attendance records with tardiness, early leave, and normal work hour calculation
- Lunch break handling that avoids double-counting absence
- Leave and attendance interaction for half-day leave scenarios
- Missing attendance warnings

### Payroll

- Monthly settlement workflow
- Taiwan labor insurance, national health insurance, and pension reference-table support
- Overtime, leave deduction, fixed allowance, meal allowance, and manual adjustment handling
- Printable payslips and `.xlsx` export
- Regression tests for payroll edge cases

### Data Safety

- Local-first storage
- JSON backup and restore
- Demo data for safe public testing
- Privacy audit script to reduce accidental payroll-data commits

## Quick Start

1. Try the hosted demo: [charge717.github.io/attendance-payroll-offline](https://charge717.github.io/attendance-payroll-offline/)
2. Or download [`src/index.html`](src/index.html).
3. Open `index.html` in a modern browser.
4. Use the backup area to load fictional demo data before entering real data.

## Development

```bash
# Payroll regression tests
node --test tests/payroll-calculation.test.js

# Privacy scan before pushing
npm run privacy:audit

# i18n compatibility audit
npm run i18n:audit
```

## Project Structure

```text
attendance-payroll-offline/
├── src/
│   └── index.html
├── docs/
│   ├── README.zh-TW.md
│   ├── README.en.md
│   ├── glossary.zh-TW-en.md
│   ├── rule-presets.md
│   ├── manual.zh-TW.html
│   ├── manual.zh-TW.pdf
│   ├── manual.en.md
│   ├── spec.zh-TW.md
│   └── architecture.md
├── tests/
│   └── payroll-calculation.test.js
├── scripts/
│   ├── privacy-audit.js
│   └── i18n-audit.js
├── CHANGELOG.md
└── CONTRIBUTING.md
```

## Documentation

| Document | Link |
|---|---|
| 中文專案說明 | [docs/README.zh-TW.md](docs/README.zh-TW.md) |
| English overview | [docs/README.en.md](docs/README.en.md) |
| Jurisdiction and rule preset policy | [docs/rule-presets.md](docs/rule-presets.md) |
| Bilingual glossary | [docs/glossary.zh-TW-en.md](docs/glossary.zh-TW-en.md) |
| Traditional Chinese manual | [docs/manual.zh-TW.html](docs/manual.zh-TW.html) |
| Printable manual PDF | [docs/manual.zh-TW.pdf](docs/manual.zh-TW.pdf) |
| English manual | [docs/manual.en.md](docs/manual.en.md) |
| System specification | [docs/spec.zh-TW.md](docs/spec.zh-TW.md) |
| Architecture notes | [docs/architecture.md](docs/architecture.md) |
| Internationalization notes | [docs/i18n.md](docs/i18n.md) |

## Privacy and Data

This is an offline-first tool. Employee and payroll records stay in local browser storage unless the user explicitly exports or shares them.

Always export JSON backups before changing browsers, clearing browser data, or moving to another computer.

## Contributing

Contributions are welcome, especially:

- UI translation and copy editing
- Documentation improvements
- Accessibility improvements
- Test cases for payroll edge cases
- Clear, sourced proposals for future rule presets

Payroll-rule changes must include tests and documentation. Do not imply that the Taiwan payroll preset applies globally. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT License](LICENSE). You may use, modify, and distribute this project, including for commercial use.
