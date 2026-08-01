<template>
  <a
    class="skip-link"
    href="#main-content"
    >{{ t("common.skipToContent") }}</a
  >
  <BeHeader />
  <BeBreadcrumb />
  <main
    id="main-content"
    tabindex="-1">
    <RouterView />
  </main>
  <BeFooter />
</template>

<script setup>
import { watch } from "vue";
import { useI18n } from "vue-i18n";

import { syncDocumentLanguage } from "@/locale";
import { updateDocumentMeta } from "@/router";

const { locale, t } = useI18n();

watch(
  locale,
  () => {
    syncDocumentLanguage();
    updateDocumentMeta();
  },
  { immediate: true },
);
</script>
