<template>
  <div class="cart-page">
    <header class="cart-intro">
      <div>
        <p class="cart-eyebrow">{{ t("cart.eyebrow") }}</p>
        <h1>{{ t("cart.title") }}</h1>
        <p>{{ t("cart.description") }}</p>
      </div>
      <ol
        class="cart-progress glass-surface"
        :aria-label="t('cart.progressLabel')">
        <li class="is-current">
          <span>1</span>
          {{ t("cart.progressCart") }}
        </li>
        <li>
          <span>2</span>
          {{ t("cart.progressCheckout") }}
        </li>
        <li>
          <span>3</span>
          {{ t("cart.progressComplete") }}
        </li>
      </ol>
    </header>

    <div
      v-if="guardNoticeVisible"
      class="cart-notice cart-notice--warning glass-surface"
      role="alert">
      <CircleAlert aria-hidden="true" />
      <p>{{ t("cart.guardNotice") }}</p>
      <button
        type="button"
        :aria-label="t('cart.dismissNotice')"
        @click="guardNoticeVisible = false">
        <X aria-hidden="true" />
      </button>
    </div>

    <div
      v-if="actionErrorVisible"
      class="cart-notice cart-notice--error glass-surface"
      role="alert">
      <CircleAlert aria-hidden="true" />
      <p>{{ t("cart.storageError") }}</p>
      <button
        type="button"
        :aria-label="t('cart.dismissNotice')"
        @click="actionErrorVisible = false">
        <X aria-hidden="true" />
      </button>
    </div>

    <section
      v-if="cartRows.length"
      class="cart-layout">
      <div class="cart-items glass-surface">
        <header class="cart-items__header">
          <div>
            <p class="cart-eyebrow">{{ t("cart.itemListEyebrow") }}</p>
            <h2>{{ t("cart.itemListTitle") }}</h2>
          </div>
          <span>{{ t("cart.itemCount", itemCount) }}</span>
        </header>

        <div class="cart-items__list">
          <article
            v-for="row in cartRows"
            :key="row.id"
            :aria-labelledby="`cart-item-title-${row.productId}-${row.variantId}`"
            class="cart-item">
            <div class="cart-item__product">
              <RouterLink
                class="cart-item__media"
                :class="{ 'has-image-error': failedImages.has(row.id) }"
                :to="row.to">
                <img
                  v-if="!failedImages.has(row.id)"
                  :src="row.image"
                  :alt="row.name"
                  @error="failedImages.add(row.id)" />
                <span v-else>
                  <ImageOff aria-hidden="true" />
                  {{ t("cart.imageUnavailable") }}
                </span>
              </RouterLink>

              <div>
                <h3>
                  <RouterLink
                    :id="`cart-item-title-${row.productId}-${row.variantId}`"
                    :to="row.to">
                    {{ row.name }}
                  </RouterLink>
                </h3>
                <em>{{ row.scientificName }}</em>
                <p>
                  <span>{{ t("cart.variant") }}</span>
                  <strong>{{ row.variantLabel }}</strong>
                </p>
              </div>
            </div>

            <div class="cart-item__commerce">
              <dl class="cart-item__price">
                <dt>{{ t("cart.unitPrice") }}</dt>
                <dd>{{ formatMoney(row.price) }}</dd>
              </dl>

              <div class="cart-item__quantity">
                <span>{{ t("cart.quantity") }}</span>
                <div>
                  <button
                    type="button"
                    :disabled="row.quantity <= 1"
                    :aria-label="
                      t('cart.decreaseQuantity', {
                        product: row.name,
                        variant: row.variantLabel,
                      })
                    "
                    @click="changeQuantity(row, row.quantity - 1)">
                    <Minus aria-hidden="true" />
                  </button>
                  <input
                    :value="row.quantity"
                    type="number"
                    min="1"
                    step="1"
                    inputmode="numeric"
                    :aria-label="
                      t('cart.quantityInput', {
                        product: row.name,
                        variant: row.variantLabel,
                      })
                    "
                    @input="changeQuantityFromInput(row, $event)" />
                  <button
                    type="button"
                    :aria-label="
                      t('cart.increaseQuantity', {
                        product: row.name,
                        variant: row.variantLabel,
                      })
                    "
                    @click="changeQuantity(row, row.quantity + 1)">
                    <Plus aria-hidden="true" />
                  </button>
                </div>
              </div>

              <dl class="cart-item__line-total">
                <dt>{{ t("cart.lineTotal") }}</dt>
                <dd>{{ formatMoney(row.lineTotal) }}</dd>
              </dl>

              <button
                class="cart-item__remove"
                type="button"
                :aria-label="
                  t('cart.removeItem', {
                    product: row.name,
                    variant: row.variantLabel,
                  })
                "
                @click="removeCartItem(row)">
                <Trash2 aria-hidden="true" />
                <span>{{ t("cart.remove") }}</span>
              </button>
            </div>
          </article>
        </div>

        <RouterLink
          class="cart-continue"
          to="/beetle-shop">
          <ShoppingBag aria-hidden="true" />
          {{ t("cart.continueShopping") }}
        </RouterLink>
      </div>

      <aside class="cart-summary glass-surface">
        <header>
          <p class="cart-eyebrow">{{ t("cart.summaryEyebrow") }}</p>
          <h2>{{ t("cart.summaryTitle") }}</h2>
          <p>{{ t("cart.summaryDescription") }}</p>
        </header>

        <fieldset class="cart-shipping">
          <legend>{{ t("cart.shippingTitle") }}</legend>
          <p>{{ t("cart.shippingDescription") }}</p>
          <label
            v-for="method in shippingMethods"
            :key="method.id"
            :class="{ 'is-selected': shippingMethodId === method.id }">
            <input
              ref="shippingInputs"
              type="radio"
              name="shipping-method"
              :value="method.id"
              :checked="shippingMethodId === method.id"
              @change="changeShippingMethod" />
            <span class="cart-shipping__icon">
              <Store
                v-if="method.fulfillment === 'convenience-store'"
                aria-hidden="true" />
              <Truck
                v-else-if="method.fulfillment === 'home-delivery'"
                aria-hidden="true" />
              <MapPin
                v-else
                aria-hidden="true" />
            </span>
            <span>
              <strong>{{ method.label }}</strong>
              <small>{{ formatMoney(method.fee) }}</small>
            </span>
            <span
              class="cart-shipping__check"
              aria-hidden="true" />
          </label>
        </fieldset>

        <dl class="cart-totals">
          <div>
            <dt>{{ t("cart.subtotal") }}</dt>
            <dd>{{ formatMoney(subtotal) }}</dd>
          </div>
          <div>
            <dt>{{ t("cart.shippingFee") }}</dt>
            <dd>{{ formatMoney(shippingFee) }}</dd>
          </div>
          <div>
            <dt>{{ t("cart.total") }}</dt>
            <dd>{{ formatMoney(total) }}</dd>
          </div>
        </dl>

        <RouterLink
          class="cart-checkout"
          to="/checkout">
          <span>{{ t("cart.checkout") }}</span>
          <ArrowRight aria-hidden="true" />
        </RouterLink>
        <p class="cart-summary__note">{{ t("cart.mockNotice") }}</p>
      </aside>
    </section>

    <section
      v-else
      class="cart-empty glass-surface">
      <span class="cart-empty__icon">
        <PackageOpen aria-hidden="true" />
      </span>
      <p class="cart-eyebrow">{{ t("cart.emptyEyebrow") }}</p>
      <h2>{{ t("cart.emptyTitle") }}</h2>
      <p>{{ t("cart.emptyBody") }}</p>
      <RouterLink to="/beetle-shop">
        <ShoppingBag aria-hidden="true" />
        {{ t("cart.emptyAction") }}
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowRight,
  CircleAlert,
  ImageOff,
  MapPin,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-vue-next";

import { isEmptyCartNotice } from "@/router/cartNavigation";
import { getCartRows, getShippingMethods } from "@/services/cartService";
import { normalizeCartQuantity, useCartState } from "@/state/cartState";

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const {
  items,
  itemCount,
  shippingMethodId,
  subtotal,
  shippingFee,
  total,
  updateQuantity,
  removeItem,
  setShippingMethod,
} = useCartState();

const guardNoticeVisible = ref(false);
const actionErrorVisible = ref(false);
const failedImages = reactive(new Set());
const shippingInputs = ref([]);
const cartRows = computed(() => getCartRows(locale.value, items.value));
const shippingMethods = computed(() => getShippingMethods(locale.value));

function formatMoney(amount) {
  return `NT$ ${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }).format(amount)}`;
}

function recordActionResult(succeeded) {
  actionErrorVisible.value = !succeeded;
  return succeeded;
}

function changeQuantity(row, value) {
  return recordActionResult(
    updateQuantity(row.productId, row.variantId, normalizeCartQuantity(value)),
  );
}

function changeQuantityFromInput(row, event) {
  const normalizedQuantity = normalizeCartQuantity(event.currentTarget.value);
  if (changeQuantity(row, normalizedQuantity))
    event.currentTarget.value = String(normalizedQuantity);
  else event.currentTarget.value = String(row.quantity);
}

function removeCartItem(row) {
  recordActionResult(removeItem(row.productId, row.variantId));
}

async function changeShippingMethod(event) {
  if (recordActionResult(setShippingMethod(event.currentTarget.value))) return;

  await nextTick();
  for (const input of shippingInputs.value) {
    input.checked = input.value === shippingMethodId.value;
  }
}

watch(
  () => route.query.notice,
  (notice) => {
    if (!isEmptyCartNotice(notice)) return;
    guardNoticeVisible.value = true;
    void router.replace({ name: "cart" }).catch(() => {});
  },
  { immediate: true },
);
</script>
