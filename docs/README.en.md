# English Project Overview

Attendance Payroll Offline is an offline-first attendance and payroll management tool for small organizations.

It is designed for administrators, HR staff, accountants, and managers who need a lightweight way to record attendance, manage leave, calculate payroll, print payslips, and keep local backups. The app runs as a single HTML file, and working data is stored locally in the browser by default, completely free of any external servers or databases.

## Important Scope Note

Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.

The current payroll rules cover Taiwan-specific concepts such as labor insurance, national health insurance, pension contribution, various leave types (special leave, compensatory leave, bereavement leave), and related payroll adjustments. Users outside Taiwan should treat these rules as a reference implementation rather than official legal or payroll advice for their jurisdiction.

## Why This Project Exists

Many small teams need transparent payroll tools that can work without a backend server, cloud subscription, or external database. This project keeps the app portable as a single HTML file, while having tests and documentation so any calculation changes can be safely reviewed.

## Current Priorities

- Keep payroll and leave calculations transparent and auditable
- Add regression tests to cover every calculation edge case
- Improve English UI coverage and documentation
- Maintain a clean GitHub contribution workflow
- Add more language translations for the interface without altering the default Taiwan payroll rules

## Non-Goals

- This tool does not provide legal, tax, or HR compliance advice.
- This is not a multi-country payroll engine yet.
- This app does not upload payroll data to any cloud service.

## Running Tests
Before deploying any custom modifications to the payroll logic, verify your changes by running the regression tests using:
```bash
node --test tests/payroll-calculation.test.js
```

## Related Documents

- User manual: [manual.en.md](manual.en.md)
- Internationalization notes: [i18n.md](i18n.md)
- Traditional Chinese specification: [spec.zh-TW.md](spec.zh-TW.md)
