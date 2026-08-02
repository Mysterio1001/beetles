const localized = (zhTW, en) => ({ "zh-TW": zhTW, en });

export const homeContent = Object.freeze({
  hero: {
    eyebrow: localized("甲蟲羽錄・飼育與收藏", "RECORDING OF BEETLES"),
    title: localized(
      "把微小生命的壯闊，帶進日常。",
      "Bring the wonder of beetles into everyday life.",
    ),
    description: localized(
      "從專業飼育、品系紀錄到昆蟲美學，我們用細緻而負責的方式，陪你探索每一段獨特的生命旅程。",
      "From responsible breeding and lineage records to insect aesthetics, we help you explore every remarkable life journey with care.",
    ),
    image: "img/image-index/main.png",
    imageMobile: "img/image-index/main-rwd.png",
  },
  brand: {
    eyebrow: localized("OUR HABITAT", "OUR HABITAT"),
    title: localized(
      "以觀察、知識與尊重，記錄甲蟲世界。",
      "A beetle journal built on observation, knowledge, and respect.",
    ),
    description: localized(
      "甲蟲羽錄聚集飼育紀錄、精選個體與實作課程，讓新手能安心起步，也讓資深玩家找到值得深入研究的品系與故事。",
      "Recording of Beetles brings together breeding journals, selected specimens, and hands-on learning so newcomers can begin confidently and experienced keepers can go deeper.",
    ),
    image: "img/image-index/picOfAward.png",
    pillars: [
      {
        id: "responsible",
        title: localized("負責任的飼育", "Responsible care"),
        description: localized(
          "重視來源、環境與生命週期，讓每一次飼育都有清楚依據。",
          "Clear provenance, proper habitats, and lifecycle-aware care.",
        ),
      },
      {
        id: "recorded",
        title: localized("可追溯的紀錄", "Traceable records"),
        description: localized(
          "持續整理羽化、尺寸與繁殖觀察，讓經驗可以被分享。",
          "Documented emergence, size, and breeding observations worth sharing.",
        ),
      },
      {
        id: "guided",
        title: localized("友善的陪伴", "Practical guidance"),
        description: localized(
          "從入門選種到進階繁殖，以好理解的方式提供協助。",
          "Approachable support from a first beetle to advanced breeding.",
        ),
      },
    ],
  },
  featuredProducts: [
    {
      id: "japanese-stag-t-brand",
      image: "img/image-index/product1.png",
      name: localized("日本大鍬 T-brand 血統", "Japanese Stag Beetle · T-brand Line"),
      scientificName: "Dorcus hopei binodulosus",
      badge: localized("近期到貨", "NEW ARRIVAL"),
    },
    {
      id: "hercules-kono-line",
      image: "img/image-index/product2.png",
      name: localized("長戟大兜・河野血統", "Hercules Beetle · Kono Line"),
      scientificName: "Dynastes hercules hercules",
      badge: localized("精選品系", "SELECTED LINE"),
    },
    {
      id: "babai-golden-stag",
      image: "img/image-index/product3.png",
      name: localized("馬場黃金鬼鍬形蟲", "Babai Golden Stag Beetle"),
      scientificName: "Allotopus moellenkampi babai",
      badge: localized("人氣品種", "POPULAR"),
    },
    {
      id: "cameroon-crab-stag",
      image: "img/image-index/product4.png",
      name: localized("螃蟹鍬形蟲・喀麥隆產", "Crab Stag Beetle · Cameroon"),
      scientificName: "Homoderus mellyi",
      badge: localized("特色個體", "FEATURED"),
    },
  ],
  featuredArticles: [
    {
      id: "giraffe-stag-breeding-log",
      image: "img/image-index/record1.png",
      title: localized("長頸鹿鋸齒鍬形蟲飼育紀錄", "Giraffe Stag Beetle Breeding Journal"),
      summary: localized(
        "從環境配置到產木管理，整理完整飼育觀察。",
        "Habitat setup, oviposition wood, and practical care observations.",
      ),
      meta: "PGK 118 mm",
    },
    {
      id: "pentodon-breeding-log",
      image: "img/image-index/record2.png",
      title: localized("五角大兜飼育與繁殖紀錄", "Pentodon Beetle Breeding Journal"),
      summary: localized(
        "溫濕度、食材與幼蟲成長階段的重點筆記。",
        "Key notes on temperature, feeding, and larval development.",
      ),
      meta: "DTT 108 mm",
    },
    {
      id: "harris-longhorn-flower-beetle-log",
      image: "img/image-index/record3.png",
      title: localized("哈里斯長角花金龜飼育紀錄", "Harris Longhorn Flower Beetle Journal"),
      summary: localized(
        "記錄特殊花金龜的日常照護與成長變化。",
        "Daily care and growth changes of a remarkable flower beetle.",
      ),
      meta: "PGD 109 mm",
    },
  ],
});
