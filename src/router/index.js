import { createRouter, createWebHistory } from "vue-router";
import i18n from "@/locale/index";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "route.home",
    },
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test/index.vue"),
    meta: {
      title: "route.test",
    },
  },
  {
    path: "/test/testChild",
    name: "testChild",
    component: () => import("@/views/test/child/testChild.vue"),
    meta: {
      title: "route.testChild",
      parents: [{ path: "/test", name: "route.test" }],
    },
  },
  {
    path: "/test/testChild/jr",
    name: "testChildJr",
    component: () => import("@/views/test/child/child/testChildJr.vue"),
    meta: {
      title: "route.testChildJr",
      parents: [
        { path: "/test", name: "route.test" },
        { path: "/test/testChild", name: "route.testChild" },
      ],
    },
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/news/index.vue"),
    meta: {
      title: "route.news",
    },
  },
  {
    path: "/beetle-lab",
    name: "beetleLab",
    component: () => import("@/views/beetleLab/index.vue"),
    meta: {
      title: "route.beetleLab",
    },
  },
  {
    path: "/beetle-shop",
    name: "beetleShop",
    component: () => import("@/views/news/index.vue"),
    meta: {
      title: "route.beetleShop",
    },
  },
  {
    path: "/beetle-bulletin",
    name: "beetleBulletin",
    component: () => import("@/views/news/index.vue"),
    meta: {
      title: "route.beetleBulletin",
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
  const pageTitle = i18n.global.t(to.meta.title);
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
