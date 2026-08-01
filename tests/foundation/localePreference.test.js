import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  resolveInitialLocale,
} from "../../src/locale/localePreference.js";

test("有效的已儲存語言優先於瀏覽器語言", () => {
  assert.equal(
    resolveInitialLocale({
      savedLocale: SUPPORTED_LOCALES.ZH_TW,
      browserLanguages: ["en-US"],
    }),
    SUPPORTED_LOCALES.ZH_TW,
  );
  assert.equal(
    resolveInitialLocale({
      savedLocale: SUPPORTED_LOCALES.EN,
      browserLanguages: ["zh-TW"],
    }),
    SUPPORTED_LOCALES.EN,
  );
});

test("中文瀏覽器語言解析為繁體中文", () => {
  assert.equal(resolveInitialLocale({ browserLanguages: ["zh-Hant-TW"] }), SUPPORTED_LOCALES.ZH_TW);
  assert.equal(resolveInitialLocale({ browserLanguages: ["zh-CN"] }), SUPPORTED_LOCALES.ZH_TW);
});

test("英文瀏覽器語言解析為英文", () => {
  assert.equal(resolveInitialLocale({ browserLanguages: ["en-GB"] }), SUPPORTED_LOCALES.EN);
});

test("不支援的瀏覽器語言回退英文", () => {
  assert.equal(resolveInitialLocale({ browserLanguages: ["ja-JP", "fr-FR"] }), DEFAULT_LOCALE);
  assert.equal(resolveInitialLocale(), SUPPORTED_LOCALES.EN);
});

test("無效的已儲存語言會被忽略", () => {
  assert.equal(
    resolveInitialLocale({
      savedLocale: "ja",
      browserLanguages: ["zh-TW"],
    }),
    SUPPORTED_LOCALES.ZH_TW,
  );
});
