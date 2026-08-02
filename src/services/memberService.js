import { validatePassword } from "../utils/passwordRules.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeIdentifier(value) {
  return normalizeText(value).toLocaleLowerCase();
}

function normalizeBirthday(value) {
  const yearValue = normalizeText(value?.year);
  const monthValue = normalizeText(value?.month);
  const dayValue = normalizeText(value?.day);
  if (!yearValue && !monthValue && !dayValue) return null;

  return {
    year: Number.parseInt(yearValue, 10) || 0,
    month: Number.parseInt(monthValue, 10) || 0,
    day: Number.parseInt(dayValue, 10) || 0,
  };
}

function normalizeAddress(value) {
  return {
    city: normalizeText(value?.city),
    district: normalizeText(value?.district),
    detail: normalizeText(value?.detail),
  };
}

export function getBirthYearOptions(currentYear = new Date().getFullYear(), range = 100) {
  const safeCurrentYear = Number.parseInt(currentYear, 10);
  const safeRange = Math.max(0, Number.parseInt(range, 10) || 0);
  if (!Number.isInteger(safeCurrentYear) || safeCurrentYear < 1) return [];

  return Array.from({ length: safeRange + 1 }, (_, index) => safeCurrentYear - index);
}

export function getDaysInMonth(year, month) {
  const safeYear = Number.parseInt(year, 10);
  const safeMonth = Number.parseInt(month, 10);
  if (!Number.isInteger(safeYear) || !Number.isInteger(safeMonth)) return 0;
  if (safeYear < 1 || safeMonth < 1 || safeMonth > 12) return 0;
  return new Date(safeYear, safeMonth, 0).getDate();
}

export function isValidBirthday(value, currentYear = new Date().getFullYear()) {
  if (value === null) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const { year, month, day } = value;
  return (
    Number.isInteger(year) &&
    year >= 1900 &&
    year <= currentYear &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12 &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= getDaysInMonth(year, month)
  );
}

export function normalizeRegistration(input = {}) {
  return {
    account: normalizeText(input.account),
    email: normalizeIdentifier(input.email),
    password: String(input.password ?? ""),
    passwordConfirm: String(input.passwordConfirm ?? ""),
    name: normalizeText(input.name),
    phone: normalizeText(input.phone),
    birthday: normalizeBirthday(input.birthday),
    address: normalizeAddress(input.address),
  };
}

export function validateRegistration(input = {}, existingMembers = []) {
  const member = normalizeRegistration(input);
  const errors = {};

  for (const field of ["account", "email", "password", "passwordConfirm", "name", "phone"]) {
    if (!member[field]) errors[field] = "required";
  }

  if (member.email && !EMAIL_PATTERN.test(member.email)) errors.email = "invalidEmail";
  if (member.phone && !PHONE_PATTERN.test(member.phone)) errors.phone = "invalidPhone";
  if (member.password && !validatePassword(member.password)) {
    errors.password = "invalidPassword";
  }
  if (member.passwordConfirm && member.password !== member.passwordConfirm) {
    errors.passwordConfirm = "passwordMismatch";
  }
  if (!isValidBirthday(member.birthday)) errors.birthday = "invalidBirthday";

  const accountKey = normalizeIdentifier(member.account);
  const emailKey = normalizeIdentifier(member.email);
  if (
    accountKey &&
    existingMembers.some((candidate) => normalizeIdentifier(candidate.account) === accountKey)
  ) {
    errors.account = "duplicateAccount";
  }
  if (
    emailKey &&
    existingMembers.some((candidate) => normalizeIdentifier(candidate.email) === emailKey)
  ) {
    errors.email = "duplicateEmail";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    member,
  };
}

export function matchesMemberCredentials(member, identifier, password) {
  const identifierKey = normalizeIdentifier(identifier);
  if (!identifierKey || typeof password !== "string") return false;

  return (
    (normalizeIdentifier(member.account) === identifierKey ||
      normalizeIdentifier(member.email) === identifierKey) &&
    member.password === password
  );
}
