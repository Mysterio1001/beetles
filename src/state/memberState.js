import { computed, reactive } from "vue";

import { defaultMemberRecords } from "../mocks/members.js";
import {
  isValidBirthday,
  matchesMemberCredentials,
  validateRegistration,
} from "../services/memberService.js";
import { clearStoredValue, readStoredJson, writeStoredJson } from "../utils/safeStorage.js";

export const MEMBER_STORAGE_KEY = "beetles.members.v1";
export const MEMBER_SESSION_STORAGE_KEY = "beetles.member-session.v1";
const MEMBER_SCHEMA_VERSION = 1;

function getBrowserStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function createMemberId() {
  return globalThis.crypto?.randomUUID?.() ?? `member-${Date.now().toString(36)}`;
}

function isMemberPayload(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.version === MEMBER_SCHEMA_VERSION &&
    Array.isArray(value.members)
  );
}

function isSessionPayload(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.version === MEMBER_SCHEMA_VERSION &&
    typeof value.memberId === "string" &&
    Boolean(value.memberId)
  );
}

function toPublicMember(member) {
  if (!member) return null;
  const { password: _password, ...publicMember } = member;
  return Object.freeze({
    ...publicMember,
    birthday:
      publicMember.birthday && typeof publicMember.birthday === "object"
        ? Object.freeze({ ...publicMember.birthday })
        : null,
    address:
      publicMember.address && typeof publicMember.address === "object"
        ? Object.freeze({ ...publicMember.address })
        : Object.freeze({ city: "", district: "", detail: "" }),
  });
}

function toDemoCredentials(member) {
  return Object.freeze({
    account: String(member?.account ?? ""),
    email: String(member?.email ?? ""),
    password: String(member?.password ?? ""),
  });
}

function sanitizeRegisteredMembers(members, defaultMembers) {
  const sanitized = [];

  for (const candidate of Array.isArray(members) ? members : []) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    if (typeof candidate.id !== "string" || !candidate.id) continue;
    if (defaultMembers.some((member) => member.id === candidate.id)) continue;

    const validation = validateRegistration({ ...candidate, passwordConfirm: candidate.password }, [
      ...defaultMembers,
      ...sanitized,
    ]);
    if (!validation.valid || !isValidBirthday(validation.member.birthday)) continue;

    const { passwordConfirm: _passwordConfirm, ...member } = validation.member;
    sanitized.push({ id: candidate.id, ...member });
  }

  return sanitized;
}

export function createMemberStore({
  storage = getBrowserStorage(),
  defaultMembers = defaultMemberRecords,
  idFactory = createMemberId,
} = {}) {
  const fallbackMemberPayload = { version: MEMBER_SCHEMA_VERSION, members: [] };
  const storedMemberPayload = readStoredJson(
    storage,
    MEMBER_STORAGE_KEY,
    fallbackMemberPayload,
    isMemberPayload,
  );
  const initialRegisteredMembers = sanitizeRegisteredMembers(
    storedMemberPayload.members,
    defaultMembers,
  );
  const normalizedMemberPayload = {
    version: MEMBER_SCHEMA_VERSION,
    members: initialRegisteredMembers,
  };

  if (JSON.stringify(storedMemberPayload) !== JSON.stringify(normalizedMemberPayload)) {
    writeStoredJson(storage, MEMBER_STORAGE_KEY, normalizedMemberPayload);
  }

  const fallbackSessionPayload = { version: MEMBER_SCHEMA_VERSION, memberId: null };
  const storedSessionPayload = readStoredJson(
    storage,
    MEMBER_SESSION_STORAGE_KEY,
    fallbackSessionPayload,
    isSessionPayload,
  );
  const initialMembers = [...defaultMembers, ...initialRegisteredMembers];
  const initialMemberId = initialMembers.some(
    (member) => member.id === storedSessionPayload.memberId,
  )
    ? storedSessionPayload.memberId
    : null;

  if (storedSessionPayload.memberId && !initialMemberId) {
    clearStoredValue(storage, MEMBER_SESSION_STORAGE_KEY);
  }

  const state = reactive({
    registeredMembers: initialRegisteredMembers,
    currentMemberId: initialMemberId,
  });
  const internalMembers = computed(() => [...defaultMembers, ...state.registeredMembers]);
  const demoCredentials = toDemoCredentials(defaultMembers[0]);
  const members = computed(() => internalMembers.value.map(toPublicMember));
  const currentMember = computed(() =>
    toPublicMember(
      internalMembers.value.find((member) => member.id === state.currentMemberId) ?? null,
    ),
  );
  const isAuthenticated = computed(() => Boolean(currentMember.value));

  function persistMembers(registeredMembers = state.registeredMembers) {
    return writeStoredJson(storage, MEMBER_STORAGE_KEY, {
      version: MEMBER_SCHEMA_VERSION,
      members: registeredMembers.map((member) => ({ ...member })),
    });
  }

  function register(input) {
    const validation = validateRegistration(input, internalMembers.value);
    if (!validation.valid) return { ok: false, errors: validation.errors };

    const { passwordConfirm: _passwordConfirm, ...memberData } = validation.member;
    const member = { id: idFactory(), ...memberData };
    if (!persistMembers([...state.registeredMembers, member])) {
      return { ok: false, reason: "storageUnavailable" };
    }

    state.registeredMembers.push(member);
    return { ok: true, member: toPublicMember(member) };
  }

  function login(identifier, password) {
    const member = internalMembers.value.find((candidate) =>
      matchesMemberCredentials(candidate, identifier, password),
    );
    if (!member) {
      if (!clearStoredValue(storage, MEMBER_SESSION_STORAGE_KEY)) {
        return { ok: false, reason: "storageUnavailable" };
      }

      state.currentMemberId = null;
      return { ok: false, reason: "invalidCredentials" };
    }

    const sessionSaved = writeStoredJson(storage, MEMBER_SESSION_STORAGE_KEY, {
      version: MEMBER_SCHEMA_VERSION,
      memberId: member.id,
    });
    if (!sessionSaved) return { ok: false, reason: "storageUnavailable" };

    state.currentMemberId = member.id;
    return { ok: true, member: toPublicMember(member) };
  }

  function logout() {
    if (!state.currentMemberId) return { ok: true };
    if (!clearStoredValue(storage, MEMBER_SESSION_STORAGE_KEY)) {
      return { ok: false, reason: "storageUnavailable" };
    }

    state.currentMemberId = null;
    return { ok: true };
  }

  return {
    demoCredentials,
    members,
    currentMember,
    isAuthenticated,
    register,
    login,
    logout,
  };
}

const memberStore = createMemberStore();

export function useMemberState() {
  return memberStore;
}
