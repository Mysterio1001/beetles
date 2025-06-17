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
          <h4>三種type = "custom"(客製化), "alert"(警告), "confirm"(確認)</h4>
          <h4>v-model:visible = "視窗開關"</h4>
          <h4>title = "標題" (支援custom)</h4>
          <h4>message = "警告或確認訊息" (支援alert和confirm)</h4>
          <h4>@close = "關閉時執行的動作" (全支援)</h4>
          <h4>@confirm = "按下確認時執行的動作" (全支援)</h4>
          <h4>新增： #footer 自定義插槽(若不使用預設有 確認/取消 按鈕)</h4>
          <h4>新增： 確認/取消 按鈕 可以用"footerBtn = 'false'" 隱藏)</h4>
          <div class="box">
            <Btn
              width="20px"
              @click="showDialog('dialog')">
              點我開啟彈窗
            </Btn>
          </div>
          <div class="box">
            <Btn
              width="20px"
              @click="showDialog('alert')">
              點我開啟警告
            </Btn>
          </div>
          <div class="box">
            <Btn
              width="20px"
              @click="showDialog('confirm')">
              點我開啟確認
            </Btn>
          </div>
        </div>
      </div>
    </div>
  </Container>
  <!-- 客製彈窗 -->
  <Dialog
    title="這是標題"
    v-model:visible="isDialogVisible"
    :show-footer-btn="showFooterBtn"
    @close="closeAlert">
    <div style="height: 800px; background-color: #bfd0c9">
      這裡是內容<br />
      且內容過多會自行生成卷軸
      <div
        class="footerTestBtn"
        @click="footerTest">
        {{ footerText }}
      </div>
    </div>
    <div style="background-color: #bfd0c9; display: flex; justify-content: end">
      我說的對吧？
    </div>
    <template
      v-if="!showFooterBtn"
      #footer>
      客製化的FOOTER!
    </template>
  </Dialog>
  <!-- 警告對話框 -->
  <Dialog
    v-model:visible="isAlertVisible"
    type="alert"
    message="這個不能按！"></Dialog>
  <!-- 確認對話框 -->
  <Dialog
    v-model:visible="isConfirmVisible"
    type="confirm"
    @confirm="confirmAlert"
    message="你確定要這樣做嗎？"></Dialog>
</template>

<script setup>
import { ref } from "vue";

let isDialogVisible = ref(false);
let isAlertVisible = ref(false);
let isConfirmVisible = ref(false);
let footerText = ref("客製化的footer");
let showFooterBtn = ref(true);

const showDialog = (key) => {
  if (key == "dialog") {
    isDialogVisible.value = true;
  } else if (key == "alert") {
    isAlertVisible.value = true;
  } else if (key == "confirm") {
    isConfirmVisible.value = true;
  }
};

const closeAlert = () => {
  alert("關閉時執行的動作");
};

const confirmAlert = () => {
  alert("按下確認後執行的動作");
};

const footerTest = () => {
  const def = "預設的footer";
  const cus = "客製化的footer";
  if (showFooterBtn.value) {
    footerText.value = def;
    showFooterBtn.value = false;
  } else {
    footerText.value = cus;
    showFooterBtn.value = true;
  }
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

.footerTestBtn {
  cursor: pointer;
  text-align: center;
  color: blue;
  text-decoration: underline;
}
</style>
