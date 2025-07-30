<template>
  <be-container v-if="!isHome">
    <nav
      class="breadcrumb"
      aria-label="breadcrumb">
      <ul>
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="crumb.path">
          <!-- 最後一塊麵包屑不需要連結 -->
          <router-link
            v-if="index !== breadcrumbs.length - 1"
            :to="crumb.path">
            <h5>
              {{ crumb.name }}
            </h5>
          </router-link>

          <h5 v-else>
            {{ crumb.name }}
          </h5>
          <h5
            v-if="index !== breadcrumbs.length - 1"
            class="suffix">
            >
          </h5>
        </li>
      </ul>
    </nav>
  </be-container>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const route = router.currentRoute;

// defineProps / defineEmits
const props = defineProps({});

const emit = defineEmits([]);
// Refs / Reactive State 定義

const breadcrumbs = computed(() => {
  const baseCrumb = [{ name: t("route.home"), path: "/" }];
  const parentsList = route.value.meta?.parents || [];
  const currentTitle = route.value.meta?.title || "";
  const currentPath = {
    name: currentTitle ? t(currentTitle) : "",
    path: route.value.fullPath, // 絕對位置
  };
  const crumbArray = [
    ...baseCrumb,
    ...parentsList.map((p) => ({ name: t(p.name || ""), path: p.path })),
    currentPath,
  ];

  return crumbArray;
});

const isHome = computed(() => {
  return route.value.name === "home";
});

// Computed 計算屬性

// Methods / Functions

// Watchers

// Lifecycle Hooks
</script>

<style lang="scss" scoped>
@use "sass:map";

.breadcrumb {
  ul {
    display: flex;
    gap: 1rem;

    padding: 0 0 1.6rem 0;
    box-sizing: border-box;

    color: getColor(white);

    @include md {
      @include center;
    }

    li {
      display: flex;
      gap: 1rem;

      a {
        color: getColor(white);
      }

      h5 {
        @include md {
          font-size: 4rem;
        }
      }
    }
  }
}
</style>
