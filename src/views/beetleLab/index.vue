<template>
  <div class="lab-page">
    <header class="lab-intro">
      <p class="lab-eyebrow">{{ t("lab.eyebrow") }}</p>
      <h1>{{ t("lab.title") }}</h1>
      <p>{{ t("lab.description") }}</p>
    </header>

    <div class="lab-workspace">
      <aside class="lab-latest glass-surface">
        <div class="lab-latest__heading">
          <span><Sparkles aria-hidden="true" /></span>
          <div>
            <p class="lab-eyebrow">CURATED NOTES</p>
            <h2>{{ t("lab.latestArticle") }}</h2>
          </div>
        </div>
        <p>{{ t("lab.latestDescription") }}</p>

        <nav :aria-label="t('lab.latestArticle')">
          <RouterLink
            v-for="article in page.latestArticles"
            :key="article.id"
            :to="article.to">
            <time :datetime="article.date">{{ formatDate(article.date) }}</time>
            <strong>{{ article.title }}</strong>
            <ArrowUpRight aria-hidden="true" />
          </RouterLink>
        </nav>
      </aside>

      <section
        class="lab-library"
        aria-labelledby="lab-library-title">
        <header class="lab-library__header">
          <div>
            <h2 id="lab-library-title">{{ t("lab.articleList") }}</h2>
            <p>{{ t("lab.articleListDescription") }}</p>
          </div>
          <p
            class="lab-library__count"
            aria-live="polite">
            {{ t("lab.resultCount", { count: filteredArticles.length }) }}
          </p>
        </header>

        <div class="lab-search glass-surface">
          <Search aria-hidden="true" />
          <BeInput
            v-model="query"
            :label="t('lab.searchLabel')"
            :placeholder="t('lab.searchPlaceholder')"
            type="search" />
        </div>

        <div
          v-if="pagination.items.length"
          class="lab-article-grid">
          <RouterLink
            v-for="article in pagination.items"
            :key="article.id"
            :to="article.to"
            class="lab-article-card glass-surface">
            <span class="lab-article-card__image">
              <img
                :src="article.image"
                :alt="article.title"
                loading="lazy" />
              <span>
                <BookOpenText aria-hidden="true" />
                {{ t("lab.detailEyebrow") }}
              </span>
            </span>
            <span class="lab-article-card__content">
              <time :datetime="article.date">{{ formatDate(article.date) }}</time>
              <strong>{{ article.title }}</strong>
              <span>{{ article.summary }}</span>
              <span class="lab-article-card__action">
                {{ t("lab.readArticle") }}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </span>
          </RouterLink>
        </div>

        <div
          v-else
          class="lab-empty glass-surface">
          <SearchX aria-hidden="true" />
          <h3>{{ t("lab.emptyTitle") }}</h3>
          <p>{{ t("lab.emptyBody") }}</p>
          <button
            type="button"
            @click="query = ''">
            {{ t("lab.clearSearch") }}
          </button>
        </div>

        <BePagination
          v-model="currentPage"
          :total="filteredArticles.length"
          :page-size="ARTICLE_PAGE_SIZE" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowUpRight, BookOpenText, Search, SearchX, Sparkles } from "lucide-vue-next";

import BeInput from "@/components/BeInput.vue";
import BePagination from "@/components/BePagination.vue";
import {
  ARTICLE_PAGE_SIZE,
  filterArticles,
  getArticlePageData,
  paginateArticles,
} from "@/services/articleService";

const { locale, t } = useI18n();
const query = ref("");
const currentPage = ref(1);

const page = computed(() => getArticlePageData(locale.value));
const filteredArticles = computed(() => filterArticles(page.value.articles, query.value));
const pagination = computed(() =>
  paginateArticles(filteredArticles.value, currentPage.value, ARTICLE_PAGE_SIZE),
);

function formatDate(date) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

watch([query, locale], () => {
  currentPage.value = 1;
});

watch(
  () => pagination.value.page,
  (safePage) => {
    if (safePage !== currentPage.value) currentPage.value = safePage;
  },
);
</script>
