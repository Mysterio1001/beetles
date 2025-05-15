<!-- 外部容器統一設定 -->
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 2rem;
}
</style>
