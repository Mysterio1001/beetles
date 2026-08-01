import { articleRecords } from "../mocks/articles.js";

const FALLBACK_LOCALE = "en";
export const ARTICLE_PAGE_SIZE = 3;

function localize(value, locale) {
  return value?.[locale] ?? value?.[FALLBACK_LOCALE] ?? "";
}

function localizeArticle(article, locale) {
  return {
    ...article,
    title: localize(article.title, locale),
    summary: localize(article.summary, locale),
    content: localize(article.content, locale),
    to: `/beetle-lab/${article.id}`,
  };
}

export function getArticlePageData(locale = FALLBACK_LOCALE) {
  const articles = articleRecords
    .map((article) => localizeArticle(article, locale))
    .sort((left, right) => right.date.localeCompare(left.date));

  return {
    articles,
    latestArticles: articles.slice(0, 3),
  };
}

export function getArticles(locale = FALLBACK_LOCALE) {
  return getArticlePageData(locale).articles;
}

export function filterArticles(articles, query = "") {
  const normalizedQuery = String(query).trim().toLocaleLowerCase();
  if (!normalizedQuery) return [...articles];

  return articles.filter((article) =>
    `${article.title} ${article.summary}`.toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function paginateArticles(articles, page = 1, pageSize = ARTICLE_PAGE_SIZE) {
  const safePageSize = Math.max(1, Number.parseInt(pageSize, 10) || ARTICLE_PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(articles.length / safePageSize));
  const requestedPage = Number.parseInt(page, 10) || 1;
  const safePage = Math.min(pageCount, Math.max(1, requestedPage));
  const start = (safePage - 1) * safePageSize;

  return {
    items: articles.slice(start, start + safePageSize),
    page: safePage,
    pageCount,
    pageSize: safePageSize,
    total: articles.length,
  };
}

export function getArticleById(locale, id) {
  return getArticlePageData(locale).articles.find((article) => article.id === id) ?? null;
}
