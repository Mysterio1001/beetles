import { convenienceStoreRecords, paymentMethodRecords } from "../mocks/checkout.js";
import { getShippingMethod } from "./cartService.js";

const FALLBACK_LOCALE = "en";
const DEFAULT_PAYMENT_METHOD_ID = "bank-transfer";
let fallbackOrderSequence = 0;

function localize(value, locale) {
  return value?.[locale] ?? value?.[FALLBACK_LOCALE] ?? "";
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function onlyDigits(value) {
  return cleanText(value).replace(/\D/g, "");
}

function createAddress(address = {}) {
  return {
    city: cleanText(address.city),
    district: cleanText(address.district),
    detail: cleanText(address.detail),
  };
}

function createCard(card = {}) {
  return {
    cardholderName: cleanText(card.cardholderName),
    cardNumber: typeof card.cardNumber === "string" ? card.cardNumber : "",
    expiryMonth: typeof card.expiryMonth === "string" ? card.expiryMonth : "",
    expiryYear: typeof card.expiryYear === "string" ? card.expiryYear : "",
    securityCode: typeof card.securityCode === "string" ? card.securityCode : "",
  };
}

export function createCheckoutForm(initial = {}) {
  return {
    recipientName: cleanText(initial.recipientName),
    phone: typeof initial.phone === "string" ? initial.phone : "",
    address: createAddress(initial.address),
    storeId: typeof initial.storeId === "string" ? initial.storeId : "",
    paymentMethodId:
      typeof initial.paymentMethodId === "string"
        ? initial.paymentMethodId
        : DEFAULT_PAYMENT_METHOD_ID,
    card: createCard(initial.card),
  };
}

export function getMemberCheckoutPrefill(member) {
  return {
    recipientName: cleanText(member?.name),
    phone: typeof member?.phone === "string" ? member.phone : "",
    address: createAddress(member?.address),
  };
}

export function getConvenienceStores(provider, locale = FALLBACK_LOCALE) {
  return convenienceStoreRecords
    .filter((store) => store.provider === provider)
    .map((store) => ({
      id: store.id,
      provider: store.provider,
      label: localize(store.label, locale),
      address: localize(store.address, locale),
    }));
}

export function getPaymentMethods(locale = FALLBACK_LOCALE) {
  return paymentMethodRecords.map((method) => ({
    id: method.id,
    label: localize(method.label, locale),
    description: localize(method.description, locale),
  }));
}

function validateExpiry(monthValue, yearValue, now) {
  if (!/^\d{2}$/.test(monthValue) || !/^\d{4}$/.test(yearValue)) return "invalid";

  const month = Number(monthValue);
  const year = Number(yearValue);
  if (month < 1 || month > 12) return "invalid";

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return year < currentYear || (year === currentYear && month < currentMonth) ? "expired" : null;
}

export function validateCheckoutForm(form, { shippingMethodId, now = new Date() } = {}) {
  const normalized = createCheckoutForm(form);
  const phoneInput = cleanText(normalized.phone);
  const cardNumberInput = cleanText(normalized.card.cardNumber);
  const expiryMonthInput = cleanText(normalized.card.expiryMonth);
  const expiryYearInput = cleanText(normalized.card.expiryYear);
  const securityCodeInput = cleanText(normalized.card.securityCode);

  normalized.phone = phoneInput;
  normalized.card.cardholderName = cleanText(normalized.card.cardholderName);
  normalized.card.cardNumber = onlyDigits(cardNumberInput);
  normalized.card.expiryMonth = /^\d{1,2}$/.test(expiryMonthInput)
    ? expiryMonthInput.padStart(2, "0")
    : expiryMonthInput;
  normalized.card.expiryYear = expiryYearInput;
  normalized.card.securityCode = securityCodeInput;

  const errors = {};
  if (!normalized.recipientName) errors.recipientName = "required";
  if (!/^\d{10}$/.test(normalized.phone)) errors.phone = "invalid";

  const shippingMethod = getShippingMethod(shippingMethodId);
  if (shippingMethod.fulfillment === "home-delivery") {
    if (!normalized.address.city) errors.addressCity = "required";
    if (!normalized.address.district) errors.addressDistrict = "required";
    if (!normalized.address.detail) errors.addressDetail = "required";
  }

  if (shippingMethod.fulfillment === "convenience-store") {
    if (!normalized.storeId) errors.storeId = "required";
    else {
      const store = convenienceStoreRecords.find(
        (candidate) => candidate.id === normalized.storeId,
      );
      if (!store || store.provider !== shippingMethod.provider) errors.storeId = "invalid";
    }
  }

  const paymentMethodExists = paymentMethodRecords.some(
    (method) => method.id === normalized.paymentMethodId,
  );
  if (!paymentMethodExists) errors.paymentMethodId = "invalid";

  if (normalized.paymentMethodId === "credit-card") {
    if (!normalized.card.cardholderName) errors.cardholderName = "required";
    if (!/^[\d -]+$/.test(cardNumberInput) || !/^\d{16}$/.test(normalized.card.cardNumber)) {
      errors.cardNumber = "invalid";
    }

    const expiryError =
      /^\d{1,2}$/.test(expiryMonthInput) && /^\d{4}$/.test(expiryYearInput)
        ? validateExpiry(normalized.card.expiryMonth, normalized.card.expiryYear, now)
        : "invalid";
    if (expiryError) errors.expiry = expiryError;
    if (!/^\d{3}$/.test(normalized.card.securityCode)) errors.securityCode = "invalid";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
}

export function createMockOrder({
  id,
  createdAt,
  rows,
  shippingMethodId,
  paymentMethodId,
  totals,
}) {
  const items = (Array.isArray(rows) ? rows : []).map((row) =>
    Object.freeze({
      productId: row.productId,
      variantId: row.variantId,
      quantity: row.quantity,
      price: row.price,
      lineTotal: row.lineTotal,
    }),
  );

  return Object.freeze({
    id,
    createdAt: createdAt.toISOString(),
    items: Object.freeze(items),
    shippingMethodId,
    paymentMethodId,
    subtotal: totals.subtotal,
    shippingFee: totals.shippingFee,
    total: totals.total,
  });
}

export function createMockOrderId(now = new Date(), options = {}) {
  const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("");
  const uuidFactory = Object.hasOwn(options, "uuidFactory")
    ? options.uuidFactory
    : globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  const nowFactory = typeof options.nowFactory === "function" ? options.nowFactory : Date.now;
  const uuid = typeof uuidFactory === "function" ? uuidFactory() : "";
  const entropy = uuid
    ? uuid.replace(/-/g, "").slice(0, 8).toUpperCase()
    : `${nowFactory().toString(36)}-${(++fallbackOrderSequence).toString(36).padStart(4, "0")}`.toUpperCase();

  return `BT-${date}-${entropy}`;
}
