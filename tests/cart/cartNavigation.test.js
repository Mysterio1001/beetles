import test from "node:test";
import assert from "node:assert/strict";

import {
  EMPTY_CART_NOTICE_CODE,
  isEmptyCartNotice,
  resolveCheckoutAccess,
} from "../../src/router/cartNavigation.js";

test("非空購物車允許訪客與會員進入 checkout", () => {
  assert.equal(resolveCheckoutAccess(1), true);
  assert.equal(resolveCheckoutAccess(6), true);
});

test("空購物車 checkout guard 返回 Cart 並附帶一次性雙語提示代碼", () => {
  assert.equal(EMPTY_CART_NOTICE_CODE, "empty-cart");
  assert.deepEqual(resolveCheckoutAccess(0), {
    name: "cart",
    query: { notice: EMPTY_CART_NOTICE_CODE },
    replace: true,
  });
  assert.deepEqual(resolveCheckoutAccess(-1), {
    name: "cart",
    query: { notice: EMPTY_CART_NOTICE_CODE },
    replace: true,
  });
});

test("Cart 只消費 guard 定義的提示代碼", () => {
  assert.equal(isEmptyCartNotice(EMPTY_CART_NOTICE_CODE), true);
  assert.equal(isEmptyCartNotice([EMPTY_CART_NOTICE_CODE]), true);
  assert.equal(isEmptyCartNotice("unknown"), false);
  assert.equal(isEmptyCartNotice(undefined), false);
});
