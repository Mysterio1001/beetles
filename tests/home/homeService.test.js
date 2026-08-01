import test from "node:test";
import assert from "node:assert/strict";

import { getHomePageData } from "../../src/services/homeService.js";

for (const locale of ["zh-TW", "en"]) {
  test(`${locale} 首頁資料具有完整可見文案`, () => {
    const page = getHomePageData(locale);

    assert.ok(page.hero.title.length > 0);
    assert.ok(page.hero.description.length > 0);
    assert.ok(page.brand.title.length > 0);
    assert.ok(page.brand.description.length > 0);
    assert.equal(page.featuredProducts.length, 4);
    assert.equal(page.featuredArticles.length, 3);
    assert.ok(page.featuredProducts.every((item) => item.name.length > 0));
    assert.ok(page.featuredArticles.every((item) => item.title.length > 0));
  });
}

test("首頁商品入口使用穩定商品 id 與正式圖片路徑", () => {
  const { featuredProducts } = getHomePageData("zh-TW");

  assert.equal(new Set(featuredProducts.map((item) => item.id)).size, 4);
  for (const product of featuredProducts) {
    assert.equal(product.to, `/beetle-shop/${product.id}`);
    assert.match(product.image, /^\/img\//);
  }
});

test("首頁文章入口使用穩定文章 id 與正式圖片路徑", () => {
  const { featuredArticles } = getHomePageData("en");

  assert.equal(new Set(featuredArticles.map((item) => item.id)).size, 3);
  for (const article of featuredArticles) {
    assert.equal(article.to, `/beetle-lab/${article.id}`);
    assert.match(article.image, /^\/img\//);
  }
});

test("不支援的內容語言回退英文", () => {
  const english = getHomePageData("en");
  const fallback = getHomePageData("ja");

  assert.equal(fallback.hero.title, english.hero.title);
  assert.equal(fallback.featuredProducts[0].name, english.featuredProducts[0].name);
});
