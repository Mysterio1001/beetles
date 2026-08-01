import { bulletinContact, bulletinContent, bulletinVisuals } from "../mocks/bulletin.js";

const FALLBACK_LOCALE = "en";

function localize(value, locale) {
  return value?.[locale] ?? value?.[FALLBACK_LOCALE] ?? "";
}

export function getBulletinPageData(locale = FALLBACK_LOCALE) {
  return {
    hero: {
      eyebrow: localize(bulletinContent.hero.eyebrow, locale),
      title: localize(bulletinContent.hero.title, locale),
      intro: localize(bulletinContent.hero.intro, locale),
      note: localize(bulletinContent.hero.note, locale),
    },
    services: {
      eyebrow: localize(bulletinContent.services.eyebrow, locale),
      title: localize(bulletinContent.services.title, locale),
      description: localize(bulletinContent.services.description, locale),
      items: bulletinContent.services.items.map((item) => ({
        id: item.id,
        title: localize(item.title, locale),
        description: localize(item.description, locale),
      })),
    },
    contact: {
      eyebrow: localize(bulletinContent.contact.eyebrow, locale),
      headline: localize(bulletinContent.contact.headline, locale),
      phone: bulletinContact.phone,
      phoneHref: `tel:${bulletinContact.phone.replace(/\D/g, "")}`,
      socialLinks: bulletinContact.socialLinks.map((link) => ({
        ...link,
        target: "_blank",
        rel: "noopener noreferrer",
      })),
    },
    visuals: bulletinVisuals,
  };
}

export function getBulletinContact() {
  return getBulletinPageData().contact;
}
