# English Project Overview

Attendance Payroll Offline is an offline-first attendance and payroll tool for small teams. It runs as a single HTML file and stores working data locally in the browser by default.

The project is multilingual at the interface and documentation level, but the maintained payroll calculation preset is Taiwan-focused.

## Scope

The built-in preset covers Taiwan-oriented attendance and payroll concepts, including labor insurance, national health insurance, labor pension contribution, leave handling, overtime, salary settlement, payslips, and spreadsheet export.

Users outside Taiwan should treat the Taiwan preset as a reference implementation. Before using the app for another jurisdiction, review the rules with a local payroll, HR, tax, or legal professional.

This project does not provide legal, tax, HR, or payroll compliance advice.

## Why This Project Exists

Many small teams need transparent payroll software that works without a backend server, subscription, or external database. This project keeps the app portable while preserving regression tests and documentation so calculation changes can be reviewed.

## What Contributors Can Safely Help With

- Translation and copy editing
- Documentation and examples
- Accessibility improvements
- UI polish
- Privacy and test tooling
- Regression tests for known calculation behavior

## What Requires Extra Care

Payroll-rule changes require tests, documentation, and a clear jurisdiction label. A translation PR should not silently change calculation behavior.

New country or region presets should be proposed as separate rule presets, not as changes to the Taiwan preset.

## Non-Goals

- This is not a global payroll engine yet.
- This is not a substitute for local payroll compliance review.
- This app does not upload payroll data to any cloud service by default.

## Running Tests

```bash
npm test
npm run privacy:audit
npm run i18n:audit
```

## Related Documents

- Traditional Chinese overview: [README.zh-TW.md](README.zh-TW.md)
- Rule preset policy: [rule-presets.md](rule-presets.md)
- Rule preset schema draft: [rule-preset-schema.md](rule-preset-schema.md)
- Bilingual glossary: [glossary.zh-TW-en.md](glossary.zh-TW-en.md)
- User manual: [manual.en.md](manual.en.md)
- Internationalization notes: [i18n.md](i18n.md)
- Traditional Chinese specification: [spec.zh-TW.md](spec.zh-TW.md)
