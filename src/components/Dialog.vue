<template>
  <!-- 背景覆蓋層 -->
  <div
    class="coverBox"
    v-if="visible">
    <div
      class="dialog"
      v-if="visible">
      <div class="top">
        <div class="titleBox">
          <h3>{{ title }}</h3>
        </div>
        <div class="closeBox">
          <CircleX
            size="20"
            class="close"
            @click="closeDialog" />
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch } from "vue";
import { CircleX } from "lucide-vue-next";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible", "close"]);

const closeDialog = () => {
  // 父元件可額外觸發的行為
  emit("close");
  //讓父元件關閉彈窗
  emit("update:visible", false);
};
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
.coverBox {
  // 背景覆蓋層
  z-index: z(dialog);

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: getColor(shadow);

  .dialog {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding: 1rem;
    box-sizing: border-box;
    background-color: getColor(green-01);
    width: 50%;
    max-height: 80vh;
    border-radius: 8px;

    color: getColor(black);

    @include md {
      width: 80%;
      padding: 3rem;
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
  }
}
</style>
