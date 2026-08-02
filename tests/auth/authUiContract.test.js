import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readSource(relativePath) {
  return readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");
}

const beInputSource = readSource("src/components/BeInput.vue");
const headerSource = readSource("src/components/layout/BeHeader.vue");
const loginSource = readSource("src/views/auth/LoginView.vue");
const signupSource = readSource("src/views/auth/SignupView.vue");
const zhAuth = JSON.parse(readSource("src/locale/i18n/zh_tw/auth.json"));
const enAuth = JSON.parse(readSource("src/locale/i18n/en/auth.json"));

test("共用密碼欄位保留使用者輸入並交由集中規則驗證", () => {
  assert.doesNotMatch(beInputSource, /filterAlphaNumeric/);
});

test("Auth views 將 storage failure reason 投影為雙語表單訊息", () => {
  assert.match(loginSource, /formError\.value = result\.reason/);
  assert.match(signupSource, /errorCodes\.value = result\.errors \?\? \{\}/);
  assert.match(signupSource, /formError\.value = result\.reason \?\? "registrationFailed"/);
  assert.equal(typeof zhAuth.storageUnavailable, "string");
  assert.equal(typeof enAuth.storageUnavailable, "string");
});

test("Header 只在 session 確實刪除後呈現登出並投影失敗 reason", () => {
  assert.match(headerSource, /const result = logout\(\)/);
  assert.match(headerSource, /memberActionError\.value = result\.reason/);
  assert.match(headerSource, /role="alert"/);
});

test("Login 與 Signup 在導向前使用 router resolver 驗證 query", () => {
  assert.match(loginSource, /getResolvedAuthRedirect\(router, route\.query\.redirect\)/);
  assert.match(signupSource, /getResolvedAuthRedirect\(router, route\.query\.redirect\)/);
});

test("Signup 圖片使用流程正確的雙語替代文字", () => {
  assert.match(signupSource, /auth\.signupVisualAlt/);
  assert.equal(zhAuth.signupVisualAlt, "甲蟲羽錄會員註冊主視覺");
  assert.equal(enAuth.signupVisualAlt, "Recording of Beetles member sign-up visual");
});
