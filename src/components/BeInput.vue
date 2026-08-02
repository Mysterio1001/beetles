<template>
  <div
    class="be-field"
    :class="[`be-field--${size}`, { 'has-error': error }]">
    <label
      v-if="label"
      :for="inputId"
      :style="{ width: labelWidth }">
      {{ label }}
    </label>
    <slot name="prefix" />

    <div
      v-if="type !== 'textarea'"
      class="be-field__control">
      <input
        v-bind="$attrs"
        :id="inputId"
        :value="modelValue"
        :type="currentType"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        @input="onInput"
        @keydown.enter="handleEnter"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false" />
      <button
        v-if="showAction"
        class="be-field__action"
        type="button"
        :aria-label="actionLabel"
        @click="handleAction">
        <EyeOff
          v-if="type === 'password' && eyeIsOpen"
          aria-hidden="true" />
        <Eye
          v-else-if="type === 'password'"
          aria-hidden="true" />
        <X
          v-else
          aria-hidden="true" />
      </button>
    </div>

    <div
      v-else
      class="be-field__control be-field__control--textarea">
      <textarea
        v-bind="$attrs"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        @input="onInput"
        @keydown.enter="handleEnter"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false" />
    </div>

    <slot name="suffix" />
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="be-field__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Eye, EyeOff, X } from "lucide-vue-next";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  type: { type: String, default: "text" },
  label: { type: String, default: "" },
  labelWidth: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  labelTop: { type: Boolean, default: false },
  size: { type: String, default: "default" },
  clearable: { type: Boolean, default: true },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  maxlength: { type: Number, default: undefined },
  error: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "enter", "input"]);
const { t } = useI18n();
const inputId = ref(`input-${Math.random().toString(36).slice(2, 9)}`);
const eyeIsOpen = ref(false);
const isComposing = ref(false);

const currentType = computed(() => {
  if (props.type !== "password") return props.type;
  return eyeIsOpen.value ? "text" : "password";
});

const showAction = computed(
  () =>
    !props.disabled &&
    !props.readonly &&
    (props.type === "password" || (props.clearable && String(props.modelValue).length)),
);

const actionLabel = computed(() => {
  if (props.type !== "password") return t("common.clearField");
  return t(eyeIsOpen.value ? "common.hidePassword" : "common.showPassword");
});

function handleAction() {
  if (props.type === "password") eyeIsOpen.value = !eyeIsOpen.value;
  else emit("update:modelValue", "");
}

function handleEnter() {
  if (!isComposing.value) emit("enter");
}

function onInput(event) {
  const value = event.target.value;
  emit("update:modelValue", value);
  emit("input", value);
}
</script>

<style lang="scss" scoped>
.be-field {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem 1.2rem;
  width: 100%;

  label {
    color: rgba(240, 255, 246, 0.82);
    font-weight: 700;
  }
}

.be-field__control {
  position: relative;

  input,
  textarea {
    width: 100%;
    min-height: 4.4rem;
    padding: 0.8rem 4.2rem 0.8rem 1.3rem;
    border: 1px solid rgba(218, 255, 231, 0.22);
    border-radius: 1.4rem;
    background: rgba(235, 255, 242, 0.11);
    color: #effff5;
    outline: 0;
    transition:
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;

    &::placeholder {
      color: rgba(220, 248, 230, 0.42);
    }

    &:hover:not(:disabled, :read-only) {
      background: rgba(235, 255, 242, 0.16);
      border-color: rgba(218, 255, 231, 0.38);
    }

    &:focus-visible {
      border-color: #a8f7c1;
      box-shadow: 0 0 0 3px rgba(136, 239, 171, 0.18);
    }

    &:disabled,
    &:read-only {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 12rem;
    resize: vertical;
    padding-right: 1.3rem;
  }
}

.be-field__action {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: rgba(231, 255, 239, 0.62);
  cursor: pointer;
  transform: translateY(-50%);

  &:hover {
    background: rgba(224, 255, 235, 0.12);
    color: #fff;
  }

  svg {
    width: 1.7rem;
  }
}

.be-field--page input,
.be-field--small input {
  min-height: 3.6rem;
  border-radius: 1rem;
  font-size: 1.3rem;
}

.be-field__error {
  grid-column: 2;
  color: #ffc3c3;
  font-size: 1.3rem;
}

.has-error input,
.has-error textarea {
  border-color: #ffaaaa;
}
</style>
