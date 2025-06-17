import { createRouter, createWebHistory } from "vue-router";
import i18n from "@/locale/index";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/homeView.vue"),
    meta: {
      titleKey: "route.home",
    },
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
    meta: {
      titleKey: "route.test",
    },
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/newsView.vue"),
    meta: {
      titleKey: "route.news",
    },
  },
  {
    path: "/beetle-lab",
    name: "beetleLab",
    component: () => import("@/views/newsView.vue"),
    meta: {
      titleKey: "route.beetleLab",
    },
  },
  {
    path: "/beetle-shop",
    name: "beetleShop",
    component: () => import("@/views/newsView.vue"),
    meta: {
      titleKey: "route.beetleShop",
    },
  },
  {
    path: "/beetle-bulletin",
    name: "beetleBulletin",
    component: () => import("@/views/newsView.vue"),
    meta: {
      titleKey: "route.beetleBulletin",
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

  const defaultTitle = i18n.global.t("route.default"); // 預設值
  const pageTitle = i18n.global.t(to.meta.titleKey);
  if (pageTitle) {
    document.title = pageTitle + "－" + defaultTitle;
  } else {
    document.title = defaultTitle;
  }
  // 以to.name建立data-page 屬性
  if (to.name) {
    document.body.dataset.page = to.name;
  } else {
    document.body.removeAttribute("data-page");
  }

  next();
});

export default router;
