<template>
  <div class="news-page">
    <header class="news-intro">
      <p class="news-eyebrow">{{ t("news.eyebrow") }}</p>
      <h1>{{ t("news.title") }}</h1>
      <p>{{ t("news.description") }}</p>
    </header>

    <section
      class="news-carousel glass-surface"
      :aria-label="t('news.featured')">
      <div class="news-carousel__media">
        <Transition
          name="news-slide"
          mode="out-in">
          <img
            :key="currentSlide.id"
            :src="currentSlide.image"
            :alt="currentSlide.title" />
        </Transition>
      </div>
      <div class="news-carousel__content">
        <p class="news-eyebrow">{{ t("news.featured") }}</p>
        <Transition
          name="news-copy"
          mode="out-in">
          <div
            :key="currentSlide.id"
            aria-live="polite">
            <h2>{{ currentSlide.title }}</h2>
            <p>{{ currentSlide.description }}</p>
          </div>
        </Transition>

        <div class="news-carousel__controls">
          <button
            type="button"
            :aria-label="t('news.previousSlide')"
            @click="moveSlide(-1)">
            <ArrowLeft aria-hidden="true" />
          </button>
          <div class="news-carousel__dots">
            <button
              v-for="(slide, index) in page.slides"
              :key="slide.id"
              type="button"
              :class="{ 'is-active': index === currentSlideIndex }"
              :aria-label="t('news.goToSlide', { number: index + 1 })"
              :aria-current="index === currentSlideIndex ? 'true' : undefined"
              @click="selectSlide(index)" />
          </div>
          <button
            type="button"
            :aria-label="t('news.nextSlide')"
            @click="moveSlide(1)">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>

    <section
      class="news-list"
      aria-labelledby="news-list-title">
      <header class="news-list__header">
        <h2 id="news-list-title">{{ t("news.listTitle") }}</h2>
        <div
          class="news-categories"
          role="group"
          :aria-label="t('news.listTitle')">
          <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            :class="{ 'is-active': activeCategory === category.value }"
            :aria-pressed="activeCategory === category.value"
            @click="activeCategory = category.value">
            <component
              :is="category.icon"
              aria-hidden="true" />
            {{ category.label }}
            <span>{{ categoryCount(category.value) }}</span>
          </button>
        </div>
      </header>

      <div
        v-if="filteredItems.length"
        class="news-grid">
        <button
          v-for="item in filteredItems"
          :key="item.id"
          class="news-card glass-surface"
          type="button"
          @click="openItem(item.id)">
          <span class="news-card__image">
            <img
              :src="item.image"
              :alt="item.title"
              loading="lazy" />
            <span class="news-card__category">
              <component
                :is="categoryIcon(item.category)"
                aria-hidden="true" />
              {{ t(`news.${item.category}`) }}
            </span>
          </span>
          <span class="news-card__content">
            <time :datetime="item.date">{{ formatDate(item.date) }}</time>
            <strong>{{ item.title }}</strong>
            <span>{{ item.content }}</span>
            <span class="news-card__action">
              {{ t("news.readMore") }}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>

      <div
        v-else
        class="news-empty glass-surface">
        <SearchX aria-hidden="true" />
        <h3>{{ t("news.emptyTitle") }}</h3>
        <p>{{ t("news.emptyBody") }}</p>
      </div>
    </section>

    <BeDialog
      v-model:visible="dialogVisible"
      :title="selectedItem?.title || ''"
      :show-footer-btn="false"
      @close="closeItem">
      <article
        v-if="selectedItem"
        class="news-detail">
        <img
          :src="selectedItem.image"
          :alt="selectedItem.title" />
        <div class="news-detail__meta">
          <span>
            <component
              :is="categoryIcon(selectedItem.category)"
              aria-hidden="true" />
            {{ t(`news.${selectedItem.category}`) }}
          </span>
          <time :datetime="selectedItem.date">
            {{ t("news.publishedAt", { date: formatDate(selectedItem.date) }) }}
          </time>
        </div>
        <p>{{ selectedItem.content }}</p>
      </article>
    </BeDialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bug,
  CalendarDays,
  Megaphone,
  NotebookPen,
  SearchX,
} from "lucide-vue-next";

import BeDialog from "@/components/BeDialog.vue";
import {
  canAutoplayNewsCarousel,
  filterNewsItems,
  getNewsItemById,
  getNewsPageData,
} from "@/services/newsService";

const { locale, t } = useI18n();
const page = computed(() => getNewsPageData(locale.value));
const activeCategory = ref("all");
const currentSlideIndex = ref(0);
const dialogVisible = ref(false);
const selectedItemId = ref("");
const prefersReducedMotion = ref(false);
let carouselTimer;
let motionQuery;

const categoryIcons = {
  all: Bug,
  announcement: Megaphone,
  event: CalendarDays,
  breedingInfo: NotebookPen,
};

const categories = computed(() =>
  Object.keys(categoryIcons).map((value) => ({
    value,
    label: t(`news.${value}`),
    icon: categoryIcons[value],
  })),
);

const currentSlide = computed(() => page.value.slides[currentSlideIndex.value]);
const filteredItems = computed(() => filterNewsItems(page.value.items, activeCategory.value));
const selectedItem = computed(() =>
  selectedItemId.value ? getNewsItemById(locale.value, selectedItemId.value) : null,
);

function categoryIcon(category) {
  return categoryIcons[category] || Bug;
}

function categoryCount(category) {
  return filterNewsItems(page.value.items, category).length;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function stopCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = undefined;
}

function startCarousel() {
  stopCarousel();
  if (!canAutoplayNewsCarousel(page.value.slides.length, prefersReducedMotion.value)) return;
  carouselTimer = window.setInterval(() => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % page.value.slides.length;
  }, 5500);
}

function selectSlide(index) {
  currentSlideIndex.value = index;
  startCarousel();
}

function moveSlide(direction) {
  const total = page.value.slides.length;
  selectSlide((currentSlideIndex.value + direction + total) % total);
}

function openItem(id) {
  selectedItemId.value = id;
  dialogVisible.value = true;
}

function closeItem() {
  dialogVisible.value = false;
}

function syncMotionPreference(event) {
  prefersReducedMotion.value = event.matches;
  startCarousel();
}

watch(dialogVisible, (visible) => {
  if (!visible) selectedItemId.value = "";
});

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = motionQuery.matches;
  motionQuery.addEventListener("change", syncMotionPreference);
  startCarousel();
});

onBeforeUnmount(() => {
  stopCarousel();
  motionQuery?.removeEventListener("change", syncMotionPreference);
});
</script>
