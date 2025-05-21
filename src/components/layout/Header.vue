<template>
  <header class="header">
    <router-link to="/test" class="logo">
      <img class="logo" :src="logo" alt="logo" />
    </router-link>
    <div :class="['hamburger', { active: isActive }]" @click="toggleMenu">
      <div v-for="i in 3" :class="['line', `line${i}`]"></div>
    </div>
    <ul>
      <li v-for="(item, index) in routes" :key="index">
        <router-link :to="item.to">{{ item.label }}</router-link>
      </li>
    </ul>
    <img class="logoRwd" :src="logoRwd" alt="Logo" />
    <div class="userAction">
      <btn class="singIn">{{ t("common.signIn") }}</btn>
      <btn class="shoppingCart">
        <ShoppingCart style="width: 1.6rem; height: 1.6rem" />&nbsp;
        <span>{{ t("common.cart") }}</span>
      </btn>
    </div>
    <div class="shoppingCartRwd">
      <ShoppingCart style="width: 50%; height: 50%" />
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import logo from "@/assets/images/logo/white_border_logo.svg";
import logoRwd from "@/assets/images/logo/rwd-white-logo.svg";
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

const isActive = ref(false);
// hamburger開關
const toggleMenu = () => {
  isActive.value = !isActive.value;
};
</script>

<style lang="scss" scoped>
@mixin circle($size: 7rem, $color: #fff) {
  height: $size;
  width: $size;
  background-color: $color;
  border-radius: 50%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 9999;

  margin-bottom: 1.6rem;
  padding: 0 1rem;
  height: 10rem;
  background: linear-gradient(to right, #98b0a7, #f5f8f6);
  opacity: 1;
  border-radius: 0 0 12px 12px;

  @include md {
    padding: 0 1.6rem;
    height: 16rem;
    border-radius: 0;
  }
  .logo {
    height: 8rem;
    @media (max-width: 768px) {
      display: none;
    }
  }

  .hamburger {
    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    @include circle();

    @media (max-width: 768px) {
      display: flex;
    }
    .line {
      height: 0.5rem;
      width: 5rem;
      background-color: black;
      border-radius: 10px;

      transform-origin: center;

      &:not(:nth-child(2)) {
        transition: 0.3s;
      }
    }

    &.active {
      .line1 {
        transform: rotate(45deg) translate(5.5px, 1.2rem);
      }
      .line2 {
        opacity: 0;
      }
      .line3 {
        transform: rotate(-45deg) translate(5.5px, -1rem);
      }
    }
  }
  ul {
    display: flex;
    border: 1px solid black;

    margin: 0 auto;
    li {
      position: relative;
      padding: 0 1.6rem;
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
        height: 4rem;
        background-color: #5d7c71;
      }
      a {
        display: block;
        line-height: 3.2rem;
        color: #161d1b;
        font-weight: bold;
        transition: transform 0.3s ease;
        &:hover {
          transform: translate(0, -5px);
          &::before {
            content: "";
            position: absolute;
            bottom: -0.4rem;
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
  .logoRwd {
    display: none;
    height: 84px;

    @media (max-width: 768px) {
      display: block;
    }
  }
  .userAction {
    display: flex;

    @media (max-width: 768px) {
      display: none;
    }
  }
  .shoppingCartRwd {
    display: none;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
      display: flex;
      @include circle($color: #5d7c71);
    }
  }
}
</style>
