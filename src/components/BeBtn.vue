<template>
  <div :class="['be-btn', size]">
    <span><slot></slot></span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

// defineProps / defineEmits
const props = defineProps({
  size: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.be-btn {
  cursor: pointer;
  position: relative;

  margin: 4px;
  padding: 8px 20px;

  color: getColor(white);
  font-weight: bold;
  text-align: center;

  background-color: getColor(green-03);
  border-radius: radius(btn);
  box-shadow: 4px 4px 4px getColor(shadow);
  &.l {
    font-size: 2rem;
    padding: 12px 20px;
  }
  &.s {
    font-size: 1.2rem;
    padding: 6px 20px;
  }

  &::before {
    content: "•";
    display: block;
    position: absolute;
    left: 0;
    opacity: 0;
    transition: all 0.2s linear;
  }

  span {
    @include center;
    transition: transform 0.2s linear, background-color 0.5s ease,
      color 0.3s ease;
    user-select: none;
  }
  &:hover {
    color: getColor(text-light);
    background-color: getColor(btnHover);

    &::before {
      transform: translateX(1rem);
      color: getColor(text-light);
      opacity: 1;
    }

    span {
      transform: translateX(0.5rem);
    }
  }

  &:active {
    background-color: getColor(btnActive);
    box-shadow: inset 0 1px 3px getColor(shadow);

    &::before {
      transform: translateX(1rem);
      color: getColor(text-light);
      opacity: 1;
    }

    span {
      transform: translateX(0.5rem);
    }
  }
}
</style>
