---
artifact_type: Review Report
artifact_id: REVIEW-BEETLES-VUE3-REBUILD-T009
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Pass
inputs:
  - docs/specs/beetles-vue3-rebuild.md#13-購物車
  - docs/plans/beetles-vue3-rebuild.md#t009--購物車頁與配送計算
  - T009 final diff and untracked new files
  - tests/cart/*.test.js
  - raw Node, ESLint, Prettier, Vite and Browser verification results
assumptions:
  - Review 範圍只包含 T009；正式 Checkout 收件、付款與訂單建立屬 T010。
deferred:
  - Safari、Firefox、Edge 引擎驗證由 T011 release QA 統一執行。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策延後。
handoff: precise staging, commit T009, then proceed to T010
---

# T009 Cart and Delivery Review Report

Review label：`non-independent`。

兩個未參與實作的隔離 reviewer context 均在長時間 active 後沒有回傳 checkpoint、finding 或 review artifact；因此本報告依規範降級，不宣稱 independent。審查重新從核准 specification、T009 ticket、raw diff、新檔、tests、surrounding Cart／router／storage code 與原始驗證結果建立。

## Findings

### 1. P3 — 隱藏配送 radio 沒有清楚的可見鍵盤焦點 — closed

Trigger：鍵盤使用者 Tab 到四個配送 radio。`src/style/page/_cart.scss` 將真正取得焦點的 input 壓成 1×1px 並設為透明，但沒有把 `:focus-visible` 投影到外層 label、icon 或自繪 check。Impact：使用者仍能切換 radio，卻無法清楚辨識目前鍵盤焦點，未完整符合 AC14 的 focus-visible 契約。修正方向：在 label 內 input `:focus-visible` 時，對可見 icon 或整個 label 顯示高對比 outline；加入可執行 UI style contract。位置：`src/style/page/_cart.scss:513`。

### 2. P3 — 同商品不同規格的數量與移除控制具有重複 accessible name — closed

Trigger：Cart 同時有 105 mm++ 與 101 mm++ 兩列相同商品。Browser DOM 實際將兩列暴露為完全相同的 `Decrease quantity for Giraffe...`、`Quantity for Giraffe...`、`Increase...`、`Remove...`；aria-label 只插入 `row.name`，未插入 `row.variantLabel`。Impact：螢幕閱讀器與語音控制使用者無法只靠控制名稱辨識要操作哪個規格。修正方向：每列建立包含商品及規格的 label 參數，並讓 article 以穩定 heading／`aria-labelledby` 命名。位置：`src/views/cart/CartView.vue:110`、`:120`、`:124`、`:139`。

### 3. P3 — 英文單一件數顯示 `1 items` — closed

Trigger：英文 Cart 只有一件商品。`cart.itemCount` 固定為 `{count} items`，template 對所有數量使用同一字串。Impact：使用者會看到文法錯誤的主要 Cart 狀態，降低雙語完成度。修正方向：使用 Vue I18n plural form 或單複數 key，並加入 count=1 與 count>1 的 focused service／UI contract。位置：`src/locale/i18n/en/cart.json:14`、`src/views/cart/CartView.vue:61`。

### 4. P3 — update／remove／clear 成功後重新建立 store 的持久化行為缺少 focused test — closed

Trigger：未來重構 `commitItems()` 或個別 action 時，只要記憶體仍更新，現有 failure rollback tests 與 Browser 當下 DOM 都能通過；目前只有 add 與 shipping 重新建立 store 的 assertions。Impact：T009 明列的「修改數量、移除、最後一項移除、重新整理持久化」可能在回歸時失去自動偵測。修正方向：用同一 memory storage 依序 update、remove、clear，分別重新建立 store 並驗證 items／itemCount／totals。位置：`tests/cart/cartState.test.js:55`、`:128`、`:165`。

## Finding closure

- Finding 1：新增 `.cart-shipping > label:has(> input:focus-visible)`，對整個可見 label 顯示 3px 高對比 outline 並抑制透明 1px input 自身 outline。Browser 實際 focus 7-ELEVEN radio 後，active value 為 `seven-eleven`，label computed outline 為 `3px solid rgb(173, 255, 200)`、offset `3px`。
- Finding 2：每列加入穩定 `aria-labelledby` 與 h3；四個數量／移除 control label 同時包含 product name 與 variant。Browser DOM 實際輸出 `Quantity for Giraffe... 105 mm++` 等唯一名稱。
- Finding 3：英文 message 改為 Vue I18n plural form `{count} item | {count} items`，template 傳入 plural choice；Browser 一件商品實際顯示 `1 item`。
- Finding 4：新增同一 memory storage 上 update、remove、clear 後逐次重建 store 的 test，驗證 items、itemCount、totals 與空 Cart fee。測試第一次即通過，確認 production persistence 原本正確且 coverage 現已補足。

Review finding Red／Green：

```text
node --test tests/cart/cartUiContract.test.js
Red: exit 1, tests 7, pass 4, fail 3

node --test tests/cart/cartState.test.js
Coverage addition: exit 0, tests 8, pass 8, fail 0

node --test tests/cart/*.test.js
Green: exit 0, tests 23, pass 23, fail 0
```

## Requirements and correctness assessment

- 商品／規格、單價、數量、小計、移除、空狀態、四種配送及整數總額均由集中資料與同一 Cart state 驅動，符合 T009 主行為。
- Cart payload 保持 version 1 並對舊 payload 缺少 `shippingMethodId` 做安全正規化；未知商品／規格與損壞 schema 路徑具 focused tests。
- 所有 mutation 在 storage 成功後才更新 reactive state；setItem failure 對 add／update／remove／clear／shipping 都回滾，沒有假成功。
- `/checkout` guard 對非空 Cart 回傳 true，空 Cart 返回具一次性 notice code 的 `/cart`；Browser 已驗證中英通知及 reload 不重播。
- 頁面沒有直接保存 storage 或寫死商品／運費金額；配送 Mock、Cart service、state、view、locale 與 page style 邊界符合核准維護規則。
- 除上述四個 P3 外，沒有 P0、P1 或 P2 correctness finding。

## Twelve architecture and refactoring lenses

| # | Lens | Outcome | Evidence |
| --- | --- | --- | --- |
| 1 | Duplicated Code or Policy | no-finding | 配送費與履約類型只在 `shipping.js`；Cart 計算只在 `cartService.js`；state 與 view 未複製費率。 |
| 2 | Long Function | no-finding | state actions、service 投影與 view handlers 都保持短小；`createCartStore` 雖組合初始化與 actions，但圍繞單一 Cart invariant。 |
| 3 | Large Module or Class | no-finding | `_cart.scss` 體積大但只擁有單一頁面視覺；Cart view 沒有吸收 Mock、storage 或 router policy。 |
| 4 | Long Parameter List | no-finding | 公開 service／state methods 使用最小 locale、items、product／variant／quantity 契約，沒有協調型長參數。 |
| 5 | Data Clumps | no-finding | productId／variantId／quantity 已形成最小 Cart item schema；配送 method record 是後續 Checkout 可重用的明確概念。 |
| 6 | Primitive Obsession | no-finding | shipping id 經集中 records 與 `isShippingMethodId` 約束；guard notice 有集中常數，不是散落 magic string。 |
| 7 | Feature Envy | no-finding | service 負責投影／計算、state 負責交易／reactivity、view 負責呈現與 DOM 回饋，沒有跨層搬運內部責任。 |
| 8 | Divergent Change | no-finding | 每個新檔分別對應配送資料、Cart domain、navigation、locale 或 page presentation 的單一變更理由。 |
| 9 | Shotgun Surgery | no-finding | 加配送方式只需集中 record；locale export 與 page style export 是既定 bootstrap seam，不屬散落政策。 |
| 10 | Message Chains | no-finding | view 只消費 store refs/actions 與 service DTO；沒有穿透 products 或 storage 內部鏈。 |
| 11 | Leaky Abstraction | no-finding | state 隱藏 payload、rollback 與 schema；view 在 radio failure 後還原原生 checked 是 UI reconciliation，不要求理解 storage 格式。 |
| 12 | Shallow Module | no-finding | Cart service 隱藏 localization、invalid row cleanup、四種 fee 與總額；Cart state 隱藏 migration、validation、transaction 與 reactivity，介面複雜度合理。 |

## Verification and evidence unavailable

已提供且通過的 final raw verification：Cart tests 23/23、完整 Node tests 79/79、ESLint、Prettier、Vite build 1723 modules、`git diff --check`、四配送／數量／移除／reload／guard／雙語／四寬度 Browser 流程、review accessibility fixes 與 console warn/error 空陣列。

Evidence unavailable：隔離 reviewer 未產生任何可引用結果；Safari、Firefox、Edge 尚未在 T009 單票執行；本階段依核准決策沒有 Vue component test runner 或正式 E2E suite。

## Residual risks and completion assessment

- 四個局部 P3 均已以 focused Red-Green 關閉，不需要 architecture diagnosis。
- Checkout 正式內容仍是 placeholder，符合 T009 out-of-scope 並由 T010 接續。
- `src/views/beetleLab/child/` 是唯一非 T009 使用者內容，審查未修改。

Completion assessment：**Pass。** T009 核心 correctness、交易行為、雙語、responsive layout 與四個 review finding 均完成；沒有未關閉的 actionable finding，可精確 staging／commit 並進入 T010。
