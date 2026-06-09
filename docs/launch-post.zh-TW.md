# 中文發布文案

## 一句話版本

我整理並開源了一個離線優先的出勤薪資工具：單一 HTML 就能使用，內建台灣薪資規則預設，資料預設保存在自己的瀏覽器。

## 短版

我把 Attendance Payroll Offline 開源了：

https://github.com/Charge717/attendance-payroll-offline

這是一個給小型團隊使用的出勤薪資工具。它不需要伺服器、不需要帳號，也不需要資料庫；下載 `src/index.html` 後，用瀏覽器開啟就能使用。

目前內建的薪資規則預設以台灣情境為主，包含員工資料、出勤、假勤、薪資結算、薪資單列印、Excel 匯出、JSON 備份/還原，以及安全展示用的 fictional demo data。

專案也補上了薪資計算回歸測試、隱私掃描、GitHub Actions、英文文件與多語化邊界說明。介面和文件可以多語化，但薪資規則不會因為翻譯就自動適用其他國家或地區。

Demo:

https://charge717.github.io/attendance-payroll-offline/

## 長版

很多小型公司或工作室不一定需要完整的雲端 HR 系統。他們需要的是一個透明、可備份、可離線使用的工具：能記錄出勤、管理假勤、做每月薪資結算、列印薪資單，並且讓資料留在自己手上。

Attendance Payroll Offline 是我對這個需求的整理。

它的特點：

- MIT 授權，可自由使用與修改。
- 單一 HTML 檔即可執行。
- 不需要伺服器、帳號或資料庫。
- 資料預設保存在瀏覽器本機。
- 支援 JSON 備份與還原。
- 支援員工、出勤、假勤、薪資結算、薪資單與 Excel 匯出。
- 內建 fictional demo data，方便公開展示或測試。
- 對開發者提供薪資計算測試、隱私掃描、i18n audit 與 GitHub Actions。

目前維護中的薪資規則預設以台灣為主。這點我刻意寫清楚：英文文件和多語介面是為了讓更多人看懂、協助維護和貢獻；但薪資法規不能只靠翻譯就套用到其他地區。

如果未來要支援其他國家或地區，會以獨立 rule preset 的方式處理，並要求文件、來源與測試。

GitHub:

https://github.com/Charge717/attendance-payroll-offline

Demo:

https://charge717.github.io/attendance-payroll-offline/
