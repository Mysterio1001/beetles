import { computed, reactive } from "vue";

import { productRecords } from "../mocks/products.js";
import { readStoredJson, writeStoredJson } from "../utils/safeStorage.js";

export const CART_STORAGE_KEY = "beetles.cart.v1";
const CART_SCHEMA_VERSION = 1;

function getBrowserStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function isCartPayload(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.version === CART_SCHEMA_VERSION &&
    Array.isArray(value.items)
  );
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function normalizeCartQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

export function sanitizeCartItems(items, products = productRecords) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const normalizedItems = [];

  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item !== "object") continue;
    const product = productsById.get(item.productId);
    const variantExists = product?.variants?.some((variant) => variant.id === item.variantId);
    if (!product || !variantExists || !isPositiveInteger(item.quantity)) continue;

    const existingItem = normalizedItems.find(
      (candidate) =>
        candidate.productId === item.productId && candidate.variantId === item.variantId,
    );
    if (existingItem) existingItem.quantity += item.quantity;
    else {
      normalizedItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      });
    }
  }

  return normalizedItems;
}

export function createCartStore({ storage = getBrowserStorage(), products = productRecords } = {}) {
  const fallbackPayload = { version: CART_SCHEMA_VERSION, items: [] };
  const storedPayload = readStoredJson(storage, CART_STORAGE_KEY, fallbackPayload, isCartPayload);
  const initialItems = sanitizeCartItems(storedPayload.items, products);
  const normalizedPayload = { version: CART_SCHEMA_VERSION, items: initialItems };

  if (JSON.stringify(storedPayload) !== JSON.stringify(normalizedPayload)) {
    writeStoredJson(storage, CART_STORAGE_KEY, normalizedPayload);
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const state = reactive({ items: initialItems });
  const items = computed(() => state.items);
  const itemCount = computed(() => state.items.reduce((total, item) => total + item.quantity, 0));

  function persist() {
    return writeStoredJson(storage, CART_STORAGE_KEY, {
      version: CART_SCHEMA_VERSION,
      items: state.items.map((item) => ({ ...item })),
    });
  }

  function addItem({ productId, variantId, quantity = 1 } = {}) {
    const product = productsById.get(productId);
    const variantExists = product?.variants?.some((variant) => variant.id === variantId);
    if (!product || product.availability !== "available" || !variantExists) return false;

    const normalizedQuantity = normalizeCartQuantity(quantity);
    const existingItem = state.items.find(
      (item) => item.productId === productId && item.variantId === variantId,
    );

    if (existingItem) existingItem.quantity += normalizedQuantity;
    else state.items.push({ productId, variantId, quantity: normalizedQuantity });
    persist();
    return true;
  }

  function updateQuantity(productId, variantId, quantity) {
    const item = state.items.find(
      (candidate) => candidate.productId === productId && candidate.variantId === variantId,
    );
    if (!item) return false;

    item.quantity = normalizeCartQuantity(quantity);
    persist();
    return true;
  }

  function removeItem(productId, variantId) {
    const index = state.items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId,
    );
    if (index < 0) return false;

    state.items.splice(index, 1);
    persist();
    return true;
  }

  function clear() {
    state.items.splice(0);
    persist();
  }

  return {
    items,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };
}

const cartStore = createCartStore();

export function useCartState() {
  return cartStore;
}
