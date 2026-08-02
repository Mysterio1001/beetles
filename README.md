# Beetles Vue 3

以 Vue 3 重建的甲蟲品牌靜態網站。專案提供綠色液態玻璃視覺、繁體中文／英文、響應式版面，以及可完整操作的純前端 Mock 會員、購物車、結帳與訂單完成流程。

本專案沒有後端、真實身分驗證、金流或物流 API。請勿輸入真實密碼、信用卡或個人資料。

## 環境需求

- Node.js 20 以上
- npm 10 以上

## 安裝與開發

```bash
npm install
npm run dev
```

Vite 會顯示本機開發網址。所有正式路由都使用 Hash Router，因此子頁網址位於 `/#/...`。

## 品質命令

```bash
npm test
npm run lint
npm run format:check
npm run build
npm run preview
```

- `npm test`：執行目前所有 Node domain／contract tests。
- `npm run lint`：檢查 `src/`、`tests/` 與 Vite／ESLint 設定。
- `npm run format:check`：以 Prettier 檢查 JS、Vue、SCSS、JSON 與根目錄設定檔。
- `npm run build`：建立 production 產物至 `dist/`。
- `npm run preview`：在本機預覽最新 `dist/`。

Vitest、Vue Test Utils 與 Playwright E2E 依目前專案決策延後至後端開發階段；現階段以 Node tests 與實際瀏覽器驗收互補。

## Mock 測試帳號

- 帳號：`beetles_demo`
- 電子信箱：`demo@beetles.test`
- 密碼：`Beetle2026`

註冊會員、登入狀態與購物車會保存在目前瀏覽器。Checkout 收件表單、信用卡欄位與訂單完成狀態只存在記憶體，不會持久化。

## 專案結構與維護邊界

```text
src/
├── components/       共用 Vue 元件；元件樣式寫在元件內的 scoped style
├── locale/i18n/      zh_tw 與 en 翻譯 namespace
├── mocks/            集中內容與 Mock data
├── router/           Hash Router、route guards 與 navigation policy
├── services/         Mock data 的查詢、投影與 domain validation
├── state/            會員、購物車與當次訂單狀態
├── style/page/       正式頁面 SCSS
├── style/main.scss   唯一頁面樣式匯出入口
└── views/            正式 route views
```

維護規則：

- 消息、文章、商品、配送、門市、付款方式及預設會員維護於 `src/mocks/`，不要直接寫入頁面。
- 頁面透過 `src/services/` 消費集中資料；未來接後端時可替換 service／Mock import boundary。
- 翻譯維護於 `src/locale/i18n/zh_tw/` 與 `src/locale/i18n/en/`；英文是缺少翻譯及不支援瀏覽器語言的 fallback。
- 元件樣式保留在元件 `.vue` 的 `<style scoped lang="scss">`。
- 主畫面樣式放在 `src/style/page/`，並由 `src/style/main.scss` 匯出。
- 靜態圖片放在 `public/img/`；集中 Mock data 以 base-relative `img/...` 參照，不寫 `/public/...`。

## 語言行為

第一次造訪時，中文瀏覽器語言使用繁體中文、英文使用英文，其他語言回退英文。Header 可即時切換語言，手動選擇會保存在瀏覽器並優先於瀏覽器預設語言。

## 靜態部署

1. 執行 `npm run build`。
2. 將 `dist/` 內容部署到 GitHub Pages 或其他靜態主機。
3. 專案使用 Hash Router，不需要 server rewrite；可直接重新整理 `/#/beetle-shop` 等子頁。
4. 若部署在非根路徑，透過 Vite `base` 設定提供對應 base path，再重新 build。

部署前至少執行 `npm test`、`npm run lint`、`npm run format:check` 與 `npm run build`，並確認 `dist/` 沒有 `/public` 資產 URL。
