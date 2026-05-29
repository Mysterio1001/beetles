<template>
  <div
    class="be-pagination"
    ref="paginationRef">
    <!-- 總筆數 -->
    <div class="total"><span>共10筆</span></div>
    <!-- 每頁筆數 -->
    <div class="size">
      <be-select
        v-model="size"
        size="page"
        :options="selectOptions"
        @select="optionSelect" />
    </div>
    <div class="main">
      <!-- 左鍵 -->
      <div class="left"><span><</span></div>
      <!-- 頁數 -->
      <div class="pages">1</div>
      <div class="pages">2</div>
      <div class="pages">3</div>
      <div class="pages">4</div>
      <!-- 右鍵 -->
      <div class="right"><span>></span></div>
    </div>
    <!-- 前往頁數 -->
    <div class="currentPage">
      <span>前往第</span>
      <be-input
        v-model="currentPage"
        size="page" />
      <span>頁</span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

// defineProps / defineEmits
const props = defineProps({});

const emit = defineEmits([]);

// Refs / Reactive State 定義
const size = ref(10);
const selectOptions = [
  { label: "10筆/頁", value: 10 },
  { label: "50筆/頁", value: 50 },
  { label: "80筆/頁", value: 80 },
  { label: "100筆/頁", value: 100 },
];

// Computed 計算屬性

// Methods / Functions

// Watchers

// Lifecycle Hooks
</script>

<style lang="scss" scoped>
@use "sass:map";

@mixin defaultStyle() {
  @include center();
  justify-content: space-between;
  gap: 1rem;
}

.be-pagination {
  @include center();
  justify-content: end;
  min-width: 40vw;
  .total {
  }
  .size {
    width: 120px;
  }
  .main {
    @include defaultStyle();

    .left {
    }
    .pages {
    }
    .right {
    }
  }
  .currentPage {
    @include defaultStyle();
    width: 100px;
  }
}
</style>
