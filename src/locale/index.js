import { createI18n } from "vue-i18n";
import zhTw from "./zh_tw";
import en from "./en";
import { isSupportedLocale, loadInitialLocale, persistLocale } from "./localePreference";

const messages = {
  "zh-TW": zhTw,
  en,
};

const i18n = createI18n({
  legacy: false,
  locale: loadInitialLocale(),
  fallbackLocale: "en",
  messages,
  missingWarn: false,
  fallbackWarn: false,
});

export function setLocale(locale) {
  if (!isSupportedLocale(locale)) return false;

  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
  persistLocale(locale);
  return true;
}

export function syncDocumentLanguage() {
  document.documentElement.lang = i18n.global.locale.value;
}

export default i18n;
