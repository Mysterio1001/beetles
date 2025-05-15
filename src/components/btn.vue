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

  color: #fff;
  font-weight: bold;
  text-align: center;

  background-color: #5d7c71;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.5);
  &.l {
    font-size: 2rem;
  }
  &.s {
    font-size: 1.2rem;
  }
  span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: transform 0.2s ease;
    &::before {
      content: "";
    }
  }
  &:hover {
    color: #dfe8e4;
    background-color: #394c45;

    span {
      transform: translateX(1rem);
      &::before {
        position: absolute;
        left: -2rem;
        content: "•";
      }
    }
  }
}
</style>
