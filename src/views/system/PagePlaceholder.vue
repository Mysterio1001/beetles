<template>
  <section
    class="system-page glass-surface"
    aria-labelledby="placeholder-title">
    <p class="system-page__eyebrow">{{ t("system.comingSoonEyebrow") }}</p>
    <h1 id="placeholder-title">
      {{ t("system.comingSoonTitle", { page: pageTitle }) }}
    </h1>
    <p>{{ t("system.comingSoonBody") }}</p>
    <RouterLink
      class="system-page__action"
      to="/">
      <ArrowLeft aria-hidden="true" />
      {{ t("system.backHome") }}
    </RouterLink>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

const route = useRoute();
const { t } = useI18n();
const pageTitle = computed(() => t(route.meta.titleKey || "route.default"));
</script>
