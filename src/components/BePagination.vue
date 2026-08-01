<template>
  <nav
    v-if="pageCount > 1"
    class="be-pagination"
    :aria-label="t('common.pageStatus', { current: modelValue, total: pageCount })">
    <span class="be-pagination__total">{{ t("common.totalResults", { total }) }}</span>
    <button
      type="button"
      :disabled="modelValue <= 1"
      :aria-label="t('common.previousPage')"
      @click="selectPage(modelValue - 1)">
      <ChevronLeft aria-hidden="true" />
    </button>
    <button
      v-for="page in visiblePages"
      :key="page"
      type="button"
      :class="{ 'is-current': page === modelValue }"
      :aria-current="page === modelValue ? 'page' : undefined"
      @click="selectPage(page)">
      {{ page }}
    </button>
    <button
      type="button"
      :disabled="modelValue >= pageCount"
      :aria-label="t('common.nextPage')"
      @click="selectPage(modelValue + 1)">
      <ChevronRight aria-hidden="true" />
    </button>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  pageSize: { type: Number, default: 9 },
  siblingCount: { type: Number, default: 2 },
});

const emit = defineEmits(["update:modelValue", "change"]);
const { t } = useI18n();
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const visiblePages = computed(() => {
  const start = Math.max(1, props.modelValue - props.siblingCount);
  const end = Math.min(pageCount.value, props.modelValue + props.siblingCount);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

function selectPage(page) {
  const safePage = Math.min(pageCount.value, Math.max(1, page));
  if (safePage === props.modelValue) return;
  emit("update:modelValue", safePage);
  emit("change", safePage);
}
</script>

<style lang="scss" scoped>
.be-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.7rem;

  button {
    display: grid;
    place-items: center;
    min-width: 4rem;
    height: 4rem;
    padding: 0 0.8rem;
    border: 1px solid rgba(219, 255, 232, 0.2);
    border-radius: 1.2rem;
    background: rgba(230, 255, 239, 0.09);
    color: #effff5;
    cursor: pointer;
    transition:
      transform 160ms ease,
      background-color 160ms ease;

    &:hover:not(:disabled),
    &.is-current {
      background: rgba(158, 245, 188, 0.24);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    svg {
      width: 1.8rem;
    }
  }
}

.be-pagination__total {
  margin-right: 0.6rem;
  color: rgba(229, 255, 238, 0.68);
  font-size: 1.3rem;
}
</style>
