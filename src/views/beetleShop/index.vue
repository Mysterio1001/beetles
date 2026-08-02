<template>
  <div class="shop-page">
    <header class="shop-intro">
      <p class="shop-eyebrow">{{ t("shop.eyebrow") }}</p>
      <h1>{{ t("shop.title") }}</h1>
      <p>{{ t("shop.description") }}</p>
    </header>

    <section
      class="shop-controls glass-surface"
      :aria-label="t('shop.controlsLabel')">
      <div class="shop-search-control">
        <Search aria-hidden="true" />
        <BeInput
          v-model="query"
          :label="t('shop.searchLabel')"
          :placeholder="t('shop.searchPlaceholder')"
          type="search" />
      </div>

      <BeSelect
        v-model="sortId"
        :label="t('shop.sortLabel')"
        :options="sortOptions" />

      <button
        ref="filterTrigger"
        class="shop-filter-trigger"
        type="button"
        aria-controls="shop-category-panel"
        :aria-expanded="isFilterOpen"
        @click="openFilters">
        <SlidersHorizontal aria-hidden="true" />
        <span>
          <small>{{ t("shop.openFilters") }}</small>
          <strong>{{ selectedCategory.label }}</strong>
        </span>
        <ChevronRight aria-hidden="true" />
      </button>
    </section>

    <div class="shop-workspace">
      <button
        v-if="isFilterOpen"
        class="shop-filter-backdrop"
        type="button"
        :aria-label="t('shop.closeFilters')"
        @click="closeFilters()" />

      <aside
        id="shop-category-panel"
        ref="filterPanel"
        class="shop-categories glass-surface"
        :class="{ 'is-open': isFilterOpen }"
        :inert="isMobileViewport && !isFilterOpen"
        :role="isFilterOpen ? 'dialog' : undefined"
        :aria-modal="isFilterOpen ? 'true' : undefined"
        :aria-hidden="isMobileViewport && !isFilterOpen ? 'true' : undefined"
        aria-labelledby="shop-category-title"
        @keydown="handlePanelKeydown">
        <header class="shop-categories__header">
          <div>
            <p class="shop-eyebrow">{{ t("shop.filterEyebrow") }}</p>
            <h2 id="shop-category-title">{{ t("shop.categoryTitle") }}</h2>
          </div>
          <button
            ref="filterClose"
            type="button"
            :aria-label="t('shop.closeFilters')"
            @click="closeFilters()">
            <X aria-hidden="true" />
          </button>
        </header>
        <p>{{ t("shop.categoryDescription") }}</p>

        <nav :aria-label="t('shop.categoryTitle')">
          <button
            v-for="category in page.categories"
            :key="category.id"
            type="button"
            :class="{ 'is-current': selectedCategoryId === category.id }"
            :aria-pressed="selectedCategoryId === category.id"
            @click="selectCategory(category.id)">
            <span>{{ category.label }}</span>
            <small>
              {{ t("shop.categoryCount", { count: categoryCounts[category.id] }) }}
            </small>
          </button>
        </nav>
      </aside>

      <section
        class="shop-catalog"
        aria-labelledby="shop-catalog-title">
        <header class="shop-catalog__header">
          <div>
            <p class="shop-eyebrow">{{ t("shop.catalogEyebrow") }}</p>
            <h2 id="shop-catalog-title">{{ t("shop.catalogTitle") }}</h2>
            <p>{{ t("shop.catalogDescription") }}</p>
          </div>
          <div class="shop-catalog__meta">
            <p aria-live="polite">
              {{ t("shop.resultCount", { count: filteredProducts.length }) }}
            </p>
            <small>
              {{ t("shop.activeCategory", { category: selectedCategory.label }) }}
            </small>
          </div>
        </header>

        <div
          v-if="pagination.items.length"
          class="shop-product-grid">
          <RouterLink
            v-for="product in pagination.items"
            :key="product.id"
            :to="product.to"
            class="shop-product-card glass-surface">
            <span
              class="shop-product-card__image"
              :class="{ 'has-image-error': failedImageIds.has(product.id) }">
              <img
                v-if="!failedImageIds.has(product.id)"
                :src="product.image"
                :alt="product.name"
                loading="lazy"
                @error="handleImageError(product.id)" />
              <span
                v-else
                class="shop-product-card__fallback">
                <ImageOff aria-hidden="true" />
                {{ t("shop.imageUnavailable") }}
              </span>
              <span
                v-if="product.categories.includes('new')"
                class="shop-product-card__new">
                {{ t("shop.newBadge") }}
              </span>
              <span
                class="shop-product-card__availability"
                :class="`is-${product.availability}`">
                {{ t(`shop.availability.${product.availability}`) }}
              </span>
            </span>

            <span class="shop-product-card__content">
              <span class="shop-product-card__title-row">
                <strong>{{ product.name }}</strong>
                <span>{{ formatPrice(product.price) }}</span>
              </span>
              <em>{{ product.scientificName }}</em>
              <span class="shop-product-card__footer">
                <span>
                  <CircleCheck
                    v-if="product.availability === 'available'"
                    aria-hidden="true" />
                  <CircleOff
                    v-else
                    aria-hidden="true" />
                  {{ t(`shop.availability.${product.availability}`) }}
                </span>
                <span>
                  {{ t("shop.viewProduct") }}
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </span>
            </span>
          </RouterLink>
        </div>

        <div
          v-else
          class="shop-empty glass-surface">
          <PackageSearch aria-hidden="true" />
          <h3>{{ t("shop.emptyTitle") }}</h3>
          <p>{{ t("shop.emptyBody") }}</p>
          <button
            type="button"
            @click="resetFilters">
            {{ t("shop.resetFilters") }}
          </button>
        </div>

        <BePagination
          v-model="currentPage"
          :total="filteredProducts.length"
          :page-size="SHOP_PAGE_SIZE" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  CircleOff,
  ImageOff,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-vue-next";

import {
  CATALOG_SORT_IDS,
  SHOP_PAGE_SIZE,
  getCatalogPageData,
  paginateCatalogProducts,
  queryCatalogProducts,
} from "@/services/catalogService";

const MOBILE_FILTER_BREAKPOINT = 820;

const { locale, t } = useI18n();
const query = ref("");
const sortId = ref("default");
const selectedCategoryId = ref("all");
const currentPage = ref(1);
const isFilterOpen = ref(false);
const isMobileViewport = ref(false);
const filterTrigger = ref(null);
const filterClose = ref(null);
const filterPanel = ref(null);
const failedImageIds = ref(new Set());

const page = computed(() => getCatalogPageData(locale.value));
const sortOptions = computed(() =>
  CATALOG_SORT_IDS.map((id) => ({ value: id, label: t(`shop.sort.${id}`) })),
);
const selectedCategory = computed(
  () =>
    page.value.categories.find((category) => category.id === selectedCategoryId.value) ??
    page.value.categories[0],
);
const categoryCounts = computed(() =>
  Object.fromEntries(
    page.value.categories.map((category) => [
      category.id,
      queryCatalogProducts(page.value.products, { categoryId: category.id }).length,
    ]),
  ),
);
const filteredProducts = computed(() =>
  queryCatalogProducts(page.value.products, {
    query: query.value,
    categoryId: selectedCategoryId.value,
    sortId: sortId.value,
  }),
);
const pagination = computed(() =>
  paginateCatalogProducts(filteredProducts.value, currentPage.value, SHOP_PAGE_SIZE),
);

function formatPrice(price) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(price);
}

function openFilters() {
  if (isFilterOpen.value) return;
  isFilterOpen.value = true;
  document.body.classList.add("shop-filter-open");
  nextTick(() => filterClose.value?.focus());
}

function closeFilters(restoreFocus = true) {
  if (!isFilterOpen.value) return;
  isFilterOpen.value = false;
  document.body.classList.remove("shop-filter-open");
  if (restoreFocus) nextTick(() => filterTrigger.value?.focus());
}

function selectCategory(categoryId) {
  selectedCategoryId.value = categoryId;
  currentPage.value = 1;
  if (isMobileViewport.value) closeFilters(false);
}

function resetFilters() {
  query.value = "";
  sortId.value = "default";
  selectedCategoryId.value = "all";
  currentPage.value = 1;
}

function handleImageError(productId) {
  failedImageIds.value = new Set([...failedImageIds.value, productId]);
}

function handleKeydown(event) {
  if (event.key === "Escape" && isFilterOpen.value) closeFilters();
}

function handlePanelKeydown(event) {
  if (event.key !== "Tab" || !isMobileViewport.value || !isFilterOpen.value) return;

  const focusable = Array.from(filterPanel.value?.querySelectorAll("button:not([disabled])") ?? []);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleResize() {
  isMobileViewport.value = window.innerWidth <= MOBILE_FILTER_BREAKPOINT;
  if (!isMobileViewport.value && isFilterOpen.value) closeFilters(false);
}

watch([query, selectedCategoryId, sortId, locale], () => {
  currentPage.value = 1;
});

watch(
  () => pagination.value.page,
  (safePage) => {
    if (safePage !== currentPage.value) currentPage.value = safePage;
  },
);

onMounted(() => {
  handleResize();
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleResize);
  document.body.classList.remove("shop-filter-open");
});
</script>
