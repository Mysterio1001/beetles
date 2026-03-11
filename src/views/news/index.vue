<template>
  <be-container>
    <!-- 幻燈片 -->
    <be-swiper :data="swiperData" />
    <!-- 過濾點選tags -->
    <be-tags
      :data="tagsData"
      :option="tagsOption"
      @tags-click="newsFilter"
      @ready="newsFilter" />
    <!-- 消息內容卡片   -->
    <div class="cardWrapper">
      <be-card
        v-for="(card, index) in filterData"
        :key="index"
        :imgSrc="card.imgSrc"
        :imgAlt="card.title"
        :imgPosition="isMobile ? 'left' : 'top'"
        :clickable="true"
        @click="handleClick(card, index)">
        <div class="cardContent">
          <div class="titleBox">
            <h5>
              <span>
                <component
                  :is="currentIcon(card.type)"
                  class="icon" />
              </span>
              {{ card.title }}
            </h5>
          </div>
          <p class="contentBox">{{ card.content }}</p>
        </div>
      </be-card>
    </div>
  </be-container>
  <!-- 消息彈窗 -->
  <be-dialog
    v-model:visible="showDialog"
    :title="currentTitle"
    :showFooterBtn="false">
    <div class="currentCard">
      <div class="imgBox">
        <img
          :src="currentCard.imgSrc"
          :alt="currentCard.title" />
      </div>
      <div class="currentContent">
        <p>{{ currentCard.content }}</p>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a href="">{{ `➤ ${t("news.go")}` }}</a>
      </div>
    </template>
  </be-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Bug, Megaphone, CalendarDays, NotebookPen } from "lucide-vue-next";
import { cardsDataTest, swiperDataTest } from "@/api/testData";
import { useDevice } from "@/utils/useDevice";

const { t } = useI18n();

const tagsOption = {
  selectedTagNo: 1, // 預設點選
};
const tagsData = [
  {
    label: t("news.all"),
    value: "all",
    icon: Bug,
  },
  {
    label: t("news.announcement"),
    value: "announcement",
    icon: Megaphone,
  },
  {
    label: t("news.event"),
    value: "event",
    icon: CalendarDays,
  },
  {
    label: t("news.breedingInfo"),
    value: "breedingInfo",
    icon: NotebookPen,
  },
];
// Refs / Reactive State 定義

// const swiperData = ref([]) api傳入
const swiperData = ref(swiperDataTest);
// const cardsData = ref([]) api傳入
// 傳入的照片需要統一大小
const cardsData = ref(cardsDataTest);
const filterData = ref([]);
// tags 點選後的值
const currentTag = ref("");
// 彈窗相關
const showDialog = ref(false);
const currentTitle = ref("");
const currentCard = ref({});
// RWD 監控
const { isMobile } = useDevice();

// Computed 計算屬性

// Methods / Functions

// 根據類型顯示icon
const currentIcon = (type) => {
  switch (type) {
    case "announcement":
      return Megaphone;
    case "event":
      return CalendarDays;
    case "breedingInfo":
      return NotebookPen;
    default:
      return Bug;
  }
};
// 消息過濾
const newsFilter = (val) => {
  // 如果是已經點選的不執行
  if (val === currentTag.value) return;
  // 儲存這次點選的值
  currentTag.value = val;
  if (val === "all") {
    filterData.value = cardsData.value;
  } else {
    filterData.value = cardsData.value.filter((item) => item.type === val);
  }
};

// 卡片點選
const handleClick = (card, index) => {
  currentTitle.value = card.title;
  showDialog.value = true;
  currentCard.value = card;
};

// 監控視窗變化

// api

// Watchers

// Lifecycle Hooks
</script>
