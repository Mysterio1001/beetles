const localized = (zhTW, en) => Object.freeze({ "zh-TW": zhTW, en });

export const DEFAULT_SHIPPING_METHOD_ID = "seven-eleven";

export const shippingMethodRecords = Object.freeze([
  Object.freeze({
    id: "seven-eleven",
    label: localized("7-ELEVEN 超商取貨", "7-ELEVEN pickup"),
    fee: 70,
    fulfillment: "convenience-store",
    provider: "seven-eleven",
  }),
  Object.freeze({
    id: "familymart",
    label: localized("全家超商取貨", "FamilyMart pickup"),
    fee: 70,
    fulfillment: "convenience-store",
    provider: "familymart",
  }),
  Object.freeze({
    id: "black-cat",
    label: localized("黑貓宅急便", "Black Cat home delivery"),
    fee: 150,
    fulfillment: "home-delivery",
    provider: "black-cat",
  }),
  Object.freeze({
    id: "pickup",
    label: localized("自行取貨", "Self pickup"),
    fee: 0,
    fulfillment: "self-pickup",
    provider: null,
  }),
]);
