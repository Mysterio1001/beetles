<template>
  <be-container>
    這裡測試之子
    <div class="test">
      <router-link to="/test/testChild/jr">
        <be-btn>前往Jr</be-btn>
      </router-link>
    </div>
  </be-container>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// Refs / Reactive State 定義
const { t } = useI18n();

// Computed 計算屬性

// Methods / Functions

// Watchers

// Lifecycle Hooks
</script>
<style lang="scss" scoped>
.test {
  background-color: #6bb46b;
  height: 50px;
  display: flex;
  margin: 10px;
}
</style>
