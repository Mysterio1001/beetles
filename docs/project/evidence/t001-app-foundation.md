---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T001
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t001--可部署-app-foundation-與全站-shell
assumptions:
  - Vitest、Vue Test Utils 與 Playwright framework 仍依核准決策延後。
deferred:
  - T002–T010 的正式頁面內容與領域行為。
  - T011 的全站整合與 release QA。
handoff: T002 Home
---

# T001 App Foundation Implementation Evidence

## Outcome

- Vue Router 改為 hash history，建立全部正式路由、雙語 route metadata、文件標題、捲動復原、Breadcrumb 與 Not Found。
- 語言初始值依有效的持久化偏好、瀏覽器語言及英文 fallback 決定；Header 可即時切換並跨重新整理保存。
- 建立安全 JSON storage、集中 `mocks`、可替換 `services`、共用 `state` 邊界，既有 news/article test data 保留為主要內容並改為正式 `/img/...` URL。
- 建立現代綠色液態玻璃 App shell、行動選單、互動回饋、focus-visible、reduced-motion 及響應式 `border-box` 基礎。
- 整理 Button、Input、Select、Dialog、Card、Pagination、Tags 等共用元件的鍵盤與 ARIA 契約。
- 導入 ESLint 9、Prettier 3 與對應 scripts；Vite 更新至安全的 6.4.3，`npm audit` 為 0。
- 移除未使用的全量字型入口；production CSS 由約 409 kB 降至 32.56 kB，建置不再輸出數百個字型分片。

## Files changed

- App／routing：`src/App.vue`、`src/main.js`、`src/router/index.js`、`src/views/system/`。
- Shell／base components：`src/components/`、`src/components/layout/`。
- Locale／storage：`src/locale/`、`src/utils/safeStorage.js`。
- Data boundaries：`src/mocks/`、`src/services/`、`src/state/`、`src/api/testData.js` compatibility bridge。
- Styles：`src/style/base/_base.scss`、`src/style/page/_system.scss`、`src/style/main.scss`。
- Quality：`eslint.config.js`、`.prettierrc.json`、`.prettierignore`、`package.json`、`package-lock.json`、`tests/foundation/`、`vite.config.js`。

`src/views/beetleLab/child/` 是既有未追蹤使用者內容；未修改、未 stage、未納入本票。

## Red evidence

Command:

```text
node --test tests/foundation/*.test.js
```

Raw result:

```text
exit 1
ERR_MODULE_NOT_FOUND: src/locale/localePreference.js
ERR_MODULE_NOT_FOUND: src/utils/safeStorage.js
tests 2, pass 0, fail 2
```

失敗原因正是尚未實作的 locale resolution 與 safe storage 公開邊界。

## Focused green evidence

Command:

```text
npm run test:foundation
```

Raw final result:

```text
exit 0
tests 9, pass 9, fail 0
```

涵蓋有效保存語言優先、中文瀏覽器、英文瀏覽器、未知語言英文 fallback、無效保存值、有效 JSON round-trip、損壞 JSON、schema-invalid JSON 及 clear。

## Refactor and broader verification

Commands and raw final results:

```text
npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1705 modules transformed
index CSS 32.56 kB (gzip 7.38 kB)
main JS 181.76 kB (gzip 68.67 kB)

npm audit fix
exit 0
found 0 vulnerabilities

git diff --check
exit 0
```

## Browser verification

- 修正瀏覽器首次揭露的 `App.vue` i18n mount error，修正後 Vue 正常掛載且沒有新增 console error。
- 英文切換後：`html[lang] = en`、文件標題與導覽為英文；重新整理仍為英文。
- 最後切回繁中並重新整理：`html[lang] = zh-TW`、選項為 `zh-TW`、標題為「翅鞘商店｜甲蟲羽錄」。
- `#/beetle-shop` 顯示正式雙語 placeholder；未知 hash 顯示 404，重新整理仍維持 Not Found。
- 375、768、1024、1440 實測 `body.scrollWidth === viewport width`，全部無水平溢位。
- 行動選單開啟後 `aria-expanded=true`、nav 顯示、body 鎖定；Escape 後恢復 `aria-expanded=false`、nav 隱藏及 body 解鎖。
- 1440 顯示完整桌面導覽，1024 以下切換為行動選單。

## Test-first exceptions

本票的玻璃視覺、RWD、focus、Hash 導覽與行動選單沒有在本階段加入已延後的 component/E2E framework。替代驗證為 ESLint、production build、in-app browser DOM 量測、鍵盤互動及 375／768／1024／1440 screenshot 目視檢查。未宣稱 Vitest、Vue Test Utils 或 Playwright E2E coverage。

## Residual risks

- 正式首頁、消息、Lab、Bulletin、商店、會員、購物車與結帳內容仍由後續核准票券完成；目前正式未完成路由使用雙語 placeholder。
- `src/api/testData.js` 只保留無資料內容的 compatibility re-export，待 T004 安全整合既有未追蹤文章詳情後移除。
