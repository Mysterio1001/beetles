<template>
  <Container>
    <div class="main">
      <!-- ----------- -->
      <div class="button section">
        <div class="title">
          <h2>按鈕</h2>
          <h3>&lt;Btn&gt;&lt;/Btn&gt;</h3>
          <h4>寬度為100%</h4>
        </div>
        <div class="btns">
          <h6>size="l"</h6>
          <div class="box">
            <Btn size="l">大按鈕</Btn>
          </div>
          <h6>不用填 :size</h6>
          <div class="box">
            <Btn>預設按鈕</Btn>
          </div>
          <h6>size="s"</h6>
          <div class="box">
            <Btn size="s">小按鈕</Btn>
          </div>
        </div>
      </div>
      <!-- ----------- -->
      <div class="dialog section">
        <div class="title">
          <h2>彈窗</h2>
          <h3>&lt;Dialog&gt;&lt;/Dialog&gt;</h3>
          <h4>title = "標題"</h4>
          <h4>v-model:visible = "視窗開關"</h4>
          <h4>@close = "關閉時執行的動作"</h4>
          <div class="box">
            <Btn
              width="20px"
              @click="showDialog">
              點我開啟彈窗(dialog)
            </Btn>
          </div>
        </div>
      </div>
    </div>
  </Container>
  <Dialog
    title="這是標題"
    v-model:visible="isDialogVisible"
    @close="closeAlert">
    <div style="height: 800px; background-color: #bfd0c9">
      這裡是內容<br />
      且內容過多會自行生成卷軸
    </div>
    <div style="background-color: #bfd0c9; display: flex; justify-content: end">
      我說的對吧？
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

let isDialogVisible = ref(false);

const showDialog = () => {
  isDialogVisible.value = true;
};

const closeAlert = () => {
  alert("關閉時執行的動作");
};
</script>

<style lang="scss" scoped>
.main {
  background-color: getColor(white);
  color: getColor(black);
  padding: 0 1rem;

  .section {
    border-bottom: 1.5px solid getColor(green-04);

    .title {
      padding: 1rem 0;
    }

    .box {
      padding: 1rem;
    }
  }
}
</style>
