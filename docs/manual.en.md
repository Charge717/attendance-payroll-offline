# User Manual

## Scope

Attendance Payroll Offline is an offline-first attendance and payroll tool for small teams.

While the core UI supports multiple languages, the default calculation presets are designed for Taiwan's payroll and legal systems.

These built-in features cover Taiwan-specific payroll concepts such as labor insurance, national health insurance, pension contribution, various leave types (special leave, personal leave, sick leave, bereavement leave, compensatory leave), and monthly payroll adjustments. If you are using this tool outside Taiwan, you should review and adapt the rules before using the output for payroll decisions.


## Open the App

Open `src/index.html` in a browser. No server, database, or account is required.

**⚠️ Important:** All working data is stored in the current browser's local storage. Export a JSON backup before switching computers, clearing browser data, or testing major changes.

## Language

Use the language selector in the top bar to switch between Traditional Chinese and English core UI labels.

English support is currently focused on the core navigation, project documentation, and contribution direction. Payroll calculation rules remain Taiwan-focused unless a jurisdiction-specific preset is added in the future.

## Employee Setup

1. Open the **👥 Employees** tab.
2. Add each employee and assign the correct employment type.
3. Enter their monthly salary or hourly wage, fixed allowances, and insurance-related values.

**Tip:** Do not delete inactive employees if they are still tied to historical payroll records. Simply leave them in the system.


## Attendance Records

1. Open the **🕒 Attendance** tab.
2. Select the employee, date, check-in time, check-out time, and day type.
3. Review the preview calculation before saving.

For normal weekdays, the default schedule is `08:00 ~ 17:00`, with `12:00 ~ 13:00` excluded as unpaid lunch hour.

Unpaid lunch time is calculated based on exact overlap minutes. For example, a shift from `08:00 ~ 12:02` counts as 4 paid work hours, excluding only the 2 minutes of lunch overlap from `12:00 ~ 12:02`.

## Leave Records

1. Open the **📅 Leave** tab.
2. Select the employee, leave date, leave type, and duration.

Personal leave can be used to cover missed work hours, while any actual hours worked are paid as normal.

Paid bereavement leave can cover a half-day absence without triggering a tardiness or early-leave deduction.

When attendance and leave exist on the same day, the system automatically reconciles them so approved leave covers the matching absence window.

## Payroll Settlement

1. Open the **💵 Payroll** tab.
2. Select the settlement month.
3. Review each employee's payable hours, leave deductions, overtime, insurance deductions, manual adjustments, and net pay.
4. Use the monthly summary totals to verify the all-employee gross total, deduction total, and net payroll total.

## Reports and Export

Use the **📄 Reports** tab to review monthly records, print payslips, and export spreadsheet files when needed.

**⚠️ Warning:** Generated payroll exports may contain personal data. Do not commit exports, backups, or real employee records to Git or public repositories.

## Backup and Restore

Use the **☁ Backup** tab to export a JSON backup of your database.

Recommended backup timing:

- Before a payroll settlement
- Before importing or restoring data
- Before clearing your browser data
- Before testing a new release

## Demo Data

Use **☁ Backup** > **Load Demo Data** to populate the app with a fictional dataset for public demos and local testing. Demo names, notes, attendance, leave, and payroll adjustments are fictional and English-friendly.

**⚠️ Warning:** The demo dataset overwrites your current browser data. Export a backup first if you are working with real records. 

## Developer Checks

Before deploying any custom modifications to the payroll logic, verify your changes by running the regression tests using:

```bash
npm test
```

Run the syntax check:

```bash
npm run check
```

*Note: Any new payroll or leave rule should include a focused regression test.*