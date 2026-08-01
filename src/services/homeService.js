import { homeContent } from "../mocks/home.js";

const FALLBACK_LOCALE = "en";

function localize(value, locale) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  return value[locale] ?? value[FALLBACK_LOCALE] ?? "";
}

function localizeCard(card, locale, routeBase) {
  return {
    ...card,
    name: localize(card.name, locale),
    title: localize(card.title, locale),
    summary: localize(card.summary, locale),
    badge: localize(card.badge, locale),
    to: `${routeBase}/${card.id}`,
  };
}

export function getHomePageData(locale = FALLBACK_LOCALE) {
  return {
    hero: {
      ...homeContent.hero,
      eyebrow: localize(homeContent.hero.eyebrow, locale),
      title: localize(homeContent.hero.title, locale),
      description: localize(homeContent.hero.description, locale),
    },
    brand: {
      ...homeContent.brand,
      eyebrow: localize(homeContent.brand.eyebrow, locale),
      title: localize(homeContent.brand.title, locale),
      description: localize(homeContent.brand.description, locale),
      pillars: homeContent.brand.pillars.map((pillar) => ({
        ...pillar,
        title: localize(pillar.title, locale),
        description: localize(pillar.description, locale),
      })),
    },
    featuredProducts: homeContent.featuredProducts.map((product) =>
      localizeCard(product, locale, "/beetle-shop"),
    ),
    featuredArticles: homeContent.featuredArticles.map((article) =>
      localizeCard(article, locale, "/beetle-lab"),
    ),
  };
}
