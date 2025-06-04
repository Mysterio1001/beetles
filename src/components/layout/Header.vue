<template>
  <header class="headerSticky">
    <div class="header">
      <router-link
        to="/test"
        class="logo">
        <img
          class="logo"
          :src="logo"
          alt="logo" />
      </router-link>
      <div
        :class="['hamburger', { active: isActive }]"
        @click="toggleMenu">
        <div
          v-for="i in 3"
          :class="['line', `line${i}`]"></div>
      </div>
      <ul :class="{ active: isActive }">
        <li
          v-for="(item, index) in routes"
          :key="index">
          <router-link :to="item.to">{{ item.label }}</router-link>
        </li>
      </ul>
      <router-link to="/test">
        <img
          class="logoRwd"
          :src="logoRwd"
          alt="Logo" />
      </router-link>
      <div class="userAction">
        <Btn class="singIn">{{ t("common.signIn") }}</Btn>
        <Btn class="shoppingCart">
          <ShoppingCart size="1.6rem" />&nbsp;
          <span>{{ t("common.cart") }}</span>
        </Btn>
      </div>
      <div class="shoppingCartRwd">
        <ShoppingCart size="4rem" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
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

// rwd動態header變化
const isActive = ref(false);
// 是否還在動畫中
const isTransitioning = ref(false);
// hamburger開關
const toggleMenu = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true;
    isActive.value = !isActive.value;

    setTimeout(() => {
      isTransitioning.value = false;
    }, 500);
  }
};

//監聽視窗大小
const mdBreakpoint = 768;
const handleResize = () => {
  if (window.innerWidth > mdBreakpoint) {
    isActive.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
@mixin circle($size: 7rem, $color: getColor(white)) {
  height: $size;
  width: $size;
  background-color: $color;
  border-radius: 50%;
}
.headerSticky {
  z-index: z(header);

  position: sticky;
  top: 0;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;

    margin-bottom: 1.6rem;
    padding: 0 1rem;
    height: 10rem;
    background: linear-gradient(
      to right,
      getColor(green-02),
      getColor(green-01)
    );
    opacity: 1;
    border-radius: 0 0 12px 12px;

    @include md {
      padding: 0 1.6rem;
      height: 16rem;
      border-radius: 0;
    }
    .logo {
      height: 8rem;
      @include md {
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
      @include md {
        display: flex;
      }
      .line {
        height: 0.5rem;
        width: 5rem;
        background-color: getColor(black);
        border-radius: 10px;

        transform-origin: center;

        &:not(:nth-child(2)) {
          transition: 0.3s;
        }
      }

      &.active {
        .line1 {
          transform: rotate(45deg) translate(7.2px, 8.5px);

          @include sm {
            transform: rotate(45deg) translate(7.2px, 7px);
          }
        }
        .line2 {
          opacity: 0;
        }
        .line3 {
          transform: rotate(-45deg) translate(5.8px, -8px);
          @include sm {
            transform: rotate(-45deg) translate(6px, -6px);
          }
        }
      }
    }
    ul {
      display: flex;
      margin: 0 auto;
      @include md {
        position: absolute;
        left: -100%;
        top: 100%;

        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: calc(100vh - 100%);

        background: linear-gradient(
          to right,
          getColor(green-01-1),
          getColor(green-01)
        );

        transition: 0.5s;

        &.active {
          transform: translate(100%);
        }
      }
      li {
        position: relative;
        padding: 0 1.6rem;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 2rem;

        @include md {
          padding: 0 5rem;
          box-sizing: border-box;

          width: 100%;
          flex: 1;

          border-bottom: 1px solid getColor(green-04);

          font-size: 4rem;
          line-height: 10;

          &:last-child {
            border: none;
          }
        }

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
          background-color: getColor(green-03);

          @include md {
            display: none;
          }
        }
        a {
          line-height: 3.2rem;
          transition: transform 0.3s ease;
          &:hover {
            transform: translate(0, -5px);

            @include md {
              transform: translate(0, 0);
            }

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
              background-color: getColor(text);

              @include md {
                display: none;
              }
            }
          }
        }
      }
    }
    .logoRwd {
      display: none;
      height: 84px;

      @include md {
        display: block;
      }
    }
    .userAction {
      display: flex;

      @include md {
        display: none;
      }
    }
    .shoppingCartRwd {
      display: none;
      justify-content: center;
      align-items: center;

      @include md {
        display: flex;
        @include circle($color: getColor(green-03));
      }
    }
  }
}
</style>
