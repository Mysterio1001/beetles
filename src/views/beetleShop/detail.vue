<template>
  <div class="product-page">
    <RouterLink
      class="product-back"
      to="/beetle-shop">
      <ArrowLeft aria-hidden="true" />
      {{ t("shop.product.backToShop") }}
    </RouterLink>

    <template v-if="product">
      <section class="product-hero glass-surface">
        <figure
          class="product-hero__image"
          :class="{ 'has-image-error': imageFailed }">
          <img
            v-if="!imageFailed"
            :src="product.detailImage"
            :alt="product.name"
            @error="imageFailed = true" />
          <span v-else>
            <ImageOff aria-hidden="true" />
            {{ t("shop.imageUnavailable") }}
          </span>
          <strong :class="`is-${product.availability}`">
            {{ t(`shop.availability.${product.availability}`) }}
          </strong>
        </figure>

        <div class="product-hero__content">
          <p class="shop-eyebrow">{{ t("shop.product.eyebrow") }}</p>
          <h1>{{ product.name }}</h1>
          <em>{{ product.scientificName }}</em>
          <p class="product-price">{{ formatPrice(product.price) }}</p>

          <section
            v-if="product.details.length"
            class="product-details"
            :aria-label="t('shop.product.detailsTitle')">
            <h2>{{ t("shop.product.detailsTitle") }}</h2>
            <dl>
              <div
                v-for="detail in product.details"
                :key="detail.id">
                <dt>{{ t(`shop.product.fields.${detail.id}`) }}</dt>
                <dd>{{ detail.value }}</dd>
              </div>
            </dl>
          </section>

          <section
            v-if="product.description"
            class="product-copy">
            <h2>{{ t("shop.product.descriptionTitle") }}</h2>
            <p>{{ product.description }}</p>
          </section>

          <section
            v-if="product.note"
            class="product-note">
            <Info aria-hidden="true" />
            <p>
              <strong>{{ t("shop.product.noteTitle") }}</strong>
              {{ product.note }}
            </p>
          </section>
        </div>

        <aside class="product-purchase glass-surface">
          <div class="product-purchase__heading">
            <ShoppingBag aria-hidden="true" />
            <h2>{{ t("shop.product.purchaseTitle") }}</h2>
          </div>

          <template v-if="canPurchase">
            <BeSelect
              v-model="selectedVariantId"
              :label="t('shop.product.variantLabel')"
              :options="variantOptions" />

            <div class="product-quantity">
              <span>{{ t("shop.product.quantityLabel") }}</span>
              <div>
                <button
                  type="button"
                  :aria-label="t('shop.product.decreaseQuantity')"
                  :disabled="quantity <= 1"
                  @click="decreaseQuantity">
                  <Minus aria-hidden="true" />
                </button>
                <input
                  :value="quantity"
                  type="number"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  :aria-label="t('shop.product.quantityInput')"
                  @input="setQuantity" />
                <button
                  type="button"
                  :aria-label="t('shop.product.increaseQuantity')"
                  @click="increaseQuantity">
                  <Plus aria-hidden="true" />
                </button>
              </div>
            </div>

            <div class="product-purchase__actions">
              <button
                type="button"
                @click="addSelectedToCart">
                <ShoppingBag aria-hidden="true" />
                {{ t("shop.product.addToCart") }}
              </button>
              <button
                type="button"
                @click="buySelectedNow">
                <Zap aria-hidden="true" />
                {{ t("shop.product.buyNow") }}
              </button>
            </div>

            <p
              v-if="feedbackQuantity"
              class="product-feedback"
              role="status"
              aria-live="polite">
              <CircleCheck aria-hidden="true" />
              {{ t("shop.product.addedToCart", { quantity: feedbackQuantity }) }}
            </p>
          </template>

          <div
            v-else
            class="product-unavailable">
            <CircleOff aria-hidden="true" />
            <h3>{{ t("shop.product.unavailableTitle") }}</h3>
            <p>{{ t("shop.product.unavailableBody") }}</p>
          </div>
        </aside>
      </section>

      <section
        v-if="product.relatedProducts.length"
        class="product-related"
        aria-labelledby="related-products-title">
        <header>
          <p class="shop-eyebrow">{{ t("shop.product.relatedProductsEyebrow") }}</p>
          <h2 id="related-products-title">{{ t("shop.product.relatedProducts") }}</h2>
          <p>{{ t("shop.product.relatedProductsDescription") }}</p>
        </header>
        <div class="product-related__grid">
          <RouterLink
            v-for="relatedProduct in product.relatedProducts"
            :key="relatedProduct.id"
            :to="relatedProduct.to"
            class="product-related-card glass-surface">
            <img
              v-if="!failedRelatedImages.has(relatedProduct.id)"
              :src="relatedProduct.image"
              :alt="relatedProduct.name"
              loading="lazy"
              @error="failedRelatedImages.add(relatedProduct.id)" />
            <div
              v-else
              class="product-related-card__media"
              role="img"
              :aria-label="t('shop.imageUnavailable')">
              <ImageOff aria-hidden="true" />
              <span>{{ t("shop.imageUnavailable") }}</span>
            </div>
            <span>
              <strong>{{ relatedProduct.name }}</strong>
              <em>{{ relatedProduct.scientificName }}</em>
              <small>{{ formatPrice(relatedProduct.price) }}</small>
              <span>
                {{ t("shop.viewProduct") }}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </span>
          </RouterLink>
        </div>
      </section>

      <section
        v-if="product.relatedArticles.length"
        class="product-articles glass-surface"
        aria-labelledby="related-articles-title">
        <header>
          <div>
            <p class="shop-eyebrow">{{ t("shop.product.relatedArticlesEyebrow") }}</p>
            <h2 id="related-articles-title">{{ t("shop.product.relatedArticles") }}</h2>
          </div>
          <p>{{ t("shop.product.relatedArticlesDescription") }}</p>
        </header>
        <nav :aria-label="t('shop.product.relatedArticles')">
          <RouterLink
            v-for="article in product.relatedArticles"
            :key="article.id"
            :to="article.to">
            <time :datetime="article.date">{{ formatDate(article.date) }}</time>
            <strong>{{ article.title }}</strong>
            <ArrowUpRight aria-hidden="true" />
          </RouterLink>
        </nav>
      </section>
    </template>

    <section
      v-else
      class="product-missing glass-surface">
      <PackageX aria-hidden="true" />
      <p class="shop-eyebrow">{{ t("shop.product.notFoundEyebrow") }}</p>
      <h1>{{ t("shop.product.notFoundTitle") }}</h1>
      <p>{{ t("shop.product.notFoundBody") }}</p>
      <RouterLink to="/beetle-shop">
        <ArrowLeft aria-hidden="true" />
        {{ t("shop.product.backToShop") }}
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleCheck,
  CircleOff,
  ImageOff,
  Info,
  Minus,
  PackageX,
  Plus,
  ShoppingBag,
  Zap,
} from "lucide-vue-next";

import BeSelect from "@/components/BeSelect.vue";
import { getProductDetail } from "@/services/productService";
import { normalizeCartQuantity, useCartState } from "@/state/cartState";

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const { addItem } = useCartState();

const selectedVariantId = ref("");
const quantity = ref(1);
const feedbackQuantity = ref(0);
const imageFailed = ref(false);
const failedRelatedImages = reactive(new Set());
let feedbackTimer;

const product = computed(() => getProductDetail(locale.value, String(route.params.productId)));
const variantOptions = computed(() =>
  (product.value?.variants ?? []).map((variant) => ({
    value: variant.id,
    label: variant.label,
  })),
);
const canPurchase = computed(
  () => product.value?.availability === "available" && variantOptions.value.length > 0,
);

function formatPrice(price) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function setQuantity(event) {
  const normalizedQuantity = normalizeCartQuantity(event.currentTarget.value);
  quantity.value = normalizedQuantity;
  event.currentTarget.value = String(normalizedQuantity);
}

function decreaseQuantity() {
  quantity.value = normalizeCartQuantity(quantity.value - 1);
}

function increaseQuantity() {
  quantity.value = normalizeCartQuantity(quantity.value + 1);
}

function showFeedback() {
  feedbackQuantity.value = quantity.value;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    feedbackQuantity.value = 0;
  }, 3600);
}

function addSelectedToCart() {
  if (!product.value) return false;
  const added = addItem({
    productId: product.value.id,
    variantId: selectedVariantId.value,
    quantity: quantity.value,
  });
  if (added) showFeedback();
  return added;
}

function buySelectedNow() {
  if (addSelectedToCart()) router.push("/cart");
}

watch(
  product,
  (currentProduct, previousProduct) => {
    if (currentProduct?.id !== previousProduct?.id) {
      quantity.value = 1;
      feedbackQuantity.value = 0;
      imageFailed.value = false;
      failedRelatedImages.clear();
    }
    if (!currentProduct?.variants.some((variant) => variant.id === selectedVariantId.value)) {
      selectedVariantId.value = currentProduct?.variants[0]?.id ?? "";
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  window.clearTimeout(feedbackTimer);
});
</script>
