---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T006
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t006--商店搜尋分類排序與分頁
assumptions:
  - 現有 Vue test data 沒有商品集合，因此依核准規則使用舊版八筆商品補足該領域，並讓首頁既有四個穩定商品 id 對應相同品項。
  - 舊版兩個 `top-item` 同時歸類為新品與成蟲，其餘六筆歸類為成蟲；缺少舊版品項的幼蟲、耗材、標本、飼育用品與教學課程保留為可操作空分類。
  - 舊版只有長頸鹿鋸齒鍬形蟲未顯示售完遮罩，因此集中資料只將該品項標示為 available。
deferred:
  - 商品詳情、規格、加入購物車與真實庫存由 T007 處理。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: T007 Product detail and cart core
---

# T006 Shop Catalog Implementation Evidence

## Outcome

- 將舊版八筆商品與八個分類集中至 `src/mocks/products.js`；每筆商品具穩定 id、雙語名稱／關鍵字、學名、分類、整數價格、日期、可用狀態及正式圖片路徑。
- `catalogService` 提供繁中／英文與英文 fallback、名稱／學名／關鍵字搜尋、分類、五種 deterministic 排序、安全分頁及穩定商品詳情 URL。
- 建立正式 `beetleShop` view 並取代 placeholder route，提供雙語 Hero、搜尋、排序、結果數、分類、商品卡、可用狀態、圖片 fallback、空狀態及分頁。
- 375px／768px 使用同一份分類內容的滑入面板；支援開啟後鎖定背景、焦點移至關閉鍵、Escape／背景關閉及焦點還原。1024px／1440px 使用 sticky 桌面分類導覽。
- 商店頁樣式集中於 `src/style/page/_beetleShop.scss`，包含綠色液態玻璃、hover／active／focus-visible、圖片 fallback 與 reduced-motion 規則。

## Files changed

- `src/mocks/products.js`
- `src/mocks/index.js`
- `src/services/catalogService.js`
- `src/locale/i18n/zh_tw/shop.json`
- `src/locale/i18n/en/shop.json`
- `src/locale/zh_tw.js`
- `src/locale/en.js`
- `src/views/beetleShop/index.vue`
- `src/style/page/_beetleShop.scss`
- `src/router/index.js`
- `tests/shop/catalogService.test.js`
- `docs/project/evidence/t006-shop-catalog.md`

## Red and green evidence

第一個執行結果直接證明目前沒有商品目錄 service 邊界：

```text
node --test tests/shop/catalogService.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'src/services/catalogService.js'
tests 1, pass 0, fail 1
```

Focused Green：

```text
node --test tests/shop/catalogService.test.js
exit 0
tests 6, pass 6, fail 0
```

測試涵蓋八筆集中商品、完整分類、穩定 id／URL、正式圖片路徑、雙語與英文 fallback、名稱／學名／關鍵字搜尋、新品／成蟲／空分類、五種排序、搜尋＋分類＋排序組合，以及結果縮減後的安全頁碼。

## Browser verification

- 繁中初始目錄顯示八筆結果、第一頁六張卡片、兩頁控制及正確可用／售完狀態；第二頁顯示剩餘兩張卡片，八張商品圖片跨兩頁均載入成功。
- 搜尋「喀麥隆」只顯示 `cameroon-crab-stag`，結果數為 1 且不顯示不必要的分頁；清除後恢復八筆。
- 選擇新品分類得到兩筆；搭配價格低到高後順序為 `babai-golden-stag`、`hercules-kono-line`。
- 選擇幼蟲得到雙語空狀態；「重設全部條件」恢復全部商品、預設排序及第一頁。
- 在第二頁搜尋 `Goliathus` 後只顯示對應商品並安全回到有效頁碼。
- Header 切換英文後，Hero、搜尋／排序標籤、八個分類、結果數、商品名稱、可用狀態及空狀態不重新載入即同步更新；英文搜尋保留並繼續依學名正確比對。
- 375px 關閉的行動分類面板具有 `inert` 與 `aria-hidden="true"`，不會讓鍵盤進入畫面外控制。開啟後實際為 `role="dialog"`、`aria-modal="true"`，焦點位於關閉鍵，Body 鎖定且背景存在；正向／反向 Tab 均在面板內循環，Escape 與可見背景區均能關閉並還原焦點。
- 視覺驗收曾發現面板 Sass `z()` function 未載入而使 computed z-index 為 `auto`；補上頁面 Sass token import 後，面板／背景／Header 層級為 2000／1999／1900，截圖確認標題、關閉鍵與分類不再被 Header 遮擋。
- 桌面與手機 viewport screenshot 目視通過；商品卡、控制列、側欄及行動面板沒有內容重疊。
- 瀏覽器 CSSOM 確認商店 reduced-motion 規則將 transition 縮至 1ms 並停用 hover 位移／圖片縮放。

| 寬度 | 商品欄 | 控制欄 | Workspace 欄 | 分類模式 | 水平溢位 |
| ---: | ---: | ---: | ---: | --- | --- |
| 375px | 1 | 1 | 1 | 滑入面板 | 無 |
| 768px | 2 | 2 | 1 | 滑入面板 | 無 |
| 1024px | 2 | 2 | 2 | Sticky 側欄 | 無 |
| 1440px | 3 | 2 | 2 | Sticky 側欄 | 無 |

最後重載驗收於 `2026-08-02 09:47:01`（Asia/Taipei）開始：頁面位於 `#/beetle-shop` 頁首、語言為 `zh-TW`、預設 viewport 寬度為 1280px，分類為全部商品、排序為預設、第一頁顯示六張卡片且結果數為八；圖片無失敗、Body 未鎖定、無水平溢位，且該時間點後新增 console error 為 0。

## Broader verification

```text
node --test tests/foundation/*.test.js tests/home/*.test.js tests/news/*.test.js tests/lab/*.test.js tests/bulletin/*.test.js tests/shop/*.test.js
exit 0
tests 34, pass 34, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1705 modules transformed
```

## Test-first exception

依核准決策，本階段未加入 Vue component 或 Playwright E2E framework。資料、搜尋、分類、排序與分頁由 Node tests 驗證；Vue reactive 語言切換、行動面板 lifecycle、DOM、圖片、reduced-motion CSSOM 與 responsive layout 使用 in-app browser 實際操作、量測及 screenshot 驗證，未宣稱 Vitest／Vue Test Utils／Playwright E2E coverage。

## Residual risk and user content protection

- 四大瀏覽器引擎的最終相容性仍需在發布前由 T011 全站驗收統一確認；目前瀏覽器驗收未發現阻擋問題。
- 既有未追蹤 `src/views/beetleLab/child/index.vue` 保持原內容且不納入本票 stage。
