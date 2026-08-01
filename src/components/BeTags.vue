<template>
  <div class="be-tags">
    <ul>
      <li
        v-for="(tag, index) in data"
        :key="tag.value ?? index">
        <button
          type="button"
          :class="{
            'is-selected': isSelected(index),
            'is-responsive': responsive,
          }"
          :disabled="disabledIndices.includes(index)"
          :aria-pressed="isSelected(index)"
          @click="selectTag(index)">
          <span>{{ tag.label }}</span>
          <component
            :is="tag.icon"
            v-if="tag.icon"
            aria-hidden="true" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  data: { type: Array, default: () => [] },
  option: { type: Object, default: () => ({}) },
  responsive: { type: Boolean, default: true },
});

const emit = defineEmits(["tagsClick", "ready"]);
const selected = ref([]);
const disabledIndices = computed(() =>
  Array.isArray(props.option.disableTagNo)
    ? props.option.disableTagNo.map((number) => number - 1)
    : [],
);

function isSelected(index) {
  return props.option.multiple ? selected.value.includes(index) : selected.value === index;
}

function selectTag(index) {
  if (disabledIndices.value.includes(index)) return;

  if (props.option.multiple) {
    const next = [...selected.value];
    const selectedIndex = next.indexOf(index);
    if (selectedIndex >= 0) next.splice(selectedIndex, 1);
    else next.push(index);
    selected.value = next;
    emit(
      "tagsClick",
      next.map((itemIndex) => props.data[itemIndex]?.value),
    );
    return;
  }

  selected.value = index;
  emit("tagsClick", props.data[index]?.value);
}

watch(
  () => props.option,
  (option) => {
    if (option.multiple) {
      selected.value = (option.selectedTagNo || []).map((number) => number - 1);
      emit(
        "ready",
        selected.value.map((index) => props.data[index]?.value),
      );
      return;
    }

    const index = Number(option.selectedTagNo || 0) - 1;
    selected.value = index;
    if (index >= 0) emit("ready", props.data[index]?.value);
  },
  { deep: true, immediate: true },
);
</script>

<style lang="scss" scoped>
.be-tags ul {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.be-tags button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  min-height: 4.4rem;
  padding: 0.8rem 1.6rem;
  border: 1px solid rgba(216, 255, 230, 0.2);
  border-radius: 999px;
  background: rgba(229, 255, 238, 0.09);
  color: rgba(240, 255, 246, 0.76);
  cursor: pointer;
  transition:
    transform 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    background-color 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    color: #fff;
    border-color: rgba(216, 255, 230, 0.38);
  }

  &.is-selected {
    background: rgba(152, 240, 183, 0.24);
    border-color: rgba(180, 255, 205, 0.5);
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 1.8rem;
  }
}

@media (max-width: 560px) {
  .be-tags button.is-responsive {
    width: 4.8rem;
    padding: 0;

    span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    svg {
      width: 2.1rem;
    }
  }
}
</style>
