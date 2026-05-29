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
import { computed, ref } from "vue";
import { Phone } from "lucide-vue-next";

const { t } = useI18n();

const bulletin = {
  intro: t("bulletin.intro"),
  note: t("bulletin.note"),
  headline: t("bulletin.headline"),
  phone: "0922-180-199",
  socialLinks: [
    {
      label: "Facebook",
      url: "https://www.facebook.com/profile.php?id=100082416973415&mibextid=LQQJ4d",
      icon: "/img/img-beetle-bulletin/icon_facebook.png",
    },
    {
      label: "LINE",
      url: "https://line.me/ti/p/061ly8VaI_",
      icon: "/img/img-beetle-bulletin/icon_LINE.png",
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/giraffa_beetle1001/",
      icon: "/img/img-beetle-bulletin/icon_IG.png",
    },
  ],
};

const headlineLines = computed(() => bulletin.headline.split("\n"));
const phoneDigits = computed(() => bulletin.phone.replace(/\D/g, ""));
</script>
