import { cardsDataTest, swiperDataTest } from "./content.js";

const localized = (zhTW, en) => ({ "zh-TW": zhTW, en });

const englishNews = {
  "giant-stag-arrival": {
    title: "Limited Giant Stag Beetles Have Arrived",
    content:
      "A small shipment of impressive giant stag beetles from Southeast Asia has arrived. Their striking form and scarcity make them highly valued for observation, research, and responsible collecting. Quantities are strictly limited.",
    date: "2025-08-18",
  },
  "beetle-contest-registration": {
    title: "Registration Open for the Beetle Contest",
    content:
      "Our first beetle competition is now accepting registrations. Every participant receives an event gift and the winners can earn selected beetle prizes. Beginners and experienced keepers are equally welcome.",
    date: "2025-08-12",
  },
  "pentodon-breeding-100": {
    title: "Pentodon Breeding Project Reaches 100 Larvae",
    content:
      "The first group in our Pentodon breeding project has passed 100 healthy larvae. Temperature and humidity have been carefully managed since the egg stage, and the larvae are now feeding actively with stable growth. A limited reservation list is open.",
    date: "2025-08-05",
  },
  "system-maintenance": {
    title: "Scheduled Website Maintenance",
    content:
      "The website will undergo scheduled maintenance from 1:00 to 3:00 a.m. on Friday. Browsing, shopping, and account features may be temporarily unavailable during this period. Thank you for your patience.",
    date: "2025-07-28",
  },
  "summer-family-class": {
    title: "Summer Family Beetle-Care Class",
    content:
      "Our summer family class introduces insect ecology, daily care, feeding, and habitat setup through guided hands-on activities. Parents and children learn together, and every participant receives a small gift and completion certificate. Places are limited.",
    date: "2025-07-20",
  },
  "golden-stag-hatching": {
    title: "Golden Stag Beetle Hatching Update",
    content:
      "The first batch of golden stag beetle eggs has hatched successfully, producing 32 active larvae. They are continuing to develop in a controlled environment and are expected to be separated into individual containers in two weeks.",
    date: "2025-07-14",
  },
  "website-redesign": {
    title: "Our Redesigned Website Is Live",
    content:
      "The new Recording of Beetles website is now online with clearer navigation, faster content discovery, improved filters, and a smoother shopping flow. We hope the refreshed experience makes every visit more useful.",
    date: "2025-07-08",
  },
  "beetle-sex-guide": {
    title: "Care Classroom: Identifying Beetle Sex",
    content:
      "Horn size and shape, body proportions, and color differences can help distinguish male and female beetles. This practical guide uses clear examples to help new keepers recognize common traits and avoid frequent mistakes.",
    date: "2025-06-30",
  },
  "autumn-beetle-exhibition": {
    title: "Autumn Beetle Exhibition Coming Soon",
    content:
      "The autumn exhibition will feature more than 100 remarkable beetle species alongside talks, hands-on activities, and care competitions. Visitors can also enter a prize drawing for event-only keepsakes.",
    date: "2025-06-22",
  },
};

export const newsItems = Object.freeze(
  cardsDataTest.map((item) => ({
    id: item.id,
    image: item.imgSrc,
    category: item.type,
    date: englishNews[item.id].date,
    title: localized(item.title, englishNews[item.id].title),
    content: localized(item.content, englishNews[item.id].content),
  })),
);

const englishSlides = {
  "pentodon-slide": {
    title: "Pentodon Breeding Notes",
    description: "Follow the latest growth milestones from our breeding room.",
  },
  "calendar-slide": {
    title: "Classes and Event Calendar",
    description: "Plan your next workshop, exhibition, or beetle-care session.",
  },
  "longhorn-slide": {
    title: "Species Observation",
    description: "Discover form, color, habitat, and care through close observation.",
  },
};

const chineseSlideDescriptions = {
  "pentodon-slide": "追蹤繁殖室裡每一個重要的成長里程碑。",
  "calendar-slide": "掌握課程、活動與甲蟲展覽的最新安排。",
  "longhorn-slide": "從近距離觀察認識形態、色彩、棲地與照護。",
};

export const newsSlides = Object.freeze(
  swiperDataTest.map((slide) => ({
    id: slide.id,
    image: slide.src,
    title: localized(slide.message, englishSlides[slide.id].title),
    description: localized(chineseSlideDescriptions[slide.id], englishSlides[slide.id].description),
  })),
);
