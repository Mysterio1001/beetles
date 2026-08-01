<template>
  <div class="home-page">
    <section
      class="home-hero"
      aria-labelledby="home-hero-title">
      <div
        class="home-hero__glow"
        aria-hidden="true" />
      <div class="home-hero__content">
        <p class="home-eyebrow">{{ page.hero.eyebrow }}</p>
        <h1 id="home-hero-title">{{ page.hero.title }}</h1>
        <p class="home-hero__description">{{ page.hero.description }}</p>
        <div class="home-hero__actions">
          <RouterLink
            class="home-action home-action--primary"
            to="/beetle-shop">
            {{ t("home.primaryAction") }}
            <ArrowUpRight aria-hidden="true" />
          </RouterLink>
          <RouterLink
            class="home-action"
            to="/beetle-lab">
            {{ t("home.secondaryAction") }}
          </RouterLink>
        </div>
      </div>

      <div class="home-hero__visual glass-surface">
        <picture>
          <source
            media="(max-width: 640px)"
            :srcset="page.hero.imageMobile" />
          <img
            :src="page.hero.image"
            :alt="page.hero.title" />
        </picture>
        <span
          class="home-hero__orbit home-hero__orbit--one"
          aria-hidden="true" />
        <span
          class="home-hero__orbit home-hero__orbit--two"
          aria-hidden="true" />
      </div>
    </section>

    <section
      class="home-brand glass-surface"
      :aria-label="t('home.brandSection')">
      <div class="home-brand__image">
        <img
          :src="page.brand.image"
          :alt="page.brand.title"
          loading="lazy" />
      </div>
      <div class="home-brand__content">
        <p class="home-eyebrow">{{ page.brand.eyebrow }}</p>
        <h2>{{ page.brand.title }}</h2>
        <p>{{ page.brand.description }}</p>
        <ul class="home-brand__pillars">
          <li
            v-for="pillar in page.brand.pillars"
            :key="pillar.id">
            <component
              :is="pillarIcon(pillar.id)"
              aria-hidden="true" />
            <span>
              <strong>{{ pillar.title }}</strong>
              <small>{{ pillar.description }}</small>
            </span>
          </li>
        </ul>
      </div>
    </section>

    <section
      class="home-section home-products"
      aria-labelledby="home-products-title">
      <header class="home-section__header">
        <div>
          <p class="home-eyebrow">{{ t("home.productsEyebrow") }}</p>
          <h2 id="home-products-title">{{ t("home.productsTitle") }}</h2>
          <p>{{ t("home.productsDescription") }}</p>
        </div>
        <RouterLink
          class="home-section__all"
          to="/beetle-shop">
          {{ t("home.allProducts") }}
          <ArrowRight aria-hidden="true" />
        </RouterLink>
      </header>

      <div class="home-products__grid">
        <RouterLink
          v-for="product in page.featuredProducts"
          :key="product.id"
          class="home-product-card glass-surface"
          :to="product.to">
          <div class="home-product-card__image">
            <img
              :src="product.image"
              :alt="product.name"
              loading="lazy" />
            <span>{{ product.badge }}</span>
          </div>
          <div class="home-product-card__content">
            <p>{{ product.scientificName }}</p>
            <h3>{{ product.name }}</h3>
            <span class="home-card-link">
              {{ t("home.viewProduct") }}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section
      class="home-section home-articles"
      aria-labelledby="home-articles-title">
      <header class="home-section__header">
        <div>
          <p class="home-eyebrow">{{ t("home.articlesEyebrow") }}</p>
          <h2 id="home-articles-title">{{ t("home.articlesTitle") }}</h2>
          <p>{{ t("home.articlesDescription") }}</p>
        </div>
        <RouterLink
          class="home-section__all"
          to="/beetle-lab">
          {{ t("home.allArticles") }}
          <ArrowRight aria-hidden="true" />
        </RouterLink>
      </header>

      <div class="home-articles__grid">
        <RouterLink
          v-for="article in page.featuredArticles"
          :key="article.id"
          class="home-article-card glass-surface"
          :to="article.to">
          <div class="home-article-card__image">
            <img
              :src="article.image"
              :alt="article.title"
              loading="lazy" />
            <span>{{ article.meta }}</span>
          </div>
          <div class="home-article-card__content">
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <span class="home-card-link">
              {{ t("home.readArticle") }}
              <ArrowRight aria-hidden="true" />
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowRight, ArrowUpRight, BookOpenCheck, HeartHandshake, Leaf } from "lucide-vue-next";

import { getHomePageData } from "@/services/homeService";

const { locale, t } = useI18n();
const page = computed(() => getHomePageData(locale.value));
const pillarIcons = {
  responsible: Leaf,
  recorded: BookOpenCheck,
  guided: HeartHandshake,
};

function pillarIcon(id) {
  return pillarIcons[id] || Leaf;
}
</script>
