<template>
  <div
    class="input"
    v-if="type != 'textarea'">
    <!-- 前方插槽 -->
    <label
      class="label"
      v-if="label"
      :for="inputId">
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

const props = defineProps({
  modelValue: String, // 父元件v-model
  type: {
    type: String, // 類型text, password
    default: "text",
  },
  label: String, //欄位標題
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

// input id 唯一值
const inputId = ref(`input-${Math.random().toString(36).slice(2, 8)}`);

// 密碼查看icon 切換
const eyeIsOpen = ref(false);

const toggleEye = () => {
  eyeIsOpen.value = !eyeIsOpen.value;
};

const currentType = computed(() => {
  if (props.type !== "password") {
    return props.type;
  } else {
    return eyeIsOpen.value ? "text" : "password";
  }
});

// input內容清除
const clear = () => {
  emit("update:modelValue", "");
};

// icon集合管理
const iconComponent = computed(() => {
  if (props.type == "password") {
    return eyeIsOpen.value ? Eye : EyeClosed;
  } else if (props.clearable) {
    return CircleX;
  }
});

const iconClick = () => {
  if (props.type === "password") {
    toggleEye();
  } else {
    clear();
  }
};

// Enter的行為
// 是否正在組字(中日等需要組字的輸入法判斷)
const isComposing = ref(false);

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
// input樣式
@mixin inputStyle($type: default, $size: default, $status: null) {
  $size-config: map.get($input-sizes, $size);
  $padding: map.get($size-config, padding);
  // 基礎樣式
  padding: $padding;
  box-sizing: border-box;
  width: 100%;

  border-radius: radius(input);
  border: none;
  outline: none; /* 移除點選時的藍框 */
  transition: box-shadow 0.5s ease-in-out;

  @if $type == "textarea" {
    min-height: 100px;
  }
  // bgc
  background-color: getColor(green-01);

  @if $status == "disabled" {
    cursor: not-allowed;
    background-color: getColor(gray-01);
    color: getColor(text-gray);
  } @else if $status == "readonly" {
    background-color: getColor(gray-01);
    &:focus {
      background-color: getColor(gray-01);
      box-shadow: none;
    }
  } @else {
    &:focus {
      background-color: getColor(white);
      box-shadow: inset 0 0 0 2px getColor(green-03);
      @if ($size == small and $type != "textarea") {
        box-shadow: inset 0 0 0 1px;
      }
    }
  }
}
// icon樣式
@mixin iconStyle($size: default) {
  $size-config: map.get($input-sizes, $size);
  $icon-size: map.get($size-config, icon-size);
  width: $icon-size;
  height: $icon-size;
}

.input {
  @include center;
  gap: 2rem;

  padding: 1.6rem 0;
  box-sizing: border-box;

  .innerInput {
    @include center;
    position: relative;

    flex: 1;

    input {
      @include inputStyle("default");

      &.small {
        @include inputStyle("default", small);
      }

      &.disabled {
        @include inputStyle($status: "disabled");
      }
      &.readonly {
        @include inputStyle($status: "readonly");
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
      @include inputStyle("textarea");
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
