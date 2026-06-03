# Attendance Payroll Offline

Offline-first attendance and payroll management for small teams.

This project began as a Taiwan-focused attendance and payroll tool. It runs as a single HTML file, stores data locally in the browser, supports JSON backup/restore, and includes regression tests for payroll and leave calculations.

> Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.

## Features

- Employee records for monthly and hourly workers
- Attendance records, tardiness, early leave, and overtime calculation
- Leave records for annual leave, personal leave, sick leave, menstrual leave, bereavement leave, compensatory leave, and other leave
- Taiwan-focused labor insurance, national health insurance, and pension reference table support
- Monthly payroll settlement with all-employee payroll totals
- Printable payslip and spreadsheet export
- Local JSON backup and restore
- Regression tests for payroll edge cases
- Bilingual project direction: Traditional Chinese first, English support in progress

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

## Privacy and Data

This is an offline-first tool. By default, employee and payroll data stays in the user's browser local storage. The repository must not include real employee data, payroll exports, production JSON backups, or bug reports containing personally identifiable information.

## Open Source Status

This repository is being prepared for public open-source release. The current calculation preset is Taiwan-focused. Contributions for documentation, tests, accessibility, and internationalization are welcome.

## License

MIT License. See [LICENSE](LICENSE).
