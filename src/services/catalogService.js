import { productCategories, productRecords } from "../mocks/products.js";

const FALLBACK_LOCALE = "en";

export const SHOP_PAGE_SIZE = 6;
export const CATALOG_SORT_IDS = Object.freeze([
  "default",
  "price-high",
  "price-low",
  "date-new",
  "date-old",
]);

function localize(value, locale) {
  return value?.[locale] ?? value?.[FALLBACK_LOCALE] ?? "";
}

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase();
}

function localizeProduct(product, locale) {
  return {
    ...product,
    name: localize(product.name, locale),
    keywords: localize(product.keywords, locale),
    variants: (product.variants ?? []).map((variant) => ({
      ...variant,
      label: localize(variant.label, locale),
    })),
    details: Object.fromEntries(
      Object.entries(product.details ?? {}).map(([id, value]) => [id, localize(value, locale)]),
    ),
    description: localize(product.description, locale),
    note: localize(product.note, locale),
    to: `/beetle-shop/${product.id}`,
  };
}

export function getCatalogPageData(locale = FALLBACK_LOCALE) {
  return {
    categories: productCategories.map((category) => ({
      id: category.id,
      label: localize(category.label, locale),
    })),
    products: productRecords.map((product) => localizeProduct(product, locale)),
  };
}

export function queryCatalogProducts(
  products,
  { query = "", categoryId = "all", sortId = "default" } = {},
) {
  const normalizedQuery = normalizeSearchValue(query);
  const filtered = products.filter((product) => {
    const matchesCategory =
      !categoryId || categoryId === "all" || product.categories.includes(categoryId);
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const searchContent = normalizeSearchValue(
      [product.name, product.scientificName, ...product.keywords].join(" "),
    );
    return searchContent.includes(normalizedQuery);
  });

  return sortCatalogProducts(filtered, sortId);
}

export function sortCatalogProducts(products, sortId = "default") {
  const sorted = [...products];

  sorted.sort((left, right) => {
    if (sortId === "price-high") return right.price - left.price || left.order - right.order;
    if (sortId === "price-low") return left.price - right.price || left.order - right.order;
    if (sortId === "date-new")
      return right.date.localeCompare(left.date) || left.order - right.order;
    if (sortId === "date-old")
      return left.date.localeCompare(right.date) || left.order - right.order;
    return left.order - right.order;
  });

  return sorted;
}

export function paginateCatalogProducts(products, page = 1, pageSize = SHOP_PAGE_SIZE) {
  const safePageSize = Math.max(1, Number.parseInt(pageSize, 10) || SHOP_PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(products.length / safePageSize));
  const requestedPage = Number.parseInt(page, 10) || 1;
  const safePage = Math.min(pageCount, Math.max(1, requestedPage));
  const start = (safePage - 1) * safePageSize;

  return {
    items: products.slice(start, start + safePageSize),
    page: safePage,
    pageCount,
    pageSize: safePageSize,
    total: products.length,
  };
}
