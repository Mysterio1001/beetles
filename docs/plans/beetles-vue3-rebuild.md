---
artifact_type: Ticket Plan
artifact_id: PLAN-BEETLES-VUE3-REBUILD-001
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Draft
inputs:
  - docs/specs/beetles-vue3-rebuild.md
  - docs/project/knowledge-base.md
assumptions:
  - `codex_dev` 已依使用者明確例外提前建立，所有實作票都在此分支完成。
  - 自動化測試框架已由使用者延後；各票採 failure-first 手動／靜態驗證，並保留可重現證據。
deferred:
  - 真實後端、資料庫、身分驗證、郵件、物流與金流整合。
  - Vitest、Vue Test Utils、Playwright E2E 與 CI 自動化測試。
handoff: implement-tdd after approval, using the approved non-framework verification policy
approval: Pending user approval
---

# Beetles Vue 3 全站重建 Ticket Plan

## Planning basis

- Approved Specification：`SPEC-BEETLES-VUE3-REBUILD-001`
- 分支：`codex_dev`
- 未追蹤的 `src/views/beetleLab/child/` 是既有使用者內容；票內不得刪除或覆寫，除非實作前確認可安全整合。
- 每票開始前先重現並記錄該票要消除的失敗行為；完成後執行 focused verification 與當時可用的 broader verification。
- 在 ESLint／Prettier 尚未由 Ticket 001 建立前，只執行現有 production build；建立後所有票都必須通過 lint、format check 與 build。

## Dependency order

```text
T001 → T002, T003, T004, T005, T006, T008
T004 + T006 → T007
T007 → T009
T008 + T009 → T010
T002–T010 complete → T011
```

## Proposed parallel groups

- **Group A — T002 Home + T005 Bulletin：Safe after T001.** 兩票只擁有各自 view、page style、Mock namespace 與 locale namespace；不得修改共用元件契約或全域 token。
- 其他票採順序執行。News、Lab、Shop、Product、Auth、Cart、Checkout 都會碰觸共用互動元件、Header 狀態或領域資料契約，平行修改會產生整合風險。

## T001 — 可部署 App Foundation 與全站 Shell

### Outcome

交付一個可部署、可切換語言、可由鍵盤操作的 hash SPA Shell，建立後續頁面共用的資料、狀態、儲存、視覺與品質邊界。

### Acceptance criteria covered

- AC1、AC2、AC3、AC5 的平台部分。
- AC14 的全域視覺與 reduced-motion 基礎。
- AC16 的 ESLint、Prettier、build 與資產路徑基礎。

### In scope

- Hash routing、route metadata、document title、scroll restoration、Not Found。
- Header、Footer、Breadcrumb、行動選單、語言切換與空購物車入口。
- 瀏覽器語言初始化、英文回退、手動偏好持久化。
- 集中 Mock namespace、可替換資料 service 邊界、安全儲存存取及共用狀態邊界。
- 將現有 news／article test data 移入集中結構並維持既有資料內容優先。
- 綠色液態玻璃 token、base style、focus-visible、reduced-motion 與頁面樣式匯出邊界。
- 將基礎 Button、Input、Select、Dialog、Card、Pagination 等元件契約整理到足以供後續票使用；不可含特定頁面的資料。
- ESLint、Prettier、format check 與 lint scripts。
- 清除正式 Shell 中的 `/test` 連結、測試路由與錯誤 public 資產引用。

### Out of scope

- 各正式頁面的完整內容。
- Mock 會員、購物車、配送及結帳業務行為。
- 自動化測試框架。

### Dependencies

- Approved Specification。

### Likely areas

- App entry、router、layout components、base components。
- locale bootstrap 與 common／route messages。
- mocks、services、state、storage utilities。
- global／base／abstract styles、package scripts 與 lint／format configuration。

### First failing verification

- 現在沒有 `npm run lint` 或 format check。
- Logo 會前往 `/test`、商店路由顯示 News、未知路由沒有正式 Not Found。
- 現在使用 history routing，無法滿足無 rewrite 靜態部署契約。
- 現有資料包含開發伺服器兼容、正式輸出無效的 `/public` 路徑。

### Focused verification

- 執行 lint 與 format check。
- 在瀏覽器驗證繁中、英文、未知語言回退與保存後重新整理。
- 直接載入首頁 hash、正式空殼路由及未知 hash。
- 只用鍵盤開關行動選單、語言選單、Not Found 返回首頁。

### Broader verification

- Production build 成功。
- 375px、768px、1024px、1440px Shell screenshot／目視檢查。
- Git diff 不包含既有未追蹤文章詳情檔案。

### Completion criteria

- 後續頁面可以只新增自己的 view、Mock／locale namespace 與 page style，不必重做平台契約。
- Shell、語言、路由、儲存與品質命令符合規格且無阻擋錯誤。

### Parallel safety

- **No.** 這票擁有全域路由、入口、共用元件、locale bootstrap、style token 與 package scripts。

## T002 — 首頁品牌與內容入口

### Outcome

以現代液態玻璃視覺交付首頁 Hero、品牌介紹、近期到貨與最新飼育紀錄，並讓內容正確連到商品及文章詳情。

### Acceptance criteria covered

- AC6 的首頁部分、AC3／AC4／AC14 的首頁部分。

### In scope

- 集中管理首頁雙語文案、近期商品與文章選取資料。
- Hero、品牌內容、近期到貨、飼育紀錄與導覽。
- 首頁動畫、reduced-motion、四種驗收寬度。

### Out of scope

- 商品／文章詳情頁本身。
- 商店與研究所搜尋篩選。

### Dependencies

- T001。

### Likely areas

- Home view、home Mock／service namespace、home locale、home page style、首頁專用展示元件。

### First failing verification

- `/` 目前只顯示 Vite 示範文字，沒有舊版品牌內容或任何可用入口。

### Focused verification

- 驗證每個商品與文章入口產生正確穩定詳情 hash。
- 切換語言後首頁所有文字同步更新。
- 在 reduced-motion 下確認內容仍可讀且無必要循環動畫。

### Broader verification

- Lint、format check、production build。
- 375px、768px、1024px、1440px 視覺檢查。

### Completion criteria

- 首頁不含 inline Mock 集合，所有主要內容與入口可操作，無錯誤圖片路徑。

### Parallel safety

- **Yes, with T005 after T001.** 僅擁有 Home 領域檔案，不修改共用元件、全域 token 或其他 page namespace。

## T003 — 最新消息列表、分類、輪播與詳情

### Outcome

交付可雙語分類、瀏覽與閱讀完整消息的 News 垂直流程。

### Acceptance criteria covered

- AC3、AC4、AC5、AC6 的消息部分、AC14。

### In scope

- 以現有 Vue news test data 為主的雙語集中資料。
- 輪播、全部／公告／活動／飼育情報分類、卡片、空狀態與消息 Dialog。
- Dialog 焦點、Escape、背景關閉與 body scroll lifecycle。
- 手動輪播、自動輪播互動與 reduced-motion。

### Out of scope

- 獨立 News detail route。
- 後端消息 API。

### Dependencies

- T001。

### Likely areas

- News view、news Mock／service／locale／page style、Dialog／Swiper／Tags 使用邊界。

### First failing verification

- 現頁資料仍稱為 test data、圖片路徑正式部署無效、Dialog「前往」為空連結，且語言內容不是完整 reactive contract。

### Focused verification

- 四種分類逐一比對卡片結果與空狀態。
- 中英文切換時輪播、卡片與 Dialog 全部同步。
- 鍵盤完成卡片開啟、焦點循環、Escape 關閉並返回觸發點。

### Broader verification

- Lint、format check、production build。
- News 在四種驗收寬度目視檢查。

### Completion criteria

- News 核心流程、Dialog accessibility、資產路徑與雙語內容符合規格。

### Parallel safety

- **No.** 會驗證並可能調整共用 Dialog、Swiper、Tags 與 Card 契約。

## T004 — 研究所搜尋、分頁與文章詳情

### Outcome

交付可搜尋、分頁、從最新文章或卡片進入穩定詳情 URL 的完整文章流程。

### Acceptance criteria covered

- AC3、AC4、AC5、AC6 的文章部分、AC13。

### In scope

- 以現有 Vue article test data 為主的雙語集中資料。
- 文章列表、關鍵字搜尋、最新文章入口、分頁與空狀態。
- 使用穩定識別值的文章詳情、完整內容、返回列表與 unknown article recovery。
- 安全整合或取代現有未追蹤 placeholder，不刪除未知使用者內容。

### Out of scope

- 文章編輯器與後端文章 API。

### Dependencies

- T001。

### Likely areas

- Lab list／detail views、article Mock／service／locale／page styles、Pagination／Card／search controls。

### First failing verification

- 現在搜尋與分頁缺失，最新文章不可點，詳情使用 title route 且未追蹤頁只顯示測試文字。

### Focused verification

- 中英文部分比對、清空搜尋、結果縮減後頁碼修正。
- 列表與最新文章都前往同一穩定詳情 URL。
- unknown article 顯示恢復操作；不突變 route metadata。

### Broader verification

- Lint、format check、production build。
- List／detail 在四種驗收寬度目視檢查。

### Completion criteria

- 搜尋、分頁、詳情與失敗復原全部可重現，既有未追蹤內容已安全處理並在交付中說明。

### Parallel safety

- **No.** 會調整共用 Pagination、Card 與 route detail 契約，且涉及既有未追蹤檔案。

## T005 — 羽錄情報品牌與聯絡體驗

### Outcome

完成雙語品牌介紹、聯絡電話、社群入口及響應式主視覺動畫。

### Acceptance criteria covered

- AC3、AC4、AC14、AC15 的 Bulletin 部分。

### In scope

- 集中品牌聯絡／社群資料及完整雙語。
- 桌面主視覺動畫、手機主圖、reduced-motion。
- 電話與安全外部連結。

### Out of scope

- 聯絡表單、真實訊息或社群 API。

### Dependencies

- T001。

### Likely areas

- Bulletin view、bulletin Mock／service／locale／page style。

### First failing verification

- 現有頁面文字在 setup 時快照化，手動切換語言後不會完整響應更新。

### Focused verification

- 語言即時切換、電話 URL、三個社群連結與安全開啟屬性。
- 桌面／手機主視覺切換及 reduced-motion。

### Broader verification

- Lint、format check、production build。
- 四種驗收寬度目視檢查。

### Completion criteria

- Bulletin 全部可見內容 reactive bilingual，動畫與連結無阻擋問題。

### Parallel safety

- **Yes, with T002 after T001.** 僅擁有 Bulletin 領域檔案，不修改共用契約。

## T006 — 商店搜尋、分類、排序與分頁

### Outcome

交付可組合搜尋、分類、排序及分頁的雙語商品目錄。

### Acceptance criteria covered

- AC3、AC4、AC5、AC7、AC14。

### In scope

- 以舊版商品補足現有缺口，建立集中雙語商品與分類資料。
- 搜尋名稱、學名及關鍵字。
- 新品、成蟲、幼蟲、耗材、標本、飼育用品、教學課程分類。
- 五種排序、結果數、空狀態、分頁及穩定商品詳情 URL。
- 行動分類面板與桌面分類導覽。

### Out of scope

- 商品詳情、加入購物車及真實庫存。

### Dependencies

- T001。

### Likely areas

- Shop view、product／category Mock、catalog service、shop locale／page style、Card／Pagination／Select usage。

### First failing verification

- `/beetle-shop` 目前顯示 News，shop page style 為空，沒有商品 catalog 行為。

### Focused verification

- 搜尋＋分類＋排序組合、頁碼回復與空分類。
- 中英文名稱／學名搜尋及商品詳情 URL。
- 行動分類面板開關與背景行為。

### Broader verification

- Lint、format check、production build。
- 商店四種驗收寬度目視檢查。

### Completion criteria

- 商品目錄的所有組合狀態可操作且 deterministic，不使用重複桌面／手機資料集合。

### Parallel safety

- **No.** 會建立後續 Product／Cart 共用商品契約，並使用共用 Card、Pagination、Select。

## T007 — 商品詳情與持久化購物車核心

### Outcome

交付商品詳情、規格／數量選擇、加入購物車、立即購買，以及可安全復原的持久化購物車核心。

### Acceptance criteria covered

- AC5、AC8、AC13 的商品／cart state 部分。

### In scope

- 商品詳情所有可用欄位、相關商品與相關文章。
- 規格、正整數數量、加入購物車、立即購買、成功通知。
- 相同商品／規格合併與 Header badge。
- Cart state 持久化、schema 驗證、損壞資料及不存在商品清理。
- unknown product recovery。

### Out of scope

- 購物車頁面、配送、結帳。

### Dependencies

- T006；相關文章入口亦依賴 T004。

### Likely areas

- Product detail view／style／locale、product service、cart state／storage、Header badge、quantity controls。

### First failing verification

- 現在沒有商品詳情 route 或購物車 state，Header cart 也沒有導航與 badge 行為。

### Focused verification

- 規格與數量邊界、相同項目合併、立即購買導覽。
- 重新整理後購物車保留；注入損壞／未知商品儲存資料後安全復原。
- unknown product 顯示返回商店操作。

### Broader verification

- Lint、format check、production build。
- 商品詳情四種驗收寬度目視檢查。

### Completion criteria

- 商品到 cart state 的公開流程完整，Header badge 與持久化內容一致。

### Parallel safety

- **No.** 擁有 product contract、cart state、storage 及 Header badge 等核心共享區域。

## T008 — Mock 註冊、登入、登出與會員帶入資料

### Outcome

交付可驗證、可持久化且明確標示為 Mock 的完整會員流程。

### Acceptance criteria covered

- AC3、AC4、AC5、AC9、AC13 的會員部分。

### In scope

- 集中預設會員資料與文件化測試帳號。
- 登入、錯誤憑證、已登入 guard、返回來源頁。
- 註冊欄位、唯一性、email／phone／password／birthday 驗證與成功引導。
- 本機註冊會員、登入狀態、Header 會員狀態與登出。
- 忘記密碼 Mock 提示。

### Out of scope

- 真實安全認證、密碼復原郵件、會員中心。

### Dependencies

- T001。

### Likely areas

- Login／Sign-up views、member Mock／service／state／storage、validation utilities、Header member controls、auth page styles／locales。

### First failing verification

- 現在沒有 login／sign-up routes 或會員 state，Header 登入按鈕不可操作。

### Focused verification

- 預設帳號登入、錯誤憑證、登出、已登入 guard。
- 重複 account／email、密碼規則、電話、閏年生日與成功註冊後登入。
- 重新整理後狀態保留；損壞會員儲存資料安全復原。

### Broader verification

- Lint、format check、production build。
- Login／Sign-up 四種驗收寬度與鍵盤操作檢查。

### Completion criteria

- Mock 會員所有成功與失敗路徑符合規格，Header 與本機資料一致。

### Parallel safety

- **No.** 會修改 Header、storage、validation 與跨頁會員 state。

## T009 — 購物車頁與配送計算

### Outcome

交付購物車項目管理、四種配送、即時運費／總額與空購物車 guard。

### Acceptance criteria covered

- AC8、AC10 的配送前段、AC13。

### In scope

- 商品／規格列、單價、數量、小計、移除及空狀態。
- 正整數數量更新與持久化。
- 7-ELEVEN／全家 70、黑貓 150、自取 0 的配送選擇。
- 商品小計、運費、總額與新台幣整數顯示。
- 空購物車 checkout guard 與提示。

### Out of scope

- 收件人、門市、付款與訂單建立。

### Dependencies

- T007。

### Likely areas

- Cart view／style／locale、cart／shipping state、shipping Mock data、money／quantity presentation。

### First failing verification

- 現在沒有 shopping-cart route，舊版數量、運費與總額都是固定畫面。

### Focused verification

- 修改數量、移除、最後一項移除、重新整理持久化。
- 四種配送逐一驗證運費及總額。
- 空購物車直接進入 checkout 的 guard 與通知。

### Broader verification

- Lint、format check、production build。
- Cart 四種驗收寬度目視檢查。

### Completion criteria

- 購物車顯示與 cart state／header badge／配送總額完全一致。

### Parallel safety

- **No.** 依賴並擴充共享 cart state，且建立 Checkout 使用的 shipping contract。

## T010 — 訪客／會員結帳與訂單完成

### Outcome

交付從非空購物車到 Mock 訂單完成的整條流程，包含條件式配送／付款驗證、敏感資料生命週期及完成頁 guard。

### Acceptance criteria covered

- AC10、AC11、AC12、AC13。

### In scope

- 訪客結帳與會員資料帶入／修改。
- 姓名、電話、宅配地址、超商門市、自取條件式驗證。
- 銀行轉帳／信用卡條件式付款欄位。
- 16 位卡號、未過期年月、3 位安全碼與重複送出防護。
- 訂單摘要、唯一 Mock 訂單編號、清空購物車、當次完成狀態。
- 完成頁訂單資訊、五秒倒數、手動返回、離開 cleanup 與 direct／reload guard。
- 確保信用卡、收件表單及完成狀態未持久化。

### Out of scope

- 真實金流失敗、物流 API、持久化歷史訂單。

### Dependencies

- T008、T009。

### Likely areas

- Checkout／Order Completion views、page styles／locales、checkout state、order service、route guards、Mock stores。

### First failing verification

- 現在沒有 checkout／completion routes 或動態表單／訂單行為；舊版所有資料與總額固定。

### Focused verification

- 訪客與會員資料帶入。
- 四種配送的必填差異；銀行／信用卡的必填差異。
- 各信用卡欄位錯誤、重複送出、成功訂單編號與 cart clear。
- 檢查 storage 不含敏感欄位；完成頁倒數、離開 cleanup、直接進入與重新整理 guard。

### Broader verification

- Lint、format check、production build。
- Checkout／Completion 四種驗收寬度與鍵盤操作檢查。

### Completion criteria

- 所有條件式驗證與成功／失敗／guard 路徑可重現，敏感資料生命週期符合規格。

### Parallel safety

- **No.** 同時依賴會員、cart、shipping、router guards 與訂單 state。

## T011 — 整站整合、無障礙、效能與 Release QA

### Outcome

整合全部垂直流程，消除跨頁不一致、資產與生命週期問題，產出可部署的 final build 與人工驗證證據。

### Acceptance criteria covered

- AC1 至 AC16 的整體覆核。

### In scope

- 全路由、Header／Footer／Breadcrumb、language、member、cart badge 一致性。
- 全站雙語遺漏、翻譯 key、空狀態、通知與 document title 檢查。
- 鍵盤順序、focus-visible、Dialog focus、表單 label／錯誤、替代文字、外部連結安全。
- 375px、768px、1024px、1440px 的所有頁面視覺 QA。
- reduced-motion、計時器與 event listener cleanup。
- 移除死碼、console、測試路由、未使用依賴與錯誤資產路徑。
- 檢查全域 eager import、字型與資產輸出，降低不必要 production 體積而不破壞視覺。
- Lint、format check、production build 與靜態產物 hash route smoke verification。
- 更新 README 的安裝、命令、Mock 帳號、資料維護及部署說明。

### Out of scope

- 新產品功能、後端、自動化測試框架。

### Dependencies

- T001 至 T010 全部完成。

### Likely areas

- 全站 routes、shared layout／components、locale、styles、assets、package dependencies、README。

### First failing verification

- 在整合前逐一列出 AC1–AC16 尚未通過或未驗證的項目；任何未覆核項目視為 failing。

### Focused verification

- 依 Specification 的 16 項 acceptance criteria 建立逐項 pass／fail 記錄。
- 以鍵盤走完導覽、News Dialog、Auth、Product、Cart、Checkout。
- 以繁中與英文各走完主要內容及交易流程。

### Broader verification

- Lint、format check、production build 全部通過。
- 四種驗收寬度的全頁 QA。
- 最新版 Chrome、Safari、Firefox、Edge 無阻擋核心流程錯誤。
- Build 產物沒有 `/public` 錯誤 URL，hash 子頁可直接載入。

### Completion criteria

- AC1–AC16 全部具備可重現 pass 證據，沒有 blocking lint／build／functional／visual finding。
- README 與實際命令、Mock 帳號及資料維護方式一致。
- 延後的後端與自動化測試清楚標示，未被誤報為已完成。

### Parallel safety

- **No.** 這是所有票完成後的集中整合與 release gate。

## Plan completion rule

- 依 dependency order 執行，不因局部畫面完成而跳過狀態、失敗或驗證範圍。
- 每票完成後記錄變更、failure-first 證據、focused verification、broader verification 及殘留風險。
- 發現需要新增產品行為時停止實作並返回 Specification gate，不在票內臨時發明規則。
- T011 無 blocking findings 且全部驗證通過後，才進入獨立 code review 與最終交付。
