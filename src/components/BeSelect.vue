<template>
  <div
    class="select"
    ref="selectRef">
    <label
      class="label"
      :for="selectId"
      :style="{ width: labelWidth }">
      <h4>{{ label }}</h4>
    </label>
    <!-- 前方插槽 -->
    <slot name="prefix" />
    <div class="selectBox">
      <div class="innerSelect">
        <input
          ref="inputRef"
          :id="selectId"
          :class="[{ small: size === 'small' }, { disabled: disabled }]"
          :value="displayLabel"
          :placeholder="placeholder"
          :disabled="disabled"
          @click="toggleDrop"
          readonly />
        <!-- i-con -->
        <Bug
          :class="[
            'icon',
            { small: size === 'small' },
            { clicked: isClicked },
            { disabled: disabled },
          ]"
          @click="toggleDrop" />
      </div>
      <div
        ref="optionRef"
        :class="['option', { dropUp: isOutOfView }]"
        v-if="optionVisible">
        <ul>
          <li
            v-for="(option, index) in options"
            :key="option.value"
            @click="handleSelect(option.value)">
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 後方插槽 -->
    <slot name="suffix" />
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
} from "vue";
import { Bug } from "lucide-vue-next";
import { listenScroll } from "@/utils/scroll";

// defineProps / defineEmits
const props = defineProps({
  modelValue: String, // 父元件v-model
  label: String, //欄位標題
  labelWidth: String, // 標題寬度
  placeholder: String, // 預設字
  // 提供small size (僅支援input)
  size: {
    type: String,
    default: "default",
  },
  // 禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // options 內容物 {label:"",value:""}
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

// Refs / Reactive State 定義
const stopListen = ref(); // 存放移除監聽的函式
// select id 唯一值
const selectId = ref(`select-${Math.random().toString(36).slice(2, 8)}`);
// select on/off
const optionVisible = ref(false);
const isClicked = ref(false);
// 元件失焦
const selectRef = ref(null);
// 監控option與視窗底部的距離
const isOutOfView = ref(false);
const inputRef = ref(null);
const optionRef = ref(null);

// Computed 計算屬性
// 標題顯示
const displayLabel = computed(() => {
  const match = props.options.find(
    (option) => option.value == props.modelValue
  );
  return match ? match.label : "";
});

// Methods / Functions
// 下拉式開關
const toggleDrop = () => {
  if (!props.disabled) {
    optionVisible.value = !optionVisible.value;
    isClicked.value = !isClicked.value;
  }
};

// 選擇選項
const handleSelect = (val) => {
  toggleDrop();
  if (!val && val != 0) return;
  const optionObj = props.options.find((option) => option.value == val);
  emit("update:modelValue", val);
  emit("select", optionObj);
};

// 元件失焦
const clickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    optionVisible.value = false;
    isClicked.value = false;
    stopListen.value?.(); // 關閉 scroll 監聽
  }
};

// 計算距離
const calculateIsOutOfView = () => {
  // 計算inputRef的定位點(會回傳物件top, bottom, left, right , height , width
  const inputRect = inputRef.value.getBoundingClientRect();
  // optionRef的高
  const optionHeight = optionVisible.value ? optionRef.value.offsetHeight : 0;
  //  inputRef 和 視窗底部距離(下方空間)
  const spaceBelow = window.innerHeight - inputRect.bottom;
  //   如果下方空間小於option的高
  isOutOfView.value = optionHeight > spaceBelow;
};

// Watchers
watch(optionVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      calculateIsOutOfView();
    });
  }
});

// Lifecycle Hooks
onMounted(() => {
  stopListen.value = listenScroll(window, () => calculateIsOutOfView());
  window.addEventListener("resize", calculateIsOutOfView);

  document.addEventListener("mousedown", clickOutside);
});

onUnmounted(() => {
  stopListen.value?.();
  window.removeEventListener("resize", calculateIsOutOfView);
  document.removeEventListener("mousedown", clickOutside);
});
</script>

<style lang="scss" scoped>
@use "sass:map";
// select 樣式

.select {
  @include center;
  gap: 2rem;

  padding: 1.6rem 0;
  box-sizing: border-box;

  .selectBox {
    position: relative;
    flex: 1;

    .innerSelect {
      @include center;
      position: relative;

      flex: 1;

      input {
        @include fieldStyle("default");
        cursor: pointer;

        &.small {
          @include fieldStyle("default", small);
        }

        &.disabled {
          @include fieldStyle($status: "disabled");
        }
      }
      .icon {
        @include iconStyle(default);
        cursor: pointer;

        position: absolute;
        right: 10px;
        color: getColor(green-03);

        transition: opacity 0.3s ease-in-out, transform 0.5s ease;
        &.small {
          @include iconStyle(small);
        }

        &.clicked {
          transform: rotate(180deg);
        }

        &.disabled {
          cursor: not-allowed;
        }
      }
    }
    .option {
      cursor: pointer;

      position: absolute;

      bottom: 0;
      transform: translateY(104%);

      width: 100%;
      border: 0.5px solid getColor(green-03);
      border-radius: radius("input");

      z-index: z(option);

      &.dropUp {
        bottom: auto;
        top: 0;
        transform: translateY(-104%);
      }

      ul {
        width: 100%;
        border-radius: radius("tags");

        overflow-y: auto;

        li {
          @include fieldStyle("default");
          border: 0.5px solid getColor(green-02);
          border-radius: radius(0);
          font-size: clamp(10px, 2rem, 16px);

          &:hover {
            background-color: getColor(gray-01);
          }
        }
      }
    }
  }
}
</style>
