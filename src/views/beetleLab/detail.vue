<template>
  <div class="lab-detail-page">
    <template v-if="article">
      <RouterLink
        class="lab-detail-back"
        to="/beetle-lab">
        <ArrowLeft aria-hidden="true" />
        {{ t("lab.backToLab") }}
      </RouterLink>

      <article class="lab-detail">
        <header class="lab-detail__hero glass-surface">
          <div class="lab-detail__intro">
            <p class="lab-eyebrow">{{ t("lab.detailEyebrow") }}</p>
            <time :datetime="article.date">
              <CalendarDays aria-hidden="true" />
              {{ t("lab.publishedAt", { date: formatDate(article.date) }) }}
            </time>
            <h1>{{ article.title }}</h1>
            <p>{{ article.summary }}</p>
          </div>
          <figure>
            <img
              :src="article.image"
              :alt="article.title" />
          </figure>
        </header>

        <section
          class="lab-detail__body glass-surface"
          aria-labelledby="lab-article-body-title">
          <div class="lab-detail__body-heading">
            <span><BookOpenText aria-hidden="true" /></span>
            <div>
              <h2 id="lab-article-body-title">{{ t("lab.articleBodyTitle") }}</h2>
              <p>{{ t("lab.articleBodyDescription") }}</p>
            </div>
          </div>
          <p class="lab-detail__copy">{{ article.content }}</p>
        </section>
      </article>
    </template>

    <section
      v-else
      class="lab-detail-missing glass-surface">
      <SearchX aria-hidden="true" />
      <p class="lab-eyebrow">{{ t("lab.notFoundEyebrow") }}</p>
      <h1>{{ t("lab.notFoundTitle") }}</h1>
      <p>{{ t("lab.notFoundBody") }}</p>
      <RouterLink to="/beetle-lab">
        <ArrowLeft aria-hidden="true" />
        {{ t("lab.backToLab") }}
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ArrowLeft, BookOpenText, CalendarDays, SearchX } from "lucide-vue-next";

import { getArticleById } from "@/services/articleService";

const route = useRoute();
const { locale, t } = useI18n();
const articleId = computed(() => String(route.params.articleId || ""));
const article = computed(() => getArticleById(locale.value, articleId.value));

function formatDate(date) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
</script>
