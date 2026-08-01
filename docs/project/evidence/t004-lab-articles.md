---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T004
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t004--研究所搜尋分頁與文章詳情
assumptions:
  - 每頁顯示三篇文章，讓現有五筆 Vue 測試資料形成可操作的兩頁結果。
  - 將測試資料中重複七次的產木文章標題正規化為舊版可見標題，穩定 id、日期與完整內容仍以 Vue 資料為主。
deferred:
  - 文章編輯器與後端文章 API。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: T005 Beetle Bulletin
---

# T004 Lab and Article Implementation Evidence

## Outcome

- 將五筆既有 Vue article test data 轉為 `src/mocks/articles.js` 的集中雙語資料，保留穩定 id、圖片、日期與完整中文內容，補齊英文標題、摘要及全文。
- `articleService` 提供繁中／英文與英文 fallback、最新文章、目前語言標題／摘要搜尋、安全分頁及穩定 id 詳情查找。
- 重建甲蟲研究所 Hero、最新文章、搜尋、結果數、文章卡片、分頁與空狀態；資料沒有直接宣告於頁面。
- 新增正式 `beetleLab/detail.vue`，詳情顯示日期、主圖、摘要、完整內容、返回列表及 unknown article recovery。
- 詳情 route 從可變標題參數改為 `/beetle-lab/:articleId`；首頁與列表既有穩定 id 入口均可直接載入。
- 列表與詳情視覺集中於 `src/style/page/_beetleLab.scss`，包含綠色液態玻璃、hover／active／focus 與 reduced-motion 規則。

## Red and green evidence

最初執行先遇到 Node ESM 不解析 Vite alias 的 setup failure：

```text
node --test tests/lab/articleService.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@/mocks' imported from src/services/articleService.js
```

將既有 import 邊界修正為相對 `.js` 後，觀察到真正的行為 Red：

```text
node --test tests/lab/articleService.test.js
exit 1
SyntaxError: The requested module '../../src/services/articleService.js' does not provide an export named 'filterArticles'
tests 1, pass 0, fail 1
```

Focused Green：

```text
node --test tests/lab/articleService.test.js
exit 0
tests 5, pass 5, fail 0
```

測試涵蓋五筆集中資料、三篇最新文章、穩定 id／URL、正式圖片路徑、完整英文、未知語言英文 fallback、中英文部分比對、大小寫忽略、清空搜尋、空結果、頁碼限制、結果縮減後頁碼修正及 unknown id。

## Browser verification

- 直接重新載入 `#/beetle-lab`：文件標題「甲蟲研究所｜甲蟲羽錄」，顯示 3 篇最新文章、第一頁 3 張卡片、共 5 筆與兩頁控制。
- 搜尋「五角」得到唯一 Pentodon 文章；搜尋不存在文字顯示繁中空狀態；清除後恢復五筆並回到第 1 頁。
- 第 2 頁顯示剩餘 2 篇；在第 2 頁輸入只剩一筆的關鍵字後，結果與頁碼安全回到有效範圍。
- 英文搜尋 `HEAD HORN` 能由摘要不分大小寫找到 Harris Longhorn Flower Beetle。
- 最新文章與第一頁卡片的三個實際 href 完全相同：`#/beetle-lab/:stable-id`。
- 從最新文章開啟 Pentodon 詳情：hash、標題、日期、主圖、278 字完整中文內容及返回 href 均正確；切換英文後標題、日期、全文與返回文字同步更新。
- `#/beetle-lab/does-not-exist` 顯示雙語不存在狀態與有效返回連結，應用沒有錯誤；route meta 未在頁面或 service 中突變。
- 列表在 375／768／1024／1440 的 workspace 欄數為 1／1／2／2，文章卡內容欄數為 1／2／2／2；詳情 Hero 與本文欄數為 1／1／2／2。
- 列表與詳情四種寬度全部無水平溢位，當前 render 圖片均載入成功，桌面與手機 screenshot 目視檢查通過。
- 最後恢復繁中、空搜尋與預設 viewport；重新載入後為 3 張第一頁卡片、3 個最新入口、0 張失敗圖片、0 筆新 console error。

## Broader verification

```text
node --test tests/foundation/*.test.js tests/home/*.test.js tests/news/*.test.js tests/lab/*.test.js
exit 0
tests 24, pass 24, fail 0

npm run lint
exit 0

npm run format:check
exit 0

npm run build
exit 0
vite v6.4.3
1703 modules transformed
```

## Test-first exception

依核准決策，本階段未加入 Vue component 或 Playwright E2E framework。資料、搜尋、分頁與詳情查找由 Node tests 驗證；Vue Router、語言 reactive update、DOM 狀態、圖片與 responsive layout 使用 in-app browser 實際操作、量測及 screenshot 驗證，未宣稱 Vitest／Vue Test Utils／Playwright E2E coverage。

## User content protection

既有未追蹤 `src/views/beetleLab/child/index.vue` 保持原內容且未 stage；正式詳情新增於獨立追蹤檔 `src/views/beetleLab/detail.vue`。
