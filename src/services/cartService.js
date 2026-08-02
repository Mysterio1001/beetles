import { productRecords } from "../mocks/products.js";
import { DEFAULT_SHIPPING_METHOD_ID, shippingMethodRecords } from "../mocks/shipping.js";

const FALLBACK_LOCALE = "en";

function localize(value, locale) {
  return value?.[locale] ?? value?.[FALLBACK_LOCALE] ?? "";
}

export function getShippingMethods(locale = FALLBACK_LOCALE) {
  return shippingMethodRecords.map((method) => ({
    ...method,
    label: localize(method.label, locale),
  }));
}

export function isShippingMethodId(methodId) {
  return shippingMethodRecords.some((method) => method.id === methodId);
}

export function getShippingMethod(methodId, locale = FALLBACK_LOCALE) {
  const resolvedMethodId = isShippingMethodId(methodId) ? methodId : DEFAULT_SHIPPING_METHOD_ID;
  return getShippingMethods(locale).find((method) => method.id === resolvedMethodId);
}

export function getCartRows(locale, items, products = productRecords) {
  const productsById = new Map(products.map((product) => [product.id, product]));

  return (Array.isArray(items) ? items : []).flatMap((item) => {
    const product = productsById.get(item?.productId);
    const variant = product?.variants?.find((candidate) => candidate.id === item?.variantId);
    if (!product || !variant || !Number.isInteger(item.quantity) || item.quantity < 1) return [];

    return [
      {
        id: `${product.id}:${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        name: localize(product.name, locale),
        scientificName: product.scientificName,
        variantLabel: localize(variant.label, locale),
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
        to: `/beetle-shop/${product.id}`,
      },
    ];
  });
}

export function calculateCartTotals(items, shippingMethodId, products = productRecords) {
  const subtotal = getCartRows(FALLBACK_LOCALE, items, products).reduce(
    (sum, row) => sum + row.lineTotal,
    0,
  );
  const shippingFee = subtotal > 0 ? getShippingMethod(shippingMethodId).fee : 0;

  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
}
