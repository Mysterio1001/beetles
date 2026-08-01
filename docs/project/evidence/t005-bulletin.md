---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T005
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t005--羽錄情報品牌與聯絡體驗
assumptions:
  - 品牌聯絡電話沿用舊版可見內容 0922-180-199，撥號 URL 正規化為 tel:0922180199。
  - 桌面主視覺沿用既有分層資產，1080px 以下切換既有單一手機主圖。
deferred:
  - 聯絡表單、真實訊息與社群 API。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: T006 Shop catalog
---

# T005 Bulletin Implementation Evidence

## Outcome

- 將品牌介紹、四項服務、聯絡電話、三個社群入口與八張圖片資產集中至 `src/mocks/bulletin.js`，由 `bulletinService` 提供繁中、英文及英文 fallback 的頁面資料。
- 重建羽錄情報 Hero、服務範圍與聯絡區塊；頁面只消費 service 回傳資料，不直接宣告 Mock 集合。
- 兩個電話入口均使用 `tel:0922180199`；Facebook、LINE、Instagram 皆以 `_blank` 及 `rel="noopener noreferrer"` 安全開啟。
- 桌面採分層主視覺與進場／甲蟲／閃光動畫，1080px 以下切換單一手機主圖，主要文案與操作不被視覺遮擋。
- 頁面樣式集中於 `src/style/page/_beetleBulletin.scss`，包含綠色液態玻璃、hover／active／focus-visible 與 reduced-motion 規則。

## Files changed

- `src/mocks/bulletin.js`
- `src/mocks/index.js`
- `src/services/bulletinService.js`
- `src/locale/i18n/zh_tw/bulletin.json`
- `src/locale/i18n/en/bulletin.json`
- `src/views/beetleBulletin/index.vue`
- `src/style/page/_beetleBulletin.scss`
- `tests/bulletin/bulletinService.test.js`
- `docs/project/evidence/t005-bulletin.md`

## Red and green evidence

最初執行先遇到 Node ESM 不解析 Vite alias 的 setup failure：

```text
node --test tests/bulletin/bulletinService.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@/mocks' imported from src/services/bulletinService.js
```

將 import 邊界修正為 Node 與 Vite 均可解析的相對 `.js` 路徑後，觀察到真正的行為 Red：

```text
node --test tests/bulletin/bulletinService.test.js
exit 1
SyntaxError: The requested module '../../src/services/bulletinService.js' does not provide an export named 'getBulletinPageData'
tests 1, pass 0, fail 1
```

Focused Green：

```text
node --test tests/bulletin/bulletinService.test.js
exit 0
tests 4, pass 4, fail 0
```

測試涵蓋完整繁中／英文、未知語言英文 fallback、電話顯示與撥號 URL、三個社群的順序與安全屬性，以及桌面／手機正式資產路徑。

## Browser verification

- 繁中頁面顯示品牌 Hero、介紹、四項服務、聯絡標題、兩個電話入口及三個社群入口。
- Header 切換英文後，Hero、品牌介紹、四項服務、聯絡標題、電話及社群 aria-label 不重新載入即同步更新；最後恢復繁中。
- 兩個電話 href 均為 `tel:0922180199`；Facebook、LINE、Instagram 的 href、`target="_blank"` 與 `rel="noopener noreferrer"` 均正確。
- 主內容八張圖片全部載入成功。
- 桌面實際動畫名稱為 `bulletin-stage-in`、`bulletin-beetle-left`、`bulletin-beetle-right` 與 `bulletin-flash`。
- `@media (prefers-reduced-motion: reduce)` 的原始 SCSS 明確設定四個桌面動畫元素為 `animation: none`；瀏覽器 CSSOM 同時確認 `animation-name: none`、閃光隱藏、hover 位移停用及 transition 縮至 1ms。
- 桌面與手機 screenshot 目視通過，文案及主視覺 bounding boxes 無重疊。

| 寬度 | Hero 欄 | 服務欄 | Contact 欄 | 主視覺 | 水平溢位 |
| ---: | ---: | ---: | ---: | --- | --- |
| 375px | 1 | 1 | 1 | 手機圖 | 無 |
| 768px | 1 | 2 | 1 | 手機圖 | 無 |
| 1024px | 1 | 2 | 1 | 手機圖 | 無 |
| 1440px | 2 | 4 | 2 | 桌面分層動畫 | 無 |

最後重載驗收於 `2026-08-02 02:51:59`（Asia/Taipei）開始：頁面位於 `#/beetle-bulletin` 頁首、語言為 `zh-TW`、預設 viewport 寬度為 1280px，顯示四項服務及三個社群入口，八張圖片無失敗、無水平溢位，且該時間點後新增 console error 為 0。

## Broader verification

```text
node --test tests/foundation/*.test.js tests/home/*.test.js tests/news/*.test.js tests/lab/*.test.js tests/bulletin/*.test.js
exit 0
tests 28, pass 28, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1700 modules transformed
```

## Test-first exception

依核准決策，本階段未加入 Vue component 或 Playwright E2E framework。資料及外部連結契約由 Node tests 驗證；Vue reactive 語言切換、DOM、媒體載入、動畫、reduced-motion CSSOM 與 responsive layout 使用 in-app browser 實際操作、量測及 screenshot 驗證，未宣稱 Vitest／Vue Test Utils／Playwright E2E coverage。

## Residual risk and user content protection

- 四大瀏覽器引擎的最終相容性仍需在發布前由 T011 全站驗收統一確認；目前瀏覽器驗收未發現阻擋問題。
- 既有未追蹤 `src/views/beetleLab/child/index.vue` 保持原內容且不納入本票 stage。
