# English Launch Post

## One-liner

I open-sourced a free, offline-first attendance and payroll tool for small teams, packaged as a single browser-based HTML app with Taiwan-focused payroll presets.

## Short Version

I just open-sourced Attendance Payroll Offline:

https://github.com/Charge717/attendance-payroll-offline

It is a free, zero-install, no-server attendance and payroll tool for small teams. The app runs as a single HTML file, stores data locally in the browser by default, and supports employee records, attendance logs, leave management, monthly payroll settlement, printable payslips, spreadsheet export, JSON backup/restore, and fictional demo data.

The core UI supports Traditional Chinese and English, while payroll/legal calculation presets are Taiwan-focused by default. The repository includes regression tests, GitHub Actions, privacy audit, and i18n audit scripts.

Demo:
https://charge717.github.io/attendance-payroll-offline/

## Long Version

Many small teams do not need a full cloud HR platform. They need something transparent, portable, and easy to inspect: attendance records, leave tracking, monthly payroll, payslips, exports, and backups.

Attendance Payroll Offline is my attempt to make that workflow local-first and open source.

Key points:

- Free and MIT licensed
- Runs as a single HTML file
- No server, account, or database required
- Data stays in the user's browser by default
- JSON backup and restore
- Attendance, leave, payroll settlement, payslip print, and spreadsheet export
- Fictional demo data for safe public testing
- Regression tests for payroll edge cases
- Privacy and i18n audit scripts in CI

The project started from Taiwan-focused attendance and payroll workflows. Core UI supports multiple languages, but payroll/legal calculation presets remain Taiwan-focused by default.

GitHub:
https://github.com/Charge717/attendance-payroll-offline

Demo:
https://charge717.github.io/attendance-payroll-offline/

Feedback, documentation improvements, tests, accessibility improvements, and localization contributions are welcome.
