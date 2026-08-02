import { computed, reactive } from "vue";

import { productRecords } from "../mocks/products.js";
import { DEFAULT_SHIPPING_METHOD_ID } from "../mocks/shipping.js";
import { calculateCartTotals, isShippingMethodId } from "../services/cartService.js";
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

function normalizeShippingMethodId(value) {
  return isShippingMethodId(value) ? value : DEFAULT_SHIPPING_METHOD_ID;
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
  const fallbackPayload = {
    version: CART_SCHEMA_VERSION,
    shippingMethodId: DEFAULT_SHIPPING_METHOD_ID,
    items: [],
  };
  const storedPayload = readStoredJson(storage, CART_STORAGE_KEY, fallbackPayload, isCartPayload);
  const initialItems = sanitizeCartItems(storedPayload.items, products);
  const initialShippingMethodId = normalizeShippingMethodId(storedPayload.shippingMethodId);
  const normalizedPayload = {
    version: CART_SCHEMA_VERSION,
    shippingMethodId: initialShippingMethodId,
    items: initialItems,
  };

  if (JSON.stringify(storedPayload) !== JSON.stringify(normalizedPayload)) {
    writeStoredJson(storage, CART_STORAGE_KEY, normalizedPayload);
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const state = reactive({
    items: initialItems,
    shippingMethodId: initialShippingMethodId,
  });
  const items = computed(() => state.items);
  const itemCount = computed(() => state.items.reduce((total, item) => total + item.quantity, 0));
  const shippingMethodId = computed(() => state.shippingMethodId);
  const totals = computed(() => calculateCartTotals(state.items, state.shippingMethodId, products));
  const subtotal = computed(() => totals.value.subtotal);
  const shippingFee = computed(() => totals.value.shippingFee);
  const total = computed(() => totals.value.total);

  function persist(nextItems = state.items, nextShippingMethodId = state.shippingMethodId) {
    return writeStoredJson(storage, CART_STORAGE_KEY, {
      version: CART_SCHEMA_VERSION,
      shippingMethodId: nextShippingMethodId,
      items: nextItems.map((item) => ({ ...item })),
    });
  }

  function commitItems(nextItems) {
    if (!persist(nextItems)) return false;
    state.items.splice(0, state.items.length, ...nextItems);
    return true;
  }

  function addItem({ productId, variantId, quantity = 1 } = {}) {
    const product = productsById.get(productId);
    const variantExists = product?.variants?.some((variant) => variant.id === variantId);
    if (!product || product.availability !== "available" || !variantExists) return false;

    const normalizedQuantity = normalizeCartQuantity(quantity);
    const nextItems = state.items.map((item) => ({ ...item }));
    const existingItem = nextItems.find(
      (item) => item.productId === productId && item.variantId === variantId,
    );

    if (existingItem) existingItem.quantity += normalizedQuantity;
    else nextItems.push({ productId, variantId, quantity: normalizedQuantity });
    return commitItems(nextItems);
  }

  function updateQuantity(productId, variantId, quantity) {
    const item = state.items.find(
      (candidate) => candidate.productId === productId && candidate.variantId === variantId,
    );
    if (!item) return false;

    const nextItems = state.items.map((candidate) => ({
      ...candidate,
      quantity:
        candidate.productId === productId && candidate.variantId === variantId
          ? normalizeCartQuantity(quantity)
          : candidate.quantity,
    }));
    return commitItems(nextItems);
  }

  function removeItem(productId, variantId) {
    const index = state.items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId,
    );
    if (index < 0) return false;

    const nextItems = state.items.filter((_, itemIndex) => itemIndex !== index);
    return commitItems(nextItems);
  }

  function clear() {
    if (!state.items.length) return true;
    return commitItems([]);
  }

  function setShippingMethod(methodId) {
    if (!isShippingMethodId(methodId)) return false;
    if (methodId === state.shippingMethodId) return true;
    if (!persist(state.items, methodId)) return false;
    state.shippingMethodId = methodId;
    return true;
  }

  return {
    items,
    itemCount,
    shippingMethodId,
    subtotal,
    shippingFee,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    setShippingMethod,
  };
}

const cartStore = createCartStore();

export function useCartState() {
  return cartStore;
}
