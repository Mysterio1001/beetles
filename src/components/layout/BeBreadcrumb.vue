<template>
  <nav
    v-if="!isHome"
    class="breadcrumbs"
    :aria-label="t('route.home')">
    <ol class="breadcrumbs__list glass-surface">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="`${crumb.path}-${index}`">
        <RouterLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path">
          {{ crumb.label }}
        </RouterLink>
        <span
          v-else
          aria-current="page"
          >{{ crumb.label }}</span
        >
        <ChevronRight
          v-if="index < breadcrumbs.length - 1"
          aria-hidden="true" />
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ChevronRight } from "lucide-vue-next";

const route = useRoute();
const { t } = useI18n();

const isHome = computed(() => route.name === "home");
const breadcrumbs = computed(() => {
  const parents = route.meta.parents || [];
  return [
    { label: t("route.home"), path: "/" },
    ...parents.map((parent) => ({
      label: t(parent.titleKey),
      path: parent.path,
    })),
    {
      label: t(route.meta.titleKey || "route.default"),
      path: route.fullPath,
    },
  ];
});
</script>

<style lang="scss" scoped>
.breadcrumbs {
  width: min(144rem, calc(100% - clamp(3.2rem, 8vw, 11.2rem)));
  margin: 1.6rem auto 0;
}

.breadcrumbs__list {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  background: rgba(11, 55, 39, 0.5);
  font-size: 1.3rem;

  li {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }

  a {
    color: rgba(235, 255, 242, 0.68);
    transition: color 160ms ease;

    &:hover {
      color: #fff;
    }
  }

  span {
    color: #f3fff7;
  }

  svg {
    width: 1.4rem;
    color: rgba(228, 255, 237, 0.42);
  }
}

@media (max-width: 560px) {
  .breadcrumbs {
    width: calc(100% - 2rem);
    margin-top: 1rem;
    overflow-x: auto;
  }

  .breadcrumbs__list {
    flex-wrap: nowrap;
    white-space: nowrap;
  }
}
</style>
