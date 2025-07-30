<!-- 外部容器統一設定 -->
<template>
  <div class="be-container">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.be-container {
  @include center;
  align-items: stretch; // 該為預設
  flex-direction: column;
  gap: 16px;

  padding: 0 2rem;
  box-sizing: border-box;
}
</style>
