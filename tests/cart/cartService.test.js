import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_SHIPPING_METHOD_ID, shippingMethodRecords } from "../../src/mocks/shipping.js";
import {
  calculateCartTotals,
  getCartRows,
  getShippingMethods,
} from "../../src/services/cartService.js";

const items = [
  {
    productId: "giraffe-stag-nishiyamai",
    variantId: "105-plus",
    quantity: 2,
  },
  {
    productId: "giraffe-stag-nishiyamai",
    variantId: "101-plus",
    quantity: 3,
  },
];

test("配送 Mock 集中提供舊版四種方式、穩定 id 與整數運費", () => {
  assert.equal(DEFAULT_SHIPPING_METHOD_ID, "seven-eleven");
  assert.deepEqual(
    shippingMethodRecords.map(({ id, fee }) => ({ id, fee })),
    [
      { id: "seven-eleven", fee: 70 },
      { id: "familymart", fee: 70 },
      { id: "black-cat", fee: 150 },
      { id: "pickup", fee: 0 },
    ],
  );
  assert.ok(shippingMethodRecords.every((method) => Number.isInteger(method.fee)));
});

test("配送方式完整支援雙語，未知語言回退英文", () => {
  const chinese = getShippingMethods("zh-TW");
  const english = getShippingMethods("en");
  const fallback = getShippingMethods("ja-JP");

  assert.deepEqual(
    chinese.map((method) => method.label),
    ["7-ELEVEN 超商取貨", "全家超商取貨", "黑貓宅急便", "自行取貨"],
  );
  assert.ok(english.every((method) => method.label));
  assert.deepEqual(fallback, english);
});

test("Cart rows 由集中商品資料投影目前語言、規格、單價與列小計", () => {
  const chineseRows = getCartRows("zh-TW", items);
  const englishRows = getCartRows("en", items);

  assert.equal(chineseRows.length, 2);
  assert.equal(chineseRows[0].name, "長頸鹿鋸齒鍬形蟲・西山保典亞種");
  assert.equal(englishRows[0].name, "Giraffe Stag Beetle · Nishiyama Subspecies");
  assert.equal(chineseRows[0].variantLabel, "105 mm++");
  assert.equal(chineseRows[0].price, 2999);
  assert.equal(chineseRows[0].quantity, 2);
  assert.equal(chineseRows[0].lineTotal, 5998);
  assert.equal(chineseRows[0].to, "/beetle-shop/giraffe-stag-nishiyamai");
});

test("四種配送逐一產生正確商品小計、運費與總額", () => {
  assert.deepEqual(calculateCartTotals(items, "seven-eleven"), {
    subtotal: 14995,
    shippingFee: 70,
    total: 15065,
  });
  assert.deepEqual(calculateCartTotals(items, "familymart"), {
    subtotal: 14995,
    shippingFee: 70,
    total: 15065,
  });
  assert.deepEqual(calculateCartTotals(items, "black-cat"), {
    subtotal: 14995,
    shippingFee: 150,
    total: 15145,
  });
  assert.deepEqual(calculateCartTotals(items, "pickup"), {
    subtotal: 14995,
    shippingFee: 0,
    total: 14995,
  });
});

test("空購物車不收取運費且無效項目不計入金額", () => {
  assert.deepEqual(calculateCartTotals([], "black-cat"), {
    subtotal: 0,
    shippingFee: 0,
    total: 0,
  });
  assert.deepEqual(
    calculateCartTotals(
      [{ productId: "missing", variantId: "missing", quantity: 5 }],
      "seven-eleven",
    ),
    { subtotal: 0, shippingFee: 0, total: 0 },
  );
});
