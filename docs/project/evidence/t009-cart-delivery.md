---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T009
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md#13-購物車
  - docs/plans/beetles-vue3-rebuild.md#t009--購物車頁與配送計算
assumptions:
  - Cart version 1 payload 以向後相容的可選欄位加入 shipping method id；既有只含 items 的 payload 會自動正規化。
  - 配送方式預設沿用舊版已勾選的 7-ELEVEN，空購物車不收取運費。
deferred:
  - 收件人、地址、Mock 門市、付款、訂單建立與正式 Checkout view 由 T010 交付。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: precise staging, commit T009, then proceed to T010
---

# T009 Cart and Delivery Implementation Evidence

## Outcome

- 建立集中配送 Mock data，提供 7-ELEVEN／全家 70 元、黑貓 150 元、自行取貨 0 元的穩定 id、雙語名稱、履約類型及後續 Checkout 可消費的 provider contract。
- 建立 Cart service，以集中商品與配送資料投影目前語言的商品／規格列、單價、數量、列小計，以及純整數商品小計、運費與總額；未知語言回退英文。
- 擴充 Cart state，保存配送選擇並公開 reactive subtotal／shipping fee／total；add／update／remove／clear／shipping actions 全部採先持久化、再提交記憶體的交易順序，storage 寫入失敗不會假成功或污染 UI state。
- 完成正式雙語 Cart view，包含商品圖片 fallback、規格、單價、數量直接輸入與加減控制、列小計、逐列移除、四種配送、即時總額、空狀態及返回商店操作。
- `/checkout` 在非空 Cart 對訪客及會員開放；空 Cart 會返回 `/cart`，顯示可跟隨目前語言的一次性提示，URL 立即清除提示 query，重新整理不重播舊通知。
- Cart 頁面樣式集中於 `src/style/page/_cart.scss` 並由 `main.scss` 匯出，具綠色液態玻璃、hover／active／focus-visible、桌面 sticky summary、單欄行動版及 reduced-motion 全域契約。
- Browser 實測發現直接數字輸入使用 `change` 時不會在輸入當下重算；先新增 failing UI contract，再改為 `input` 事件，現在輸入、列小計、Header badge 與總額同步更新。
- Review 的四個 P3 已關閉：配送 radio 提供 3px 可見鍵盤焦點、相同商品不同規格的 article 與控制名稱可唯一辨識、英文單數顯示 `1 item`，並新增 update／remove／clear 成功後重新建立 store 的持久化 coverage。兩次隔離 reviewer 沒有產生 artifact，Review label 依規範降級為 `non-independent`。

## Files changed

- `src/mocks/shipping.js`
- `src/services/cartService.js`
- `src/state/cartState.js`
- `src/router/cartNavigation.js`
- `src/router/index.js`
- `src/views/cart/CartView.vue`
- `src/locale/i18n/zh_tw/cart.json`
- `src/locale/i18n/en/cart.json`
- `src/locale/zh_tw.js`
- `src/locale/en.js`
- `src/style/page/_cart.scss`
- `src/style/main.scss`
- `tests/cart/cartService.test.js`
- `tests/cart/cartState.test.js`
- `tests/cart/cartNavigation.test.js`
- `tests/cart/cartUiContract.test.js`
- `docs/project/evidence/t009-cart-delivery.md`

## Red and green evidence

集中配送與 Cart service Red：

```text
node --test tests/cart/cartService.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'src/mocks/shipping.js'
tests 1, pass 0, fail 1
```

加入集中配送資料及 Cart service 後 Green：

```text
node --test tests/cart/cartService.test.js
exit 0
tests 5, pass 5, fail 0
```

Cart state 交易與金額 Red：

```text
node --test tests/cart/cartState.test.js
exit 1
tests 7, pass 3, fail 4
- payload 缺少 shippingMethodId
- state 未公開 shippingMethodId／subtotal／shippingFee／total
- storage setItem 失敗後 addItem 仍回傳 true
```

將 actions 改為先持久化、再提交 reactive state 後 Green：

```text
node --test tests/cart/cartState.test.js tests/cart/cartService.test.js
exit 0
tests 12, pass 12, fail 0
```

Checkout navigation Red：

```text
node --test tests/cart/cartNavigation.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'src/router/cartNavigation.js'
tests 1, pass 0, fail 1
```

加入可獨立測試的空 Cart guard contract 後 Green：

```text
node --test tests/cart/cartNavigation.test.js
exit 0
tests 3, pass 3, fail 0
```

正式 Cart UI Red：

```text
node --test tests/cart/cartUiContract.test.js
exit 1
ENOENT: no such file or directory, open 'src/views/cart/CartView.vue'
tests 1, pass 0, fail 1
```

完成 view、locale、route 與 page style 後 Initial Focused Green：

```text
node --test tests/cart/*.test.js
exit 0
tests 19, pass 19, fail 0
```

Browser finding Red：

```text
node --test tests/cart/cartUiContract.test.js
exit 1
tests 4, pass 3, fail 1
- quantity field 使用 @change，未符合輸入當下更新的契約
```

改為 `@input` 後 Final Focused Green：

```text
node --test tests/cart/*.test.js
exit 0
tests 19, pass 19, fail 0
```

Review findings Red：

```text
node --test tests/cart/cartUiContract.test.js
exit 1
tests 7, pass 4, fail 3
- 配送 radio 未將 focus-visible 投影到可見外層
- 相同商品不同規格沒有唯一 article／control name
- 英文 itemCount 未使用單複數格式

node --test tests/cart/cartState.test.js
exit 0
tests 8, pass 8, fail 0
- 新增的 update／remove／clear 重建 store coverage 立即通過，確認這是測試缺口而非既有 production defect
```

Review findings Final Focused Green：

```text
node --test tests/cart/*.test.js
exit 0
tests 23, pass 23, fail 0
```

Focused tests 涵蓋四種集中配送與英文 fallback、localized cart rows、所有配送金額、空 Cart 金額、正整數數量、相同項目合併、舊 payload 正規化、損壞／未知項目清理、配送持久化、storage rollback、checkout access、一次性提示代碼及 UI data／style boundary。

## Browser verification

- 初始 T007 localStorage 有兩個規格、共 6 件；正式 Cart 顯示兩列，Header badge、列數量、列小計、商品小計 17,994、7-ELEVEN 運費 70、總額 18,064 完全一致。
- 四種配送逐一操作：7-ELEVEN 與全家總額 18,064、黑貓 18,144、自取 17,994；checked radio、運費及總額同步切換。
- 105 mm++ 從 5 直接輸入 3 後，列小計立即成為 8,997、Header 與 Cart item count 成為 5、商品小計 14,995；reload 後數量 3 與黑貓配送仍保留，總額 15,145。
- 逐列移除後，第一列移除會保留 101 mm++、badge 2 及總額 6,148；移除最後一列後 badge 0、配送摘要消失，顯示英文空狀態與商店入口。
- 非空 Cart 可直接進入 `#/checkout`；空 Cart 進入時返回 `#/cart`，英文提示為 `Your cart is empty...`、繁中提示為「購物車目前是空的...」，reload 後提示不會重播。
- Header 語言切換不 reload 即同步更新 Cart 標題、商品名稱、四種配送、Document title 及空狀態；英文 `lang=en`，繁中 `lang=zh-TW`。
- 1440px：Cart layout 為約 `937px + 356px` 雙欄、summary sticky；1024px／768px：單欄 layout、summary static、配送兩欄；375px：頁面落在 `10–350px`、配送單欄、數量與移除控制各 266px、checkout 298px。
- 375px、768px、1024px、1440px 的 `documentElement.scrollWidth` 均不超過 viewport，375px 全 DOM overflow audit 為 0 個 offenders；液態玻璃層、hover controls、手機商品列與配送總額目視正常。
- 最終 `tab.dev.logs({ levels: ["warn", "error"] })` 回傳空陣列；Browser viewport 已 reset。最後狀態為繁中、Cart 內 1 件 105 mm++，配送保留黑貓，方便 T010 接續驗證。
- Review 修正後 Browser DOM 將 Cart row 暴露為具名稱的 article，數量與移除名稱包含 `105 mm++`；英文單數實際顯示 `1 item`。鍵盤 focus 到 7-ELEVEN radio 時 active value 為 `seven-eleven`，外層 label computed outline 為 `3px solid rgb(173, 255, 200)`、offset `3px`；最終 console warning/error 仍為空陣列並恢復繁中。

## Broader verification

```text
node --test tests/**/*.test.js
exit 0
tests 79, pass 79, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1723 modules transformed

git diff --check
exit 0
```

## Test-first exception

依核准決策，本階段未加入 Vue Test Utils 或 Playwright E2E framework。配送／Cart service、schema、持久化、交易回滾、金額及 guard 由 Node tests 驗證；Vue reactivity、直接輸入、Header badge、reload、路由通知、雙語、DOM、RWD、視覺與 console 使用 in-app browser 實際操作、量測及 screenshot 驗證。

## Residual risk and user content protection

- Safari、Firefox、Edge 的引擎差異仍由 T011 release QA 統一驗證；目前實際瀏覽器沒有 T009 阻擋問題。
- T009 只交付配送選擇與總額；Checkout 仍依核准範圍顯示 placeholder，收件、付款與訂單建立由 T010 完成。
- `src/views/beetleLab/child/` 保持未追蹤且未修改，不得納入 T009 stage。
