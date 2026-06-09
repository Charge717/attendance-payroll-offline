# GitHub 發布檢查清單

這份文件用來協助維護者在公開發布前確認 repo 狀態。它不是使用手冊，而是發布流程備忘。

## 發布前確認

1. 確認工作樹乾淨。

```bash
git status
```

2. 確認沒有私人資料或匯出檔。

```bash
npm run privacy:audit
```

3. 執行測試。

```bash
npm run check
npm test
```

4. 如有調整文件或 UI 語系，執行 i18n 檢查。

```bash
npm run i18n:audit
```

## 不應提交的資料

請勿提交下列內容：

- 真實員工姓名、身分資料、電話、地址
- 真實薪資、出勤、假勤資料
- JSON 備份檔
- Excel / CSV / zip 匯出檔
- SQLite 或其他資料庫檔
- 含有私人資料的截圖

如需示範，請使用 fictional demo data。

## GitHub Repository 建議設定

Repository name:

```text
attendance-payroll-offline
```

Description:

```text
Offline-first attendance and payroll app with a tested Taiwan payroll preset and configurable rule path.
```

Topics:

```text
attendance
payroll
hr
offline-first
local-first
single-file-app
browser-app
javascript
taiwan
taiwan-payroll
rule-presets
open-source
```

Website:

```text
https://charge717.github.io/attendance-payroll-offline/
```

## 重要定位

公開描述應保持以下邊界：

```text
介面與文件可以多語化，但目前維護中的薪資規則預設以台灣為主。其他地區需自行確認法規並調整規則。
```

避免寫成：

- 全球薪資系統
- 適用所有國家法規
- 自動符合各地勞動法令

## 建立 Release

建議 release notes 至少包含：

- 版本重點
- 主要修正
- 是否影響薪資規則
- 驗證指令
- 法規/地區適用範圍說明

範例：

```bash
gh release create v2.1.0 --target main --title "v2.1.0 - Taiwan preset positioning and payroll fixes" --notes-file release-notes.md
```

## 發布後確認

- GitHub Actions 是否通過。
- README badge 版本是否正確。
- GitHub Pages demo 是否能開啟。
- Release 是否標示為 latest。
- 沒有 private export 或 backup 出現在 repo。
