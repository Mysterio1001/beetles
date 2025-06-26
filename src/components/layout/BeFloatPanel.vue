<template>
  <div
    :style="floatPosition"
    :class="[
      'be-float-panel',
      { isLeft: side == 'left' },
      { isRight: side == 'right' },
      { isMovingLeft: isMovingLeft },
      { isMovingRight: isMovingRight },
    ]">
    <div class="title">
      <h4>
        {{ title }}
      </h4>
    </div>
    <div class="mainBox">
      <div class="content">
        <slot></slot>
      </div>
      <div
        :class="['toggleIcon', { iconRotate: isMovingLeft || isMovingRight }]"
        @click="toggleMove">
        <ChevronsLeft
          v-if="side == 'left'"
          class="icon" />
        <ChevronsRight
          v-else
          class="icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { ChevronsRight, ChevronsLeft } from "lucide-vue-next";

// defineProps / defineEmits
const props = defineProps({
  title: String,
  topOffSet: {
    type: String,
    default: "20",
  },
  side: {
    type: String,
    default: "left",
  },
  initialHidden: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([]);

// Refs / Reactive State 定義

// 移動開關
const isMovingLeft = ref(props.side === "left" && props.initialHidden);
const isMovingRight = ref(props.side === "right" && props.initialHidden);

// Computed 計算屬性
const floatPosition = computed(() => {
  const pp = props.topOffSet;
  const unit = "%";
  const style = {};
  // 如果數入的值為數字
  if (!isNaN(Number(pp))) {
    style.top = `${pp}${unit}`;
    // 非數字的話(含單位的值)
  } else {
    style.top = pp;
  }

  return style;
});

// Methods / Functions
const toggleMove = () => {
  if (props.side == "left") {
    isMovingLeft.value = !isMovingLeft.value;
  } else if (props.side == "right") {
    isMovingRight.value = !isMovingRight.value;
  }
};
// Watchers

// Lifecycle Hooks
</script>

<style lang="scss" scoped>
@use "sass:map";

.be-float-panel {
  position: fixed;
  //   top: 20%; 讓父元件控制位置

  max-width: 96vw; // 以防超出視窗
  background-color: getColor(gray-01);
  opacity: 0.9;
  border-radius: radius(tags);
  box-shadow: 0 0 8px getColor(shadow);
  z-index: z(float);

  color: getColor(text);

  transition: transform 0.3s ease-in-out, translate 0.5s linear;

  &:hover:not(.isMovingLeft, .isMovingRight) {
    transform: scale(1.05);
  }

  &.isLeft {
    left: 2rem;
  }

  &.isRight {
    right: 2rem;

    .toggleIcon {
      order: -1;

      &.iconRotate {
        transform: translateX(150%) !important;
      }
    }
  }
  &.isMovingLeft {
    translate: calc(-100% - 2rem) 0;
  }

  &.isMovingRight {
    translate: calc(100% + 2rem) 0;
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0.8rem;
  }
  .mainBox {
    display: flex;
    align-items: center;
    .content {
      padding: 1rem;
    }
    .toggleIcon {
      cursor: pointer;

      transition: transform 0.3s ease;

      &.iconRotate {
        background-color: getColor(gray-01);
        border-radius: radius(circle);
        opacity: 0.7;

        transform: translateX(-150%);
        rotate: 180deg;
      }

      .icon:hover {
        animation: shakeX 0.5s linear infinite;
      }
    }
  }
}

@keyframes shakeX {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(0px);
  }
  75% {
    transform: translateX(2px);
  }
}

// @keyframes iconRotating {
//   0% {
//     transform: rotate(0) translateX(0);
//   }
//   25% {
//     transform: rotate(0) translateX(-25%);
//   }
//   50% {
//     transform: rotate(0) translateX(-50%);
//   }
//   75% {
//     transform: rotate(0) translateX(-75%);
//   }
//   100% {
//     transform: rotate(180deg) translateX(-150%);
//   }
// }

// @keyframes shakeY {
//   0%,
//   100% {
//     transform: translateY(0);
//   }
//   25% {
//     transform: translateY(-2px);
//   }
//   50% {
//     transform: translateY(0px);
//   }
//   75% {
//     transform: translateY(2px);
//   }
// }
</style>
