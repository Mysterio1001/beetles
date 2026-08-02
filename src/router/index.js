import { createRouter, createWebHashHistory } from "vue-router";

import i18n from "@/locale";
import { resolveCheckoutAccess } from "@/router/cartNavigation";
import { useCartState } from "@/state/cartState";
import { useMemberState } from "@/state/memberState";

const placeholder = () => import("@/views/system/PagePlaceholder.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/index.vue"),
    meta: { titleKey: "route.home" },
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/news/index.vue"),
    meta: { titleKey: "route.news" },
  },
  {
    path: "/beetle-lab",
    name: "beetleLab",
    component: () => import("@/views/beetleLab/index.vue"),
    meta: { titleKey: "route.beetleLab" },
  },
  {
    path: "/beetle-lab/:articleId",
    name: "beetleLabDetail",
    component: () => import("@/views/beetleLab/detail.vue"),
    meta: {
      titleKey: "route.beetleLabDetail",
      parents: [{ path: "/beetle-lab", titleKey: "route.beetleLab" }],
    },
  },
  {
    path: "/beetle-shop",
    name: "beetleShop",
    component: () => import("@/views/beetleShop/index.vue"),
    meta: { titleKey: "route.beetleShop" },
  },
  {
    path: "/beetle-shop/:productId",
    name: "product",
    component: () => import("@/views/beetleShop/detail.vue"),
    meta: {
      titleKey: "route.product",
      parents: [{ path: "/beetle-shop", titleKey: "route.beetleShop" }],
    },
  },
  {
    path: "/beetle-bulletin",
    name: "beetleBulletin",
    component: () => import("@/views/beetleBulletin/index.vue"),
    meta: { titleKey: "route.beetleBulletin" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { titleKey: "route.login" },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/auth/SignupView.vue"),
    meta: {
      titleKey: "route.signup",
      parents: [{ path: "/login", titleKey: "route.login" }],
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/cart/CartView.vue"),
    meta: { titleKey: "route.cart" },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: placeholder,
    beforeEnter: () => resolveCheckoutAccess(useCartState().itemCount.value),
    meta: {
      titleKey: "route.checkout",
      parents: [{ path: "/cart", titleKey: "route.cart" }],
    },
  },
  {
    path: "/order-complete",
    name: "orderComplete",
    component: placeholder,
    meta: { titleKey: "route.orderComplete" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/system/NotFound.vue"),
    meta: { titleKey: "route.notFound" },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

router.beforeEach((to) => {
  const isAuthRoute = to.name === "login" || to.name === "signup";
  if (isAuthRoute && useMemberState().isAuthenticated.value) return { name: "home" };
  return true;
});

export function updateDocumentMeta(route = router.currentRoute.value) {
  const siteTitle = i18n.global.t("route.default");
  const pageTitle = route?.meta?.titleKey ? i18n.global.t(route.meta.titleKey) : "";

  document.title = pageTitle ? `${pageTitle}｜${siteTitle}` : siteTitle;

  if (route?.name) document.body.dataset.page = String(route.name);
  else delete document.body.dataset.page;
}

router.afterEach((to) => {
  updateDocumentMeta(to);
});

export default router;
