import { computed, readonly, reactive } from "vue";

const state = reactive({ items: [] });
const itemCount = computed(() =>
  state.items.reduce((total, item) => total + Number(item.quantity || 0), 0),
);

export function useCartState() {
  return {
    items: readonly(state.items),
    itemCount,
  };
}
