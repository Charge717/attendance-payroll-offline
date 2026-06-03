# English Project Overview

Attendance Payroll Offline is an offline-first attendance and payroll management tool for small organizations.

It is designed for administrators, HR staff, accountants, and managers who need a lightweight way to record attendance, manage leave, calculate payroll, print payslips, and keep local backups.

## Important Scope Note

Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.

The current payroll rules include Taiwan-oriented concepts such as labor insurance, national health insurance, pension contribution, special leave, compensatory leave, bereavement leave, and related payroll adjustments. Users outside Taiwan should treat these rules as a reference implementation, not as legal or payroll advice for their jurisdiction.

## Why This Project Exists

Many small teams need transparent payroll tools that can work without a backend server, cloud subscription, or external database. This project keeps the app portable as a single HTML file while adding tests and documentation so calculation changes can be reviewed safely.

## Current Priorities

- Keep payroll and leave calculations auditable
- Add regression tests for every calculation edge case
- Improve English UI coverage and documentation
- Prepare clean GitHub contribution workflows
- Add optional locale dictionaries without changing Taiwan payroll defaults

## Non-Goals

- This is not legal, tax, or HR compliance advice.
- This is not a multi-country payroll engine yet.
- This does not upload payroll data to a cloud service by default.

## Running Tests

```bash
node --test tests/payroll-calculation.test.js
```

## Related Documents

- User manual: [manual.en.md](manual.en.md)
- Internationalization notes: [i18n.md](i18n.md)
- Traditional Chinese specification: [spec.zh-TW.md](spec.zh-TW.md)
