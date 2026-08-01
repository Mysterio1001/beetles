import { clearStoredValue, readStoredJson, writeStoredJson } from "../utils/safeStorage.js";

export const SUPPORTED_LOCALES = Object.freeze({
  ZH_TW: "zh-TW",
  EN: "en",
});

export const DEFAULT_LOCALE = SUPPORTED_LOCALES.EN;
export const LOCALE_STORAGE_KEY = "beetles.locale";

export function isSupportedLocale(locale) {
  return Object.values(SUPPORTED_LOCALES).includes(locale);
}

export function resolveInitialLocale({ savedLocale, browserLanguages = [] } = {}) {
  if (isSupportedLocale(savedLocale)) return savedLocale;

  const normalizedLanguages = Array.isArray(browserLanguages)
    ? browserLanguages
    : [browserLanguages];

  for (const language of normalizedLanguages) {
    const normalizedLanguage = String(language || "").toLowerCase();
    if (normalizedLanguage.startsWith("zh")) return SUPPORTED_LOCALES.ZH_TW;
    if (normalizedLanguage.startsWith("en")) return SUPPORTED_LOCALES.EN;
  }

  return DEFAULT_LOCALE;
}

export function getBrowserLanguages(browserNavigator = globalThis.navigator) {
  if (!browserNavigator) return [];
  if (Array.isArray(browserNavigator.languages) && browserNavigator.languages.length) {
    return browserNavigator.languages;
  }
  return browserNavigator.language ? [browserNavigator.language] : [];
}

export function loadInitialLocale(
  storage = globalThis.localStorage,
  browserNavigator = globalThis.navigator,
) {
  const savedLocale = readStoredJson(storage, LOCALE_STORAGE_KEY, null, isSupportedLocale);

  return resolveInitialLocale({
    savedLocale,
    browserLanguages: getBrowserLanguages(browserNavigator),
  });
}

export function persistLocale(locale, storage = globalThis.localStorage) {
  if (!isSupportedLocale(locale)) {
    clearStoredValue(storage, LOCALE_STORAGE_KEY);
    return false;
  }

  return writeStoredJson(storage, LOCALE_STORAGE_KEY, locale);
}
