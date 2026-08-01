---
artifact_type: Draft Working Notes
artifact_id: DWN-BEETLES-VUE3-REBUILD-001
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Draft
inputs:
  - /Users/ian/vs code-worksapce/Poject Report/
  - /Users/ian/vs code-worksapce/beetles/
assumptions: []
deferred:
  - 真實會員、付款與訂單 API 整合不在本次前端重建範圍。
  - Vitest、Vue Test Utils 與 Playwright E2E 延後至後端開發階段導入。
handoff: ask-with-docs
approval: Pending Requirement Decision Record and Knowledge Base approval
---

# Beetles Vue 3 全站重建－Draft Working Notes

## Confirmed

- `confirmed`：以現有 `beetles` Vue 3 專案作為重建基礎。
- `confirmed`：重建舊版 11 個頁面及其前端互動流程。
- `confirmed`：建立新分支 `codex_dev`；依 workflow 門檻，在需求、規格與 ticket plan 核准後才建立。
- `confirmed`：Mock data 集中管理，不分散在頁面元件中。
- `confirmed`：建立 i18n 架構。
- `confirmed`：共用元件樣式放在元件內的 `<style>`；頁面樣式放在 `src/style/page/`，並由 `src/style/main.scss` 匯出。
- `confirmed`：可使用現有 `beetles` 圖片或舊版資料夾圖片。
- `confirmed`：會員、購物車、運費、結帳與訂單完成採完整前端 Mock 流程，不串接真實會員、付款或訂單 API。
- `confirmed`：不逐像素複製舊版 CSS；保留舊版品牌、內容與核心動效，同時重新設計版面、RWD、互動與無障礙體驗。
- `confirmed`：新視覺採現代液態玻璃風格，以深淺綠色為主題色系。
- `confirmed`：所有可互動元素需提供清楚且一致的 hover／按壓回饋動畫，並兼顧鍵盤 focus 與 reduced-motion 使用者。
- `confirmed`：i18n 初始語言依使用者瀏覽器預設語言決定，並在 Header 提供手動語言切換入口。
- `confirmed`：正式支援繁體中文與英文兩種語系；其他瀏覽器語言回退英文。
- `confirmed`：使用者在 Header 手動選擇的語言保存於 `localStorage`，後續造訪優先於瀏覽器語言，直到再次切換或清除瀏覽器資料。
- `confirmed`：購物車與 Mock 登入狀態保存於 `localStorage`，以維持重新整理與跨頁操作的連續性。
- `confirmed`：結帳表單資料只保留於當次操作；信用卡欄位不得寫入任何持久化儲存。
- `confirmed`：Mock 訂單完成後清空購物車。
- `confirmed`：現有 Vue `src/api/testData.js` 的資料為正式 Mock 內容主要來源；舊版 `Poject Report` 只補足現有資料未涵蓋的頁面與領域資料。
- `confirmed`：所有測試資料與 Mock data 必須集中於獨立 JavaScript 模組，頁面元件不得直接宣告資料陣列或資料物件。
- `confirmed`：頁面透過明確且可替換的 import 邊界取得 Mock data，使未來可移除或替換資料來源 import，而不需重寫頁面呈現邏輯。
- `confirmed`：i18n 涵蓋所有使用者可見內容；商品、消息、文章、商品說明、按鈕、標題與表單文字都必須提供繁體中文與英文內容。
- `confirmed`：Mock 會員提供至少一組集中管理的預設測試帳號。
- `confirmed`：使用者可在前端註冊新帳號；註冊資料保存在目前瀏覽器，登入只接受預設帳號或已註冊帳號的正確憑證。
- `confirmed`：登入後 Header 顯示會員狀態並提供登出。
- `confirmed`：忘記密碼只顯示模擬通知，不寄送真實郵件。
- `confirmed`：Mock 結帳保留銀行轉帳與信用卡兩種付款方式，並依選擇執行條件式表單驗證。
- `confirmed`：付款驗證成功後產生 Mock 訂單編號、清空購物車，導向訂單完成頁並倒數返回首頁。
- `confirmed`：付款結果固定為模擬成功，不串接或模擬真實金流失敗回應。
- `confirmed`：配送方式包含 7-ELEVEN 超商取貨 70 元、全家超商取貨 70 元、黑貓宅急便 150 元及自行取貨 0 元。
- `confirmed`：購物車與結帳摘要依配送方式即時計算商品小計、運費與總額。
- `confirmed`：黑貓宅配必填收件地址；超商取貨必選站內 Mock 門市；自行取貨不要求地址或門市。
- `confirmed`：未登入使用者可加入購物車，並以訪客身分完成結帳。
- `confirmed`：登入會員可選擇「同會員資料」，將本機會員資料帶入收件欄位。
- `confirmed`：空購物車進入結帳頁時重新導向購物車並顯示提示。
- `confirmed`：沒有剛完成的有效 Mock 訂單而直接進入訂單完成頁時重新導向首頁。
- `confirmed`：正式支援最新版 Chrome、Safari、Firefox 與 Edge，不支援 Internet Explorer。
- `confirmed`：RWD 至少在 375px、768px、1024px 與 1440px 四種視窗寬度完成驗收。
- `confirmed`：本次前端重建導入 ESLint 與 Prettier，並要求 lint 與 production build 通過。
- `confirmed`：本次以前端逐頁功能檢查及 375px、768px、1024px、1440px 視覺檢查作為主要驗證證據。
- `confirmed`：Vitest、Vue Test Utils 與 Playwright E2E 不在本次前端重建範圍，延後至後端開發階段實作。
- `confirmed`：專案以 GitHub Pages／無 SPA rewrite 的一般靜態主機為部署目標，使用 hash routing 避免重新整理子頁時發生 404。

## Proposed


## Unresolved

- 無待確認的高影響需求決策；實作細節交由 Specification 階段定義。

## Evidence

- 舊版共有 11 個 HTML 頁面，會員、購物車及結帳為靜態頁面，沒有後端 API 呼叫。
- 現有 Vue 專案已具備 Vite、Vue Router、Vue I18n、Sass 與部分共用元件，但主要頁面尚未完整移植。
- 現有 repository 沒有正式需求、規格、ticket plan、測試或 CI 文件。
