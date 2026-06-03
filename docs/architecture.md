# Architecture Notes

## Why the App Is a Single HTML File

The core application is intentionally packaged as `src/index.html`.

This is unusual for many modern web repositories, but it matches the product goal:

- Users can open the app directly in a browser.
- No backend server is required.
- No database setup is required.
- No build step is required for ordinary use.
- Backups can be exported and restored as JSON.
- The app remains easy to share with non-technical users.

中文說明：

主程式刻意維持在 `src/index.html`，不是因為專案沒有結構，而是因為這套工具的使用情境偏向「離線、可攜、直接打開就能用」。對小型團隊來說，不需要安裝伺服器、不需要設定資料庫、不需要 build step，是重要優點。

## Repository Structure

```text
src/index.html                      Main offline browser app
tests/payroll-calculation.test.js   Regression tests for payroll and leave calculations
docs/                               User manuals, specs, i18n notes, publishing guide
.github/                            GitHub Actions, issue templates, PR template
package.json                        Test commands and project metadata
README.md                           Public project overview
```

## Tradeoffs

Advantages:

- Very easy to run and distribute.
- Good fit for local-first payroll data.
- Less infrastructure for small organizations.
- Fewer deployment steps for non-technical users.

Costs:

- `src/index.html` is large.
- UI, style, and logic are not yet split into smaller modules.
- Code review can be harder than a modular frontend project.
- Future multi-language and multi-jurisdiction work will be easier after extracting dictionaries and calculation modules.

## Future Refactor Roadmap

Recommended future steps:

1. Extract payroll calculation logic into `src/payroll/`.
2. Extract locale dictionaries into `src/locales/`.
3. Extract CSS into `src/styles/`.
4. Keep a generated or packaged single-file HTML release for offline users.
5. Add sample data using fictional employees only.
6. Add screenshots or a GitHub Pages demo with fake data.

## Current Public Message

The best way to describe the project is:

```text
Portable single-file app for users, structured open-source repository for contributors.
```

中文：

```text
對使用者是可攜式單檔工具；對貢獻者則是有文件、測試與流程的開源專案。
```
