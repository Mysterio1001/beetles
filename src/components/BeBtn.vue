<template>
  <button
    class="be-button"
    :class="[`be-button--${variant}`, size && `be-button--${size}`]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined">
    <span
      v-if="loading"
      class="be-button__spinner"
      aria-hidden="true" />
    <span class="be-button__content"><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: "button" },
  variant: { type: String, default: "primary" },
  size: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.be-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: 4.4rem;
  padding: 0.8rem 1.8rem;
  border: 1px solid rgba(218, 255, 231, 0.24);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(111, 228, 150, 0.88), rgba(38, 151, 86, 0.9));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 1rem 2.4rem rgba(4, 55, 28, 0.22);
  color: #052a18;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 1.5rem 3rem rgba(4, 55, 28, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }
}

.be-button--secondary {
  background: rgba(224, 255, 235, 0.1);
  color: #effff5;
}

.be-button--danger {
  background: rgba(255, 127, 127, 0.16);
  border-color: rgba(255, 177, 177, 0.34);
  color: #ffe9e9;
}

.be-button--l {
  min-height: 5.2rem;
  padding-inline: 2.4rem;
  font-size: 1.8rem;
}

.be-button--s {
  min-height: 3.6rem;
  padding: 0.6rem 1.3rem;
  font-size: 1.3rem;
}

.be-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.be-button__spinner {
  width: 1.6rem;
  height: 1.6rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 700ms linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
