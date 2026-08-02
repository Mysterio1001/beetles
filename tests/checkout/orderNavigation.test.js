import test from "node:test";
import assert from "node:assert/strict";

import { resolveOrderCompleteAccess } from "../../src/router/orderNavigation.js";

test("有效的當次 order state 允許進入完成頁", () => {
  assert.equal(resolveOrderCompleteAccess({ id: "BT-20260802-ABC123", total: 3069 }), true);
});

test("直接進入、重新整理或完成狀態已清除時返回首頁", () => {
  const redirect = { name: "home", replace: true };
  assert.deepEqual(resolveOrderCompleteAccess(null), redirect);
  assert.deepEqual(resolveOrderCompleteAccess(undefined), redirect);
  assert.deepEqual(resolveOrderCompleteAccess({ id: "", total: 3069 }), redirect);
  assert.deepEqual(resolveOrderCompleteAccess({ id: "BT-1", total: -1 }), redirect);
});
