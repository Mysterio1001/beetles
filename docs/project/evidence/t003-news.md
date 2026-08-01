---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T003
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t003--最新消息列表分類輪播與詳情
assumptions:
  - News 詳情依核准規格使用 Dialog，不新增獨立 detail route。
deferred:
  - 後端消息 API。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: T004 Lab and article detail
---

# T003 News Implementation Evidence

## Outcome

- 以既有 Vue `testData.js` 內容為基準，建立九筆穩定 id 消息與三張輪播的集中雙語 Mock data；頁面只透過 `newsService` 取得資料。
- 重建繁中／英文 News Hero、手動與自動輪播、全部／公告／活動／飼育情報分類、消息卡片、空狀態及完整消息 Dialog。
- Dialog 使用共用 `BeDialog`，具備背景鎖定、焦點循環、Escape／背景關閉與焦點返回。
- 輪播操作會重設自動播放計時；`prefers-reduced-motion` 或不足兩張時不啟動自動播放。
- 頁面視覺與 responsive 規則集中於 `src/style/page/_news.scss`，元件樣式仍由共用元件自身管理。

## Red and green evidence

首次行為 Red：

```text
node --test tests/news/newsService.test.js
exit 1
SyntaxError: The requested module '../../src/services/newsService.js' does not provide an export named 'filterNewsItems'
```

補強 reduced-motion 契約時再次先觀察 Red：

```text
node --test tests/news/newsService.test.js
exit 1
SyntaxError: The requested module '../../src/services/newsService.js' does not provide an export named 'canAutoplayNewsCarousel'
tests 1, pass 0, fail 1
```

Focused Green：

```text
node --test tests/news/newsService.test.js
exit 0
tests 5, pass 5, fail 0
```

測試涵蓋九筆消息、三張輪播、穩定 id、正式 `/img/...` 路徑、完整英文、未知語言英文 fallback、四種分類、空結果、詳情查找，以及 reduced-motion 自動播放契約。

## Browser verification

- 直接重新載入 `#/news`：文件標題為「最新消息｜甲蟲羽錄」，顯示 9 張卡片與 3 張輪播控制，沒有新增 console error。
- 分類逐一操作結果：全部 9、公告 3、活動 3、飼育情報 3；每次只有一個 `aria-pressed=true`。
- 手動點選指定輪播及下一張控制均更新 active slide；等待 5.5 秒後自動輪播前進，證實使用者操作會建立新的完整播放週期。
- 消息卡片為可聚焦原生 `button`；Dialog 開啟後焦點移到關閉按鈕，Tab 維持在 Dialog，Escape 與背景點擊均能關閉、清除 `body` 捲動鎖並把焦點返回原卡片。
- Dialog 開啟時將 locale 從英文切回繁中，頁面、Dialog 標題、分類與日期立即同步更新，沒有重新載入。
- News 畫面 10 張當前 DOM 圖片全部 `complete=true` 且 `naturalWidth>0`。
- 375／768／1024／1440 實測均無水平溢位；grid 欄數依序為 1／2／2／3，並完成桌面與手機 screenshot 目視檢查。
- 最後恢復繁中與預設 viewport；最終重新載入為 `lang=zh-TW`、9 張卡片、3 張輪播、0 張失敗圖片、0 筆新 console error。

## Broader verification

```text
node --test tests/foundation/*.test.js tests/home/*.test.js tests/news/*.test.js
exit 0
tests 19, pass 19, fail 0

npm run lint
exit 0

npm run format:check
exit 0

npm run build
exit 0
vite v6.4.3
1701 modules transformed
```

## Test-first exception

依核准決策，本階段未加入 Vue component 或 Playwright E2E framework。分類與 reduced-motion 決策以 Node tests 驗證；Vue reactive 語言更新、Dialog lifecycle、焦點、圖片、輪播與 responsive layout 使用 in-app browser 實際量測及 screenshot 驗證，未宣稱 Vitest／Vue Test Utils／Playwright E2E coverage。

## User content protection

`src/views/beetleLab/child/` 仍為未追蹤使用者內容，本票未讀寫、未 stage。
