---
artifact_type: Project Knowledge Base
artifact_id: KB-BEETLES-001
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Draft
approval: Pending approval with RDR-BEETLES-VUE3-REBUILD-001
---

# Beetles Project Knowledge Base

## Glossary

- **舊版**：`/Users/ian/vs code-worksapce/Poject Report/` 下的 11 頁靜態 HTML／CSS／JavaScript 專案。
- **新版**：`/Users/ian/vs code-worksapce/beetles/` 下的 Vue 3／Vite 專案。
- **Mock data**：僅供前端展示及互動、集中存放於 JavaScript 模組、未連接後端的資料。
- **Mock 會員／訂單**：只在目前瀏覽器有效，不具正式身分或交易效力的前端狀態。
- **液態玻璃**：以透明度、模糊、分層高光與綠色色階構成的現代視覺語言。

## Architecture Map

- `src/main.js`：應用啟動、全域 plugin 與全域樣式入口。
- `src/router/`：hash routes、頁面 metadata 與流程守衛。
- `src/views/`：頁面結構與頁面行為，不內嵌 Mock 資料集合。
- `src/components/`：共用元件；元件樣式與元件同檔管理。
- `src/style/page/`：頁面專用樣式，統一由 `src/style/main.scss` 匯出。
- `src/mocks/`：按領域集中管理雙語 Mock data。
- `src/services/`：頁面可替換的資料來源邊界。
- `src/state/`：會員、購物車、結帳與通知等跨頁狀態。
- `src/locale/`：繁體中文與英文 UI 翻譯及語言初始化／持久化。
- `public/img/` 與 `src/assets/`：靜態內容圖片與需由 bundler 處理的資產。

## Important Decisions

- 完整重建舊版頁面，但不逐像素複製；採綠色液態玻璃風格與一致互動回饋。
- 所有使用者可見內容支援繁中與英文；未知瀏覽器語言回退英文。
- Header 語言選擇保存於 `localStorage`。
- 現有 Vue test data 優先，舊版內容補足缺少領域。
- Mock data 集中於 JavaScript 模組，頁面經由可替換 import 邊界存取。
- Mock 會員與購物車可持久化；結帳及信用卡資料不得持久化。
- 訪客可結帳；登入會員可帶入會員資料。
- Mock 結帳成功後產生訂單編號、清空購物車並進入完成頁。
- 使用 hash routing 支援 GitHub Pages 類靜態部署。
- 本階段採 ESLint、Prettier、手動功能／RWD 驗證與 production build；自動化測試延後。

## External Dependencies

- Vue 3、Vue Router、Vue I18n、Vite、Sass。
- Iconify／Lucide 圖示套件與本機字型資產。
- 瀏覽器 `localStorage` 作為語言、Mock 會員及購物車持久化介面。
- GitHub Pages 或不具 SPA rewrite 的一般靜態主機。
- ESLint、Prettier將在核准後加入開發依賴。

## Unresolved Items

- 詳細資料 schema、狀態 API、元件契約、表單規則與版面 token 由 Specification 定義。
- 真實後端契約、測試框架及 CI 留待後端階段決定。

## Artifact Links

- [Requirement Decision Record](requirements/beetles-vue3-rebuild-requirements.md)
- [Draft Working Notes](drafts/beetles-vue3-rebuild-20260801-working-notes.md)
- Specification：待需求核准後建立。
- Ticket Plan：待 Specification 核准後建立。
