<template>
  <be-container>尚未開工</be-container>
  <!-- 浮動視窗 -->
  <be-float-panel
    :title="t('lab.latestArticle')"
    side="right">
    <div class="floatBox">
      <div
        class="floatList"
        v-for="(list, index) in floatData">
        <p>{{ list.title }}</p>
      </div>
    </div>
  </be-float-panel>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { articleDataTest } from "@/api/testData";

// Refs / Reactive State 定義
const { t } = useI18n();

// const floatData = ref([]) api傳入
const floatData = ref(articleDataTest);
// const cardsData = ref([]) api傳入
const cardsData = ref(articleDataTest);

// Computed 計算屬性

// Methods / Functions

// Watchers

// Lifecycle Hooks
</script>
