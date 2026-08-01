<template>
  <div
    class="be-select"
    :class="[`be-select--${size}`, { 'has-error': error }]">
    <label
      v-if="label"
      :for="selectId"
      :style="{ width: labelWidth }">
      {{ label }}
    </label>
    <slot name="prefix" />
    <div class="be-select__control">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${selectId}-error` : undefined"
        @change="handleChange">
        <option
          v-if="placeholder"
          value=""
          disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown aria-hidden="true" />
    </div>
    <slot name="suffix" />
    <p
      v-if="error"
      :id="`${selectId}-error`"
      class="be-select__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  labelWidth: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  size: { type: String, default: "default" },
  disabled: { type: Boolean, default: false },
  options: { type: Array, required: true },
  error: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "select"]);
const selectId = ref(`select-${Math.random().toString(36).slice(2, 9)}`);

function handleChange(event) {
  const option = props.options.find((item) => String(item.value) === event.target.value);
  const value = option?.value ?? event.target.value;
  emit("update:modelValue", value);
  emit("select", option);
}
</script>

<style lang="scss" scoped>
.be-select {
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

.be-select__control {
  position: relative;

  select {
    width: 100%;
    min-height: 4.4rem;
    appearance: none;
    padding: 0.8rem 4rem 0.8rem 1.3rem;
    border: 1px solid rgba(218, 255, 231, 0.22);
    border-radius: 1.4rem;
    background: rgba(235, 255, 242, 0.11);
    color: #effff5;
    cursor: pointer;
    transition:
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;

    &:hover:not(:disabled) {
      background: rgba(235, 255, 242, 0.17);
      border-color: rgba(218, 255, 231, 0.38);
    }

    &:disabled {
      opacity: 0.48;
      cursor: not-allowed;
    }

    option {
      background: #123b2a;
      color: #effff5;
    }
  }

  svg {
    position: absolute;
    top: 50%;
    right: 1.2rem;
    width: 1.8rem;
    transform: translateY(-50%);
    pointer-events: none;
  }
}

.be-select--page .be-select__control select,
.be-select--small .be-select__control select {
  min-height: 3.6rem;
  padding-block: 0.5rem;
  border-radius: 1rem;
  font-size: 1.3rem;
}

.be-select__error {
  grid-column: 2;
  color: #ffc3c3;
  font-size: 1.3rem;
}

.has-error select {
  border-color: #ffaaaa;
}
</style>
