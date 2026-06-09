# Jurisdiction and Rule Preset Policy

## Current Preset

The maintained built-in payroll preset is:

```text
tw-2026
```

It represents the app's current Taiwan-oriented attendance and payroll behavior. The preset includes tested logic for attendance, leave, overtime, partial-month salary, meal allowance, insurance-related fields, payroll settlement, payslip output, and spreadsheet export.

## Policy

The interface may be translated, but payroll rules must remain jurisdiction-aware.

For now:

- `tw-2026` is the only maintained jurisdiction preset.
- The app may expose custom manual fields and future custom settings.
- Users outside Taiwan must review and configure rules before relying on payroll output.
- The project does not provide legal, tax, HR, or payroll compliance advice.

## Future Preset Shape

Future presets should be defined as structured rule data rather than scattered UI text. A preset should eventually include:

- `id`, `label`, and `jurisdiction`
- Currency and locale defaults
- Standard workday and workweek settings
- Lunch/rest break rules
- Overtime categories and multipliers
- Leave types and paid/unpaid behavior
- Insurance, pension, tax, or deduction tables
- Rounding rules
- Payslip and export labels
- Regression test cases

See [rule-preset-schema.md](rule-preset-schema.md) for the current schema draft.

## Proposed Presets

| Preset | Status | Description |
|---|---|---|
| `tw-2026` | Maintained | Current Taiwan payroll preset. |
| `custom` | Planned | User-configurable rules for teams that must adapt behavior locally. |
| Other country/region presets | Proposal only | Must include sources, tests, and documentation. |

## Contribution Requirements for New Presets

A new jurisdiction preset proposal must include:

- Jurisdiction name and effective date.
- Source links or citations for payroll assumptions.
- A clear statement of what the preset does not cover.
- Regression tests using fictional employee data.
- Documentation explaining all rule choices.
- No real employee, payroll, attendance, or export data.

## What Not to Do

- Do not rename Taiwan-specific rules into generic global rules.
- Do not change `tw-2026` to satisfy another jurisdiction.
- Do not imply that translations make the payroll logic legally valid elsewhere.
- Do not add legal claims without tests and documentation.
