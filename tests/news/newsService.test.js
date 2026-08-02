import test from "node:test";
import assert from "node:assert/strict";

import {
  canAutoplayNewsCarousel,
  filterNewsItems,
  getNewsItemById,
  getNewsPageData,
} from "../../src/services/newsService.js";

test("News service 保留既有九筆消息與三張輪播資料", () => {
  const page = getNewsPageData("zh-TW");

  assert.equal(page.items.length, 9);
  assert.equal(page.slides.length, 3);
  assert.equal(new Set(page.items.map((item) => item.id)).size, 9);
  assert.ok(page.items.every((item) => item.image.startsWith("img/")));
  assert.ok(page.slides.every((item) => item.image.startsWith("img/")));
});

test("News service 提供完整英文並讓未知語言回退英文", () => {
  const english = getNewsPageData("en");
  const fallback = getNewsPageData("ja-JP");

  assert.ok(english.items.every((item) => item.title && item.content));
  assert.ok(english.slides.every((item) => item.title));
  assert.equal(fallback.items[0].title, english.items[0].title);
  assert.equal(fallback.slides[0].title, english.slides[0].title);
});

test("News 分類支援 all、announcement、event、breedingInfo", () => {
  const { items } = getNewsPageData("en");

  assert.equal(filterNewsItems(items, "all").length, 9);
  for (const category of ["announcement", "event", "breedingInfo"]) {
    const results = filterNewsItems(items, category);
    assert.ok(results.length > 0);
    assert.ok(results.every((item) => item.category === category));
  }
  assert.deepEqual(filterNewsItems(items, "unknown"), []);
});

test("News 詳情以穩定 id 查找且未知 id 回傳 null", () => {
  const page = getNewsPageData("zh-TW");
  const target = page.items[2];

  assert.equal(getNewsItemById("zh-TW", target.id)?.id, target.id);
  assert.equal(getNewsItemById("en", "does-not-exist"), null);
});

test("News 輪播在 reduced-motion 或不足兩張時停用自動播放", () => {
  assert.equal(canAutoplayNewsCarousel(3, false), true);
  assert.equal(canAutoplayNewsCarousel(3, true), false);
  assert.equal(canAutoplayNewsCarousel(1, false), false);
});
