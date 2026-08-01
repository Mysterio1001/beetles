import test from "node:test";
import assert from "node:assert/strict";

import { clearStoredValue, readStoredJson, writeStoredJson } from "../../src/utils/safeStorage.js";

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

test("有效 JSON 資料可以安全寫入並讀回", () => {
  const storage = createMemoryStorage();
  const value = { locale: "zh-TW", count: 2 };

  assert.equal(writeStoredJson(storage, "settings", value), true);
  assert.deepEqual(
    readStoredJson(storage, "settings", {}, (data) => data.count > 0),
    value,
  );
});

test("損壞的 JSON 會清除並回傳 fallback", () => {
  const storage = createMemoryStorage({ cart: "{broken" });
  const fallback = [];

  assert.equal(readStoredJson(storage, "cart", fallback, Array.isArray), fallback);
  assert.equal(storage.getItem("cart"), null);
});

test("不符合 schema 的資料會清除並回傳 fallback", () => {
  const storage = createMemoryStorage({ cart: JSON.stringify({ items: [] }) });
  const fallback = [];

  assert.equal(readStoredJson(storage, "cart", fallback, Array.isArray), fallback);
  assert.equal(storage.getItem("cart"), null);
});

test("clearStoredValue 會移除指定資料", () => {
  const storage = createMemoryStorage({ locale: "zh-TW" });

  assert.equal(clearStoredValue(storage, "locale"), true);
  assert.equal(storage.getItem("locale"), null);
});
