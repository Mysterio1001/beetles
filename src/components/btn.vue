<template>
  <div :class="['btn', size]">
    <span><slot></slot></span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;

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
  }
  &.s {
    font-size: 1.2rem;
  }
  span {
    @include center;
    position: relative;

    text-align: center;
    transition: transform 0.2s ease, background-color 0.5s ease, color 0.3s ease;
    &::before {
      display: none;
      content: "•";
      opacity: 0;
      transform: translateX(-0.5rem);
      transition: all 0.3s ease;
    }
  }
  &:hover {
    color: getColor(text-light);
    background-color: getColor(btnHover);

    span {
      transform: translateX(1rem);
      user-select: none;
      &::before {
        display: block;
        position: absolute;
        left: clamp(-3rem, -32%, 2rem);
        content: "•";
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  &:active {
    background-color: getColor(btnActive);
  }
}
</style>
