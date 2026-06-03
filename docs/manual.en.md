# User Manual

## Scope

Attendance Payroll Offline is an offline-first attendance and payroll tool for small teams.

Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.

The current preset includes Taiwan-oriented payroll concepts such as labor insurance, national health insurance, pension contribution, special leave, personal leave, sick leave, bereavement leave, compensatory leave, and monthly payroll adjustments. Users outside Taiwan should review and adapt the rules before using the output for payroll decisions.

## Open the App

Open `src/index.html` in a browser. No server, database, or account is required.

All working data is stored in the current browser's local storage. Export a JSON backup before switching computers, clearing browser data, or testing major changes.

## Language

Use the language selector in the top bar to switch between Traditional Chinese and English core UI labels.

English support is currently focused on the core navigation, project documentation, and contribution direction. Payroll calculation rules remain Taiwan-focused unless a future jurisdiction-specific preset is added.

## Employee Setup

1. Open the Employees tab.
2. Add each employee with the correct employment type.
3. Enter monthly salary or hourly wage, fixed allowances, and insurance-related values.
4. Keep inactive employees in the system when historical payroll records still need them.

## Attendance Records

1. Open the Attendance tab.
2. Select employee, date, check-in time, check-out time, and day type.
3. Review the preview calculation before saving.
4. For normal weekdays, the default schedule is `08:00 ~ 17:00` with `12:00 ~ 13:00` excluded as unpaid lunch.

Lunch overlap is calculated by actual overlap minutes. For example, `08:00 ~ 12:02` counts 4 paid work hours and excludes only the 2 lunch minutes from `12:00 ~ 12:02`.

## Leave Records

1. Open the Leave tab.
2. Select employee, leave date, leave type, and duration.
3. Personal leave can offset absence minutes while normal worked minutes remain payable.
4. Paid bereavement leave can cover a half-day absence without causing tardiness or early-leave deduction.

When attendance and leave exist on the same day, the calculation reconciles them so approved leave covers the matching absence window.

## Payroll Settlement

1. Open the Payroll tab.
2. Select the month.
3. Review each employee's payable hours, leave deductions, overtime, insurance deductions, manual adjustments, and net pay.
4. Use the monthly summary totals to verify the all-employee gross total, deduction total, and net payroll total.

## Reports and Export

Use the Reports tab to review monthly records, print payslips, and export spreadsheet files when needed.

Generated payroll exports may contain personal data. Do not commit exports, backups, or real employee records to Git.

## Backup and Restore

Use the Backup tab to export a JSON backup regularly.

Recommended backup timing:

- Before payroll settlement
- Before importing or restoring data
- Before clearing browser data
- Before testing a new release

## Developer Checks

Run the regression tests before changing payroll logic:

```bash
npm test
```

Run the syntax check:

```bash
npm run check
```

Any new payroll or leave rule should include a focused regression test.
