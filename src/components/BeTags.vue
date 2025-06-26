<template>
  <div class="be-tag">
    <ul class="tags">
      <li
        ref="tag"
        v-for="(tag, index) in data"
        :key="index"
        :class="[
          'tag',
          {
            // 如果為多選擇把被點選樣式加到每一個tag上
            selected: props.option?.multiple
              ? selectedIndex.includes(index)
              : selectedIndex === index,
          },
          { multiple: props.option?.multiple },
          { disabled: disableTagIndex.includes(index) },
        ]"
        @click="tagSelect(index)">
        <h5 class="label">
          {{ tag.label }}
          <component
            :is="tag.icon"
            v-if="tag.icon"
            size="2rem" />
        </h5>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";

// defineProps / defineEmits
const props = defineProps({
  data: Array, // [{label:"",value:""}]
  option: {
    type: Object,
    default: () => ({}), //Vue：對於 Object 或 Array 類型的 預設值，必須用函式回傳
  },
});

const emit = defineEmits(["tagsClick", "ready"]);

// Refs / Reactive State 定義
const selectedIndex = ref([]);
const disableTagIndex = ref([]);

// Methods / Functions
// 點選後觸發的事件
const tagSelect = (index) => {
  // 如果含有禁止點選的tag
  if (disableTagIndex.value.includes(index)) return;

  // 是否為複選
  if (props.option?.multiple) {
    // toogle邏輯（複選用）
    const i = selectedIndex.value.indexOf(index);
    if (i === -1) {
      // 如果陣列裡沒有就加入
      selectedIndex.value.push(index);
      // 如果有就移除
    } else {
      selectedIndex.value.splice(i, 1);
    }
    emit(
      "tagsClick",
      selectedIndex.value.map((index) => props.data[index].value)
    );
  } else {
    // 單選
    selectedIndex.value = index;
    emit("tagsClick", props.data[index].value);
  }
};

// Watchers
watch(
  () => props.option,
  (option) => {
    // 預設被選擇的index
    if (props.option?.multiple) {
      // 複選
      const indices = (option?.selectedTagNo || []).map((item) => item - 1);
      selectedIndex.value = indices;
      emit(
        "ready",
        selectedIndex.value.map((i) => props.data[i]?.value)
      );
    } else {
      // 單選
      const index = option?.selectedTagNo - 1;
      if (index >= 0) {
        selectedIndex.value = index;
        emit("ready", props.data[selectedIndex.value]?.value);
      }
    }
    // 被禁用的index
    disableTagIndex.value =
      props.option?.disableTagNo.map((tag) => tag - 1) || [];
  },
  { immediate: true } // 進入畫面時執行一次
);
</script>

<style lang="scss" scoped>
@mixin tagsStyle($type: "default") {
  @if ($type == "default") {
    cursor: pointer;
    background-color: getColor(green-01);
    border: 1px solid getColor(green-03);
    color: getColor(green-03);
  } @else if($type == "hover") {
    border: 1px solid getColor(green-04);
    color: getColor(black);
  } @else if($type == "selected") {
    cursor: default;
    background-color: getColor(green-03);
    border: 1px solid getColor(white);
    color: getColor(green-01);
  } @else if($type == "disabled") {
    cursor: not-allowed;
    background-color: getColor(shadow);
    border: 1px solid getColor(green-03);
    color: getColor(green-03);
  }
}

.be-tag {
  width: 100%;
  .tags {
    @include center;
    gap: 4rem;

    .tag {
      @include center;
      @include tagsStyle("default");

      padding: 8px 20px;
      box-sizing: border-box;
      min-width: 4.8rem;
      border-radius: radius(tags);

      &:hover {
        @include tagsStyle("hover");
      }

      &.selected {
        @include tagsStyle("selected");

        &.multiple {
          cursor: pointer;
        }
      }

      &.disabled {
        @include tagsStyle("disabled");
      }

      .label {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
}
</style>
