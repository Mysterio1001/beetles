<template>
  <div
    :class="[
      'be-card',
      { hasPadding: hasPadding },
      { darkMode: darkMode },
      { imgTop: imgPosition == 'top' },
      { imgRight: imgPosition == 'right' },
      { clickable: clickable },
    ]">
    <!-- 圖片放置位置 -->
    <div
      :class="['mainImg', { imgCover: imgCover }]"
      v-if="imgSrc"
      :data-coverText="imgCoverText"
      :style="{ '--text-rotate': textRotate }">
      <!-- 建立style變數 -->
      <!-- --*** 為CSS變數 -->
      <img
        :src="imgSrc"
        :alt="imgAlt" />
    </div>
    <!-- 內容放置位置 -->
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";

// defineProps / defineEmits
const props = defineProps({
  imgPosition: {
    type: String,
    default: "top",
  },
  hasPadding: {
    type: Boolean,
    default: true,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  imgCoverTextRotate: {
    type: Number,
    default: 45,
  },
  imgSrc: String,
  imgAlt: String,
  imgCover: Boolean,
  imgCoverText: String,
  clickable: Boolean,
});

const emit = defineEmits([]);

// Refs / Reactive State 定義

// Computed 計算屬性
const textRotate = computed(() => `${props.imgCoverTextRotate}deg`);
// Methods / Functions

// Watchers

// Lifecycle Hooks
</script>

<style lang="scss" scoped>
@use "sass:map";

.be-card {
  // border: 1px solid black;
  display: flex;

  background-color: getColor(green-01);
  box-shadow: 0 0 8px getColor(shadow);

  border-radius: radius(block);
  overflow: hidden;

  &.hasPadding {
    padding: 1.5rem;
  }

  &.darkMode {
    background-color: getColor(green-04);
    color: getColor(text-light);
  }

  &.imgRight {
    flex-direction: row-reverse;
  }

  &.imgTop {
    flex-direction: column;
    align-items: center;
    display: block;
  }
  .mainImg {
    aspect-ratio: 4/3;
    position: relative;

    // @include md {
    //   aspect-ratio: 8/5;
    // }

    @include sm {
      aspect-ratio: 3/2;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: radius(block);
    }

    // 圖片遮罩
    &.imgCover:before {
      content: "";
      display: block;

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
      background-color: rgba(getColor(white), 0.4);
      border-radius: radius(block);

      @include center;
    }

    // 圖片遮罩上文字
    &.imgCover:after {
      content: attr(data-coverText);
      display: block;
      width: 100%;

      position: absolute;
      top: 50%;

      color: rgba(getColor(black), 0.4);
      text-align: center;
      font-size: 4rem;
      font-weight: 1000;
      // CSS 自訂變數
      transform: translate(0, -50%) rotate(var(--text-rotate));
    }
  }

  &.clickable {
    cursor: pointer;
    transition: transform 0.4s ease-in-out;
    &:hover {
      transform: translateY(-1rem);
      box-shadow: 0 10px 10px getColor(shadow);
    }
  }

  .mainImg {
    flex: 3;

    img {
      width: 100%;
      height: 100%;
      border-radius: radius(block);
    }
  }

  .content {
    line-height: 1.6;
    flex: 7;
    padding: 2rem;
  }
}
</style>
