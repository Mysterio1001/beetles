import test from "node:test";
import assert from "node:assert/strict";

import { defaultMemberRecords } from "../../src/mocks/members.js";
import {
  getBirthYearOptions,
  getDaysInMonth,
  validateRegistration,
} from "../../src/services/memberService.js";
import {
  MEMBER_SESSION_STORAGE_KEY,
  MEMBER_STORAGE_KEY,
  createMemberStore,
} from "../../src/state/memberState.js";

function createMemoryStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

const validRegistration = {
  account: "new_keeper",
  email: "keeper@beetles.test",
  password: "Keeper2026",
  passwordConfirm: "Keeper2026",
  name: "新會員",
  phone: "0911222333",
  birthday: { year: 2000, month: 2, day: 29 },
  address: { city: "臺北市", district: "大安區", detail: "測試路 1 號" },
};

test("集中預設會員提供可文件化的 Mock 測試帳號", () => {
  assert.equal(defaultMemberRecords.length, 1);
  assert.equal(defaultMemberRecords[0].account, "beetles_demo");
  assert.equal(defaultMemberRecords[0].email, "demo@beetles.test");
  assert.equal(defaultMemberRecords[0].password, "Beetle2026");
});

test("生日選項涵蓋指定年度並遵守閏年與月份天數", () => {
  assert.deepEqual(getBirthYearOptions(2026).slice(0, 3), [2026, 2025, 2024]);
  assert.equal(getDaysInMonth(2000, 2), 29);
  assert.equal(getDaysInMonth(1900, 2), 28);
  assert.equal(getDaysInMonth(2025, 4), 30);
  assert.equal(getDaysInMonth(2025, 1), 31);
});

test("註冊驗證涵蓋必填、email、電話、密碼、確認密碼與生日", () => {
  assert.deepEqual(validateRegistration({}).errors, {
    account: "required",
    email: "required",
    password: "required",
    passwordConfirm: "required",
    name: "required",
    phone: "required",
  });

  const result = validateRegistration({
    ...validRegistration,
    email: "invalid",
    phone: "123",
    password: "weak",
    passwordConfirm: "different",
    birthday: { year: 2025, month: 2, day: 29 },
  });
  assert.equal(result.errors.email, "invalidEmail");
  assert.equal(result.errors.phone, "invalidPhone");
  assert.equal(result.errors.password, "invalidPassword");
  assert.equal(result.errors.passwordConfirm, "passwordMismatch");
  assert.equal(result.errors.birthday, "invalidBirthday");
});

test("帳號與 email 唯一性不分大小寫且涵蓋預設會員", () => {
  const duplicateAccount = validateRegistration(
    { ...validRegistration, account: "BEETLES_DEMO" },
    defaultMemberRecords,
  );
  const duplicateEmail = validateRegistration(
    { ...validRegistration, email: "DEMO@BEETLES.TEST" },
    defaultMemberRecords,
  );

  assert.equal(duplicateAccount.errors.account, "duplicateAccount");
  assert.equal(duplicateEmail.errors.email, "duplicateEmail");
});

test("註冊只持久化維護所需會員資料且不保存確認密碼", () => {
  const storage = createMemoryStorage();
  const store = createMemberStore({ storage, idFactory: () => "registered-1" });
  const result = store.register(validRegistration);

  assert.equal(result.ok, true);
  assert.equal(result.member.id, "registered-1");
  assert.equal(store.members.value.length, 2);
  assert.deepEqual(JSON.parse(storage.getItem(MEMBER_STORAGE_KEY)), {
    version: 1,
    members: [
      {
        id: "registered-1",
        account: "new_keeper",
        email: "keeper@beetles.test",
        password: "Keeper2026",
        name: "新會員",
        phone: "0911222333",
        birthday: { year: 2000, month: 2, day: 29 },
        address: { city: "臺北市", district: "大安區", detail: "測試路 1 號" },
      },
    ],
  });
  assert.equal(storage.getItem(MEMBER_STORAGE_KEY).includes("passwordConfirm"), false);
});

test("預設會員可用帳號或 email 登入，錯誤憑證不建立狀態", () => {
  const storage = createMemoryStorage();
  const store = createMemberStore({ storage });

  assert.equal(store.login("beetles_demo", "wrong").ok, false);
  assert.equal(store.isAuthenticated.value, false);
  assert.equal(storage.getItem(MEMBER_SESSION_STORAGE_KEY), null);

  assert.equal(store.login("BEETLES_DEMO", "Beetle2026").ok, true);
  assert.equal(store.currentMember.value.account, "beetles_demo");
  store.logout();
  assert.equal(store.login("DEMO@BEETLES.TEST", "Beetle2026").ok, true);
});

test("本機註冊會員可登入，session 可重建且登出會清除", () => {
  const storage = createMemoryStorage();
  const firstStore = createMemberStore({ storage, idFactory: () => "registered-1" });
  firstStore.register(validRegistration);
  assert.equal(firstStore.login("new_keeper", "Keeper2026").ok, true);
  assert.deepEqual(JSON.parse(storage.getItem(MEMBER_SESSION_STORAGE_KEY)), {
    version: 1,
    memberId: "registered-1",
  });

  const secondStore = createMemberStore({ storage });
  assert.equal(secondStore.currentMember.value.email, "keeper@beetles.test");
  assert.deepEqual(secondStore.logout(), { ok: true });
  assert.equal(secondStore.isAuthenticated.value, false);
  assert.equal(storage.getItem(MEMBER_SESSION_STORAGE_KEY), null);
});

test("session 刪除失敗時不得假裝完成登出或錯誤憑證清理", () => {
  const readableStorage = createMemoryStorage();
  let failRemoval = false;
  const storage = {
    ...readableStorage,
    removeItem(key) {
      if (failRemoval) throw new Error("storage unavailable");
      readableStorage.removeItem(key);
    },
  };
  const store = createMemberStore({ storage });
  store.login("beetles_demo", "Beetle2026");
  failRemoval = true;

  assert.deepEqual(store.logout(), { ok: false, reason: "storageUnavailable" });
  assert.equal(store.isAuthenticated.value, true);
  assert.notEqual(storage.getItem(MEMBER_SESSION_STORAGE_KEY), null);

  assert.deepEqual(store.login("beetles_demo", "wrong"), {
    ok: false,
    reason: "storageUnavailable",
  });
  assert.equal(store.isAuthenticated.value, true);

  failRemoval = false;
  assert.deepEqual(store.logout(), { ok: true });
  assert.equal(store.isAuthenticated.value, false);
  assert.equal(storage.getItem(MEMBER_SESSION_STORAGE_KEY), null);
});

test("會員或 session 寫入失敗時回滾記憶體狀態並回報失敗", () => {
  const readableStorage = createMemoryStorage();
  const storage = {
    ...readableStorage,
    setItem() {
      throw new Error("storage unavailable");
    },
  };
  const store = createMemberStore({ storage, idFactory: () => "registered-1" });

  assert.deepEqual(store.register(validRegistration), {
    ok: false,
    reason: "storageUnavailable",
  });
  assert.equal(store.members.value.length, 1);

  assert.deepEqual(store.login("beetles_demo", "Beetle2026"), {
    ok: false,
    reason: "storageUnavailable",
  });
  assert.equal(store.isAuthenticated.value, false);
});

test("公開會員 DTO 不得透過巢狀生日或地址改寫內部狀態", () => {
  const storage = createMemoryStorage();
  const store = createMemberStore({ storage, idFactory: () => "registered-1" });
  store.register(validRegistration);
  store.login("new_keeper", "Keeper2026");

  const member = store.currentMember.value;
  assert.equal(Object.isFrozen(member), true);
  assert.equal(Object.isFrozen(member.birthday), true);
  assert.equal(Object.isFrozen(member.address), true);
  assert.throws(() => {
    member.address.city = "已被改寫";
  }, TypeError);
  assert.throws(() => {
    member.birthday.year = 1999;
  }, TypeError);
  assert.equal(store.currentMember.value.address.city, "臺北市");
  assert.equal(store.currentMember.value.birthday.year, 2000);
});

test("損壞會員資料與不存在會員 session 會安全清理", () => {
  const storage = createMemoryStorage({
    [MEMBER_STORAGE_KEY]: "{broken",
    [MEMBER_SESSION_STORAGE_KEY]: JSON.stringify({ version: 1, memberId: "missing" }),
  });
  const store = createMemberStore({ storage });

  assert.equal(store.members.value.length, 1);
  assert.equal(store.isAuthenticated.value, false);
  assert.equal(storage.getItem(MEMBER_STORAGE_KEY), null);
  assert.equal(storage.getItem(MEMBER_SESSION_STORAGE_KEY), null);
});
