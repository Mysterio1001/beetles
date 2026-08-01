<template>
  <article
    class="be-card glass-surface"
    :class="[
      `be-card--image-${imgPosition}`,
      {
        'has-padding': hasPadding,
        'is-dark': darkMode,
        'is-clickable': clickable,
      },
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate">
    <div
      v-if="imgSrc"
      class="be-card__image"
      :class="{ 'has-cover': imgCover }"
      :data-cover-text="imgCoverText"
      :style="{ '--text-rotate': textRotate }">
      <img
        :src="imgSrc"
        :alt="imgAlt"
        loading="lazy" />
    </div>
    <div class="be-card__content"><slot /></div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  imgPosition: { type: String, default: "top" },
  hasPadding: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  imgCoverTextRotate: { type: Number, default: 45 },
  imgSrc: { type: String, default: "" },
  imgAlt: { type: String, default: "" },
  imgCover: { type: Boolean, default: false },
  imgCoverText: { type: String, default: "" },
  clickable: { type: Boolean, default: false },
});

const emit = defineEmits(["click"]);
const textRotate = computed(() => `${props.imgCoverTextRotate}deg`);

function activate(event) {
  if (props.clickable) emit("click", event);
}
</script>

<style lang="scss" scoped>
.be-card {
  display: flex;
  min-width: 0;
  overflow: hidden;
  border-radius: 2.4rem;
  background: rgba(232, 255, 240, 0.13);
  color: #eafff1;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.be-card.has-padding {
  padding: 1.4rem;
}

.be-card.is-dark {
  background: rgba(7, 40, 28, 0.72);
}

.be-card--image-top {
  flex-direction: column;
}

.be-card--image-right {
  flex-direction: row-reverse;
}

.be-card.is-clickable {
  cursor: pointer;

  &:hover {
    transform: translateY(-0.7rem);
    border-color: rgba(218, 255, 231, 0.38);
    box-shadow: 0 2.4rem 5rem rgba(0, 24, 13, 0.3);
  }

  &:active {
    transform: translateY(-0.2rem) scale(0.99);
  }
}

.be-card__image {
  position: relative;
  flex: 3;
  min-width: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1.6rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 360ms ease;
  }

  &.has-cover::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(235, 255, 242, 0.42);
  }

  &.has-cover::after {
    content: attr(data-cover-text);
    position: absolute;
    top: 50%;
    z-index: 2;
    width: 100%;
    color: rgba(8, 44, 29, 0.58);
    font-size: 3rem;
    font-weight: 900;
    text-align: center;
    transform: translateY(-50%) rotate(var(--text-rotate));
  }
}

.is-clickable:hover .be-card__image img {
  transform: scale(1.035);
}

.be-card__content {
  flex: 7;
  min-width: 0;
  padding: clamp(1.6rem, 3vw, 2.4rem);
}

@media (max-width: 640px) {
  .be-card--image-right {
    flex-direction: column;
  }
}
</style>
