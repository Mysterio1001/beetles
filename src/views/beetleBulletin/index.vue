<template>
  <be-container>
    <section class="bulletinContent">
      <div class="mobileHero">
        <img
          src="/img/img-beetle-bulletin/main-pic.png"
          alt="beetles" />
      </div>
      <div class="animatedHero">
        <img
          src="/img/img-beetle-bulletin/explosion.png"
          alt="explosion"
          class="explosion" />
      </div>
      <h2>{{ bulletin.intro }}</h2>
      <p class="note">{{ bulletin.note }}</p>
      <h1>
        <template
          v-for="line in headlineLines"
          :key="line">
          {{ line }}<br />
        </template>
      </h1>
      <a
        class="phone"
        :href="`tel:${phoneDigits}`">
        <Phone :size="24" />
        {{ bulletin.phone }}
      </a>
      <ul class="socialLinks">
        <li
          v-for="link in bulletin.socialLinks"
          :key="link.label">
          <a
            :href="link.url"
            target="_blank"
            rel="noreferrer"
            :aria-label="link.label">
            <img
              :src="link.icon"
              :alt="link.label" />
          </a>
        </li>
      </ul>
    </section>
  </be-container>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { Phone } from "lucide-vue-next";
import { getBulletinContact } from "@/services/bulletinService";

const { t } = useI18n();
const contact = getBulletinContact();

const bulletin = computed(() => ({
  intro: t("bulletin.intro"),
  note: t("bulletin.note"),
  headline: t("bulletin.headline"),
  ...contact,
}));

const headlineLines = computed(() => bulletin.value.headline.split("\n"));
const phoneDigits = computed(() => bulletin.value.phone.replace(/\D/g, ""));
</script>
