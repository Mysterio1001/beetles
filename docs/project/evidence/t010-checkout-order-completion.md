---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T010
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md#14-結帳
  - docs/specs/beetles-vue3-rebuild.md#15-訂單完成
  - docs/plans/beetles-vue3-rebuild.md#t010--訪客會員結帳與訂單完成
assumptions:
  - Checkout 採用購物車已保存的配送方式；如需變更，返回購物車操作。
  - 完成狀態只保留訂單編號、項目、配送／付款 id 與整數金額，不保留收件表單或信用卡欄位。
deferred:
  - 真實付款、物流、持久化歷史訂單與後端 API。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
  - Safari、Firefox 與 Edge 實機引擎驗收由 T011 執行。
handoff: precise staging and commit T010, then proceed to T011
---

# T010 Checkout and Order Completion Implementation Evidence

## Outcome

- 新增集中 Checkout Mock data，提供 7-ELEVEN／全家各兩個穩定門市與銀行轉帳／信用卡兩種雙語付款方式；未知語言回退英文。
- 新增 Checkout service，負責空白表單、會員姓名／電話／地址複本、門市／付款 localize、四種配送條件、信用卡格式與到期驗證、唯一 Mock 訂單編號，以及不含收件或卡片欄位的 order snapshot。
- 新增純記憶體 Order state；驗證失敗、空 Cart、重複送出與 Cart clear 持久化失敗都不建立完成狀態。成功時先確認 Cart clear，再只提交一筆 current order。
- `/checkout` 改用正式雙語 view，支援訪客與會員可選擇帶入後修改、黑貓完整地址、超商對應 Mock 門市、自取免地址／門市、銀行／信用卡條件欄位及與 Cart 完全一致的摘要。
- `/order-complete` 改用正式雙語 view；有效狀態顯示唯一訂單編號、總額、集中社群入口與五秒倒數，手動／自動離開都停止 timer 並清除 current order。direct 或 reload 無有效狀態時返回首頁。
- 收件表單、卡號、期限、安全碼及 current order 未使用 `localStorage` 或 `sessionStorage`；卡號、期限與安全碼在付款方式離開信用卡、成功送出或 view unmount 時清除。
- Checkout 與完成頁樣式分別位於 `src/style/page/_checkout.scss`、`_orderComplete.scss`，由 `main.scss` 匯出；提供綠色液態玻璃、hover、visible focus、reduced-motion 相容及四個驗收寬度版面。
- Browser runtime 找到 `BeInput.maxlength` 字串 prop warning；改成三個數字 binding 後，自修正時間點起的 warning／error 為空。
- Independent review 的兩個 P2 與 integration review 的格式缺陷已依 TDD 關閉：fallback order id 在無 UUID 且同毫秒時仍唯一、卡片期限依使用者本地曆月判斷，電話與卡片欄位不會藉由刪除英文字母後誤判有效。月份邊界 test clock 亦改為不依賴 host timezone，正常與 `TZ=UTC` 都通過。
- Final independent closure re-review 為 `Pass`，沒有 P0–P3 actionable finding；四項 correctness／test portability finding 全部 closed。

## Files changed

- `src/mocks/checkout.js`
- `src/mocks/index.js`
- `src/services/checkoutService.js`
- `src/state/orderState.js`
- `src/router/orderNavigation.js`
- `src/router/index.js`
- `src/views/checkout/CheckoutView.vue`
- `src/views/order/OrderCompleteView.vue`
- `src/locale/i18n/zh_tw/checkout.json`
- `src/locale/i18n/en/checkout.json`
- `src/locale/zh_tw.js`
- `src/locale/en.js`
- `src/style/page/_checkout.scss`
- `src/style/page/_orderComplete.scss`
- `src/style/main.scss`
- `tests/checkout/checkoutService.test.js`
- `tests/checkout/orderState.test.js`
- `tests/checkout/orderNavigation.test.js`
- `tests/checkout/checkoutUiContract.test.js`
- `docs/project/evidence/t010-checkout-order-completion.md`

## Red and green evidence

Initial Red：

```text
node --test tests/checkout/*.test.js
exit 1
tests 4, pass 0, fail 4
- ERR_MODULE_NOT_FOUND: src/mocks/checkout.js
- ERR_MODULE_NOT_FOUND: src/services/checkoutService.js
- ERR_MODULE_NOT_FOUND: src/router/orderNavigation.js
- ENOENT: src/views/checkout/CheckoutView.vue
```

加入集中 Mock、service、Order state 與 navigation 後的領域層 Green：

```text
node --test tests/checkout/checkoutService.test.js tests/checkout/orderState.test.js tests/checkout/orderNavigation.test.js
exit 0
tests 13, pass 13, fail 0
```

完成 views、locales、routes 與 page styles 後的 Focused Green：

```text
node --test tests/checkout/*.test.js
exit 0
tests 18, pass 18, fail 0
```

Independent review regressions Red：

```text
node --test tests/checkout/checkoutService.test.js
exit 1
tests 10, pass 6, fail 4
- 含英文字母的 10 位電話被刪除字母後誤判有效
- 含英文字母的卡號／期限／安全碼被刪除字母後誤判有效
- 臺北新月份開始時，上個月期限因 UTC 月份而誤判未過期
- 無 crypto.randomUUID 且固定同毫秒時，100 次 order id 只有 1 個 unique value
```

Independent re-review portability Red：

```text
TZ=UTC node --test tests/checkout/checkoutService.test.js
exit 1
tests 10, pass 9, fail 1
- 月份邊界測試用帶 +08:00 的 absolute instant，在 UTC host 取得 8 月 local month 而假紅
```

將 clock 改為明確區分 local September／UTC August 的 timezone-independent date-like object 後：

```text
node --test tests/checkout/checkoutService.test.js
exit 0
tests 10, pass 10, fail 0

TZ=UTC node --test tests/checkout/checkoutService.test.js
exit 0
tests 10, pass 10, fail 0
```

關閉 review findings 後 Final Focused Green：

```text
node --test tests/checkout/*.test.js
exit 0
tests 21, pass 21, fail 0
```

Focused tests 涵蓋集中門市／付款、英文 fallback、immutable 會員 DTO 複製、四種配送條件、兩種付款條件、10 位純數字電話、16 位卡號、3 位安全碼、非數字字元拒絕、本地曆月期限、無 UUID fallback 同毫秒唯一性、非敏感 order snapshot、驗證失敗、Cart clear rollback、空 Cart、防重複訂單、current order clear、完成頁 route guard、storage 禁止邊界、雙語與 page style boundary。

## Browser verification

- 以既有黑貓配送與 1 件 `105 mm++` 商品進入正式 Checkout；摘要顯示商品小計 2,999、運費 150、總額 3,149，Header badge 為 1。
- 空白送出顯示姓名、10 位電話與黑貓完整地址五個欄位錯誤，焦點移到第一個 invalid control；非敏感資料留在表單。
- 登入預設 Mock 會員後勾選帶入，姓名 `甲蟲羽錄 Demo`、電話 `0912345678`、臺北市／大安區／測試路 1 號全部帶入；姓名可改為 `已修改收件人`，不會回寫 member DTO。
- 信用卡切換顯示持卡人、卡號、月份、年份與安全碼。使用 16 位格式正確卡號、3 位安全碼及 `07/2026` 時顯示已過期；改成 `12/2030` 後成功，只建立一筆 `BT-20260802-*` 訂單並將 badge 清為 0。
- 7-ELEVEN 只顯示兩個 7-ELEVEN Mock 門市，可選大安門市並顯示對應地址；全家只顯示兩個全家 Mock 門市，可選永業門市並顯示對應地址。兩者摘要運費 70、總額 3,069。
- 自行取貨不顯示地址或門市欄位，銀行轉帳不顯示信用卡欄位；英文完成訂單總額 2,999。
- Header 由繁中切換英文後，Checkout 標題、欄位、配送、付款、商品、單數 `1 item`、摘要與 document title 即時切換；英文完成頁也完整顯示。
- 完成頁顯示訂單編號、總額與 Facebook／LINE／Instagram 安全外連；五秒倒數自動回首頁。完成頁 direct entry 與有效狀態期間 reload 都返回首頁。
- 付款 radio 的鍵盤焦點會投影為外層 `3px solid` 可見 outline；所有表單保有原生 label、radio／checkbox、autocomplete 與 invalid focus contract。
- Checkout：375px 為 355px 單欄、768px 為約 714px 單欄、1024px 為約 952px 單欄、1440px 為約 `921px + 387px` 雙欄且 summary sticky。
- Order Complete：375px 為 355px 單欄、768px 為約 714px 單欄、1024px 為約 `518px + 432px` 雙欄、1440px 為約 `730px + 608px` 雙欄。
- 兩頁在 375／768／1024／1440 的 `documentElement.scrollWidth` 都等於 viewport，無文件水平 overflow；手機與桌面液態玻璃版面 screenshot 目視正常。
- 修正 `maxlength` prop 後，以時間戳篩選的新 console warning／error 為空；Browser viewport 已 reset。

## Broader verification

```text
node --test tests/**/*.test.js
exit 0
tests 100, pass 100, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1734 modules transformed

git diff --check
exit 0
```

## Test-first exception

依核准決策，本階段未加入 Vitest、Vue Test Utils 或 Playwright E2E framework。Checkout domain validation、Order state 原子性、guard 與 persistence boundary 由 Node tests 驗證；Vue reactivity、會員帶入、四種配送、信用卡錯誤、成功訂單、倒數、reload／direct guard、雙語、鍵盤焦點、RWD、視覺及 console 使用 in-app Browser 實際操作、量測與 screenshot 驗證。

## Residual risk and user content protection

- Safari、Firefox、Edge 的實機引擎差異、整站跨頁回歸與 production 靜態產物 smoke test 由 T011 release QA 統一執行。
- 純前端 Mock 刻意不提供付款失敗、物流 API 或歷史訂單，符合 T010 out-of-scope。
- `src/views/beetleLab/child/` 保持未追蹤且未修改，不得納入 T010 stage。
