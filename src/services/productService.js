import { getArticles } from "./articleService.js";
import { getCatalogPageData } from "./catalogService.js";

export const PRODUCT_DETAIL_FIELD_IDS = Object.freeze([
  "origin",
  "parentage",
  "type",
  "generation",
  "size",
  "condition",
]);

function projectRelatedProduct(product) {
  return {
    id: product.id,
    name: product.name,
    scientificName: product.scientificName,
    price: product.price,
    availability: product.availability,
    image: product.image,
    to: product.to,
  };
}

export function getProductDetail(locale, id) {
  const catalog = getCatalogPageData(locale);
  const product = catalog.products.find((item) => item.id === id);
  if (!product) return null;

  const productsById = new Map(catalog.products.map((item) => [item.id, item]));
  const articlesById = new Map(getArticles(locale).map((article) => [article.id, article]));

  return {
    ...product,
    detailImage: product.detailImage || product.image,
    details: PRODUCT_DETAIL_FIELD_IDS.flatMap((detailId) => {
      const value = product.details?.[detailId];
      return value ? [{ id: detailId, value }] : [];
    }),
    relatedProducts: (product.relatedProductIds ?? [])
      .map((relatedId) => productsById.get(relatedId))
      .filter(Boolean)
      .map(projectRelatedProduct),
    relatedArticles: (product.relatedArticleIds ?? [])
      .map((relatedId) => articlesById.get(relatedId))
      .filter(Boolean),
  };
}
