<template>
  <section
    class="system-page system-page--not-found glass-surface"
    aria-labelledby="not-found-title">
    <p class="system-page__code">{{ t("system.notFoundCode") }}</p>
    <h1 id="not-found-title">{{ t("system.notFoundTitle") }}</h1>
    <p>{{ t("system.notFoundBody") }}</p>
    <RouterLink
      class="system-page__action"
      to="/">
      <Home aria-hidden="true" />
      {{ t("system.backHome") }}
    </RouterLink>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { Home } from "lucide-vue-next";

const { t } = useI18n();
</script>
