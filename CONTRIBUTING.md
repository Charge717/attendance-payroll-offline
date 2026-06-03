# Contributing

Thanks for helping improve Attendance Payroll Offline.

## Development Setup

No build step is required for the app. Open:

```text
src/index.html
```

Run tests with:

```bash
node --test tests/payroll-calculation.test.js
```

## Pull Request Rules

- Calculation changes must include regression tests.
- Leave, attendance, overtime, and payroll rule changes must update documentation.
- Do not include real employee or payroll data.
- Keep Taiwan payroll/legal presets clearly labeled.
- For UI translation changes, update `docs/i18n.md` when needed.

## Commit Style

Use clear commit messages:

```text
feat: add English locale toggle
fix: correct lunch overlap calculation
test: cover half-day bereavement leave
docs: add English project overview
ci: run payroll tests on pull requests
```
