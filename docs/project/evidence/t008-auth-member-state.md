---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T008
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md#11-mock-會員登入
  - docs/specs/beetles-vue3-rebuild.md#12-mock-會員註冊
  - docs/plans/beetles-vue3-rebuild.md#t008--mock-註冊登入登出與會員帶入資料
assumptions:
  - Mock 會員憑證與新註冊會員只供純前端作品展示，並以頁面及 README 警告使用者不要輸入真實敏感資料。
  - 會員與 session 使用 version 1 localStorage schema；公開會員狀態不暴露 password，註冊資料不保存 passwordConfirm。
deferred:
  - 真實認證、密碼雜湊、密碼復原郵件與會員中心。
  - 結帳會員資料帶入介面由 T010 消費本票 currentMember 契約。
  - Vitest、Vue Test Utils 與 Playwright E2E 依核准決策留待後端開發階段。
handoff: T009 cart page and delivery calculations
---

# T008 Mock Auth and Member State Implementation Evidence

## Outcome

- 建立集中預設會員資料與 README 測試帳號文件：`beetles_demo`／`demo@beetles.test`／`Beetle2026`。
- 建立可替換的 member service，集中處理註冊正規化、必填、email、10 位電話、6–12 位大小寫英文加數字密碼、確認密碼、帳號／email 唯一性、100 年生日選項、月份天數與閏年；站內返回政策位於獨立 router utility。
- 建立 version 1 Member store，支援本機會員註冊、帳號或 email 不分大小寫登入、錯誤憑證清除 session、重新整理復原、登出、損壞儲存安全清理、寫入失敗回滾，以及不可變的公開會員 DTO。
- 完成雙語 Login／Signup routes 與 views，包含 Mock／隱私警告、欄位錯誤、成功引導、忘記密碼 Mock 通知、重複送出防護、登入來源返回及已登入 Auth route guard。
- Header 桌面與行動版消費相同 Member singleton，顯示會員名稱、登出操作，訪客登入入口會附帶目前站內來源。
- Auth 頁面樣式集中於 `src/style/page/_auth.scss` 並由 `main.scss` 匯出，具綠色液態玻璃、hover／active／focus 回饋、RWD 與 reduced-motion。
- 修正 Vue I18n 將 email placeholder 的 `@` 解讀為 linked-message 語法所造成的 console compile error；繁中與英文實際顯示仍是標準 email。
- 兩輪獨立 review 的 4 個 P2 與 3 個 P3 finding 已以 TDD 修正：storage 寫入／刪除失敗不再假成功、公開巢狀會員資料無法污染內部狀態、符號密碼完整保留、Not Found 與未知 query 不再成為登入返回來源，且 Signup 主圖使用正確雙語 alt。

## Files changed

- `README.md`
- `src/mocks/members.js`
- `src/services/memberService.js`
- `src/state/memberState.js`
- `src/router/authNavigation.js`
- `src/components/BeInput.vue`
- `src/views/auth/LoginView.vue`
- `src/views/auth/SignupView.vue`
- `src/locale/i18n/zh_tw/auth.json`
- `src/locale/i18n/en/auth.json`
- `src/locale/i18n/zh_tw/common.json`
- `src/locale/i18n/en/common.json`
- `src/locale/zh_tw.js`
- `src/locale/en.js`
- `src/components/layout/BeHeader.vue`
- `src/router/index.js`
- `src/utils/inputFilters.js`（移除無消費端且與集中密碼規則衝突的舊過濾器）
- `src/style/page/_auth.scss`
- `src/style/main.scss`
- `tests/auth/memberState.test.js`
- `tests/auth/authNavigation.test.js`
- `tests/auth/authUiContract.test.js`
- `docs/project/evidence/t008-auth-member-state.md`

## Red and green evidence

Member domain Red（斷線前已執行）：

```text
node --test tests/auth/memberState.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'src/mocks/members.js'
```

這個失敗由測試先引用尚不存在的集中會員資料、service 與 state 公開邊界所觸發，符合 T008 缺少會員領域實作的預期原因。

Initial Focused Green：

```text
node --test tests/auth/memberState.test.js
exit 0
tests 9, pass 9, fail 0
```

Focused tests 涵蓋集中預設測試帳號、100 年生日選項、閏年與月份天數、安全站內返回來源、完整註冊驗證、預設與本機會員唯一性、最小維護資料、不保存 `passwordConfirm`、帳號／email 登入、錯誤憑證、session 重建、登出及損壞儲存清理。

獨立 review finding Red：

```text
node --test tests/auth/memberState.test.js
exit 1
tests 11, pass 9, fail 2
- storage setItem 失敗時 register 實際回傳 ok: true
- currentMember、birthday 與 address 實際不是 frozen DTO

node --test tests/auth/authNavigation.test.js
exit 1
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'src/router/authNavigation.js'

node --test tests/auth/authUiContract.test.js
exit 1
tests 3, pass 0, fail 3
- BeInput 仍包含 filterAlphaNumeric
- Auth views 未投影 storageUnavailable
- Signup 仍使用 loginVisualAlt
```

Review finding Focused Green：

```text
node --test tests/auth/*.test.js
exit 0
tests 15, pass 15, fail 0
```

新增 focused tests 涵蓋寫入失敗回滾與明確 reason、公開 DTO 巢狀不可變、純 router 返回來源、Not Found fallback、符號密碼保留、storage failure 雙語投影及 Signup 雙語 alt。

第一次獨立複審新增 finding Red：

```text
node --test tests/auth/memberState.test.js
exit 1
tests 11, pass 9, fail 2
- logout 未回傳結果
- session removeItem 失敗後仍在記憶體呈現已登出

node --test tests/auth/authNavigation.test.js
exit 1
SyntaxError: authNavigation.js does not provide getResolvedAuthRedirect

node --test tests/auth/authUiContract.test.js
exit 1
tests 4, pass 3, fail 1
- Header 未投影 logout failure reason
```

最終 Focused Green：

```text
node --test tests/auth/*.test.js
exit 0
tests 19, pass 19, fail 0
```

最終新增測試涵蓋 session 刪除失敗時保留登入狀態與 failure reason、錯誤憑證清理的同一交易邊界、成功 logout 回傳、router resolver 驗證未知 query，以及 Login／Signup／Header 對新契約的實際消費。

Browser 額外觀察到 UI Red：未跳脫的 email `@` 會被 Vue I18n 視為 linked-message 語法。

```text
Message compilation error: Invalid linked format
Message compilation error: Unexpected lexical analysis in token
Message compilation error: Unexpected empty linked key
```

將四個 placeholder 使用 Vue I18n literal interpolation 表示 `@` 後，實際 DOM 分別顯示 `beetles_demo 或 demo@beetles.test`、`beetles_demo or demo@beetles.test` 與 `name@example.com`；11:17（Asia/Taipei）後新增 console warning／error 為 0。

## Browser verification

- 空登入顯示必填欄位錯誤；修改欄位後立即清除該欄舊錯誤。
- 錯誤憑證不建立登入狀態並清空密碼；忘記密碼只顯示不寄送郵件的 Mock 通知。
- 預設帳號可用 account 或 email 登入；登入會返回合法站內來源，reload 後 session 保留；外部 URL、`/login` 與 `/signup` 回退首頁。
- 已登入進入 Login／Signup 由 guard 回首頁；桌面與 375px 行動 Header 都顯示會員名稱並可登出。
- 空註冊顯示所有必填錯誤；2024 年 2 月有 29 日，切換 2025 年後自動移除 29 日。
- 新會員可註冊、登入並返回 `/cart`；預設或本機重複 account／email 顯示對應錯誤。
- 中英文切換不重新載入即可同步更新 Auth、Header、Breadcrumb 與 Footer；修正後 email placeholders 在兩種語言都正確顯示。
- Login／Signup 在 375px、768px、1024px、1440px 沒有文件水平溢位；Auth 圖片完成載入，CSSOM 存在 Auth reduced-motion 規則。
- Review 修正後 Browser 實測密碼 `Abcd1!` 保留完整原值、Signup 圖片 alt 為「甲蟲羽錄會員註冊主視覺」，且 Not Found Header 登入 URL 為 `#/login`、不含未知 redirect；11:39（Asia/Taipei）後新增 console warning／error 為 0。
- 最後 Browser 直接開啟 `#/login?redirect=/removed-route`，用預設 Mock 帳號登入後確定回退 `#/`，再由 Header 成功登出並恢復訪客狀態；11:49（Asia/Taipei）後新增 console warning／error 為 0。
- 最後狀態恢復為登出、繁中與 1280px；Browser localStorage 內 T007 購物車 badge 6 只屬本機驗收資料。

## Broader verification

```text
node --test tests/**/*.test.js
exit 0
tests 61, pass 61, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1717 modules transformed

git diff --check
exit 0
```

## Test-first exception

依核准決策，本階段未加入 Vue component 或 Playwright E2E framework。會員驗證、資料 schema、持久化及狀態操作由 Node tests 驗證；Vue 表單錯誤、route guard、語言反應、Header session、reload、RWD、圖片、CSSOM reduced-motion 與 console 使用 in-app browser 實際操作及量測驗證。

README 文件化測試帳號不具合理的 failing runtime test surface；替代驗證為將文件值逐一比對 `src/mocks/members.js` 及 Login 頁面實際顯示值。

## Residual risk and user content protection

- Safari、Firefox、Edge 的引擎差異仍由 T011 release QA 統一驗證；目前實際瀏覽器沒有 T008 阻擋問題。
- 這是純前端 Mock 流程，localStorage 中的會員憑證不具正式安全性；UI 與 README 均已明確警告不得輸入真實敏感資料。
- `src/views/beetleLab/child/index.vue` 保持原內容，未修改且不得納入 T008 stage。
