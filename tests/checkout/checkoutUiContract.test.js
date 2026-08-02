import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const routerSource = read("../../src/router/index.js");
const checkoutSource = read("../../src/views/checkout/CheckoutView.vue");
const completeSource = read("../../src/views/order/OrderCompleteView.vue");
const orderStateSource = read("../../src/state/orderState.js");
const mainStyleSource = read("../../src/style/main.scss");
const chinese = JSON.parse(read("../../src/locale/i18n/zh_tw/checkout.json"));
const english = JSON.parse(read("../../src/locale/i18n/en/checkout.json"));

test("Checkout 與 Order Complete routes 使用正式頁面與完成狀態 guard", () => {
  assert.match(routerSource, /views\/checkout\/CheckoutView\.vue/);
  assert.match(routerSource, /views\/order\/OrderCompleteView\.vue/);
  assert.match(
    routerSource,
    /resolveOrderCompleteAccess\(useOrderState\(\)\.currentOrder\.value\)/,
  );
});

test("Checkout 只消費集中 service、store 與 Cart projection，不直接保存表單或寫死資料", () => {
  assert.match(checkoutSource, /getConvenienceStores/);
  assert.match(checkoutSource, /getPaymentMethods/);
  assert.match(checkoutSource, /getCartRows/);
  assert.match(checkoutSource, /getMemberCheckoutPrefill/);
  assert.match(checkoutSource, /placeOrder/);
  assert.doesNotMatch(checkoutSource, /localStorage|sessionStorage/);
  assert.doesNotMatch(checkoutSource, /seven-eleven-da-an|familymart-yongye|\b2999\b|\b3069\b/);
  assert.doesNotMatch(
    orderStateSource,
    /localStorage|sessionStorage|writeStoredJson|readStoredJson/,
  );
});

test("信用卡欄位具有對應 autocomplete，完成頁離開時清除 timer 與 current order", () => {
  assert.match(checkoutSource, /autocomplete="cc-name"/);
  assert.match(checkoutSource, /autocomplete="cc-number"/);
  assert.match(checkoutSource, /autocomplete="cc-exp-month"/);
  assert.match(checkoutSource, /autocomplete="cc-exp-year"/);
  assert.match(checkoutSource, /autocomplete="cc-csc"/);
  assert.match(completeSource, /clearInterval/);
  assert.match(completeSource, /onBeforeRouteLeave/);
  assert.match(completeSource, /clearCurrentOrder/);
});

test("Checkout ���完成頁的主要狀態具有完整雙語文字", () => {
  const requiredKeys = [
    "title",
    "memberPrefill",
    "recipientName",
    "phone",
    "addressTitle",
    "storeTitle",
    "paymentTitle",
    "cardNumber",
    "submit",
    "summaryTitle",
    "completeTitle",
    "orderNumber",
    "countdown",
    "returnHome",
  ];

  for (const key of requiredKeys) {
    assert.equal(typeof chinese[key], "string", `missing zh-TW checkout.${key}`);
    assert.equal(typeof english[key], "string", `missing en checkout.${key}`);
    assert.ok(chinese[key]);
    assert.ok(english[key]);
  }
});

test("Checkout 與 Order Complete 頁面樣式由 main.scss page boundary 匯出", () => {
  assert.match(mainStyleSource, /@use "page\/checkout";/);
  assert.match(mainStyleSource, /@use "page\/orderComplete";/);
});
