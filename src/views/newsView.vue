<template>
  <be-container>
    <!-- 幻燈片 -->
    <be-swiper :data="swiperData" />
    <!-- 過濾點選tags -->
    <be-tags
      :data="tagsData"
      :option="tagsOption" />
    <!-- 消息內容卡片   -->
    <div class="cardWrapper">
      <be-card
        v-for="(card, index) in cardsData"
        :key="index"
        :imgSrc="card.imgSrc"
        :imgPosition="isMobile ? 'left' : 'top'"
        :clickable="true">
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
          <p>{{ card.content }}</p>
        </div>
      </be-card>
    </div>
  </be-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { Bug, Megaphone, CalendarDays, NotebookPen } from "lucide-vue-next";

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
const swiperData = ref([
  {
    src: "../../public/img/image-news/slide1.png",
    name: "slide1.png",
    message: "五角大兜",
  },
  {
    src: "../../public/img/image-news/list2.png",
    name: "list2.png",
    message: "日曆",
  },
  {
    src: "../../public/img/image-news/slide3.png",
    name: "slide3.png",
    message: "黃帶天牛",
  },
]);
// const cardsData = ref([]) api傳入
const cardsData = ref([
  {
    imgSrc: "../../public/img/image-news/list1.png",
    title: "五角大兜蟲大大大量發生中~~!!",
    content:
      "第一輪幼蟲就破百，究竟還會有多少幼蟲呢?現在特價販售中，趕快去商店瞧瞧!",
    type: "breedingInfo",
  },
  {
    imgSrc: "../../public/img/image-news/list1.png",
    title: "五角大兜蟲",
    content:
      "第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，第一輪幼蟲就破百，!",
    type: "announcement",
  },
]);

// RWD 監控
const isMobile = ref(window.innerWidth <= 768);

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

// 監控視窗變化
const updateSize = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Watchers

// Lifecycle Hooks
onMounted(() => {
  updateSize();
  window.addEventListener("resize", updateSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSize);
});
</script>
