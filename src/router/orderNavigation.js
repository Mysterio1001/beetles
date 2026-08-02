export function resolveOrderCompleteAccess(order) {
  if (
    order &&
    typeof order.id === "string" &&
    Boolean(order.id) &&
    Number.isInteger(order.total) &&
    order.total >= 0
  ) {
    return true;
  }

  return { name: "home", replace: true };
}
