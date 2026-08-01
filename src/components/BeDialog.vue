<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="visible"
        class="be-dialog__backdrop"
        @mousedown.self="closeDialog">
        <section
          ref="dialogRef"
          class="be-dialog glass-surface"
          :class="{ 'be-dialog--small': type !== 'custom' }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          @keydown="handleKeydown">
          <header class="be-dialog__header">
            <h2 :id="titleId">
              {{ type === "alert" ? prompt || t("common.warning") : title }}
            </h2>
            <button
              class="be-dialog__close"
              type="button"
              :aria-label="t('common.close')"
              @click="closeDialog">
              <X aria-hidden="true" />
            </button>
          </header>

          <div
            v-if="type === 'custom'"
            class="be-dialog__content">
            <slot />
          </div>
          <p
            v-else
            class="be-dialog__message">
            {{ message }}
          </p>

          <footer
            v-if="$slots.footer || showFooterBtn"
            class="be-dialog__footer">
            <slot
              v-if="$slots.footer"
              name="footer" />
            <template v-else>
              <BeBtn
                v-if="type !== 'alert'"
                @click="handleConfirm">
                {{ t("common.confirm") }}
              </BeBtn>
              <BeBtn
                variant="secondary"
                @click="closeDialog">
                {{ t(type === "alert" ? "common.confirm" : "common.cancel") }}
              </BeBtn>
            </template>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { X } from "lucide-vue-next";

const props = defineProps({
  title: { type: String, default: "" },
  visible: { type: Boolean, default: false },
  type: { type: String, default: "custom" },
  prompt: { type: String, default: "" },
  message: { type: String, default: "" },
  showFooterBtn: { type: Boolean, default: true },
});

const emit = defineEmits(["update:visible", "close", "confirm"]);
const { t } = useI18n();
const dialogRef = ref(null);
const titleId = `dialog-${Math.random().toString(36).slice(2, 9)}`;
let previouslyFocusedElement;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function closeDialog() {
  emit("close");
  emit("update:visible", false);
}

function handleConfirm() {
  emit("confirm");
  emit("update:visible", false);
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeDialog();
    return;
  }

  if (event.key !== "Tab") return;
  const focusableElements = [...dialogRef.value.querySelectorAll(focusableSelector)];
  if (!focusableElements.length) {
    event.preventDefault();
    dialogRef.value.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function unlockPage() {
  document.body.style.removeProperty("overflow");
  previouslyFocusedElement?.focus?.();
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      unlockPage();
      return;
    }

    previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = "hidden";
    await nextTick();
    const firstFocusable = dialogRef.value?.querySelector(focusableSelector);
    (firstFocusable || dialogRef.value)?.focus();
  },
);

onBeforeUnmount(unlockPage);
</script>

<style lang="scss" scoped>
.be-dialog__backdrop {
  position: fixed;
  inset: 0;
  z-index: z(dialog);
  display: grid;
  place-items: center;
  padding: 1.6rem;
  background: rgba(0, 15, 9, 0.68);
  backdrop-filter: blur(8px);
}

.be-dialog {
  display: grid;
  gap: 1.8rem;
  width: min(76rem, 100%);
  max-height: min(86dvh, 82rem);
  padding: clamp(2rem, 4vw, 3.2rem);
  overflow: hidden;
  border-radius: 2.8rem;
  background: rgba(15, 61, 43, 0.94);
  color: #eafff1;
}

.be-dialog--small {
  width: min(42rem, 100%);
}

.be-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
  }
}

.be-dialog__close {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 4rem;
  height: 4rem;
  padding: 0;
  border: 1px solid rgba(220, 255, 233, 0.18);
  border-radius: 50%;
  background: rgba(220, 255, 233, 0.08);
  color: #f4fff8;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background-color 160ms ease;

  &:hover {
    transform: rotate(8deg) scale(1.06);
    background: rgba(220, 255, 233, 0.16);
  }
}

.be-dialog__content {
  overflow-y: auto;
  overscroll-behavior: contain;
}

.be-dialog__message {
  color: rgba(235, 255, 242, 0.78);
}

.be-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(218, 255, 231, 0.14);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 180ms ease;

  .be-dialog {
    transition:
      transform 220ms ease,
      opacity 180ms ease;
  }
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;

  .be-dialog {
    opacity: 0;
    transform: translateY(1.2rem) scale(0.97);
  }
}
</style>
