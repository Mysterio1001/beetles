---
artifact_type: Implementation Evidence
artifact_id: IMPL-BEETLES-VUE3-REBUILD-T011
workflow_id: beetles-vue3-rebuild-20260801
core_version: 1.0.1
status: Complete
inputs:
  - docs/specs/beetles-vue3-rebuild.md#acceptance-criteria
  - docs/plans/beetles-vue3-rebuild.md#t011--整站整合無障礙效能與-release-qa
  - REVIEW-BEETLES-T011-003
assumptions:
  - 使用者於 2026-08-02 明確要求停止瀏覽器檢核，T011 最終 closure 只覆核程式、測試、依賴、文件與 production build。
deferred:
  - AC15 與後續 Browser／跨瀏覽器／viewport runtime QA，依使用者明確指示停止。
  - 真實後端、資料庫、身分驗證、付款、物流及訂單 API。
  - Vitest、Vue Test Utils、Playwright E2E 與 CI。
handoff: precise staging and commit T011; retain deferred runtime QA labels
---

# T011 Release QA Implementation Evidence

## Outcome

- 移除入口的 eager global component registration，正式 views 與共用 shell 改為 local imports；route views 維持 lazy chunks。
- 移除未使用 toolkit、demo views、placeholder、utility 及舊共用元件。
- 新增完整 `npm test` 命令、行為型 release contract tests，並更新 README 的安裝、品質命令、Mock 帳號、資料邊界、i18n、樣式及 Hash Router 部署說明。
- 明確保留 Vue I18n compiler／resolver，release test 會實際載入 locale runtime、驗證 nested messages、插值及 Vite production flags。
- Mock 動態圖片改用 base-relative `img/...`，並以 in-memory non-root production build 防止 GitHub Pages project-site regression。
- Footer 與 Order Complete 透過獨立 `contactService` 消費唯一的集中聯絡資料；Footer 不再複製社群 URL，也不會把完整 Bulletin domain eager 打進 main bundle。
- Login 只由 member state 取得最小化、唯讀的 Demo credential DTO，不再直接 import 或理解 Mock record collection。
- ESLint 啟用 `vue/no-undef-components`，只排除 Vue Router 提供的 `RouterLink`／`RouterView`，可攔截自有元件漏 import。
- Final independent review 為 Pass，沒有 P0–P3 actionable finding；T011 可在核准的非瀏覽器範圍內交付。

## Review findings closure

| Finding | Status | Closure evidence |
| --- | --- | --- |
| P1 non-root base 圖片失效 | Closed | `build({ base: "/__beetles_base_contract__/", write: false })` 不含 origin-root dynamic `/img/`。 |
| P2 Footer 重複社群資料 | Closed | `contactRecord`／`contactService` 是唯一資料 boundary；Footer source 無社群 URL。 |
| P2 Login 穿透 Mock boundary | Closed | `LoginView` 只消費 `useMemberState().demoCredentials`，全 views 無 direct mocks import。 |
| P2 release contract false-green | Closed | public／console fixtures、實際 i18n runtime、non-root build、boundary 與 ESLint fixture 全部納入 test。 |
| P3 stale evidence | Closed | 本文件與 review handoff 已依 111 tests 及使用者停止 Browser 的決策更新。 |

## Red and green evidence

Finding remediation Red：

```text
node --test tests/release/releaseContract.test.js tests/auth/memberState.test.js \
  tests/bulletin/bulletinService.test.js tests/home/homeService.test.js \
  tests/news/newsService.test.js tests/lab/articleService.test.js \
  tests/shop/catalogService.test.js tests/product/productService.test.js

exit 1
tests 50, pass 38, fail 12
- member state 沒有 Demo credential DTO
- services 仍輸出 origin-root /img paths
- non-root production build 仍含 origin-root dynamic assets
- Login／Footer 尚未通過集中資料 boundary
- ESLint 尚未攔截 undefined components
```

Focused Green：

```text
相同 focused command
exit 0
tests 50, pass 50, fail 0
```

Bundle refactor Red／Green：

```text
Red: Footer import bulletinService，main JS gzip 91.14 kB
Red test: contact-only boundary tests 1, pass 0, fail 1

Green: Footer／Order Complete import contactService
Green test: tests 1, pass 1, fail 0
Final main JS gzip 89.59 kB
```

Release contract focused Green：

```text
node --test tests/release/releaseContract.test.js
tests 10, pass 10, fail 0
```

## Acceptance criteria matrix

| AC | Status | Evidence |
| --- | --- | --- |
| AC1–AC4 | Pass in code scope | Router／shell／locale domain tests 與 production i18n runtime contract 通過。 |
| AC5 | Pass | 全 views 不直接 import mocks；Footer／Order／Login 使用 contact／member boundaries。 |
| AC6–AC13 | Pass in code scope | Home、News、Lab、Shop、Product、Auth、Cart、Checkout 與 Order domain／contract tests 通過。 |
| AC14 | Deferred runtime scope | 既有 style contracts 保持通過；後續 Browser／viewport runtime QA 依使用者指示停止。 |
| AC15 | Deferred by user | 不在本次 code-review completion 中宣告跨瀏覽器 pass。 |
| AC16 | Pass | 111 tests、lint、format、root build、non-root in-memory build、diff check 及 production `/public` scan 通過。 |

## Final non-browser verification

```text
npm test
exit 0
tests 111, pass 111, fail 0

npm run lint
exit 0

npm run format:check
exit 0
All matched files use Prettier code style!

npm run build
exit 0
vite v6.4.3
1724 modules transformed
main JS gzip 89.59 kB
main CSS gzip 19.28 kB

git diff --check
exit 0

rg -n '/public' dist
exit 1 / no matches

npm ls @intlify/core-base vue-i18n @intlify/vue-i18n-core --depth=1
exit 0
all i18n core packages resolve to 12.0.0-alpha.2
```

## Scope control and residual risk

- 本輪未執行任何 Browser、SafariDriver 或跨瀏覽器操作。
- UI mount 與 E2E automation 依核准 Specification 延後，source／domain contracts 不能取代真實 focus、layout 或瀏覽器引擎驗證。
- `src/views/beetleLab/child/` 保持未追蹤、未修改且不得 stage／commit。
