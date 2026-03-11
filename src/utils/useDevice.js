import { ref, onMounted, onBeforeUnmount } from "vue";
import { getDevice, watchDevice, getView } from "@mysterio1001/toolkit";

/**
 * @function useDevice
 * @description 響應式取得是否為行動裝置以及行動裝置類型
 * @returns {Object} isMobile, devicetype
 */
export function useDevice() {
  const isMobile = ref(getDevice().isMobile);

  const devicetype = ref(getDevice().device);
  let unwatch;

  onMounted(() => {
    unwatch = watchDevice((state) => {
      isMobile.value = state.isMobile;
      devicetype.value = state.device;
    });
  });
  onBeforeUnmount(() => {
    if (unwatch) {
      unwatch();
    }
  });
  console.log("in", isMobile.value);
  return { isMobile, devicetype };
}
