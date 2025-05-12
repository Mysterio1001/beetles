<template>
  <div class="container">
    <!-- 按鈕 -->
    <div class="button section">
      <div class="title">
        <h2 style="font-size: 20px">button &lt;btn&gt;&lt;/btn&gt;</h2>
        <h3>width屬性可以自己調整寬度</h3>
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
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  padding: 20px;
  color: black;
  display: flex;
  justify-content: center;

  .title {
    padding: 10px 0;
    h2 {
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .box {
    padding: 10px;
  }
}
</style>
