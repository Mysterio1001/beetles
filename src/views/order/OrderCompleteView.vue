<template>
  <div class="order-complete-page">
    <section class="order-complete-card glass-surface">
      <div class="order-complete-copy">
        <span class="order-complete-badge">
          <BadgeCheck aria-hidden="true" />
          {{ t("checkout.successBadge") }}
        </span>
        <p class="order-complete-eyebrow">{{ t("checkout.completeEyebrow") }}</p>
        <h1>{{ t("checkout.completeTitle") }}</h1>
        <p class="order-complete-description">{{ t("checkout.completeDescription") }}</p>

        <dl class="order-complete-details">
          <div>
            <dt>{{ t("checkout.orderNumber") }}</dt>
            <dd>{{ currentOrder?.id }}</dd>
          </div>
          <div>
            <dt>{{ t("checkout.orderTotal") }}</dt>
            <dd>{{ formatMoney(currentOrder?.total ?? 0) }}</dd>
          </div>
        </dl>

        <div class="order-complete-actions">
          <button
            type="button"
            @click="returnHome">
            <Home aria-hidden="true" />
            {{ t("checkout.returnHome") }}
          </button>
          <p aria-live="polite">
            <Timer aria-hidden="true" />
            {{ t("checkout.countdown", { seconds: countdown }) }}
          </p>
        </div>

        <p class="order-complete-notice">
          <ShieldCheck aria-hidden="true" />
          {{ t("checkout.completeMockNotice") }}
        </p>
      </div>

      <div class="order-complete-visual">
        <span class="order-complete-orbit order-complete-orbit--one" />
        <span class="order-complete-orbit order-complete-orbit--two" />
        <img
          src="/img/img-order-completion/DA.png"
          :alt="t('checkout.completeVisualAlt')" />
      </div>
    </section>

    <section class="order-social glass-surface">
      <header>
        <p class="order-complete-eyebrow">Stay connected</p>
        <h2>{{ t("checkout.socialTitle") }}</h2>
        <p>{{ t("checkout.socialDescription") }}</p>
      </header>
      <ul>
        <li
          v-for="social in socialLinks"
          :key="social.id">
          <a
            :href="social.url"
            :aria-label="social.label"
            :rel="social.rel"
            :target="social.target">
            <img
              :src="social.icon"
              alt="" />
            <span>{{ social.label }}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { ArrowUpRight, BadgeCheck, Home, ShieldCheck, Timer } from "lucide-vue-next";

import { getBulletinContact } from "@/services/bulletinService";
import { useOrderState } from "@/state/orderState";

const router = useRouter();
const { locale, t } = useI18n();
const { currentOrder, clearCurrentOrder } = useOrderState();
const socialLinks = getBulletinContact().socialLinks;
const countdown = ref(5);
let timerId = null;

function formatMoney(amount) {
  return `NT$ ${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }).format(amount)}`;
}

function stopTimer() {
  if (timerId === null) return;
  clearInterval(timerId);
  timerId = null;
}

async function returnHome() {
  stopTimer();
  await router.replace({ name: "home" });
}

onMounted(() => {
  timerId = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value > 0) return;
    stopTimer();
    void router.replace({ name: "home" });
  }, 1000);
});

onBeforeRouteLeave(() => {
  stopTimer();
  clearCurrentOrder();
});

onBeforeUnmount(stopTimer);
</script>
