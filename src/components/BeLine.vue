<template>
  <div
    :class="[
      'be-line',
      { vertical: direction === 'vertical' },
      { lightMode },
      { hasMargin: margin },
      { top: marginPosition === 'top' },
      { bottom: marginPosition === 'bottom' },
    ]" />
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

// defineProps / defineEmits
const props = defineProps({
  // 垂直 horizontal | vertical
  direction: { type: String, default: "horizontal" },
  // 淺色模式
  lightMode: {
    type: Boolean,
    default: false,
  },
  // 是否有margin
  margin: {
    type: Boolean,
    default: true,
  },
  // 單邊margin top/bottom
  marginPosition: String,
});

const emit = defineEmits([]);

// Refs / Reactive State 定義

// Computed 計算屬性

// Methods / Functions

// Watchers

// Lifecycle Hooks
</script>

<style lang="scss" scoped>
@use "sass:map";

.be-line {
  border: 0.8px solid getColor(black);
  width: 100%;
  border-radius: radius("block");

  &.vertical {
    width: 0;
    height: 100%;
  }
  &.lightMode {
    border: 0.8px solid getColor(white);
  }
  &.hasMargin {
    margin: 1rem 0 1rem;

    &.top {
      margin: 1rem 0 0;
    }
    &.bottom {
      margin: 0 0 1rem;
    }
  }
}
</style>
