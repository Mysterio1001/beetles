import test from "node:test";
import assert from "node:assert/strict";

import {
  filterArticles,
  getArticleById,
  getArticlePageData,
  paginateArticles,
} from "../../src/services/articleService.js";

test("Article service 以五筆既有 Vue 資料建立穩定詳情入口", () => {
  const page = getArticlePageData("zh-TW");

  assert.equal(page.articles.length, 5);
  assert.equal(page.latestArticles.length, 3);
  assert.equal(new Set(page.articles.map((article) => article.id)).size, 5);
  assert.ok(page.articles.every((article) => article.image.startsWith("/img/")));
  assert.ok(page.articles.every((article) => article.to === `/beetle-lab/${article.id}`));
  assert.deepEqual(
    page.latestArticles.map((article) => article.id),
    page.articles.slice(0, 3).map((article) => article.id),
  );
});

test("Article service 提供完整英文並讓未知語言回退英文", () => {
  const english = getArticlePageData("en");
  const fallback = getArticlePageData("ja-JP");

  assert.ok(
    english.articles.every((article) => article.title && article.summary && article.content),
  );
  assert.equal(fallback.articles[0].title, english.articles[0].title);
  assert.equal(fallback.articles[0].content, english.articles[0].content);
});

test("Article 搜尋依目前語言的標題與摘要做不分大小寫部分比對", () => {
  const chinese = getArticlePageData("zh-TW").articles;
  const english = getArticlePageData("en").articles;

  assert.deepEqual(
    filterArticles(chinese, "五角").map((article) => article.id),
    ["pentodon-breeding-log"],
  );
  assert.deepEqual(
    filterArticles(english, "HEAD HORN").map((article) => article.id),
    ["harris-longhorn-flower-beetle-log"],
  );
  assert.equal(filterArticles(english, "  ").length, 5);
  assert.deepEqual(filterArticles(english, "no matching article"), []);
});

test("Article 分頁會限制頁碼並在結果縮減後回到有效頁", () => {
  const articles = getArticlePageData("en").articles;
  const lastPage = paginateArticles(articles, 3, 2);
  const oversizedPage = paginateArticles(articles, 99, 2);
  const reducedResults = paginateArticles(filterArticles(articles, "Pentodon"), 2, 2);

  assert.equal(lastPage.pageCount, 3);
  assert.equal(lastPage.items.length, 1);
  assert.equal(oversizedPage.page, 3);
  assert.equal(reducedResults.page, 1);
  assert.equal(reducedResults.items[0].id, "pentodon-breeding-log");
});

test("Article 詳情以穩定 id 查找且未知 id 回傳 null", () => {
  assert.equal(
    getArticleById("zh-TW", "giraffe-stag-breeding-log")?.id,
    "giraffe-stag-breeding-log",
  );
  assert.equal(getArticleById("en", "does-not-exist"), null);
});
