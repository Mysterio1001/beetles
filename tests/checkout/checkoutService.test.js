import test from "node:test";
import assert from "node:assert/strict";

import { convenienceStoreRecords, paymentMethodRecords } from "../../src/mocks/checkout.js";
import {
  createCheckoutForm,
  createMockOrder,
  createMockOrderId,
  getConvenienceStores,
  getMemberCheckoutPrefill,
  getPaymentMethods,
  validateCheckoutForm,
} from "../../src/services/checkoutService.js";

function validForm(overrides = {}) {
  return {
    ...createCheckoutForm(),
    recipientName: "王小明",
    phone: "0912345678",
    storeId: "seven-eleven-da-an",
    paymentMethodId: "bank-transfer",
    ...overrides,
  };
}

test("超商門市與付款方式由集中 Mock data 提供並支援英文回退", () => {
  assert.equal(convenienceStoreRecords.length, 4);
  assert.equal(paymentMethodRecords.length, 2);
  assert.deepEqual(
    getConvenienceStores("seven-eleven", "en").map(({ id, provider }) => ({ id, provider })),
    [
      { id: "seven-eleven-da-an", provider: "seven-eleven" },
      { id: "seven-eleven-xinyi", provider: "seven-eleven" },
    ],
  );
  assert.deepEqual(
    getConvenienceStores("familymart", "ja").map((store) => store.label),
    ["FamilyMart Yongye Store", "FamilyMart Xinyi Store"],
  );
  assert.deepEqual(
    getPaymentMethods("en").map((method) => method.id),
    ["bank-transfer", "credit-card"],
  );
});

test("會員帶入會複製姓名、電話與完整地址，不修改 frozen member DTO", () => {
  const member = Object.freeze({
    name: "甲蟲羽錄 Demo",
    phone: "0912345678",
    address: Object.freeze({ city: "臺北市", district: "大安區", detail: "測試路 1 號" }),
  });

  const prefill = getMemberCheckoutPrefill(member);
  prefill.address.detail = "已修改的收件地址";

  assert.deepEqual(member.address, {
    city: "臺北市",
    district: "大安區",
    detail: "測試路 1 號",
  });
  assert.deepEqual(prefill, {
    recipientName: "甲蟲羽錄 Demo",
    phone: "0912345678",
    address: { city: "臺北市", district: "大安區", detail: "已修改的收件地址" },
  });
});

test("姓名與 10 位數電話在所有配送方式都必填", () => {
  const result = validateCheckoutForm(createCheckoutForm(), {
    shippingMethodId: "pickup",
    now: new Date("2026-08-02T00:00:00+08:00"),
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, {
    recipientName: "required",
    phone: "invalid",
  });

  const mixedPhone = validateCheckoutForm(validForm({ phone: "0912345678abc", storeId: "" }), {
    shippingMethodId: "pickup",
  });
  assert.equal(mixedPhone.errors.phone, "invalid");
});

test("黑貓要求完整地址，自取不要求地址或門市", () => {
  const incompleteAddress = validateCheckoutForm(validForm({ storeId: "" }), {
    shippingMethodId: "black-cat",
  });
  assert.equal(incompleteAddress.valid, false);
  assert.deepEqual(incompleteAddress.errors, {
    addressCity: "required",
    addressDistrict: "required",
    addressDetail: "required",
  });

  const pickup = validateCheckoutForm(validForm({ storeId: "" }), {
    shippingMethodId: "pickup",
  });
  assert.equal(pickup.valid, true);
});

test("7-ELEVEN 與全家只接受對應 provider 的 Mock 門市", () => {
  const missing = validateCheckoutForm(validForm({ storeId: "" }), {
    shippingMethodId: "seven-eleven",
  });
  assert.equal(missing.errors.storeId, "required");

  const wrongProvider = validateCheckoutForm(validForm({ storeId: "familymart-yongye" }), {
    shippingMethodId: "seven-eleven",
  });
  assert.equal(wrongProvider.errors.storeId, "invalid");

  const correctProvider = validateCheckoutForm(validForm({ storeId: "familymart-yongye" }), {
    shippingMethodId: "familymart",
  });
  assert.equal(correctProvider.valid, true);
});

test("銀行轉帳不要求卡片欄位，信用卡要求完整且未過期的欄位", () => {
  const bankTransfer = validateCheckoutForm(validForm(), {
    shippingMethodId: "seven-eleven",
    now: new Date("2026-08-02T00:00:00+08:00"),
  });
  assert.equal(bankTransfer.valid, true);

  const emptyCard = validateCheckoutForm(validForm({ paymentMethodId: "credit-card" }), {
    shippingMethodId: "seven-eleven",
    now: new Date("2026-08-02T00:00:00+08:00"),
  });
  assert.deepEqual(emptyCard.errors, {
    cardholderName: "required",
    cardNumber: "invalid",
    expiry: "invalid",
    securityCode: "invalid",
  });

  const expiredCard = validateCheckoutForm(
    validForm({
      paymentMethodId: "credit-card",
      card: {
        cardholderName: "WANG HSIAO MING",
        cardNumber: "4111 1111 1111 1111",
        expiryMonth: "07",
        expiryYear: "2026",
        securityCode: "123",
      },
    }),
    { shippingMethodId: "seven-eleven", now: new Date("2026-08-02T00:00:00+08:00") },
  );
  assert.equal(expiredCard.errors.expiry, "expired");

  const validCard = validateCheckoutForm(
    validForm({
      paymentMethodId: "credit-card",
      card: {
        cardholderName: "WANG HSIAO MING",
        cardNumber: "4111 1111 1111 1111",
        expiryMonth: "08",
        expiryYear: "2026",
        securityCode: "123",
      },
    }),
    { shippingMethodId: "seven-eleven", now: new Date("2026-08-02T00:00:00+08:00") },
  );
  assert.equal(validCard.valid, true);
  assert.equal(validCard.normalized.card.cardNumber, "4111111111111111");
});

test("信用卡欄位不得藉由刪除英文字母後通過數字格式驗證", () => {
  const result = validateCheckoutForm(
    validForm({
      paymentMethodId: "credit-card",
      card: {
        cardholderName: "TEST USER",
        cardNumber: "4111111111111111abc",
        expiryMonth: "a8",
        expiryYear: "20x30",
        securityCode: "1a2b3",
      },
    }),
    { shippingMethodId: "seven-eleven", now: new Date("2026-08-02T00:00:00+08:00") },
  );

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, {
    cardNumber: "invalid",
    expiry: "invalid",
    securityCode: "invalid",
  });
});

test("信用卡到期依使用者本地曆月判斷，不使用 UTC 月份", () => {
  const localSeptemberUtcAugustClock = {
    getFullYear: () => 2026,
    getMonth: () => 8,
    getUTCFullYear: () => 2026,
    getUTCMonth: () => 7,
  };
  const result = validateCheckoutForm(
    validForm({
      paymentMethodId: "credit-card",
      card: {
        cardholderName: "TEST USER",
        cardNumber: "4111111111111111",
        expiryMonth: "08",
        expiryYear: "2026",
        securityCode: "123",
      },
    }),
    {
      shippingMethodId: "seven-eleven",
      now: localSeptemberUtcAugustClock,
    },
  );

  assert.equal(result.errors.expiry, "expired");
});

test("沒有 crypto.randomUUID 時，同毫秒建立的 Mock order id 仍保持唯一", () => {
  const ids = new Set(
    Array.from({ length: 100 }, () =>
      createMockOrderId(new Date("2026-08-02T12:00:00+08:00"), {
        uuidFactory: null,
        nowFactory: () => 1785643200000,
      }),
    ),
  );

  assert.equal(ids.size, 100);
  for (const id of ids) assert.match(id, /^BT-20260802-/);
});

test("Mock order snapshot 只保留完成頁與摘要需要的非敏感資料", () => {
  const order = createMockOrder({
    id: "BT-20260802-ABC123",
    createdAt: new Date("2026-08-02T12:00:00+08:00"),
    checkout: validForm({
      recipientName: "王小明",
      phone: "0912345678",
      paymentMethodId: "credit-card",
      card: {
        cardholderName: "WANG HSIAO MING",
        cardNumber: "4111111111111111",
        expiryMonth: "08",
        expiryYear: "2027",
        securityCode: "123",
      },
    }),
    rows: [
      {
        productId: "giraffe-stag-nishiyamai",
        variantId: "105-plus",
        quantity: 1,
        price: 2999,
        lineTotal: 2999,
      },
    ],
    shippingMethodId: "seven-eleven",
    paymentMethodId: "credit-card",
    totals: { subtotal: 2999, shippingFee: 70, total: 3069 },
  });

  assert.deepEqual(order, {
    id: "BT-20260802-ABC123",
    createdAt: "2026-08-02T04:00:00.000Z",
    items: [
      {
        productId: "giraffe-stag-nishiyamai",
        variantId: "105-plus",
        quantity: 1,
        price: 2999,
        lineTotal: 2999,
      },
    ],
    shippingMethodId: "seven-eleven",
    paymentMethodId: "credit-card",
    subtotal: 2999,
    shippingFee: 70,
    total: 3069,
  });
  assert.doesNotMatch(JSON.stringify(order), /4111111111111111|0912345678|securityCode|expiry/);
});
