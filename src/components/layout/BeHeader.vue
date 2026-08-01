<template>
  <header class="site-header">
    <div class="site-header__bar glass-surface">
      <RouterLink
        class="site-header__brand"
        to="/"
        @click="closeMenu">
        <img
          :src="logo"
          :alt="t('route.default')" />
        <span>
          <strong>{{ t("route.default") }}</strong>
          <small>RECORDING OF BEETLES</small>
        </span>
      </RouterLink>

      <button
        class="site-header__menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-navigation"
        :aria-label="t(menuOpen ? 'common.closeMenu' : 'common.openMenu')"
        @click="toggleMenu">
        <X
          v-if="menuOpen"
          aria-hidden="true" />
        <Menu
          v-else
          aria-hidden="true" />
      </button>

      <nav
        id="primary-navigation"
        class="site-header__nav"
        :class="{ 'is-open': menuOpen }"
        :aria-label="t('common.openMenu')">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          @click="closeMenu">
          {{ item.label }}
        </RouterLink>

        <div class="site-header__mobile-actions">
          <RouterLink
            to="/login"
            @click="closeMenu">
            <UserRound aria-hidden="true" />
            {{ t("common.signIn") }}
          </RouterLink>
          <RouterLink
            to="/cart"
            :aria-label="t('common.cartCount', { count: cartCount })"
            @click="closeMenu">
            <ShoppingBag aria-hidden="true" />
            {{ t("common.cart") }}
            <span class="site-header__badge">{{ cartCount }}</span>
          </RouterLink>
        </div>
      </nav>

      <div class="site-header__actions">
        <label class="site-header__locale">
          <Languages aria-hidden="true" />
          <span class="sr-only">{{ t("common.language") }}</span>
          <select
            :value="locale"
            @change="changeLocale">
            <option value="zh-TW">{{ t("common.traditionalChinese") }}</option>
            <option value="en">{{ t("common.english") }}</option>
          </select>
        </label>
        <RouterLink
          class="site-header__icon-link"
          to="/login"
          :aria-label="t('common.signIn')">
          <UserRound aria-hidden="true" />
        </RouterLink>
        <RouterLink
          class="site-header__icon-link site-header__cart-link"
          to="/cart"
          :aria-label="t('common.cartCount', { count: cartCount })">
          <ShoppingBag aria-hidden="true" />
          <span class="site-header__badge">{{ cartCount }}</span>
        </RouterLink>
      </div>
    </div>

    <button
      v-if="menuOpen"
      class="site-header__backdrop"
      type="button"
      :aria-label="t('common.closeMenu')"
      @click="closeMenu" />
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { Languages, Menu, ShoppingBag, UserRound, X } from "lucide-vue-next";

import logo from "@/assets/images/logo/rwd-white-logo.svg";
import { setLocale } from "@/locale";
import { useCartState } from "@/state/cartState";

const { locale, t } = useI18n();
const route = useRoute();
const menuOpen = ref(false);
const { itemCount: cartCount } = useCartState();

const navigation = computed(() => [
  { label: t("route.home"), to: "/" },
  { label: t("route.news"), to: "/news" },
  { label: t("route.beetleLab"), to: "/beetle-lab" },
  { label: t("route.beetleShop"), to: "/beetle-shop" },
  { label: t("route.beetleBulletin"), to: "/beetle-bulletin" },
]);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function changeLocale(event) {
  setLocale(event.target.value);
}

function handleEscape(event) {
  if (event.key === "Escape") closeMenu();
}

watch(
  menuOpen,
  (isOpen) => {
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) document.addEventListener("keydown", handleEscape);
    else document.removeEventListener("keydown", handleEscape);
  },
  { flush: "post" },
);

watch(() => route.fullPath, closeMenu);

onBeforeUnmount(() => {
  document.body.classList.remove("menu-open");
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style lang="scss" scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: z(header);
  padding: 1.2rem clamp(1.6rem, 4vw, 5.6rem) 0;
}

.site-header__bar {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1.6rem, 3vw, 4rem);
  min-height: 7.2rem;
  padding: 0.9rem 1.2rem 0.9rem 1.6rem;
  border-radius: 2.4rem;
  background: rgba(8, 45, 32, 0.72);
  border-color: rgba(213, 255, 231, 0.22);
  box-shadow: 0 1.8rem 5rem rgba(2, 20, 13, 0.24);
}

.site-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  color: #f4fff8;

  img {
    width: 5.4rem;
    height: 5.4rem;
    object-fit: contain;
    transition: transform 220ms ease;
  }

  span {
    display: grid;
    gap: 0.2rem;
  }

  strong {
    font-size: 1.5rem;
    letter-spacing: 0.08em;
  }

  small {
    color: rgba(226, 255, 237, 0.64);
    font-size: 0.9rem;
    letter-spacing: 0.14em;
  }

  &:hover img {
    transform: rotate(-6deg) scale(1.05);
  }
}

.site-header__nav {
  display: flex;
  justify-content: center;
  gap: clamp(0.4rem, 1.5vw, 1.6rem);

  > a {
    position: relative;
    padding: 1rem 1.2rem;
    color: rgba(240, 255, 246, 0.78);
    border-radius: 999px;
    font-size: 1.4rem;
    transition:
      color 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;

    &:hover,
    &.router-link-active {
      color: #fff;
      background: rgba(179, 255, 207, 0.13);
      transform: translateY(-2px);
    }

    &.router-link-active::after {
      content: "";
      position: absolute;
      right: 1.2rem;
      bottom: 0.5rem;
      left: 1.2rem;
      height: 2px;
      border-radius: 2px;
      background: #9cf6bd;
    }
  }
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.site-header__locale,
.site-header__icon-link,
.site-header__menu-button {
  min-height: 4.4rem;
  border: 1px solid rgba(219, 255, 232, 0.18);
  background: rgba(222, 255, 235, 0.09);
  color: #f2fff7;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(211, 255, 227, 0.18);
    border-color: rgba(219, 255, 232, 0.34);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }
}

.site-header__locale {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.9rem;
  border-radius: 999px;

  svg {
    width: 1.8rem;
  }

  select {
    max-width: 9.4rem;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 1.3rem;
    cursor: pointer;

    option {
      color: #102c22;
    }
  }
}

.site-header__icon-link,
.site-header__menu-button {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 4.4rem;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;

  svg {
    width: 2rem;
  }
}

.site-header__badge {
  display: inline-grid;
  place-items: center;
  min-width: 1.8rem;
  height: 1.8rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: #b9ffc9;
  color: #0b3b27;
  font-size: 1.1rem;
  font-weight: 800;
}

.site-header__cart-link .site-header__badge {
  position: absolute;
  top: -0.3rem;
  right: -0.3rem;
}

.site-header__menu-button,
.site-header__mobile-actions,
.site-header__backdrop {
  display: none;
}

@media (max-width: 1024px) {
  .site-header__bar {
    grid-template-columns: 1fr auto auto;
  }

  .site-header__brand span,
  .site-header__actions .site-header__icon-link {
    display: none;
  }

  .site-header__brand {
    grid-column: 1;
    grid-row: 1;
  }

  .site-header__menu-button {
    display: inline-grid;
    grid-column: 3;
    grid-row: 1;
  }

  .site-header__actions {
    grid-column: 2;
    grid-row: 1;
  }

  .site-header__nav {
    position: absolute;
    top: calc(100% + 1rem);
    right: 0;
    left: 0;
    display: none;
    max-height: calc(100dvh - 11rem);
    overflow-y: auto;
    padding: 1.2rem;
    border: 1px solid rgba(219, 255, 232, 0.2);
    border-radius: 2.2rem;
    background: rgba(7, 42, 29, 0.94);
    box-shadow: 0 2rem 5rem rgba(0, 18, 10, 0.35);
    backdrop-filter: blur(24px) saturate(140%);

    &.is-open {
      display: grid;
      animation: menu-enter 180ms ease-out;
    }

    > a {
      padding: 1.4rem 1.6rem;
    }
  }

  .site-header__mobile-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(219, 255, 232, 0.14);

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
      min-height: 4.8rem;
      padding: 0.8rem 1rem;
      border-radius: 1.4rem;
      background: rgba(212, 255, 228, 0.1);
      color: #f2fff7;
    }
  }

  .site-header__backdrop {
    position: fixed;
    inset: 0;
    display: block;
    width: 100%;
    border: 0;
    background: rgba(0, 14, 8, 0.5);
    backdrop-filter: blur(3px);
  }
}

@media (max-width: 560px) {
  .site-header {
    padding: 0.8rem 1rem 0;
  }

  .site-header__bar {
    min-height: 6.4rem;
    padding: 0.7rem 0.8rem 0.7rem 1rem;
    border-radius: 1.8rem;
  }

  .site-header__brand img {
    width: 4.8rem;
    height: 4.8rem;
  }

  .site-header__locale {
    padding: 0 0.7rem;

    svg {
      display: none;
    }

    select {
      max-width: 7.8rem;
    }
  }
}

@keyframes menu-enter {
  from {
    opacity: 0;
    transform: translateY(-0.8rem) scale(0.98);
  }
}
</style>
