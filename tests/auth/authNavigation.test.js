import test from "node:test";
import assert from "node:assert/strict";

import {
  getAuthSourceRedirect,
  getResolvedAuthRedirect,
  getSafeAuthRedirect,
} from "../../src/router/authNavigation.js";

test("登入返回來源只接受站內非 Auth 路徑", () => {
  assert.equal(
    getSafeAuthRedirect("/beetle-shop/giraffe-stag-nishiyamai"),
    "/beetle-shop/giraffe-stag-nishiyamai",
  );
  assert.equal(getSafeAuthRedirect("https://example.com"), "/");
  assert.equal(getSafeAuthRedirect("//example.com"), "/");
  assert.equal(getSafeAuthRedirect("/login?redirect=/cart"), "/");
  assert.equal(getSafeAuthRedirect("/signup"), "/");
});

test("Header 只將可導覽內容頁作為登入返回來源", () => {
  assert.equal(getAuthSourceRedirect({ name: "news", fullPath: "/news?page=2" }), "/news?page=2");
  assert.equal(getAuthSourceRedirect({ name: "notFound", fullPath: "/missing" }), "/");
  assert.equal(getAuthSourceRedirect({ name: "login", fullPath: "/login" }), "/");
  assert.equal(getAuthSourceRedirect({ name: "signup", fullPath: "/signup" }), "/");
});

test("直接登入 query 只接受 router 可解析的正式內容 route", () => {
  const router = {
    resolve(path) {
      const routeNames = {
        "/news": "news",
        "/login": "login",
        "/removed-route": "notFound",
      };
      return { name: routeNames[path] ?? "notFound" };
    },
  };

  assert.equal(getResolvedAuthRedirect(router, "/news"), "/news");
  assert.equal(getResolvedAuthRedirect(router, "/removed-route"), "/");
  assert.equal(getResolvedAuthRedirect(router, "/login"), "/");
  assert.equal(getResolvedAuthRedirect(null, "/news"), "/");
});
