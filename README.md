# Attendance Payroll Offline

Offline-first attendance and payroll management for small teams.

出勤薪資管理系統是一套離線優先的小型團隊出勤與薪資結算工具。主程式可直接用瀏覽器開啟，資料預設儲存在使用者本機瀏覽器，適合需要簡單記錄出勤、假勤、月結薪資、薪資單列印與備份還原的店家、工作室或小型組織。

This project began as a Taiwan-focused attendance and payroll tool. It runs as a single HTML file, stores data locally in the browser, supports JSON backup/restore, and includes regression tests for payroll and leave calculations.

> Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.

> 核心介面支援多語系，但薪資 / 法規計算預設以台灣規則為主。

## Project Positioning

This repository is not just one loose HTML file. The app is packaged as a portable single-file browser application, with supporting documentation, regression tests, GitHub workflows, issue templates, and contribution guidelines around it.

這個 repository 不是單純只丟一個 HTML 檔案。主程式採用單一 HTML 是為了離線使用與部署方便；周邊已補上文件、測試、GitHub Actions、issue template、授權與貢獻說明，方便其他人理解、驗證與協作。

## Features

- Employee records for monthly and hourly workers
- Attendance records, tardiness, early leave, and overtime calculation
- Leave records for annual leave, personal leave, sick leave, menstrual leave, bereavement leave, compensatory leave, and other leave
- Taiwan-focused labor insurance, national health insurance, and pension reference table support
- Monthly payroll settlement with all-employee payroll totals
- Printable payslip and spreadsheet export
- Local JSON backup and restore
- Fictional demo data loader for safe public demos
- Regression tests for payroll edge cases
- Bilingual core UI and output: Traditional Chinese and English labels, common dynamic output, report HTML, printable payslip HTML, workbook headings, units, placeholders, and dialogs

## Quick Start

Open the app directly:

```text
src/index.html
```

No server is required. Data is stored in the current browser's local storage. Export JSON backups regularly, especially before switching computers or clearing browser data.

## Development

Run calculation tests:

```bash
node --test tests/payroll-calculation.test.js
```

Run the privacy audit before pushing:

```bash
npm run privacy:audit
```

Run the i18n static UI audit:

```bash
npm run i18n:audit
```

Check test file syntax:

```bash
node --check tests/payroll-calculation.test.js
```

## Documentation

- Traditional Chinese manual: [docs/manual.zh-TW.html](docs/manual.zh-TW.html)
- Printable manual: [docs/manual.zh-TW.pdf](docs/manual.zh-TW.pdf)
- English manual: [docs/manual.en.md](docs/manual.en.md)
- Specification: [docs/spec.zh-TW.md](docs/spec.zh-TW.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- English overview: [docs/README.en.md](docs/README.en.md)
- Internationalization notes: [docs/i18n.md](docs/i18n.md)
- GitHub publishing guide: [docs/github-publish.zh-TW.md](docs/github-publish.zh-TW.md)
- GitHub profile copy: [docs/github-profile.md](docs/github-profile.md)
- Architecture notes: [docs/architecture.md](docs/architecture.md)

## Privacy and Data

This is an offline-first tool. By default, employee and payroll data stays in the user's browser local storage. The repository must not include real employee data, payroll exports, production JSON backups, or bug reports containing personally identifiable information.

## Open Source Status

This repository is being prepared for public open-source release. The current calculation preset is Taiwan-focused. Contributions for documentation, tests, accessibility, and internationalization are welcome.

## License

MIT License. See [LICENSE](LICENSE).
