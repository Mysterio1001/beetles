export const EMPTY_CART_NOTICE_CODE = "empty-cart";

export function resolveCheckoutAccess(itemCount) {
  if (Number.isInteger(itemCount) && itemCount > 0) return true;

  return {
    name: "cart",
    query: { notice: EMPTY_CART_NOTICE_CODE },
    replace: true,
  };
}

export function isEmptyCartNotice(value) {
  const notice = Array.isArray(value) ? value[0] : value;
  return notice === EMPTY_CART_NOTICE_CODE;
}
