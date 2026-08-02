import test from "node:test";
import assert from "node:assert/strict";

import { createCheckoutForm } from "../../src/services/checkoutService.js";
import { createCartStore } from "../../src/state/cartState.js";
import { createOrderStore } from "../../src/state/orderState.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    dump() {
      return Object.fromEntries(values);
    },
  };
}

function validCheckout() {
  return {
    ...createCheckoutForm(),
    recipientName: "王小明",
    phone: "0912345678",
    storeId: "seven-eleven-da-an",
    paymentMethodId: "bank-transfer",
  };
}

function createNonEmptyCart(storage = createMemoryStorage()) {
  const cart = createCartStore({ storage });
  cart.addItem({
    productId: "giraffe-stag-nishiyamai",
    variantId: "105-plus",
    quantity: 1,
  });
  return cart;
}

test("成功只建立一筆唯一 Mock order 並在建立完成狀態前清空 Cart", () => {
  const cart = createNonEmptyCart();
  const orderStore = createOrderStore({
    idFactory: () => "BT-20260802-ABC123",
    nowProvider: () => new Date("2026-08-02T12:00:00+08:00"),
  });

  const result = orderStore.placeOrder({ form: validCheckout(), cart });

  assert.equal(result.ok, true);
  assert.equal(result.order.id, "BT-20260802-ABC123");
  assert.equal(result.order.total, 3069);
  assert.equal(cart.itemCount.value, 0);
  assert.equal(orderStore.currentOrder.value, result.order);
  assert.equal(orderStore.hasCurrentOrder.value, true);

  const duplicate = orderStore.placeOrder({ form: validCheckout(), cart });
  assert.deepEqual(duplicate, { ok: false, reason: "alreadyPlaced" });
  assert.equal(orderStore.currentOrder.value.id, "BT-20260802-ABC123");
});

test("驗證失敗保留 Cart 且不建立完成狀態", () => {
  const cart = createNonEmptyCart();
  const orderStore = createOrderStore();
  const form = validCheckout();
  form.phone = "123";

  const result = orderStore.placeOrder({ form, cart });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "validation");
  assert.equal(result.errors.phone, "invalid");
  assert.equal(cart.itemCount.value, 1);
  assert.equal(orderStore.currentOrder.value, null);
});

test("Cart clear 持久化失敗時不得建立訂單或完成狀態", () => {
  const memory = createMemoryStorage();
  let failWrites = false;
  const storage = {
    ...memory,
    setItem(key, value) {
      if (failWrites) throw new Error("storage unavailable");
      memory.setItem(key, value);
    },
  };
  const cart = createNonEmptyCart(storage);
  failWrites = true;
  const orderStore = createOrderStore({ idFactory: () => "MUST-NOT-COMMIT" });

  const result = orderStore.placeOrder({ form: validCheckout(), cart });

  assert.deepEqual(result, { ok: false, reason: "cartClearFailed" });
  assert.equal(cart.itemCount.value, 1);
  assert.equal(orderStore.currentOrder.value, null);
  assert.equal(orderStore.hasCurrentOrder.value, false);
});

test("空 Cart 不建立訂單，完成狀態可明確清除且完全不使用 storage", () => {
  const storage = createMemoryStorage();
  const cart = createCartStore({ storage });
  const orderStore = createOrderStore({ idFactory: () => "BT-20260802-ABC123" });

  assert.deepEqual(orderStore.placeOrder({ form: validCheckout(), cart }), {
    ok: false,
    reason: "emptyCart",
  });

  const filledCart = createNonEmptyCart(storage);
  assert.equal(orderStore.placeOrder({ form: validCheckout(), cart: filledCart }).ok, true);
  orderStore.clearCurrentOrder();

  assert.equal(orderStore.currentOrder.value, null);
  assert.equal(orderStore.hasCurrentOrder.value, false);
  assert.equal(Object.keys(storage.dump()).length, 1);
  assert.match(Object.keys(storage.dump())[0], /^beetles\.cart\./);
});
