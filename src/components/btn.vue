<template>
  <div :class="['btn', size]" :style="{ width: width }">
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
  width: {
    type: String,
    default: "80px",
  },
});
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;

  margin: 5px;
  padding: 8px 20px;

  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;

  background-color: #5d7c71;
  border-radius: 20px;
  box-shadow: 5px 4px 4px rgb(0, 0, 0, 0.5);
  &.l {
    font-size: 20px;
  }
  &.s {
    font-size: 12px;
  }
  span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
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
      transform: translateX(10px);
      &::before {
        position: absolute;
        left: -10px;
        content: "•";
      }
    }
  }
}
</style>
