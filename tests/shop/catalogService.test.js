import test from "node:test";
import assert from "node:assert/strict";

import {
  SHOP_PAGE_SIZE,
  getCatalogPageData,
  paginateCatalogProducts,
  queryCatalogProducts,
} from "../../src/services/catalogService.js";

test("Catalog service 集中舊版八筆商品、完整分類及穩定詳情入口", () => {
  const page = getCatalogPageData("zh-TW");

  assert.equal(page.products.length, 8);
  assert.equal(new Set(page.products.map((product) => product.id)).size, 8);
  assert.deepEqual(
    page.categories.map((category) => category.id),
    ["all", "new", "adult", "larva", "consumables", "specimen", "breeding-supplies", "course"],
  );

  for (const product of page.products) {
    assert.equal(product.to, `/beetle-shop/${product.id}`);
    assert.match(product.image, /^\/img\/img-beetle-shop\//);
    assert.ok(product.name);
    assert.ok(product.scientificName);
    assert.ok(Number.isInteger(product.price));
    assert.ok(["available", "sold-out"].includes(product.availability));
  }
});

test("Catalog service 提供完整英文並讓未知語言回退英文", () => {
  const english = getCatalogPageData("en");
  const fallback = getCatalogPageData("ja-JP");

  assert.ok(english.categories.every((category) => category.label));
  assert.ok(english.products.every((product) => product.name && product.keywords.length));
  assert.deepEqual(fallback.categories, english.categories);
  assert.deepEqual(fallback.products, english.products);
});

test("商品搜尋依目前語言名稱、學名與關鍵字做不分大小寫部分比對", () => {
  const chineseProducts = getCatalogPageData("zh-TW").products;
  const englishProducts = getCatalogPageData("en").products;

  assert.deepEqual(
    queryCatalogProducts(chineseProducts, { query: "河野" }).map((product) => product.id),
    ["hercules-kono-line"],
  );
  assert.deepEqual(
    queryCatalogProducts(chineseProducts, { query: "PROSOPOCOILUS GIRAFFA" }).map(
      (product) => product.id,
    ),
    ["giraffe-stag-nishiyamai"],
  );
  assert.deepEqual(
    queryCatalogProducts(englishProducts, { query: "cameroon" }).map((product) => product.id),
    ["cameroon-crab-stag"],
  );
});

test("商品分類支援新品、成蟲及明確空分類", () => {
  const products = getCatalogPageData("en").products;

  assert.equal(queryCatalogProducts(products, { categoryId: "all" }).length, 8);
  assert.equal(queryCatalogProducts(products, { categoryId: "new" }).length, 2);
  assert.equal(queryCatalogProducts(products, { categoryId: "adult" }).length, 8);
  assert.deepEqual(queryCatalogProducts(products, { categoryId: "larva" }), []);
});

test("商品搜尋、分類與五種排序可以共同作用且結果 deterministic", () => {
  const products = getCatalogPageData("en").products;

  assert.deepEqual(
    queryCatalogProducts(products, { sortId: "default" }).map((product) => product.id),
    products.map((product) => product.id),
  );
  assert.equal(
    queryCatalogProducts(products, { sortId: "price-high" })[0].id,
    "hercules-kono-line",
  );
  assert.equal(queryCatalogProducts(products, { sortId: "price-low" })[0].id, "tokara-saw-stag");
  assert.equal(queryCatalogProducts(products, { sortId: "date-new" })[0].id, "rainbow-stag-red");
  assert.equal(queryCatalogProducts(products, { sortId: "date-old" })[0].id, "hercules-kono-line");
  assert.deepEqual(
    queryCatalogProducts(products, {
      query: "beetle",
      categoryId: "new",
      sortId: "price-low",
    }).map((product) => product.id),
    ["babai-golden-stag", "hercules-kono-line"],
  );
});

test("Catalog 分頁限制頁碼並在結果縮減後回到有效頁", () => {
  const products = getCatalogPageData("en").products;
  const secondPage = paginateCatalogProducts(products, 2, SHOP_PAGE_SIZE);
  const clampedPage = paginateCatalogProducts(products, 99, SHOP_PAGE_SIZE);
  const emptyPage = paginateCatalogProducts([], 3, SHOP_PAGE_SIZE);

  assert.equal(SHOP_PAGE_SIZE, 6);
  assert.equal(secondPage.pageCount, 2);
  assert.equal(secondPage.items.length, 2);
  assert.equal(clampedPage.page, 2);
  assert.equal(emptyPage.page, 1);
  assert.equal(emptyPage.pageCount, 1);
  assert.deepEqual(emptyPage.items, []);
});
