---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T002
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t002--首頁品牌與內容入口
assumptions:
  - 商品與文章詳情頁由 T004、T007 完成；本票只交付穩定入口。
deferred:
  - 商品與文章詳情的正式內容與不存在狀態。
handoff: T003 News
---

# T002 Home Implementation Evidence

## Outcome

- 以舊版首頁品牌素材重建雙語 Hero、品牌介紹、近期到貨與最新飼育紀錄。
- 全部首頁內容集中於 `src/mocks/home.js`，由 `src/services/homeService.js` 依語言提供並以英文回退。
- 四個商品與三篇文章使用穩定 id；Vue Router 實際輸出 `#/beetle-shop/:id` 與 `#/beetle-lab/:id`。
- 頁面樣式完整位於 `src/style/page/_home.scss`；包含玻璃分層、hover／active、responsive grid 及 reduced-motion 全域契約。

## Red and green evidence

```text
node --test tests/home/homeService.test.js
exit 1
ERR_MODULE_NOT_FOUND: src/services/homeService.js

node --test tests/home/homeService.test.js
exit 0
tests 5, pass 5, fail 0
```

測試涵蓋繁中／英文完整資料、四個穩定商品入口、三個穩定文章入口、正式 `/img/...` 路徑及未知語言英文 fallback。

## Browser verification

- 首頁 title、Hero、品牌、產品與文章在繁中與英文切換後同步更新。
- 實際 anchor href：四筆 `#/beetle-shop/:id`、三筆 `#/beetle-lab/:id`。
- 九張首頁圖片經完整頁面 render 後全部 `complete=true` 且 `naturalWidth>0`。
- 375px 使用 mobile hero image、1 欄商品與 1 欄文章；768／1024 為 2 欄商品；1440 為 4 欄商品與 3 欄文章。
- 初次量測發現裝飾 orbit 造成水平溢位，加入 scoped `overflow: clip` 後重測 375／768／1024／1440，四者皆 `body.scrollWidth === viewport width`。
- 最後恢復繁中：`lang=zh-TW`、文件標題「首頁｜甲蟲羽錄」。

## Broader verification

```text
npm run test:foundation && node --test tests/home/homeService.test.js
exit 0

npm run lint
exit 0

npm run format:check
exit 0

npm run build
exit 0
vite v6.4.3
```

## Test-first exception

依核准決策未加入 Vue component/E2E framework。頁面視覺、語言 DOM 更新、Hash href、圖片載入與 responsive grid 使用 in-app browser 實際量測及 screenshot 驗證；未宣稱 Vitest／Vue Test Utils／Playwright E2E coverage。

## User content protection

`src/views/beetleLab/child/` 仍為未追蹤使用者內容，本票未讀寫、未 stage。
