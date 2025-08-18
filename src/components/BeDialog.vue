<template>
  <!-- 背景覆蓋層 -->
  <div
    class="be-coverBox"
    v-if="visible">
    <div
      class="be-dialog"
      :class="{ small: type != 'custom' }">
      <div class="top">
        <div class="titleBox">
          <h3 v-if="type == 'custom'">{{ title }}</h3>
          <h3
            class="alertTitle"
            v-if="type == 'alert'">
            {{ prompt || t("common.warning") }}
          </h3>
        </div>
        <div class="closeBox">
          <CircleX
            class="close"
            @click="closeDialog" />
        </div>
      </div>
      <!-- 客製化內容 -->
      <div
        v-if="type == 'custom'"
        class="content">
        <slot></slot>
      </div>
      <!-- 固定式訊息內容 -->
      <div
        v-if="type != 'custom'"
        class="message">
        {{ message }}
      </div>
      <!-- footer客製化插槽 -->
      <template v-if="$slots.footer">
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </template>
      <template v-else-if="showFooterBtn">
        <!-- 固定式彈窗按鈕 -->
        <div class="footer">
          <be-btn
            v-if="type != 'alert'"
            @click="handleConfirm">
            {{ t("common.confirm") }}
          </be-btn>
          <be-btn @click="closeDialog">
            <span v-if="type != 'alert'">{{ t("common.cancel") }}</span>
            <span v-else>{{ t("common.confirm") }}</span>
          </be-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch } from "vue";
import { useI18n } from "vue-i18n";
import { CircleX } from "lucide-vue-next";

// defineProps / defineEmits
const props = defineProps({
  title: {
    type: String,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  //彈窗類型：客製化custom,警告alert,確認confirm
  type: {
    type: String,
    default: "custom", //預設為客製化
  },
  // 提示標題,僅支援警告alert 預設為"警告"
  prompt: {
    type: String,
    default: "",
  },
  // 警告alert,確認confirm 支援
  message: {
    type: String,
  },
  // 手動控制footer是否有按鈕
  showFooterBtn: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:visible", "close", "confirm"]);

// Refs / Reactive State 定義
const { t } = useI18n();

// Methods / Functions
const closeDialog = () => {
  // 按下關閉後執行的行為
  emit("close");
  //讓父元件關閉彈窗
  emit("update:visible", false);
};

// 按下確認後執行的行為
const handleConfirm = () => {
  emit("confirm");
  emit("update:visible", false);
};

// Watchers
// 監控visible, 讓body加上overflow-y屬性
watch(
  () => props.visible,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>

<style lang="scss" scoped>
.be-coverBox {
  // 背景覆蓋層
  @include center;
  z-index: z(dialog);

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  height: 100vh;
  width: 100vw;
  background-color: getColor(dialogCover);

  .be-dialog {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding: 1rem;
    box-sizing: border-box;
    background-color: getColor(green-01);
    width: 50%;
    max-height: 80vh;
    border-radius: radius(dialog);

    color: getColor(black);

    &.small {
      padding: 3rem;
      width: 248px;
      min-height: 150px;
      justify-content: space-between;

      .alertTitle {
        font-size: 24px;
      }
    }

    @include md {
      &:not(.small) {
        width: 80%;
        padding: 3rem;
      }
    }

    .top {
      position: relative;
      display: flex;

      .closeBox {
        position: absolute;
        right: 0;

        .close {
          cursor: pointer;
          color: getColor(green-04);
          width: 40px;
          height: 40px;

          @include sm {
            width: 28px;
            height: 28px;
          }
        }
      }

      .titleBox {
        text-align: center;
        flex: 1;
      }
    }

    .content {
      overflow-y: auto;
    }

    .message {
      margin: 0 auto;
      font-size: 16px;
      line-height: 1.6;
    }

    .footer {
      @include center;

      gap: 10px;

      font-size: 16px;
    }
  }
}
</style>
