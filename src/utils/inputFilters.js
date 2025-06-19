// 過濾非英文及數字

export function filterAlphaNumeric(value) {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}
