import { articleDataTest } from "./content.js";

const localized = (zhTW, en) => ({ "zh-TW": zhTW, en });

const chineseArticleContent = {
  "giraffe-stag-breeding-log": {
    title: "長頸鹿鋸齒鍬形蟲飼育紀錄",
    summary: "從溫濕度、基質到產木管理，整理長頸鹿鋸齒鍬形蟲繁殖過程中最重要的觀察。",
  },
  "oviposition-wood-tips": {
    title: "產木選擇及投產小技巧",
    summary: "硬度、樹種、含水量與擺放方式都會影響產卵成果，帶你建立可重複的產木選擇方法。",
  },
  "pentodon-breeding-log": {
    title: "五角大兜飼育與繁殖紀錄",
    summary: "記錄五角大兜從成蟲照護、投產環境到幼蟲管理的關鍵條件與繁殖心得。",
  },
  "beginner-beetle-guide": {
    title: "適合新手入門的幾種家門蟲",
    summary: "從環境需求、照護難度與取得方式，挑選適合第一次飼育的甲蟲種類。",
  },
  "harris-longhorn-flower-beetle-log": {
    title: "哈里斯長角花金龜飼育紀錄",
    summary: "認識具有醒目頭角的哈里斯長角花金龜，整理日常餵食、環境配置與成長觀察。",
  },
};

const englishArticleContent = {
  "giraffe-stag-breeding-log": {
    title: "Giraffe Stag Beetle Breeding Log",
    summary:
      "A practical record of temperature, humidity, substrate, and oviposition-wood management for giraffe stag beetles.",
    content:
      "Giraffe stag beetles attract keepers with their extraordinary size and form. This record covers habitat setup, food selection, oviposition wood, and later-stage care. Temperature and humidity directly affect larval growth and survival, while a nutritious substrate supports steady development. New keepers should build experience with manageable species before attempting more demanding breeding projects. Healthy females and correctly prepared wood are essential during oviposition. Patient observation and consistent notes make it possible to refine the environment and improve each breeding cycle.",
  },
  "oviposition-wood-tips": {
    title: "Choosing and Preparing Oviposition Wood",
    summary:
      "Learn how wood hardness, species, moisture, and placement influence a reliable oviposition setup.",
    content:
      "Oviposition wood varies from very hard to soft, and each beetle species responds differently to wood type, moisture, and placement. This guide explains how to assess the female, prepare the substrate, and decide whether the wood should be buried, half buried, or placed upright. Stable temperature and humidity remain important throughout the laying period. Recording how each setup performs helps keepers replace guesswork with a repeatable method and choose better materials for the next cycle.",
  },
  "pentodon-breeding-log": {
    title: "Pentodon Care and Breeding Log",
    summary:
      "Key conditions from adult care and breeding setup through egg checks and early larval management.",
    content:
      "The five horns of Pentodon beetles make them instantly recognizable, but successful breeding depends on careful preparation. This log follows adult feeding, breeding-container setup, moisture control, egg checks, and the transition to larval care. Females need a stable substrate that is neither waterlogged nor dry, and disturbance should be kept to a minimum. Consistent observations reveal when the environment should be adjusted and help protect larvae during their most vulnerable stage.",
  },
  "beginner-beetle-guide": {
    title: "Beginner-Friendly Beetles for a First Habitat",
    summary:
      "Compare environment needs, care difficulty, and availability when choosing a first beetle species.",
    content:
      "A first beetle should match the keeper's available space, seasonal temperature, and time for daily care. This guide compares several hardy, accessible species and explains their feeding, substrate, and ventilation needs. Starting with a forgiving species makes it easier to recognize normal behavior and respond to changes without unnecessary intervention. Once the basic routine is stable, those skills can be applied to larger or more sensitive beetles.",
  },
  "harris-longhorn-flower-beetle-log": {
    title: "Harris Longhorn Flower Beetle Care Log",
    summary:
      "Daily feeding, habitat setup, and growth observations for a distinctive flower beetle with a prominent head horn.",
    content:
      "The Harris longhorn flower beetle is a distinctive medium-sized species, especially the male with its prominent head horn. This care log records feeding response, ventilation, substrate condition, and changes during development. A clean habitat and stable moisture level support active adults and healthy larvae. Regular observation also makes it easier to identify stress early and adjust food or enclosure conditions before the problem grows.",
  },
};

export const articleRecords = Object.freeze(
  articleDataTest.map((article) => {
    const chinese = chineseArticleContent[article.id];
    const english = englishArticleContent[article.id];

    return {
      id: article.id,
      image: article.imgSrc,
      date: article.createDate,
      title: localized(chinese.title, english.title),
      summary: localized(chinese.summary, english.summary),
      content: localized(article.content, english.content),
    };
  }),
);
