<template>
  <footer class="be-footer">
    <div>Copyright 2024 © {{ t("route.default") }}</div>
    <div>
      <img
        :src="footerLogo"
        alt="Logo" />
    </div>
    <ul>
      <li
        v-for="(item, index) in socials"
        :key="item.name">
        <a
          :href="item.url"
          :aria-label="item.name"
          rel="noopener noreferrer"
          target="_blank">
          <Icon
            class="icon"
            :icon="item.icon" />
        </a>
      </li>
    </ul>
  </footer>
</template>

<script setup>
import footerLogo from "@/assets/images/logo/rwd-white-logo.svg";
import { useI18n } from "vue-i18n";
// 使用安裝的iconify
import { Icon } from "@iconify/vue";
import instagram from "@iconify-icons/simple-icons/instagram";
import line from "@iconify-icons/simple-icons/line";
import facebook from "@iconify-icons/simple-icons/facebook";

// Refs / Reactive State 定義
const { t } = useI18n();

// 社交按鈕 這裏用的是iconify
const socials = [
  {
    name: "instagram",
    url: "https://www.instagram.com/giraffa_beetle1001/",
    icon: instagram,
  },
  {
    name: "line",
    url: "https://line.me/ti/p/061ly8VaI_",
    icon: line,
  },
  {
    name: "facebook",
    url: "https://www.facebook.com/profile.php?id=100082416973415&mibextid=LQQJ4d",
    icon: facebook,
  },
];
</script>
<style lang="scss" scoped>
.be-footer {
  z-index: z(footer);

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 1rem 4rem;
  background-color: getColor(green-04);

  img {
    width: 7rem;
    height: 7rem;
  }

  ul {
    @include center;

    gap: 4rem;
    a {
      color: getColor(white);

      .icon {
        // iconify 是svg 樣式可以直接設定在本體
        height: 5rem;
        width: 5rem;
      }
    }
  }
}
</style>
