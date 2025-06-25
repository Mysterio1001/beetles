<template>
  <footer class="footer">
    <div>Copyright 2024 © {{ t("route.default") }}</div>
    <div>
      <img
        :src="footerLogo"
        alt="Logo" />
    </div>
    <ul>
      <li
        v-for="(item, index) in socials"
        :key="index">
        <a
          :href="item.url"
          target="_blank">
          <i :class="[item.icon, 'icon']" />
        </a>
      </li>
    </ul>
  </footer>
</template>

<script setup>
import footerLogo from "@/assets/images/logo/rwd-white-logo.svg";
import { useI18n } from "vue-i18n";

// Refs / Reactive State 定義
const { t } = useI18n();

// 社交按鈕 這裏用的是font awesome
const socials = [
  {
    name: "instargram",
    url: "https://www.instagram.com/giraffa_beetle1001/",
    icon: "fa-brands fa-instagram fa-2xl",
  },
  {
    name: "line",
    url: "https://line.me/ti/p/061ly8VaI_",
    icon: "fa-brands fa-line fa-2xl",
  },
  {
    name: "facebook",
    url: "https://www.facebook.com/profile.php?id=100082416973415&mibextid=LQQJ4d",
    icon: "fa-brands fa-facebook fa-2xl",
  },
];
</script>
<style lang="scss" scoped>
.footer {
  z-index: z(footer);

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.6rem;
  padding: 1rem 4rem;
  background-color: getColor(green-04);

  img {
    width: 7rem;
    height: 7rem;
  }

  ul {
    @include center;

    gap: 4rem;
    .icon::before {
      color: getColor(white);
      height: 5rem;
      width: 5rem;
    }
  }
}
</style>
