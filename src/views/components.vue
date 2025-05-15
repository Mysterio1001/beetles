<template>
  <Container>
    <div class="main">
      <!-- 按鈕 -->
      <div class="button section">
        <div class="title">
          <h2>button &lt;btn&gt;&lt;/btn&gt;</h2>
          <h4>width屬性如果需要可以自己調整寬度</h4>
        </div>
        <div class="btns">
          <h6>size="l"</h6>
          <div class="box">
            <btn size="l">大按鈕</btn>
          </div>
          <h6>不用填 :size</h6>
          <div class="box">
            <btn>預設按鈕</btn>
          </div>
          <h6>size="s"</h6>
          <div class="box">
            <btn size="s">小按鈕</btn>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup></script>

<style lang="scss" scoped>
.main {
  background-color: #fff;
  color: black;
  padding: 0 1rem;

  .title {
    padding: 1rem 0;
  }

  .box {
    padding: 1rem;
  }
}
</style>
