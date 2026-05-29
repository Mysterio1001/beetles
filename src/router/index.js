import { createRouter, createWebHistory } from "vue-router";
import { scrollTop } from "@/utils/scroll";
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
    path: "/beetle-lab/:title", // 動態路徑
    name: "beetleLabDetail",
    component: () => import("@/views/beetleLab/child/index.vue"),
    meta: {
      title: "route.beetleLabDetail",
      parents: [{ path: "/beetle-lab", name: "route.beetleLab" }],
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
    component: () => import("@/views/beetleBulletin/index.vue"),
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
  // 全路由轉換時先置頂
  scrollTop();
  // Beetle Lab文章詳細麵包屑處理
  if (to.name === "beetleLabDetail" && to.params.title) {
    // 強制覆蓋 meta.title 為文章標題
    // 這樣下方的 i18n.global.t(to.meta.title) 找不到 Key 就會直接回傳標題字串
    to.meta.title = to.params.title;
  }
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
