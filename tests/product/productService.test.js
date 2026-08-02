import test from "node:test";
import assert from "node:assert/strict";

import { getProductDetail } from "../../src/services/productService.js";

test("商品詳情提供舊版長頸鹿商品的完整欄位與三個穩定規格", () => {
  const product = getProductDetail("zh-TW", "giraffe-stag-nishiyamai");

  assert.equal(product.id, "giraffe-stag-nishiyamai");
  assert.equal(product.price, 2999);
  assert.equal(product.availability, "available");
  assert.match(product.detailImage, /^img\/img-beetle-product\//);
  assert.deepEqual(
    product.variants.map((variant) => variant.id),
    ["105-plus", "101-plus", "97-plus"],
  );
  assert.deepEqual(
    product.details.map((detail) => detail.id),
    ["origin", "parentage", "type", "generation", "size", "condition"],
  );
  assert.ok(product.description);
  assert.ok(product.note);
});

test("商品詳情提供相關商品與既有文章的穩定入口", () => {
  const product = getProductDetail("en", "giraffe-stag-nishiyamai");

  assert.equal(product.relatedProducts.length, 3);
  assert.ok(product.relatedProducts.every((item) => item.to === `/beetle-shop/${item.id}`));
  assert.deepEqual(
    product.relatedArticles.map((article) => article.id),
    ["giraffe-stag-breeding-log", "oviposition-wood-tips"],
  );
  assert.ok(product.relatedArticles.every((article) => article.to === `/beetle-lab/${article.id}`));
});

test("商品詳情完整支援英文 fallback 且 unknown id 回傳 null", () => {
  const english = getProductDetail("en", "giraffe-stag-nishiyamai");
  const fallback = getProductDetail("ja-JP", "giraffe-stag-nishiyamai");

  assert.equal(fallback.name, english.name);
  assert.equal(fallback.description, english.description);
  assert.deepEqual(fallback.details, english.details);
  assert.equal(getProductDetail("zh-TW", "does-not-exist"), null);
});
