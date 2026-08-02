import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const viewSource = readFileSync(
  new URL("../../src/views/cart/CartView.vue", import.meta.url),
  "utf8",
);
const routerSource = readFileSync(new URL("../../src/router/index.js", import.meta.url), "utf8");
const mainStyleSource = readFileSync(new URL("../../src/style/main.scss", import.meta.url), "utf8");
const cartStyleSource = readFileSync(
  new URL("../../src/style/page/_cart.scss", import.meta.url),
  "utf8",
);
const chinese = JSON.parse(
  readFileSync(new URL("../../src/locale/i18n/zh_tw/cart.json", import.meta.url), "utf8"),
);
const english = JSON.parse(
  readFileSync(new URL("../../src/locale/i18n/en/cart.json", import.meta.url), "utf8"),
);

test("Cart route 使用正式頁面並以共用 Cart state 執行 checkout guard", () => {
  assert.match(routerSource, /views\/cart\/CartView\.vue/);
  assert.match(routerSource, /resolveCheckoutAccess\(useCartState\(\)\.itemCount\.value\)/);
});

test("Cart view 由 service 投影資料且不直接存取 storage 或寫死交易金額", () => {
  assert.match(viewSource, /getCartRows\(locale\.value, items\.value\)/);
  assert.match(viewSource, /getShippingMethods\(locale\.value\)/);
  assert.match(viewSource, /updateQuantity/);
  assert.match(viewSource, /@input="changeQuantityFromInput\(row, \$event\)"/);
  assert.match(viewSource, /removeItem/);
  assert.match(viewSource, /setShippingMethod/);
  assert.doesNotMatch(viewSource, /localStorage|sessionStorage/);
  assert.doesNotMatch(viewSource, /\b2999\b|\b150\b|\b70\b/);
});

test("Cart 所有主要狀態具備完整雙語文字", () => {
  const requiredKeys = [
    "title",
    "description",
    "guardNotice",
    "storageError",
    "shippingTitle",
    "subtotal",
    "shippingFee",
    "total",
    "checkout",
    "emptyTitle",
    "emptyBody",
    "emptyAction",
  ];

  for (const key of requiredKeys) {
    assert.equal(typeof chinese[key], "string", `missing zh-TW cart.${key}`);
    assert.equal(typeof english[key], "string", `missing en cart.${key}`);
    assert.ok(chinese[key]);
    assert.ok(english[key]);
  }
});

test("Cart 頁面樣式由 main.scss 的 page boundary 匯出", () => {
  assert.match(mainStyleSource, /@use "page\/cart";/);
});

test("配送 radio 將 focus-visible 投影到可見的外層控制", () => {
  assert.match(cartStyleSource, /\.cart-shipping > label:has\(> input:focus-visible\)/);
});

test("同商品不同規格具有唯一的列名稱與控制 accessible name", () => {
  assert.match(viewSource, /:aria-labelledby="`cart-item-title-/);
  assert.match(viewSource, /<h3>/);
  assert.equal(viewSource.match(/variant: row\.variantLabel/g)?.length, 4);
  assert.match(chinese.decreaseQuantity, /\{variant\}/);
  assert.match(english.decreaseQuantity, /\{variant\}/);
});

test("英文 Cart 件數使用 Vue I18n 單複數格式", () => {
  assert.equal(english.itemCount, "{count} item | {count} items");
  assert.match(viewSource, /t\("cart\.itemCount", itemCount\)/);
});
