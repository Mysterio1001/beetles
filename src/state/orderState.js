import { computed, reactive } from "vue";

import { getCartRows } from "../services/cartService.js";
import {
  createMockOrder,
  createMockOrderId,
  validateCheckoutForm,
} from "../services/checkoutService.js";

export function createOrderStore({
  idFactory = createMockOrderId,
  nowProvider = () => new Date(),
} = {}) {
  const state = reactive({
    currentOrder: null,
    placing: false,
  });
  const currentOrder = computed(() => state.currentOrder);
  const hasCurrentOrder = computed(() => Boolean(state.currentOrder));
  const isPlacing = computed(() => state.placing);

  function placeOrder({ form, cart } = {}) {
    if (state.placing) return { ok: false, reason: "inProgress" };
    if (state.currentOrder) return { ok: false, reason: "alreadyPlaced" };
    if (!cart || cart.itemCount.value < 1) return { ok: false, reason: "emptyCart" };

    state.placing = true;

    try {
      const now = nowProvider();
      const validation = validateCheckoutForm(form, {
        shippingMethodId: cart.shippingMethodId.value,
        now,
      });
      if (!validation.valid) {
        return { ok: false, reason: "validation", errors: validation.errors };
      }

      const rows = getCartRows("en", cart.items.value);
      const order = createMockOrder({
        id: idFactory(now),
        createdAt: now,
        rows,
        shippingMethodId: cart.shippingMethodId.value,
        paymentMethodId: validation.normalized.paymentMethodId,
        totals: {
          subtotal: cart.subtotal.value,
          shippingFee: cart.shippingFee.value,
          total: cart.total.value,
        },
      });

      if (!cart.clear()) return { ok: false, reason: "cartClearFailed" };

      state.currentOrder = order;
      return { ok: true, order };
    } finally {
      state.placing = false;
    }
  }

  function clearCurrentOrder() {
    state.currentOrder = null;
  }

  return {
    currentOrder,
    hasCurrentOrder,
    isPlacing,
    placeOrder,
    clearCurrentOrder,
  };
}

const orderStore = createOrderStore();

export function useOrderState() {
  return orderStore;
}
