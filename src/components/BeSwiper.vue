<template>
  <div
    ref="beSwiper"
    class="be-swiper">
    <ul
      ref="imgBox"
      class="imgBox">
      <li
        v-for="(img, index) in siwperData"
        :key="index"
        :ref="setImgRefs">
        <img
          :src="img.src"
          :alt="img.name" />
        <div class="swiperMsg">
          <h3>{{ img.message }}</h3>
        </div>
      </li>
    </ul>
    <div
      v-if="moveArrow"
      class="arrow leftArrow"
      @click="handleMove('left')">
      <CircleChevronLeft class="icon" />
    </div>
    <div
      v-if="moveArrow"
      class="arrow rightArrow"
      @click="handleMove('right')">
      <CircleChevronRight class="icon" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeUpdate, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { CircleChevronLeft, CircleChevronRight } from "lucide-vue-next";

// defineProps / defineEmits
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  time: {
    type: Number,
    default: 4,
  },
  moveArrow: {
    type: Boolean,
    default: true,
  },
  // mobileMode: {
  //   type: Boolean,
  //   default: false,
  // },
});

// Refs / Reactive State 定義

const beSwiper = ref(null); // 最外容器
const imgBox = ref(null); // ul
const imgRefs = ref([]); // li的ref容器

const siwperData = ref([]); // 幻燈片資料

const currentIndex = ref(1); // 目前顯示第幾張(index)
const isActive = ref(false); // 防止連續點擊

// 開啟手機模式 且 處於手機大小螢幕
// const isMobile = ref(props.mobileMode && window.innerWidth <= 576);

let autoMoveInterval = null; // 執行自動播放

// Computed 計算屬性

// Methods / Functions

// li的ref存入
const setImgRefs = (el) => {
  if (!el) return;
  imgRefs.value.push(el);
};

// 圖片移動
const imgBoxTransform = (width, isTransition = true, time = "0.8") => {
  imgBox.value.style.transform = `translateX(-${width * currentIndex.value}px)`;
  imgBox.value.style.transition = isTransition ? `transform ${time}s linear` : "none";
};

// let isActive = false; // 防止連續點擊
// 點選移動
const handleMove = (direction, isAuto = false) => {
  if (isActive.value) return;
  isActive.value = true;
  // 確認是否為自動播放或手動播放
  if (!isAuto) {
    clearInterval(autoMoveInterval);
    setTimeout(() => {
      clearInterval(autoMoveInterval);

      autoMoveInterval = setInterval(() => {
        handleMove("left", true);
      }, props.time * 1000);
    }, 3000);
  }

  const imgWidth = beSwiper.value.offsetWidth;

  if (direction === "left") {
    currentIndex.value++;
  } else if (direction === "right") {
    currentIndex.value--;
  }
  imgBoxTransform(imgWidth, true);
  // 無縫接軌邏輯處理
  setTimeout(() => {
    const maxIndex = siwperData.value.length - 1;
    if (currentIndex.value === 0) {
      currentIndex.value = maxIndex - 1;
      imgBoxTransform(imgWidth, false, 0.1);
    } else if (currentIndex.value == maxIndex) {
      currentIndex.value = 1;
      imgBoxTransform(imgWidth, false, 0.1);
    }
    isActive.value = false;
  }, 1000);
};

// 視窗寬度變動改變
const handleResize = () => {
  if (!beSwiper.value || !imgBox.value || imgRefs.value.length === 0) return;
  const width = beSwiper.value.offsetWidth;
  imgBox.value.style.width = width * siwperData.value.length + "px";
  imgRefs.value.forEach((li) => {
    li.style.width = width + "px";
  });
  imgBoxTransform(width, false);
};

// Watchers

watch(
  () => props.data,
  (newData) => {
    if (!newData || !newData.length) return;
    const first = newData[0];
    // console.log('first',first)
    const last = newData.at(-1);
    // console.log('newData',newData)
    siwperData.value = [last, ...newData, first];
    // console.log('siwperData.value',siwperData.value)

    nextTick(() => {
      const imgWidth = beSwiper.value.offsetWidth;
      imgBoxTransform(imgWidth, false);
    });
  },
  { immediate: true },
);
// Lifecycle Hooks
onBeforeUpdate(() => {
  imgRefs.value = []; // 每次重新渲染前先清空
});

// 動態控制幻燈片個項目寬度比例
onMounted(() => {
  nextTick(() => {
    // 初始執行
    handleResize();
    window.addEventListener("resize", handleResize);
    // 執行自動播放
    autoMoveInterval = setInterval(() => {
      handleMove("left", true);
    }, props.time * 1000);
  });
});

// 關閉自動播放
onBeforeUnmount(() => {
  clearInterval(autoMoveInterval);
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
@use "sass:map";
.be-swiper {
  position: relative;

  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  border-radius: radius(block);

  overflow-x: hidden;
  /* 隱藏橫向捲軸樣式 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .imgBox {
    @include center;

    width: max-content; // 撐開 ul 的寬度，剛好包含所有 li
    background-color: getColor(shadow);

    transition: transform 0.5s linear;
    li {
      position: relative;

      img {
        display: block;

        margin: 0 auto;
        max-width: 100%;
        height: 50rem;
        object-fit: contain; // 保持比例完整顯示，不裁切
      }

      .swiperMsg {
        position: absolute;
        right: 28px;
        bottom: 10px;

        padding: 0.4rem 1rem;
        box-sizing: border-box;

        background-color: getColor(opacity);
        border-radius: radius(block);

        h3 {
          color: getColor(white);
        }
      }
    }
  }

  .arrow {
    cursor: pointer;

    position: absolute;
    top: 50%;

    background-color: getColor(white);

    border-radius: radius(circle);
    opacity: 0.3;

    transform: translateY(-50%);

    z-index: z(float);

    &.leftArrow {
      left: 1%;
    }
    &.rightArrow {
      right: 1%;
    }

    .icon {
      width: 5rem;
      height: 5rem;
      color: getColor(green-03);

      &:hover {
        color: getColor(black);
      }
    }
  }
}
</style>
