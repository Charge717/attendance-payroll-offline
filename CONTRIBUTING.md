# Contributing

Thanks for helping improve Attendance Payroll Offline.

This project welcomes international contributors, but it has an important boundary: UI and documentation can be multilingual, while payroll rules must stay jurisdiction-aware.

## Development Setup

No build step is required for the app. Open:

```text
src/index.html
```

Run checks with:

```bash
npm run check
npm run privacy:audit
npm run i18n:audit
npm test
```

## Contribution Areas

### Good First Contributions

- Documentation improvements
- English copy editing
- Traditional Chinese copy editing
- UI translation that does not change calculation behavior
- Accessibility improvements
- Screenshots using fictional demo data
- Tests for existing payroll behavior

### Payroll Rule Contributions

Payroll, leave, overtime, insurance, pension, deduction, and payslip changes require extra care.

Any payroll-rule PR must include:

- The jurisdiction affected.
- A short explanation of the rule.
- Regression tests with fictional data.
- Documentation updates.
- A statement that no real employee or payroll data is included.

### New Jurisdiction Presets

Do not change the Taiwan preset to fit another country or region.

Propose new jurisdiction behavior as a separate rule preset. See [docs/rule-presets.md](docs/rule-presets.md).

## Pull Request Rules

- Calculation changes must include regression tests.
- Leave, attendance, overtime, and payroll rule changes must update documentation.
- Do not include real employee, payroll, attendance, backup, export, or database data.
- Keep Taiwan payroll/legal presets clearly labeled.
- For UI translation changes, update [docs/i18n.md](docs/i18n.md) when needed.
- For terminology changes, update [docs/glossary.zh-TW-en.md](docs/glossary.zh-TW-en.md) when needed.

## Privacy Rules

Never commit:

- Real employee names
- Real salaries
- Real attendance records
- Payroll exports
- Browser backups
- `.xlsx`, `.csv`, `.zip`, `.db`, `.sqlite`, or similar generated data files

Use fictional demo data for screenshots, tests, and examples.

## Commit Style

Use clear commit messages:

```text
feat: add custom leave label setting
fix: correct lunch overlap calculation
test: cover half-day bereavement leave
docs: add English project overview
ci: run payroll tests on pull requests
```
