# English Launch Post

## One-liner

I have open-sourced a free, offline-first attendance and payroll tool for small teams, packaged as a single HTML file with Taiwan-specific payroll presets.

## Short Version

I just open-sourced Attendance Payroll Offline:

https://github.com/Charge717/attendance-payroll-offline

It is a free, zero-install, no-server attendance and payroll tool for small teams. The app runs entirely as a single HTML file and stores all data locally in the browser by default.

It handles employee records, attendance logs, leave management, monthly payroll settlement, printable payslips, spreadsheet export, JSON backup/restore, and fictional demo data.

The core UI supports both English and Traditional Chinese, with default payroll and legal calculation presets being Taiwan-focused by default. For developers, the repository includes regression tests, GitHub Actions, privacy audit, and i18n audit scripts.

Demo:
https://charge717.github.io/attendance-payroll-offline/

## Long Version

Many small teams do not need a full-scale cloud HR platform. They need something transparent, portable, and easy to manage: basic attendance records, leave tracking, monthly payroll, payslips, and reliable backups.

Attendance Payroll Offline is my attempt to make that workflow local-first and fully open-source.

Key highlights:

- Completely free and MIT licensed.
- Runs entirely as a single HTML file.
- No server, account, or database required. Your data stays in your browser by default.
- Full support for JSON backups, restores, and spreadsheet exports.
- Manage attendance, track leave, settle payroll, and print payslips all in one place.
- Includes fictional demo data for safe local testing without risking real information.
- For developers, includes regression tests for payroll edge cases, plus privacy and i18n audit scripts in CI.


While the core UI supports multiple languages (currently English and Traditional Chinese), the project originated from Taiwan-focused attendance and payroll workflows, so the payroll and legal calculation presets remain Taiwan-focused by default.

GitHub Repository:
https://github.com/Charge717/attendance-payroll-offline

Live Demo:
https://charge717.github.io/attendance-payroll-offline/

Feedback is highly appreciated! I welcome contribution of all kinds, from documentation improvements and tests, to accessibility enhancements and localization.