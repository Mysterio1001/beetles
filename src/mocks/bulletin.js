const localized = (zhTW, en) => ({ "zh-TW": zhTW, en });

export const bulletinContent = Object.freeze({
  hero: {
    eyebrow: localized("KEEPING WITH PURPOSE", "KEEPING WITH PURPOSE"),
    title: localized(
      "把甲蟲飼育，變成值得長久分享的知識。",
      "Turn beetle keeping into knowledge worth sharing.",
    ),
    intro: localized(
      "歡迎來到甲蟲羽錄，我們專注於提供各種甲蟲的飼養及販售服務。無論您是甲蟲愛好者還是剛入門的新手，都可以在這裡找到合適的甲蟲，並獲得專業的飼養建議。我們的目標是分享甲蟲的魅力與知識，讓更多人了解並喜愛這些神奇的生物。",
      "Welcome to Recording of Beetles. We provide carefully selected beetles, responsible keeping guidance, and practical support for enthusiasts at every level. Our goal is to share the knowledge and wonder behind these remarkable animals.",
    ),
    note: localized(
      "飼育問題、活動、課程以及標本訂製都歡迎洽詢",
      "Contact us about beetle care, events, courses, and custom specimen work.",
    ),
  },
  services: {
    eyebrow: localized("OUR FIELD", "OUR FIELD"),
    title: localized("從生命照護到昆蟲美學", "From responsible care to insect craft"),
    description: localized(
      "我們把實際飼育經驗整理成能被理解、實作與持續傳承的服務。",
      "We turn hands-on keeping experience into services that can be understood, practiced, and passed forward.",
    ),
    items: [
      {
        id: "responsible-care",
        title: localized("專業飼育建議", "Responsible care guidance"),
        description: localized(
          "依品種、生命階段與環境條件，提供清楚可執行的照護方向。",
          "Clear, practical guidance based on species, life stage, and habitat conditions.",
        ),
      },
      {
        id: "breeding-records",
        title: localized("繁殖與品系紀錄", "Breeding and lineage records"),
        description: localized(
          "記錄投產、孵化、羽化與個體表現，讓經驗可以被持續比較。",
          "Trace oviposition, hatching, emergence, and individual outcomes across each cycle.",
        ),
      },
      {
        id: "events-courses",
        title: localized("活動與實作課程", "Events and hands-on courses"),
        description: localized(
          "以觀察與實作帶領大小朋友安全認識甲蟲與棲地。",
          "Safe, observation-led sessions that introduce beetles and habitats through practice.",
        ),
      },
      {
        id: "specimen-craft",
        title: localized("昆蟲標本訂製", "Custom specimen craft"),
        description: localized(
          "以尊重生命的方式整理、保存並呈現昆蟲獨特的形態。",
          "Thoughtful preservation and presentation that respects each insect's unique form.",
        ),
      },
    ],
  },
  contact: {
    eyebrow: localized("LET'S TALK BEETLES", "LET'S TALK BEETLES"),
    headline: localized(
      "遇到疑難雜症？\n別擔心，因為我來了",
      "Running into a problem?\nDon't worry, I'm here for you.",
    ),
  },
});

export const bulletinContact = Object.freeze({
  phone: "0922-180-199",
  socialLinks: [
    {
      id: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/profile.php?id=100082416973415&mibextid=LQQJ4d",
      icon: "/img/img-beetle-bulletin/icon_facebook.png",
    },
    {
      id: "line",
      label: "LINE",
      url: "https://line.me/ti/p/061ly8VaI_",
      icon: "/img/img-beetle-bulletin/icon_LINE.png",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/giraffa_beetle1001/",
      icon: "/img/img-beetle-bulletin/icon_IG.png",
    },
  ],
});

export const bulletinVisuals = Object.freeze({
  mobile: "/img/img-beetle-bulletin/main-pic.png",
  desktop: {
    background: "/img/img-beetle-bulletin/main-pic-no-bg.png",
    leftBeetle: "/img/img-beetle-bulletin/beetle-left.png",
    rightBeetle: "/img/img-beetle-bulletin/beetle-right.png",
    explosion: "/img/img-beetle-bulletin/explosion.png",
  },
});
