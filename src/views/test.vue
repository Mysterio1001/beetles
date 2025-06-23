<template>
  <be-container>
    <div class="main">
      <!-- ----------- -->
      <div class="button section">
        <div class="title">
          <h2>按鈕</h2>
          <h3>&lt;be-btn&gt;&lt;/be-btn&gt;</h3>
          <h4>寬度為100%</h4>
        </div>
        <div class="btns">
          <h6>size="l"</h6>
          <div class="box">
            <be-btn size="l">大按鈕</be-btn>
          </div>
          <h6>不用填 :size</h6>
          <div class="box">
            <be-btn>預設按鈕</be-btn>
          </div>
          <h6>size="s"</h6>
          <div class="box">
            <be-btn size="s">小按鈕</be-btn>
          </div>
        </div>
      </div>
      <!-- ----------- -->
      <div class="dialog section">
        <div class="title">
          <h2>彈窗</h2>
          <h3>&lt;be-dialog&gt;&lt;/be-dialog&gt;</h3>
          <h4>三種type = "custom"(客製化), "alert"(警告), "confirm"(確認)</h4>
          <h4>v-model:visible = "視窗開關"</h4>
          <h4>title = "標題" (支援custom)</h4>
          <h4>message = "警告或確認訊息" (支援alert和confirm)</h4>
          <h4>@close = "關閉時執行的動作" (全支援)</h4>
          <h4>@confirm = "按下確認時執行的動作" (全支援)</h4>
          <h4>新增： #footer 自定義插槽(若不使用預設有 確認/取消 按鈕)</h4>
          <h4>新增： 確認/取消 按鈕 可以用"footerBtn = 'false'" 隱藏)</h4>
          <h4>新增： "prompt" 提示標題,僅支援警告alert 預設為"警告"</h4>
        </div>
        <div class="box">
          <be-btn @click="showDialog('dialog')"> 點我開啟彈窗 </be-btn>
        </div>
        <div class="box">
          <be-btn @click="showDialog('alert')"> 點我開啟警告 </be-btn>
        </div>
        <div class="box">
          <be-btn @click="showDialog('confirm')"> 點我開啟確認 </be-btn>
        </div>
      </div>
      <!-- ----------- -->
      <div class="tag section">
        <div class="title">
          <h2>標籤</h2>
          <h3>&lt;be-tags&gt;&lt;/be-tags&gt;</h3>
          <h4>標籤資料 data="[{label:"",value:"", icon:""}]"</h4>
          <h5>icon import後直接使用</h5>
          <h4>標籤設定 option 提供:</h4>
          <h5>"multiple"(是否多選：Boolean)</h5>
          <h5>"selectedTagNo"(預設選取：單選給一值/多選給一陣列, 數值1~n)</h5>
          <h5>"disableTagNo"(禁止點選:陣列, 數值1~n)</h5>
          <h4>@tags-click = "點選後可執行的事件"</h4>
          <h4>@ready = "載入時執行的事件"</h4>

          <h5>現在點選的Label是 : {{ showTagSelectLabel }}</h5>
          <h5>現在點選的Value是 : {{ showTagSelectValue }}</h5>
        </div>
        <div class="box">
          <be-tags
            :data="tagsData"
            :option="tagsOption"
            @tags-click="tagsClick"
            @ready="tagsClick" />
        </div>
        <div class="title">
          <h5>現在點選的Label是 : {{ showTagSelectLabels.join(", ") }}</h5>
          <h5>現在點選的Value是 : {{ showTagSelectValues.join(", ") }}</h5>
        </div>
        <div class="box">
          <be-tags
            :data="multipleTagsData"
            :option="multipleTagsOption"
            @tags-click="multipleTagsClick"
            @ready="multipleTagsClick" />
        </div>
      </div>
      <!-- ----------- -->
      <div class="tag section">
        <div class="title">
          <h2>輸入框</h2>
          <h3>&lt;be-input&gt;&lt;/be-input&gt;</h3>
          <h4>需設定v-model的值</h4>
          <h4>type = "text, password, textarea" 支援三種原生類型</h4>
          <h5>password僅支援英文數字</h5>
          <h4>label = "欄位標題"</h4>
          <h4>placeholder = "提示文字"</h4>
          <h4>支援原生readonly 和 disabled</h4>
          <h4>支援原生maxlength(最大字元數)</h4>
          <h4>僅支援input:</h4>
          <h5>size = "default, small"設定兩種大小的input(預設為default)</h5>
          <h5>clearable設定是否要清除按鈕(預設為true：Boolean)</h5>
          <h5>
            提供前後兩種slot插槽： #prefix #suffix(註：#prefix位於標題後input前)
          </h5>
          <h4>僅支援textarea:</h4>
          <h5>labelTop設定欄位標題是否置上(預設為false：Boolean)</h5>
        </div>
        <br />
        <h4>提供事件支援：</h4>
        <h4>@enter事件 (按下enter後可執行的事件)</h4>
        <h4>@input事件 (輸入值時可執行事件,回傳使用者目前輸入的文字內容)</h4>

        <div class="title">
          <h4>size="default"</h4>
        </div>
        <div class="box">
          <be-input
            label="一般預設input"
            v-model="inputValue"
            placeholder="按下Enter送到下面的Textarea"
            @enter="enter">
            <template #prefix>#prefix</template>
          </be-input>
          <be-input
            label="禁用"
            v-model="inputValueDis"
            disabled>
          </be-input>
          <be-input
            label="唯讀"
            v-model="inputValueRead"
            readonly>
          </be-input>
        </div>
        <div class="title">
          <h4>size="small"</h4>
        </div>
        <div class="box">
          <be-input
            label="密碼"
            v-model="inputValuePs"
            placeholder="請輸入密碼"
            size="small"
            type="password"
            :maxlength="5">
            <template #suffix>#suffix</template>
          </be-input>
        </div>
        <div class="box">
          <be-input
            type="textarea"
            v-model="textareaValue"
            placeholder="任意輸入"
            label="標題"
            :labelTop="true" />
        </div>
      </div>
    </div>
  </be-container>
  <!---------->
  <!-- 彈窗 -->
  <!---------->
  <be-dialog
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
  </be-dialog>
  <!-- 警告對話框 -->
  <be-dialog
    v-model:visible="isAlertVisible"
    type="alert"
    message="這個不能按！"></be-dialog>
  <!-- 確認對話框 -->
  <be-dialog
    v-model:visible="isConfirmVisible"
    type="confirm"
    @confirm="confirmAlert"
    message="你確定要這樣做嗎？"></be-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ShoppingCart, XCircle } from "lucide-vue-next";
// 彈窗內容邏輯
const isDialogVisible = ref(false);
const isAlertVisible = ref(false);
const isConfirmVisible = ref(false);
const footerText = ref("客製化的footer");
const showFooterBtn = ref(true);

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
// tags內容邏輯
// 單選
const showTagSelectLabel = ref("");
const showTagSelectValue = ref("");

const tagsData = ref([
  { label: "A", value: "a", icon: ShoppingCart },
  { label: "B", value: "b", icon: XCircle },
  { label: "C", value: "c" },
  { label: "D", value: "d" },
  { label: "E", value: "e" },
  { label: "F", value: "f" },
]);

const tagsOption = ref({
  selectedTagNo: 1, // 預設點選
  disableTagNo: [2], // 禁止點選
});
// 回傳該tag的value
const tagsClick = (val) => {
  const preValue = showTagSelectValue.value;
  showTagSelectValue.value = val;
  const clickIndex = tagsData.value.findIndex((i) => i.value == val);
  showTagSelectLabel.value = tagsData.value[clickIndex].label;

  if (preValue != "f" && val === "f") {
    isAlertVisible.value = true;
  }
};

// 多選
const showTagSelectLabels = ref([]);
const showTagSelectValues = ref([]);

const multipleTagsData = ref([
  { label: "AA", value: "aa" },
  { label: "BB", value: "bb" },
  { label: "CC", value: "cc" },
  { label: "DD", value: "dd" },
  { label: "EE", value: "ee" },
  { label: "FF", value: "ff" },
]);

const multipleTagsOption = ref({
  selectedTagNo: [2, 3], // 預設點選
  disableTagNo: [1], // 禁止點選
  multiple: true, // 是否多選
});

// 回傳該tag的array
const multipleTagsClick = (val) => {
  showTagSelectValues.value = val;
  showTagSelectLabels.value = multipleTagsData.value
    .filter((item) => val.includes(item.value))
    .map((i) => i.label);
};

// input 內容邏輯

const inputValue = ref("");
const inputValuePs = ref("");
const textareaValue = ref("");
const inputValueDis = ref("nonono");
const inputValueRead = ref("look at me");

const enter = () => {
  const val = inputValue.value;
  textareaValue.value = val;
  inputValue.value = "";
};
</script>

<style lang="scss" scoped>
.main {
  background-color: getColor(green-02);
  color: getColor(black);
  padding: 0 1rem;

  .section {
    border-bottom: 1.5px solid getColor(green-04);
    padding: 1rem 0 1rem;
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
