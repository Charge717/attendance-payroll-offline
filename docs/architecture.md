# Architecture Notes

## Product Shape

The application is intentionally distributed as `src/index.html`.

This shape is unusual for many modern frontend projects, but it matches the product goal:

- Users can open the app directly in a browser.
- No backend server is required.
- No database setup is required.
- No build step is required for ordinary use.
- Backups can be exported and restored as JSON.
- The app remains easy to share with non-technical users.

Traditional Chinese summary:

```text
對使用者來說，這是一個可以直接開啟的單一 HTML 工具。對貢獻者來說，這是一個有測試、文件、隱私掃描與未來模組化方向的開源專案。
```

## Current Repository Structure

```text
src/index.html                      Main offline browser app
tests/payroll-calculation.test.js   Regression tests for payroll and leave calculations
scripts/privacy-audit.js            Scan for accidental private payroll/export files
scripts/i18n-audit.js               Translation compatibility audit
docs/                               User manuals, specs, i18n notes, rule policy
.github/                            GitHub Actions, issue templates, PR template
package.json                        Test commands and project metadata
README.md                           Public project overview
```

## Rule and Language Boundary

The current implementation still keeps UI, storage, and payroll logic inside the single HTML file.

The public positioning should therefore stay honest:

- The interface and documentation can be multilingual.
- The maintained payroll preset is Taiwan-focused.
- Future jurisdiction support should be implemented as named rule presets.
- Translation must not silently change calculation behavior.

## Tradeoffs

Advantages:

- Easy to run and distribute.
- Good fit for local-first payroll data.
- Less infrastructure for small organizations.
- Fewer deployment steps for non-technical users.

Costs:

- `src/index.html` is large.
- UI, style, locale text, storage, and calculation logic are not yet split into modules.
- Code review is harder than a modular frontend project.
- Multi-jurisdiction support should wait until rule presets are separated from UI text.

## Future Refactor Roadmap

Recommended order:

1. Extract payroll calculation helpers into `src/payroll/`.
2. Extract locale dictionaries into `src/locales/`.
3. Extract rule presets into `src/presets/`.
4. Add a `custom` preset for user-configurable schedules, leave types, overtime rates, and deductions.
5. Keep a generated or packaged single-file HTML release for offline users.
6. Keep all tests using fictional data only.

## Current Public Message

```text
Portable single-file app for users, structured open-source repository for contributors.
```

Traditional Chinese:

```text
給使用者的是可攜式單一 HTML 工具；給貢獻者的是有測試、文件和清楚規則邊界的開源專案。
```
