# GitHub 發布流程

## 目前狀態

本資料夾 `attendance-payroll-offline` 已經是獨立 Git repository，預設分支為 `main`。

目前已有多筆 commit，可直接推送到 GitHub。

## 推送前檢查

確認不要把真實個資或薪資資料放進 Git：

- 不要提交真實員工名冊
- 不要提交薪資匯出 Excel
- 不要提交備份 JSON
- 不要提交含個資的 bug 回報附件

本專案 `.gitignore` 已預設排除常見薪資、備份與匯出檔案，但推送前仍建議確認一次：

```bash
git status
```

## 建立 GitHub Repository

1. 登入 GitHub。
2. 建立新的 repository，例如 `attendance-payroll-offline`。
3. 建議先建立空 repository，不要勾選自動產生 README、license 或 `.gitignore`，因為本機專案已經有這些檔案。
4. 複製 GitHub 顯示的 HTTPS remote URL。

URL 格式通常像這樣：

```text
https://github.com/<your-account>/attendance-payroll-offline.git
```

## 設定 Remote 並推送

在本機專案資料夾執行：

```bash
git remote add origin https://github.com/<your-account>/attendance-payroll-offline.git
git push -u origin main
```

如果 remote 已存在但網址要更換：

```bash
git remote set-url origin https://github.com/<your-account>/attendance-payroll-offline.git
git push -u origin main
```

## 是否需要提供 GitHub 帳號？

不用提供 GitHub 密碼。

如果要我在這台機器上協助推送，你可以提供其中一種資訊：

- 空的 GitHub repository HTTPS URL
- GitHub username，並且你自己在瀏覽器或終端機完成登入
- 你先執行 `gh auth login` 登入 GitHub CLI，之後我可以用 `gh repo create` 或 `git push`

若要讓 commit 歸屬到你的 GitHub 帳號，建議設定你的 Git 作者資訊：

```bash
git config user.name "<your-github-name>"
git config user.email "<your-github-noreply-email>"
```

GitHub noreply email 可以在 GitHub 的 Email settings 頁面找到。

## 推送後建議

- 在 GitHub repository description 放入一句簡短說明。
- 加上 topics：`attendance`, `payroll`, `offline`, `taiwan`, `hr`, `javascript`。
- 確認 Actions 裡的 Tests workflow 有成功執行。
- 在 README 保留範圍聲明：Core UI supports multiple languages, but payroll/legal calculation presets are Taiwan-focused by default.
