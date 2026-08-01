---
artifact_type: Requirement Decision Record
artifact_id: RDR-BEETLES-VUE3-REBUILD-001
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Draft
inputs:
  - /Users/ian/vs code-worksapce/Poject Report/
  - /Users/ian/vs code-worksapce/beetles/
  - docs/project/drafts/beetles-vue3-rebuild-20260801-working-notes.md
assumptions:
  - 本專案是可獨立展示的純前端作品，所有交易與會員行為均為 Mock。
deferred:
  - 真實會員、付款、物流與訂單 API。
  - Vitest、Vue Test Utils 與 Playwright E2E。
handoff: write-spec after approval
approval: Pending user approval
---

# Beetles Vue 3 全站重建需求決策紀錄

## 問題

舊版 `Poject Report` 是由 11 個 HTML、CSS 與原生 JavaScript／jQuery 組成的靜態網站。現有 `beetles` 已建立 Vue 3 基礎與部分共用元件，但首頁、商店、會員及結帳鏈尚未完成，既有資料、路由、資產路徑、互動與工程品質亦未達可交付狀態。

## 目標成果

以現有 `beetles` 為基礎，完整重建舊版頁面與核心互動，交付可部署至 GitHub Pages 類靜態主機的 Vue 3 前端專案。新版保留甲蟲品牌與內容，採綠色液態玻璃視覺、完整 RWD、雙語、集中 Mock data、可持久化的 Mock 會員／購物車，以及可走完的 Mock 結帳流程。

## 使用者

- 訪客：瀏覽內容、搜尋商品與文章、加入購物車並以訪客結帳。
- Mock 會員：註冊、登入、登出，並可將會員資料帶入結帳欄位。
- 維護者：可集中維護 Mock data 與翻譯，未來可替換資料來源而不重寫頁面。

## 範圍與行為

### 頁面與導覽

- 重建首頁、最新消息、甲蟲研究所、文章詳情、翅鞘商店、商品詳情、羽錄情報、登入、註冊、購物車、結帳與訂單完成頁。
- Header、Footer、麵包屑、語言切換、會員狀態與購物車入口在全站一致。
- 使用 hash routing，並提供未匹配路由的 Not Found 處理。

### 視覺與互動

- 不逐像素複製舊版 CSS；保留品牌、內容與核心動效並重新設計。
- 採現代液態玻璃風格，以深淺綠為主色。
- 所有可互動元素提供 hover、按壓與鍵盤 focus 回饋。
- 支援 reduced-motion，避免強制播放高動態動畫。
- 驗收最新版 Chrome、Safari、Firefox、Edge，以及 375px、768px、1024px、1440px 寬度。

### 資料與 i18n

- 現有 `src/api/testData.js` 是消息與文章等內容的主要來源；舊版只補足缺少的頁面與領域資料。
- 所有測試／Mock data 集中於獨立 JavaScript 模組，頁面不得內嵌資料集合。
- 頁面經由明確、可替換的 import 邊界讀取資料。
- 所有使用者可見內容提供繁體中文與英文。
- 初次進站依瀏覽器語言選擇；不支援的瀏覽器語言回退英文。
- Header 可手動切換語言，選擇保存於 `localStorage` 並優先於瀏覽器語言。

### Mock 會員

- 提供集中管理的預設測試帳號。
- 註冊的新帳號保存在目前瀏覽器；登入只接受預設或已註冊帳號的正確憑證。
- Header 顯示登入狀態並提供登出。
- 忘記密碼只顯示 Mock 通知，不寄送郵件。

### 商品與購物車

- 商店支援搜尋、分類、排序、商品卡片與商品詳情。
- 商品可選規格與數量後加入購物車；購物車支援修改數量、移除項目及即時計算。
- 購物車保存在 `localStorage`；訪客與會員均可使用。

### 配送與結帳

- 7-ELEVEN 與全家取貨運費各 70 元；黑貓宅配 150 元；自行取貨 0 元。
- 商品小計、運費與總額隨選擇即時更新。
- 黑貓宅配必填地址；超商取貨必選站內 Mock 門市；自取不要求地址或門市。
- 登入會員可用「同會員資料」帶入收件資訊；訪客可直接填寫。
- 支援銀行轉帳及信用卡兩種 Mock 付款方式，依選擇執行條件式驗證。
- 結帳表單只存在當次操作，信用卡欄位不得持久化。
- 成功後產生 Mock 訂單編號、清空購物車，進入完成頁並於五秒後返回首頁。

## 邊界與非目標

- 不串接真實會員、付款、物流、郵件或訂單 API。
- 不處理真實款項、庫存鎖定、會員安全或跨裝置同步。
- 不支援 Internet Explorer。
- 不要求逐像素重現舊版。
- 本階段不導入 Vitest、Vue Test Utils 或 Playwright。

## 失敗與復原

- 表單驗證失敗時留在原頁、保留非敏感輸入並顯示欄位錯誤。
- Mock 登入失敗時不得建立登入狀態。
- 空購物車進入結帳時返回購物車並顯示提示。
- 無有效新訂單直接進入完成頁時返回首頁。
- Mock data 無結果時顯示雙語空狀態，不產生執行錯誤。
- `localStorage` 資料無效時使用安全預設值復原，不阻止網站啟動。

## 資料與模組契約

- Mock data、翻譯、頁面、共用元件、狀態與儲存存取必須分層。
- 頁面只消費資料介面與狀態操作，不直接讀寫分散的固定資料。
- 共用元件樣式位於元件 `<style>`；頁面樣式位於 `src/style/page/` 並由 `src/style/main.scss` 匯出。
- 圖片使用現有 `beetles` 或舊版資產，並遵守 Vite public／module asset 路徑規則。

## 限制

- 在核准 ticket plan 後才建立 `codex_dev` 分支及修改產品程式碼。
- 必須保留使用者現有未追蹤檔案，不能覆寫或刪除未知變更。
- 導入 ESLint 與 Prettier；lint、格式檢查及 production build 必須通過。

## 驗收條件

1. 所有範圍內頁面可由 Header、頁內連結或流程正確到達，重新整理 hash 子頁不會 404。
2. 繁中、英文完整切換；未知瀏覽器語言使用英文；手動選擇可跨工作階段保存。
3. Mock data 不直接宣告在頁面元件，且資料來源可經由 import 邊界替換。
4. 商品搜尋、分類、排序、詳情、加入購物車、數量與總額計算可操作。
5. 預設帳號與新註冊帳號可登入／登出；錯誤憑證不建立登入狀態。
6. 訪客與會員均可完成配送及付款條件式驗證，成功後取得訂單編號並清空購物車。
7. 信用卡欄位未寫入 `localStorage` 或其他持久化儲存。
8. 空購物車與無有效訂單的路由守衛符合已確認行為。
9. 液態玻璃綠色主題、hover／focus／按壓回饋與 reduced-motion 在四種驗收寬度正常。
10. 最新版四大瀏覽器無阻擋操作的錯誤；ESLint、Prettier 檢查與 production build 通過。

## 假設

- 使用者輸入的 Mock 帳號與訂單只用於本機展示，不代表安全的正式會員系統。
- 靜態主機可發布 Vite 產物，且不提供 server-side rewrite。

## 延後項目

- 真實後端 API、資料庫、身分驗證、郵件、物流與金流。
- Vitest、Vue Test Utils、Playwright E2E 與 CI 自動化測試。
