<template>
  <footer class="site-footer">
    <div class="site-footer__inner glass-surface">
      <RouterLink
        class="site-footer__brand"
        to="/">
        <img
          :src="footerLogo"
          :alt="t('route.default')" />
        <span>
          <strong>{{ t("route.default") }}</strong>
          <small>Copyright © {{ currentYear }}</small>
        </span>
      </RouterLink>

      <ul
        class="site-footer__socials"
        :aria-label="t('route.default')">
        <li
          v-for="item in socials"
          :key="item.name">
          <a
            :href="item.url"
            :aria-label="item.name"
            rel="noopener noreferrer"
            target="_blank">
            <Icon
              :icon="item.icon"
              aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { Icon } from "@iconify/vue";
import facebook from "@iconify-icons/simple-icons/facebook";
import instagram from "@iconify-icons/simple-icons/instagram";
import line from "@iconify-icons/simple-icons/line";

import footerLogo from "@/assets/images/logo/rwd-white-logo.svg";

const { t } = useI18n();
const currentYear = new Date().getFullYear();
const socials = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/giraffa_beetle1001/",
    icon: instagram,
  },
  { name: "LINE", url: "https://line.me/ti/p/061ly8VaI_", icon: line },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100082416973415&mibextid=LQQJ4d",
    icon: facebook,
  },
];
</script>

<style lang="scss" scoped>
.site-footer {
  padding: 4rem clamp(1.6rem, 4vw, 5.6rem) 2.4rem;
}

.site-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  max-width: 144rem;
  min-height: 9rem;
  margin: 0 auto;
  padding: 1.6rem 2rem;
  border-radius: 2.4rem;
  background: rgba(5, 35, 24, 0.72);
}

.site-footer__brand {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: #f3fff7;

  img {
    width: 5.6rem;
    height: 5.6rem;
  }

  span {
    display: grid;
    gap: 0.3rem;
  }

  strong {
    font-size: 1.5rem;
  }

  small {
    color: rgba(231, 255, 240, 0.6);
    font-size: 1.2rem;
  }
}

.site-footer__socials {
  display: flex;
  gap: 0.8rem;

  a {
    display: grid;
    place-items: center;
    width: 4.4rem;
    height: 4.4rem;
    border: 1px solid rgba(219, 255, 232, 0.16);
    border-radius: 50%;
    background: rgba(219, 255, 232, 0.08);
    color: #eafff1;
    transition:
      transform 180ms ease,
      background-color 180ms ease;

    &:hover {
      transform: translateY(-3px) rotate(-4deg);
      background: rgba(190, 255, 214, 0.18);
    }

    svg {
      width: 2rem;
      height: 2rem;
    }
  }
}

@media (max-width: 560px) {
  .site-footer {
    padding: 3rem 1rem 1rem;
  }

  .site-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.8rem;
    border-radius: 1.8rem;
  }

  .site-footer__socials {
    width: 100%;
  }
}
</style>
