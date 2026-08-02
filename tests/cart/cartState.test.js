import test from "node:test";
import assert from "node:assert/strict";

import {
  CART_STORAGE_KEY,
  createCartStore,
  normalizeCartQuantity,
} from "../../src/state/cartState.js";
import { DEFAULT_SHIPPING_METHOD_ID } from "../../src/mocks/shipping.js";

function createMemoryStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test("商品數量正規化為至少 1 的正整數", () => {
  assert.equal(normalizeCartQuantity(0), 1);
  assert.equal(normalizeCartQuantity(-5), 1);
  assert.equal(normalizeCartQuantity("3.9"), 3);
  assert.equal(normalizeCartQuantity("invalid"), 1);
});

test("相同商品與規格合併數量，不同規格保留獨立列", () => {
  const store = createCartStore({ storage: createMemoryStorage() });

  assert.equal(
    store.addItem({ productId: "giraffe-stag-nishiyamai", variantId: "105-plus", quantity: 2 }),
    true,
  );
  assert.equal(
    store.addItem({ productId: "giraffe-stag-nishiyamai", variantId: "105-plus", quantity: 3 }),
    true,
  );
  assert.equal(
    store.addItem({ productId: "giraffe-stag-nishiyamai", variantId: "101-plus", quantity: 1 }),
    true,
  );

  assert.equal(store.items.value.length, 2);
  assert.equal(store.items.value[0].quantity, 5);
  assert.equal(store.itemCount.value, 6);
});

test("購物車可由相同 storage 重新建立並保留最小持久化資料", () => {
  const storage = createMemoryStorage();
  const firstStore = createCartStore({ storage });
  firstStore.addItem({
    productId: "giraffe-stag-nishiyamai",
    variantId: "97-plus",
    quantity: 2,
  });

  const secondStore = createCartStore({ storage });
  assert.deepEqual(secondStore.items.value, [
    { productId: "giraffe-stag-nishiyamai", variantId: "97-plus", quantity: 2 },
  ]);
  assert.deepEqual(JSON.parse(storage.getItem(CART_STORAGE_KEY)), {
    version: 1,
    shippingMethodId: DEFAULT_SHIPPING_METHOD_ID,
    items: [{ productId: "giraffe-stag-nishiyamai", variantId: "97-plus", quantity: 2 }],
  });
});

test("損壞 schema、未知商品與未知規格會安全清理", () => {
  const brokenStorage = createMemoryStorage({ [CART_STORAGE_KEY]: "{broken" });
  const brokenStore = createCartStore({ storage: brokenStorage });
  assert.deepEqual(brokenStore.items.value, []);
  assert.equal(brokenStorage.getItem(CART_STORAGE_KEY), null);

  const invalidSchemaStorage = createMemoryStorage({
    [CART_STORAGE_KEY]: JSON.stringify({ items: [] }),
  });
  const invalidSchemaStore = createCartStore({ storage: invalidSchemaStorage });
  assert.deepEqual(invalidSchemaStore.items.value, []);
  assert.equal(invalidSchemaStorage.getItem(CART_STORAGE_KEY), null);

  const unknownStorage = createMemoryStorage({
    [CART_STORAGE_KEY]: JSON.stringify({
      version: 1,
      items: [
        { productId: "missing-product", variantId: "105-plus", quantity: 2 },
        {
          productId: "giraffe-stag-nishiyamai",
          variantId: "missing-variant",
          quantity: 1,
        },
      ],
    }),
  });
  const unknownStore = createCartStore({ storage: unknownStorage });
  assert.deepEqual(unknownStore.items.value, []);
  assert.deepEqual(JSON.parse(unknownStorage.getItem(CART_STORAGE_KEY)), {
    version: 1,
    shippingMethodId: DEFAULT_SHIPPING_METHOD_ID,
    items: [],
  });
});

test("售完商品與不存在規格不得加入購物車", () => {
  const store = createCartStore({ storage: createMemoryStorage() });

  assert.equal(
    store.addItem({ productId: "hercules-kono-line", variantId: "default", quantity: 1 }),
    false,
  );
  assert.equal(
    store.addItem({
      productId: "giraffe-stag-nishiyamai",
      variantId: "does-not-exist",
      quantity: 1,
    }),
    false,
  );
  assert.equal(store.itemCount.value, 0);
});

test("Cart state 提供即時商品小計、運費、總額並持久化配送方式", () => {
  const storage = createMemoryStorage();
  const firstStore = createCartStore({ storage });
  firstStore.addItem({
    productId: "giraffe-stag-nishiyamai",
    variantId: "105-plus",
    quantity: 2,
  });

  assert.equal(firstStore.shippingMethodId.value, "seven-eleven");
  assert.equal(firstStore.subtotal.value, 5998);
  assert.equal(firstStore.shippingFee.value, 70);
  assert.equal(firstStore.total.value, 6068);

  assert.equal(firstStore.setShippingMethod("black-cat"), true);
  assert.equal(firstStore.shippingMethodId.value, "black-cat");
  assert.equal(firstStore.shippingFee.value, 150);
  assert.equal(firstStore.total.value, 6148);
  assert.equal(firstStore.setShippingMethod("missing"), false);
  assert.equal(firstStore.shippingMethodId.value, "black-cat");

  const secondStore = createCartStore({ storage });
  assert.equal(secondStore.shippingMethodId.value, "black-cat");
  assert.equal(secondStore.total.value, 6148);
  assert.deepEqual(JSON.parse(storage.getItem(CART_STORAGE_KEY)), {
    version: 1,
    shippingMethodId: "black-cat",
    items: [
      {
        productId: "giraffe-stag-nishiyamai",
        variantId: "105-plus",
        quantity: 2,
      },
    ],
  });
});

test("數量更新、逐列移除與 clear 成功後可由相同 storage 重建", () => {
  const storage = createMemoryStorage();
  const store = createCartStore({ storage });
  store.addItem({
    productId: "giraffe-stag-nishiyamai",
    variantId: "105-plus",
    quantity: 2,
  });
  store.addItem({
    productId: "giraffe-stag-nishiyamai",
    variantId: "101-plus",
    quantity: 1,
  });

  assert.equal(store.updateQuantity("giraffe-stag-nishiyamai", "105-plus", 4), true);
  const afterUpdate = createCartStore({ storage });
  assert.deepEqual(afterUpdate.items.value, [
    { productId: "giraffe-stag-nishiyamai", variantId: "105-plus", quantity: 4 },
    { productId: "giraffe-stag-nishiyamai", variantId: "101-plus", quantity: 1 },
  ]);
  assert.equal(afterUpdate.itemCount.value, 5);
  assert.equal(afterUpdate.total.value, 15065);

  assert.equal(store.removeItem("giraffe-stag-nishiyamai", "101-plus"), true);
  const afterRemove = createCartStore({ storage });
  assert.deepEqual(afterRemove.items.value, [
    { productId: "giraffe-stag-nishiyamai", variantId: "105-plus", quantity: 4 },
  ]);
  assert.equal(afterRemove.itemCount.value, 4);

  assert.equal(store.clear(), true);
  const afterClear = createCartStore({ storage });
  assert.deepEqual(afterClear.items.value, []);
  assert.equal(afterClear.itemCount.value, 0);
  assert.equal(afterClear.shippingFee.value, 0);
  assert.equal(afterClear.total.value, 0);
});

test("Cart storage 寫入失敗時所有變更都回滾且不得回報成功", () => {
  const readableStorage = createMemoryStorage();
  let failWrites = false;
  const storage = {
    ...readableStorage,
    setItem(key, value) {
      if (failWrites) throw new Error("storage unavailable");
      readableStorage.setItem(key, value);
    },
  };
  const store = createCartStore({ storage });
  assert.equal(
    store.addItem({
      productId: "giraffe-stag-nishiyamai",
      variantId: "105-plus",
      quantity: 1,
    }),
    true,
  );
  failWrites = true;

  assert.equal(
    store.addItem({
      productId: "giraffe-stag-nishiyamai",
      variantId: "101-plus",
      quantity: 2,
    }),
    false,
  );
  assert.equal(store.updateQuantity("giraffe-stag-nishiyamai", "105-plus", 4), false);
  assert.equal(store.removeItem("giraffe-stag-nishiyamai", "105-plus"), false);
  assert.equal(store.setShippingMethod("pickup"), false);
  assert.equal(store.clear(), false);

  assert.deepEqual(store.items.value, [
    { productId: "giraffe-stag-nishiyamai", variantId: "105-plus", quantity: 1 },
  ]);
  assert.equal(store.shippingMethodId.value, DEFAULT_SHIPPING_METHOD_ID);
  assert.equal(store.itemCount.value, 1);
  assert.equal(store.total.value, 3069);
});
