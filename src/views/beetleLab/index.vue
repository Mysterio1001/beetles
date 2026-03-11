<template>
  <!-- 文章列表 -->
  <be-container>
    <div class="cardWrapper">
      <router-link
        v-for="(card, index) in cardsData"
        :key="index"
        :to="{ name: 'beetleLabDetail', params: { title: card.title } }"
        custom
        v-slot="{ route, navigate }">
        <be-card
          :hasPadding="false"
          :imgSrc="card.imgSrc"
          imgPosition="right"
          :clickable="true"
          :darkMode="true"
          @click="beforeNavigate(card, route, navigate)">
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
          class="floatList"
          v-for="(list, index) in floatData">
          <div class="listContent">
            <p class="small">{{ list.title }}</p>
            <p class="small bold more">MORE</p>
          </div>
          <!-- 底線 -->
          <be-line marginPosition="bottom" />
        </div>
      </div>
    </be-float-panel>
  </be-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { articleDataTest } from "@/api/testData";

// Refs / Reactive State 定義
const { t } = useI18n();

// const floatData = ref([]) api傳入
const floatData = ref(articleDataTest);
// const cardsData = ref([]) api傳入
const cardsData = ref(articleDataTest);

const router = useRouter();

// Computed 計算屬性

// Methods / Functions
// 路由轉跳前 先改動他的麵包屑標題
const beforeNavigate = (card, route, navigate) => {
  // const targetRouter = router.resolve({
  //   name: "beetleLabDetail",
  //   params: { title: card.title },
  // });

  route.meta.title = card.title;

  navigate();
};

// Watchers

// Lifecycle Hooks
</script>
