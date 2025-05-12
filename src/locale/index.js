import { createI18n } from "vue-i18n";
import zhTw from "./zh_tw";
import en from "./en";

// 根據瀏覽器語系判斷預設語言
let locale = "zh-TW";
if (navigator.language.toLowerCase().startsWith("en")) {
  locale = "en";
}

const messages = {
  "zh-TW": zhTw,
  en,
};

const i18n = createI18n({
  legacy: true,
  locale,
  fallbackLocale: "zh-TW",
  messages,
});

export default i18n;
