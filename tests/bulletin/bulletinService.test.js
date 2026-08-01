import test from "node:test";
import assert from "node:assert/strict";

import { getBulletinPageData } from "../../src/services/bulletinService.js";

test("Bulletin service 提供完整繁中、英文與英文 fallback", () => {
  const chinese = getBulletinPageData("zh-TW");
  const english = getBulletinPageData("en");
  const fallback = getBulletinPageData("ja-JP");

  for (const page of [chinese, english]) {
    assert.ok(page.hero.title);
    assert.ok(page.hero.intro);
    assert.ok(page.contact.headline);
    assert.equal(page.services.items.length, 4);
    assert.ok(page.services.items.every((item) => item.title && item.description));
  }

  assert.equal(fallback.hero.title, english.hero.title);
  assert.equal(fallback.services.items[0].title, english.services.items[0].title);
});

test("Bulletin 電話提供顯示文字與可撥號 URL", () => {
  const { contact } = getBulletinPageData("zh-TW");

  assert.equal(contact.phone, "0922-180-199");
  assert.equal(contact.phoneHref, "tel:0922180199");
});

test("Bulletin 三個社群連結使用安全新頁面屬性", () => {
  const { contact } = getBulletinPageData("en");

  assert.deepEqual(
    contact.socialLinks.map((link) => link.id),
    ["facebook", "line", "instagram"],
  );
  for (const link of contact.socialLinks) {
    assert.match(link.url, /^https:\/\//);
    assert.match(link.icon, /^\/img\//);
    assert.equal(link.target, "_blank");
    assert.match(link.rel, /noopener/);
    assert.match(link.rel, /noreferrer/);
  }
});

test("Bulletin 桌面動畫與手機主圖資產使用正式路徑", () => {
  const { visuals } = getBulletinPageData("en");

  assert.match(visuals.mobile, /^\/img\//);
  assert.match(visuals.desktop.background, /^\/img\//);
  assert.match(visuals.desktop.leftBeetle, /^\/img\//);
  assert.match(visuals.desktop.rightBeetle, /^\/img\//);
  assert.match(visuals.desktop.explosion, /^\/img\//);
});
