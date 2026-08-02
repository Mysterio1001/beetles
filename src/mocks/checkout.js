const localized = (zhTW, en) => Object.freeze({ "zh-TW": zhTW, en });

export const convenienceStoreRecords = Object.freeze([
  Object.freeze({
    id: "seven-eleven-da-an",
    provider: "seven-eleven",
    label: localized("7-ELEVEN 大安門市", "7-ELEVEN Da'an Store"),
    address: localized("臺北市大安區復興南路一段 100 號", "No. 100, Sec. 1, Fuxing S. Rd., Taipei"),
  }),
  Object.freeze({
    id: "seven-eleven-xinyi",
    provider: "seven-eleven",
    label: localized("7-ELEVEN 信義門市", "7-ELEVEN Xinyi Store"),
    address: localized("臺北市信義區松仁路 88 號", "No. 88, Songren Rd., Taipei"),
  }),
  Object.freeze({
    id: "familymart-yongye",
    provider: "familymart",
    label: localized("全家永業門市", "FamilyMart Yongye Store"),
    address: localized("臺北市中正區臨沂街 10 號", "No. 10, Linyi St., Taipei"),
  }),
  Object.freeze({
    id: "familymart-xinyi",
    provider: "familymart",
    label: localized("全家信義門市", "FamilyMart Xinyi Store"),
    address: localized("臺北市信義區信義路五段 20 號", "No. 20, Sec. 5, Xinyi Rd., Taipei"),
  }),
]);

export const paymentMethodRecords = Object.freeze([
  Object.freeze({
    id: "bank-transfer",
    label: localized("銀行轉帳", "Bank transfer"),
    description: localized(
      "不需填寫信用卡資料，也不會建立真實匯款資訊。",
      "No card details are required, and no real transfer information is created.",
    ),
  }),
  Object.freeze({
    id: "credit-card",
    label: localized("信用卡", "Credit card"),
    description: localized(
      "僅驗證格式，卡片資料不會被保存或傳送。",
      "Format validation only. Card data is never saved or sent.",
    ),
  }),
]);
