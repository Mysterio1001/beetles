<template>
  <div
    class="be-input"
    v-if="type != 'textarea'">
    <!-- 前方插槽 -->
    <label
      class="label"
      v-if="label"
      :for="inputId"
      :style="{ width: labelWidth }">
      <h4>
        {{ label }}
      </h4>
    </label>
    <slot name="prefix" />
    <div :class="['innerInput', { hasValue: modelValue }]">
      <input
        :id="inputId"
        :class="[
          { small: size === 'small' },
          { disabled: disabled },
          { readonly: readonly },
        ]"
        :value="modelValue"
        :type="currentType"
        :placeholder="placeholder"
        @input="onInput"
        @keydown.enter="handleEnter"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false" />
      <!-- icon 集合 -->
      <component
        v-if="iconComponent && !disabled && !readonly"
        :is="iconComponent"
        :class="['icon', { small: size === 'small' }]"
        @mousedown.prevent
        @click="iconClick" />
    </div>
    <!-- 後方插槽 -->
    <slot name="suffix" />
  </div>
  <div
    :class="['textarea', { labelTop: labelTop }]"
    v-else>
    <label
      class="label"
      v-if="label"
      :for="inputId">
      <h4>{{ label }}</h4>
    </label>
    <div class="innerTextarea">
      <textarea
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        @keydown.enter="handleEnter"
        @input="onInput"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { CircleX, Eye, EyeClosed } from "lucide-vue-next";
import { filterAlphaNumeric } from "@/utils/inputFilters";

// defineProps / defineEmits
const props = defineProps({
  modelValue: String, // 父元件v-model
  type: {
    type: String, // 類型text, password
    default: "text",
  },
  label: String, //欄位標題
  labelWidth: String, // 標題寬度
  placeholder: String, // 預設字
  // 提供textarea標題在上方
  labelTop: {
    type: Boolean,
    default: false,
  },
  // 提供small size (僅支援input)
  size: {
    type: String,
    default: "default",
  },
  // 可清除按鈕 (僅支援input)
  clearable: {
    type: Boolean,
    default: true,
  },
  // 唯獨
  readonly: {
    type: Boolean,
    default: false,
  },
  // 禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 最大字元數
  maxlength: Number,
});

const emit = defineEmits([
  "update:modelValue",
  "update:type",
  "enter",
  "input",
]);

// Refs / Reactive State 定義
// input id 唯一值
const inputId = ref(`input-${Math.random().toString(36).slice(2, 8)}`);
// 密碼查看icon 切換
const eyeIsOpen = ref(false);
// 是否正在組字(中日等需要組字的輸入法判斷)
const isComposing = ref(false);

// Computed 計算屬性
const currentType = computed(() => {
  if (props.type !== "password") {
    return props.type;
  } else {
    return eyeIsOpen.value ? "text" : "password";
  }
});

// icon集合管理
const iconComponent = computed(() => {
  if (props.type == "password") {
    return eyeIsOpen.value ? Eye : EyeClosed;
  } else if (props.clearable) {
    return CircleX;
  }
});

// Methods / Functions
const toggleEye = () => {
  eyeIsOpen.value = !eyeIsOpen.value;
};

// input內容清除
const clear = () => {
  emit("update:modelValue", "");
};

const iconClick = () => {
  if (props.type === "password") {
    toggleEye();
  } else {
    clear();
  }
};

// Enter的行為
const handleEnter = () => {
  // 如果在組字就返回
  if (isComposing.value) return;
  // 空白不執行
  if (!props.modelValue) return;
  emit("enter");
};

// input的行爲
const onInput = (e) => {
  const val = e.target.value;
  if (props.type == "password") {
    const filtered = filterAlphaNumeric(val);
    e.target.value = filtered; // 過濾的值重新塞入
    emit("update:modelValue", filtered);
    emit("input", filtered);
  } else {
    emit("update:modelValue", val);
    emit("input", val);
  }
};
</script>

<style lang="scss" scoped>
@use "sass:map";

.be-input {
  @include center;
  gap: 2rem;

  padding: 1.6rem 0;
  box-sizing: border-box;

  .innerInput {
    @include center;
    position: relative;

    flex: 1;

    input {
      @include fieldStyle("default");

      &.small {
        @include fieldStyle("default", small);
      }

      &.disabled {
        @include fieldStyle($status: "disabled");
      }
      &.readonly {
        @include fieldStyle($status: "readonly");
      }
    }
    &.hasValue:hover .icon {
      cursor: pointer;
      opacity: 1;
    }
    .icon {
      @include iconStyle(default);

      position: absolute;
      right: 10px;
      color: getColor(green-01-1);
      opacity: 0;

      transition: opacity 0.3s ease-in-out;
      &.small {
        @include iconStyle(small);
      }
    }
  }
}

.textarea {
  @include center;
  gap: 2rem;
  align-items: start;

  padding: 1.6rem 0;
  box-sizing: border-box;

  .innerTextarea {
    flex: 1;
    textarea {
      @include fieldStyle("textarea");
    }
  }

  &.labelTop {
    flex-direction: column;

    .innerTextarea {
      width: 100%;
    }
  }
}
</style>
