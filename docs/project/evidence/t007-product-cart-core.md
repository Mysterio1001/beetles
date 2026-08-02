---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T007
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/plans/beetles-vue3-rebuild.md#t007--商品詳情與持久化購物車核心
assumptions:
  - 舊版只有長頸鹿鋸齒鍬形蟲具有完整可購買詳情與三個規格；其餘七筆售完商品保留可瀏覽詳情、相關內容及售完狀態，不建立虛構規格。
  - Cart 持久化只保存 schema version、product id、variant id 與正整數數量；名稱、價格與圖片仍由集中商品資料取得。
  - 「立即購買」先加入目前選定項目再導向 `/cart`；正式購物車頁屬於 T009。
deferred:
  - 購物車頁面、配送、金額計算與 checkout guard 由 T009 處理。
  - 結帳與訂單完成由 T010 處理。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: T008 Mock registration, sign-in, sign-out, and member state
---

# T007 Product Detail and Persistent Cart Core Implementation Evidence

## Outcome

- 以集中商品資料補上長頸鹿鋸齒鍬形蟲的舊版完整欄位、主圖、三個穩定規格、雙語說明／備註、相關商品與相關文章 id；其餘商品亦由集中資料提供相關入口。
- `productService` 組合目前語言的商品詳情，省略不存在的資訊欄位，提供英文 fallback、穩定相關 URL 與 unknown product recovery。
- 建立正式商品詳情 view，包含主圖 fallback、可用狀態、完整資訊、規格、正整數數量、加入購物車、立即購買、成功 live status、售完狀態、相關商品圖片 fallback 及相關文章。
- 建立 version 1 Cart store：相同商品／規格合併、不同規格分列、add／update／remove／clear、最小化 localStorage payload，以及損壞 schema、未知商品、未知規格清理。
- 既有 Header 已消費同一個 `useCartState()` singleton，因此不需修改 Header 即可讓桌面／行動 badge 隨加入操作即時更新並在重新整理後復原。
- 商品詳情頁樣式位於 `src/style/page/_beetleShop.scss`，提供綠色液態玻璃、多欄到單欄 RWD、hover／active 回饋、圖片 fallback 與 reduced-motion 規則。

## Files changed

- `src/mocks/products.js`
- `src/services/catalogService.js`
- `src/services/productService.js`
- `src/state/cartState.js`
- `src/locale/i18n/zh_tw/shop.json`
- `src/locale/i18n/en/shop.json`
- `src/views/beetleShop/detail.vue`
- `src/style/page/_beetleShop.scss`
- `src/router/index.js`
- `tests/product/productService.test.js`
- `tests/cart/cartState.test.js`
- `docs/project/evidence/t007-product-cart-core.md`

## Red and green evidence

Product service Red：

```text
node --test tests/product/productService.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'src/services/productService.js'
```

Cart state Red：

```text
node --test tests/cart/cartState.test.js
exit 1
SyntaxError: The requested module '../../src/state/cartState.js' does not provide an export named 'CART_STORAGE_KEY'
```

Focused Green：

```text
node --test tests/product/productService.test.js tests/cart/cartState.test.js
exit 0
tests 8, pass 8, fail 0
```

Focused tests 涵蓋完整詳情與三個穩定規格、相關商品／文章入口、英文 fallback、unknown id、數量正規化、同規格合併、不同規格分列、重新建立 store 的持久化、最小 payload、損壞／未知資料清理，以及售完商品／未知規格拒絕加入。

Browser 額外觀察到 UI Red：輸入數量 `0` 後 reactive state 已正規化，但原生欄位仍顯示 `0`。

```text
before: { valueAfterZero: '0', decreaseEnabled: false }
after:  { valueAfterZero: '1', decreaseEnabled: false }
```

修正輸入元素與 reactive state 的同步後，focused 8 tests 再次全部通過。

## Browser verification

- `#/beetle-shop/giraffe-stag-nishiyamai` 顯示主圖、雙語名稱／學名、價格、產地、親代、類別、累代、尺寸、狀況、說明、備註、三個規格及正整數數量控制。
- 數量輸入 `0` 立即回復為 `1`，減少鍵在 1 時停用。
- 選擇 `105-plus`、數量 2 並加入兩次後 Header badge 為 4；重新整理後仍為 4，證明 singleton badge 與 localStorage 恢復共同運作。
- 改選 `101-plus` 加入一件後 badge 為 5，Node test 同時確認不同規格形成獨立列；再次執行立即購買後 badge 為 6 並導向 `#/cart`。
- `#/beetle-shop/hercules-kono-line` 顯示售完狀態，DOM 不存在規格、數量、加入購物車或立即購買控制。
- `#/beetle-shop/does-not-exist` 在繁中與英文都顯示明確 recovery，並提供穩定返回商店連結。
- Header 語言切換不重新載入即可同步更新商品所有詳情、通知命名、相關商品、相關文章、麵包屑、Header 與 Footer。
- 三個相關商品 URL 為 `#/beetle-shop/{id}`；兩個相關文章 URL 為 `#/beetle-lab/{id}`。頁面六張內容圖片全部完成解碼且 `naturalWidth > 0`，沒有失敗圖片；主圖與相關商品另具載入失敗 fallback 分支。
- CSSOM 找到 5 個 reduced-motion media rule，商品專用規則包含返回鍵、購買按鈕、相關商品、文章與 recovery 入口，停用非必要 hover 位移並縮短 transition。

| 驗收寬度 | 詳情配置 | 可視內容水平溢位 |
| ---: | --- | --- |
| 375px | 主圖、內容、購買區單欄 | 無（client／scroll width：360／360） |
| 768px | 主圖、內容、購買區單欄 | 無（753／753） |
| 1024px | 主圖＋內容雙欄、購買區下一列 | 無（1009／1009） |
| 1440px | 主圖＋內容＋購買區三欄 | 無（1425／1425） |

最後驗收於 `2026-08-02 10:33:15`（Asia/Taipei）完成：新頁籤位於商品詳情頁首、語言為 `zh-TW`、viewport 1280px、client／scroll width 均為 1280、失敗圖片為 0；本次 `127.0.0.1:5174` 頁面新增 console error／warning 為 0。

## Broader verification

```text
node --test tests/foundation/*.test.js tests/home/*.test.js tests/news/*.test.js tests/lab/*.test.js tests/bulletin/*.test.js tests/shop/*.test.js tests/product/*.test.js tests/cart/*.test.js
exit 0
tests 42, pass 42, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1707 modules transformed

git diff --check
exit 0
```

## Test-first exception

依核准決策，本階段未加入 Vue component 或 Playwright E2E framework。商品資料、詳情投影、Cart schema、持久化與狀態操作由 Node tests 驗證；Vue reactive 語言切換、原生數量欄位、Header badge、重新整理、立即購買導覽、售完／unknown DOM、圖片、CSSOM reduced-motion 及 responsive layout 使用 in-app browser 實際操作、量測與 screenshot 驗證。

## Residual risk and user content protection

- 四大瀏覽器引擎的最終相容性仍由 T011 release QA 統一覆核；目前使用的實際瀏覽器未發現 T007 阻擋問題。
- `#/cart` 在本票仍依核准範圍顯示 placeholder，正式購物車列與配送功能由 T009 交付。
- 既有未追蹤 `src/views/beetleLab/child/index.vue` 保持原內容且不納入本票 stage。
