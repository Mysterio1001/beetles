import test from "node:test";
import assert from "node:assert/strict";

import {
  CART_STORAGE_KEY,
  createCartStore,
  normalizeCartQuantity,
} from "../../src/state/cartState.js";

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
