<!-- 外部容器統一設定 -->
<template>
  <div class="be-container"><slot /></div>
</template>

<style lang="scss" scoped>
.be-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: min(144rem, calc(100% - clamp(3.2rem, 8vw, 11.2rem)));
  min-height: 64vh;
  margin: 0 auto;
}

@media (max-width: 560px) {
  .be-container {
    width: calc(100% - 2rem);
  }
}
</style>
