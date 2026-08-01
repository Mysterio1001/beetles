<template>
  <div class="bulletin-page">
    <section class="bulletin-hero">
      <div class="bulletin-hero__copy">
        <p class="bulletin-eyebrow">{{ page.hero.eyebrow }}</p>
        <h1>{{ page.hero.title }}</h1>
        <p class="bulletin-hero__intro">{{ page.hero.intro }}</p>
        <p class="bulletin-hero__note">
          <MessageCircleHeart aria-hidden="true" />
          {{ page.hero.note }}
        </p>
        <a
          class="bulletin-phone-link"
          :href="page.contact.phoneHref"
          :aria-label="t('bulletin.callUs', { phone: page.contact.phone })">
          <PhoneCall aria-hidden="true" />
          <span>
            <small>{{ t("bulletin.contactPhone") }}</small>
            <strong>{{ page.contact.phone }}</strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <figure class="bulletin-visual glass-surface">
        <img
          class="bulletin-visual__mobile"
          :src="page.visuals.mobile"
          :alt="t('bulletin.visualAlt')" />
        <div
          class="bulletin-visual__desktop"
          aria-hidden="true">
          <img
            class="bulletin-visual__background"
            :src="page.visuals.desktop.background"
            alt="" />
          <img
            class="bulletin-visual__beetle bulletin-visual__beetle--left"
            :src="page.visuals.desktop.leftBeetle"
            alt="" />
          <img
            class="bulletin-visual__beetle bulletin-visual__beetle--right"
            :src="page.visuals.desktop.rightBeetle"
            alt="" />
          <img
            class="bulletin-visual__explosion"
            :src="page.visuals.desktop.explosion"
            alt="" />
        </div>
      </figure>
    </section>

    <section
      class="bulletin-services"
      :aria-label="t('bulletin.servicesLabel')">
      <header class="bulletin-services__header">
        <p class="bulletin-eyebrow">{{ page.services.eyebrow }}</p>
        <h2>{{ page.services.title }}</h2>
        <p>{{ page.services.description }}</p>
      </header>

      <div class="bulletin-service-grid">
        <article
          v-for="(service, index) in page.services.items"
          :key="service.id"
          class="bulletin-service-card glass-surface">
          <span class="bulletin-service-card__number">
            {{ String(index + 1).padStart(2, "0") }}
          </span>
          <span class="bulletin-service-card__icon">
            <component
              :is="serviceIcons[service.id]"
              aria-hidden="true" />
          </span>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
        </article>
      </div>
    </section>

    <section class="bulletin-contact glass-surface">
      <div class="bulletin-contact__copy">
        <p class="bulletin-eyebrow">{{ page.contact.eyebrow }}</p>
        <h2>{{ page.contact.headline }}</h2>
      </div>

      <div class="bulletin-contact__actions">
        <a
          class="bulletin-contact__phone"
          :href="page.contact.phoneHref"
          :aria-label="t('bulletin.callUs', { phone: page.contact.phone })">
          <PhoneCall aria-hidden="true" />
          {{ page.contact.phone }}
        </a>

        <nav :aria-label="t('bulletin.socialTitle')">
          <a
            v-for="link in page.contact.socialLinks"
            :key="link.id"
            :href="link.url"
            :target="link.target"
            :rel="link.rel"
            :aria-label="t('bulletin.openSocial', { platform: link.label })">
            <img
              :src="link.icon"
              :alt="link.label" />
            <span>{{ link.label }}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  ArrowUpRight,
  BookOpenCheck,
  Frame,
  HeartHandshake,
  MessageCircleHeart,
  PhoneCall,
  Presentation,
} from "lucide-vue-next";

import { getBulletinPageData } from "@/services/bulletinService";

const { locale, t } = useI18n();
const page = computed(() => getBulletinPageData(locale.value));

const serviceIcons = {
  "responsible-care": HeartHandshake,
  "breeding-records": BookOpenCheck,
  "events-courses": Presentation,
  "specimen-craft": Frame,
};
</script>
