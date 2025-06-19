// 密碼規則設定

export const passwordRules = {
  minLength: 6,
  maxLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSymbol: false,
};

// 驗證函式
// 回傳一個Boolean
export function validatePassword(pwd) {
  const rules = passwordRules;
  if (pwd.length < rules.minLength || pwd.length > rules.maxLength)
    return false;
  if (rules.requireUppercase && !/[A-Z]/.test(pwd)) return false;
  if (rules.requireLowercase && !/[a-z]/.test(pwd)) return false;
  if (rules.requireNumber && !/[0-9]/.test(pwd)) return false;
  if (rules.requireSymbol && !/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return false;
  return true;
}
