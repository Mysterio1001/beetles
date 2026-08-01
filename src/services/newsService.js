import { newsItems, newsSlides } from "../mocks/news.js";

const FALLBACK_LOCALE = "en";

function localize(value, locale) {
  return value?.[locale] ?? value?.[FALLBACK_LOCALE] ?? "";
}

export function getNewsPageData(locale = FALLBACK_LOCALE) {
  return {
    items: newsItems.map((item) => ({
      ...item,
      title: localize(item.title, locale),
      content: localize(item.content, locale),
    })),
    slides: newsSlides.map((slide) => ({
      ...slide,
      title: localize(slide.title, locale),
      description: localize(slide.description, locale),
    })),
  };
}

export function filterNewsItems(items, category = "all") {
  if (category === "all") return [...items];
  return items.filter((item) => item.category === category);
}

export function canAutoplayNewsCarousel(slideCount, prefersReducedMotion) {
  return slideCount > 1 && !prefersReducedMotion;
}

export function getNewsItemById(locale, id) {
  return getNewsPageData(locale).items.find((item) => item.id === id) ?? null;
}
