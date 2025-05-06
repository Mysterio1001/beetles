import { createRouter, createWebHistory } from "vue-router";
import i18n from "@/locale/index";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      titleKey: "route.home",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
//進入頁面更改title
router.beforeEach((to, from, next) => {
  i18n.global.t("route.home");

  const defaultTitle = i18n.global.t("route.default"); // fallback key
  if (to.meta.titleKey) {
    document.title = i18n.global.t(to.meta.titleKey);
  } else {
    document.title = defaultTitle;
  }
  next();
});

export default router;
