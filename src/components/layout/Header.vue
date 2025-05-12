<template>
  <header class="header">
    <router-link to="/test">
      <img :src="logo" alt="logo" />
    </router-link>
    <ul>
      <li v-for="(item, index) in routes" :key="index">
        <router-link :to="item.to">{{ item.label }}</router-link>
      </li>
    </ul>
    <div class="userAction">
      <btn>{{ t("common.signIn") }}</btn>
      <btn>
        <ShoppingCart style="width: 16px; height: 16px" />&nbsp;
        {{ t("common.cart") }}</btn
      >
    </div>
  </header>
</template>

<script setup>
import logo from "@/assets/images/logo/white_border_logo.svg";
import { ShoppingCart } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const routes = [
  { label: t("route.home"), to: "/" },
  { label: t("route.news"), to: "/news" },
  { label: t("route.beetleLab"), to: "/beetle-lab" },
  { label: t("route.beetleShop"), to: "/beetle-shop" },
  { label: t("route.beetleBulletin"), to: "/beetle-bulletin" },
];
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 9999;
  margin-bottom: 28px;
  padding: 0 10px;
  height: 100px;
  background: linear-gradient(to right, #98b0a7, #f5f8f6);
  opacity: 1;
  border-radius: 0 0 10px 10px;
  img {
    height: 80px;
  }
  ul {
    display: flex;

    margin: 0 auto;
    li {
      position: relative;
      padding: 0 15px;
      font-weight: bold;
      &:not(:last-child)::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 1px;
        height: 40px;
        background-color: #5d7c71;
      }
      a {
        display: block;
        line-height: 30px;
        color: #161d1b;
        font-weight: 1000;
        transition: transform 0.3s ease;
        &:hover {
          transform: translate(0, -5px);
          &::before {
            content: "";
            position: absolute;
            bottom: -5px;
            right: 0;
            left: 0;
            display: block;
            margin: auto;
            height: 1px;
            width: 100%;
            background-color: #161d1b;
          }
        }
      }
    }
  }
  .userAction {
    display: flex;
  }
}
</style>
