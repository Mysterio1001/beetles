<template>
  <!-- 文章列表 -->
  <be-container>
    <div class="cardWrapper">
      <router-link
        v-for="card in cardsData"
        :key="card.id"
        v-slot="{ navigate }"
        :to="{ name: 'beetleLabDetail', params: { title: card.title } }"
        custom>
        <be-card
          :has-padding="false"
          :img-src="card.imgSrc"
          img-position="right"
          :clickable="true"
          :dark-mode="true"
          @click="navigate">
          <div class="cardText">
            <h5>{{ card.title }}</h5>
            <p class="small bold">{{ card.createDate }}</p>
            <p>{{ card.content }}</p>
          </div>
        </be-card>
      </router-link>
    </div>
    <!-- 浮動視窗 -->
    <be-float-panel
      :title="t('lab.latestArticle')"
      side="left"
      class="panel">
      <div class="floatBox">
        <div
          v-for="list in floatData"
          :key="list.id"
          class="floatList">
          <div class="listContent">
            <p class="small">{{ list.title }}</p>
            <p class="small bold more">MORE</p>
          </div>
          <!-- 底線 -->
          <be-line margin-position="bottom" />
        </div>
      </div>
    </be-float-panel>
  </be-container>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getArticles } from "@/services/articleService";

// Refs / Reactive State 定義
const { t } = useI18n();

// const floatData = ref([]) api傳入
const floatData = ref(getArticles());
// const cardsData = ref([]) api傳入
const cardsData = ref(getArticles());
</script>
