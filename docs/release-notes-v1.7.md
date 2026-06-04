# v1.7 - Lunch Break Precision and Public OSS Release

Attendance Payroll Offline v1.7 focuses on payroll calculation correctness, public demo readiness, and open-source maintainability.

## Highlights

- Fixed lunch-break overlap calculation so only the actual overlap with `12:00 ~ 13:00` is excluded.
- Added regression coverage for lunch boundary cases such as `07:51 ~ 12:02`, `08:00 ~ 12:59`, and full-day attendance.
- Preserved half-day bereavement leave and personal-leave minute offset behavior.
- Added all-employee monthly payroll total summary in payroll settlement.
- Added Traditional Chinese / English UI and output localization coverage.
- Added fictional demo data for safe public testing.
- Added privacy and i18n audit scripts in GitHub Actions.

## Demo

Try the browser demo:

https://charge717.github.io/attendance-payroll-offline/

The app runs locally in the browser. Demo data is fictional, and real payroll data should be kept in the user's own browser or JSON backups.

## Verification

Before release, the following checks were run:

```bash
npm test
npm run check
npm run i18n:audit
npm run privacy:audit
```

## Scope

Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.
