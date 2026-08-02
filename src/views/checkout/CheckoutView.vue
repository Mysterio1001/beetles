<template>
  <div class="checkout-page">
    <header class="checkout-intro">
      <div class="checkout-intro__copy">
        <p class="checkout-eyebrow">{{ t("checkout.eyebrow") }}</p>
        <span class="checkout-secure-badge">
          <ShieldCheck aria-hidden="true" />
          {{ t("checkout.secureBadge") }}
        </span>
        <h1>{{ t("checkout.title") }}</h1>
        <p>{{ t("checkout.description") }}</p>
      </div>

      <ol
        class="checkout-progress glass-surface"
        :aria-label="t('checkout.progressLabel')">
        <li class="is-complete">
          <span><Check aria-hidden="true" /></span>
          {{ t("checkout.progressCart") }}
        </li>
        <li class="is-current">
          <span>2</span>
          {{ t("checkout.progressCheckout") }}
        </li>
        <li>
          <span>3</span>
          {{ t("checkout.progressComplete") }}
        </li>
      </ol>
    </header>

    <div class="checkout-layout">
      <form
        ref="checkoutFormElement"
        class="checkout-form glass-surface"
        novalidate
        @submit.prevent="submitCheckout">
        <section class="checkout-section">
          <header class="checkout-section__header">
            <span><UserRound aria-hidden="true" /></span>
            <div>
              <p class="checkout-eyebrow">01 · Recipient</p>
              <h2>{{ t("checkout.recipientTitle") }}</h2>
              <p>{{ t("checkout.recipientDescription") }}</p>
            </div>
          </header>

          <label
            v-if="currentMember"
            class="checkout-member-prefill">
            <input
              v-model="useMemberData"
              type="checkbox"
              @change="applyMemberPrefill" />
            <span class="checkout-member-prefill__check">
              <Check aria-hidden="true" />
            </span>
            <span>
              <strong>{{ t("checkout.memberPrefill") }}</strong>
              <small>{{ t("checkout.memberPrefillHint") }}</small>
            </span>
          </label>

          <div class="checkout-field-grid checkout-field-grid--two">
            <BeInput
              v-model="form.recipientName"
              type="text"
              autocomplete="name"
              :label="t('checkout.recipientName')"
              :placeholder="t('checkout.recipientNamePlaceholder')"
              :error="errorText('recipientName')"
              @input="clearFieldError('recipientName')" />
            <BeInput
              v-model="form.phone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              :maxlength="10"
              :label="t('checkout.phone')"
              :placeholder="t('checkout.phonePlaceholder')"
              :error="errorText('phone')"
              @input="clearFieldError('phone')" />
          </div>
        </section>

        <section class="checkout-section">
          <header class="checkout-section__header">
            <span><Truck aria-hidden="true" /></span>
            <div>
              <p class="checkout-eyebrow">02 · Delivery</p>
              <h2>{{ t("checkout.deliveryTitle") }}</h2>
              <p>{{ t("checkout.deliveryDescription") }}</p>
            </div>
          </header>

          <div class="checkout-current-delivery">
            <div>
              <small>{{ t("checkout.currentDelivery") }}</small>
              <strong>{{ shippingMethod.label }}</strong>
            </div>
            <span>{{ formatMoney(shippingMethod.fee) }}</span>
            <RouterLink to="/cart">{{ t("checkout.editDelivery") }}</RouterLink>
          </div>

          <div
            v-if="isHomeDelivery"
            class="checkout-conditional-fields">
            <h3>{{ t("checkout.addressTitle") }}</h3>
            <div class="checkout-field-grid checkout-field-grid--two">
              <BeInput
                v-model="form.address.city"
                autocomplete="address-level1"
                :label="t('checkout.addressCity')"
                :placeholder="t('checkout.addressCityPlaceholder')"
                :error="errorText('addressCity')"
                @input="clearFieldError('addressCity')" />
              <BeInput
                v-model="form.address.district"
                autocomplete="address-level2"
                :label="t('checkout.addressDistrict')"
                :placeholder="t('checkout.addressDistrictPlaceholder')"
                :error="errorText('addressDistrict')"
                @input="clearFieldError('addressDistrict')" />
            </div>
            <BeInput
              v-model="form.address.detail"
              autocomplete="street-address"
              :label="t('checkout.addressDetail')"
              :placeholder="t('checkout.addressDetailPlaceholder')"
              :error="errorText('addressDetail')"
              @input="clearFieldError('addressDetail')" />
          </div>

          <div
            v-else-if="isStoreDelivery"
            class="checkout-conditional-fields">
            <h3>{{ t("checkout.storeTitle") }}</h3>
            <BeSelect
              v-model="form.storeId"
              :label="t('checkout.storeTitle')"
              :placeholder="t('checkout.storePlaceholder')"
              :options="storeOptions"
              :error="errorText('storeId')"
              @select="clearFieldError('storeId')" />
            <p
              v-if="selectedStore"
              class="checkout-store-address">
              <MapPin aria-hidden="true" />
              {{ t("checkout.storeAddress", { address: selectedStore.address }) }}
            </p>
          </div>

          <div
            v-else
            class="checkout-pickup-note">
            <MapPinned aria-hidden="true" />
            <div>
              <h3>{{ t("checkout.pickupTitle") }}</h3>
              <p>{{ t("checkout.pickupDescription") }}</p>
            </div>
          </div>
        </section>

        <section class="checkout-section">
          <header class="checkout-section__header">
            <span><CreditCard aria-hidden="true" /></span>
            <div>
              <p class="checkout-eyebrow">03 · Payment</p>
              <h2>{{ t("checkout.paymentTitle") }}</h2>
              <p>{{ t("checkout.paymentDescription") }}</p>
            </div>
          </header>

          <fieldset class="checkout-payment-methods">
            <legend class="sr-only">{{ t("checkout.paymentTitle") }}</legend>
            <label
              v-for="method in paymentMethods"
              :key="method.id"
              :class="{ 'is-selected': form.paymentMethodId === method.id }">
              <input
                v-model="form.paymentMethodId"
                type="radio"
                name="payment-method"
                :value="method.id"
                @change="paymentMethodChanged" />
              <span class="checkout-payment-methods__radio" />
              <span>
                <strong>{{ method.label }}</strong>
                <small>{{ method.description }}</small>
              </span>
              <Landmark
                v-if="method.id === 'bank-transfer'"
                aria-hidden="true" />
              <CreditCard
                v-else
                aria-hidden="true" />
            </label>
          </fieldset>
          <p
            v-if="errorText('paymentMethodId')"
            class="checkout-field-error"
            role="alert">
            {{ errorText("paymentMethodId") }}
          </p>

          <div
            v-if="form.paymentMethodId === 'credit-card'"
            class="checkout-card-fields">
            <div
              class="checkout-card-fields__brands"
              aria-hidden="true">
              <img
                src="/img/img-checkout/visa.png"
                alt="" />
              <img
                src="/img/img-checkout/master.png"
                alt="" />
              <img
                src="/img/img-checkout/jcb.png"
                alt="" />
            </div>
            <BeInput
              v-model="form.card.cardholderName"
              type="text"
              autocomplete="cc-name"
              :label="t('checkout.cardholderName')"
              :placeholder="t('checkout.cardholderPlaceholder')"
              :error="errorText('cardholderName')"
              @input="clearFieldError('cardholderName')" />
            <BeInput
              v-model="form.card.cardNumber"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              :maxlength="19"
              :label="t('checkout.cardNumber')"
              :placeholder="t('checkout.cardNumberPlaceholder')"
              :error="errorText('cardNumber')"
              @input="clearFieldError('cardNumber')" />
            <div class="checkout-card-fields__expiry">
              <div class="checkout-native-field">
                <label for="checkout-expiry-month">{{ t("checkout.expiryMonth") }}</label>
                <input
                  id="checkout-expiry-month"
                  v-model="form.card.expiryMonth"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-exp-month"
                  maxlength="2"
                  :aria-invalid="Boolean(errorText('expiry'))"
                  :aria-describedby="errorText('expiry') ? 'checkout-expiry-error' : undefined"
                  placeholder="MM"
                  @input="clearFieldError('expiry')" />
              </div>
              <div class="checkout-native-field">
                <label for="checkout-expiry-year">{{ t("checkout.expiryYear") }}</label>
                <input
                  id="checkout-expiry-year"
                  v-model="form.card.expiryYear"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-exp-year"
                  maxlength="4"
                  :aria-invalid="Boolean(errorText('expiry'))"
                  :aria-describedby="errorText('expiry') ? 'checkout-expiry-error' : undefined"
                  placeholder="YYYY"
                  @input="clearFieldError('expiry')" />
              </div>
              <BeInput
                v-model="form.card.securityCode"
                type="password"
                inputmode="numeric"
                autocomplete="cc-csc"
                :maxlength="3"
                :label="t('checkout.securityCode')"
                :placeholder="t('checkout.securityCodePlaceholder')"
                :error="errorText('securityCode')"
                @input="clearFieldError('securityCode')" />
            </div>
            <p
              v-if="errorText('expiry')"
              id="checkout-expiry-error"
              class="checkout-field-error"
              role="alert">
              {{ errorText("expiry") }}
            </p>
            <p class="checkout-security-hint">
              <LockKeyhole aria-hidden="true" />
              {{ t("checkout.securityHint") }}
            </p>
          </div>

          <p
            v-else
            class="checkout-bank-note">
            <Landmark aria-hidden="true" />
            {{ t("checkout.bankNote") }}
          </p>
        </section>

        <p
          v-if="formError"
          class="checkout-form-error"
          role="alert">
          <CircleAlert aria-hidden="true" />
          {{ formError }}
        </p>
      </form>

      <aside class="checkout-summary glass-surface">
        <header>
          <p class="checkout-eyebrow">Order overview</p>
          <h2>{{ t("checkout.summaryTitle") }}</h2>
          <p>{{ t("checkout.summaryDescription") }}</p>
          <span>{{ t("checkout.itemCount", cart.itemCount.value) }}</span>
        </header>

        <div class="checkout-summary__items">
          <article
            v-for="row in cartRows"
            :key="row.id">
            <img
              :src="row.image"
              :alt="row.name" />
            <div>
              <h3>{{ row.name }}</h3>
              <p>{{ t("checkout.variant") }} · {{ row.variantLabel }}</p>
              <span>× {{ row.quantity }}</span>
            </div>
            <strong>{{ formatMoney(row.lineTotal) }}</strong>
          </article>
        </div>

        <dl class="checkout-summary__totals">
          <div>
            <dt>{{ t("checkout.subtotal") }}</dt>
            <dd>{{ formatMoney(cart.subtotal.value) }}</dd>
          </div>
          <div>
            <dt>{{ shippingMethod.label }}</dt>
            <dd>{{ formatMoney(cart.shippingFee.value) }}</dd>
          </div>
          <div>
            <dt>{{ t("checkout.total") }}</dt>
            <dd>{{ formatMoney(cart.total.value) }}</dd>
          </div>
        </dl>

        <button
          class="checkout-submit"
          type="button"
          :disabled="submitting || isPlacing"
          @click="checkoutFormElement?.requestSubmit()">
          <LoaderCircle
            v-if="submitting || isPlacing"
            class="is-spinning"
            aria-hidden="true" />
          <ShieldCheck
            v-else
            aria-hidden="true" />
          {{ t(submitting || isPlacing ? "checkout.submitting" : "checkout.submit") }}
        </button>
        <RouterLink
          class="checkout-back"
          to="/cart">
          <ArrowLeft aria-hidden="true" />
          {{ t("checkout.backToCart") }}
        </RouterLink>
        <p class="checkout-summary__notice">
          <LockKeyhole aria-hidden="true" />
          {{ t("checkout.mockNotice") }}
        </p>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  CreditCard,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  MapPinned,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-vue-next";

import { EMPTY_CART_NOTICE_CODE } from "@/router/cartNavigation";
import { getCartRows, getShippingMethod } from "@/services/cartService";
import {
  createCheckoutForm,
  getConvenienceStores,
  getMemberCheckoutPrefill,
  getPaymentMethods,
} from "@/services/checkoutService";
import { useCartState } from "@/state/cartState";
import { useMemberState } from "@/state/memberState";
import { useOrderState } from "@/state/orderState";

const router = useRouter();
const { locale, t } = useI18n();
const cart = useCartState();
const { currentMember } = useMemberState();
const { isPlacing, placeOrder } = useOrderState();

const checkoutFormElement = ref(null);
const form = reactive(createCheckoutForm());
const useMemberData = ref(false);
const errorCodes = ref({});
const formError = ref("");
const submitting = ref(false);

const cartRows = computed(() => getCartRows(locale.value, cart.items.value));
const shippingMethod = computed(() => getShippingMethod(cart.shippingMethodId.value, locale.value));
const isHomeDelivery = computed(() => shippingMethod.value.fulfillment === "home-delivery");
const isStoreDelivery = computed(() => shippingMethod.value.fulfillment === "convenience-store");
const paymentMethods = computed(() => getPaymentMethods(locale.value));
const stores = computed(() => getConvenienceStores(shippingMethod.value.provider, locale.value));
const storeOptions = computed(() =>
  stores.value.map((store) => ({ value: store.id, label: store.label })),
);
const selectedStore = computed(() => stores.value.find((store) => store.id === form.storeId));

function formatMoney(amount) {
  return `NT$ ${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }).format(amount)}`;
}

function applyMemberPrefill() {
  if (!useMemberData.value || !currentMember.value) return;
  const prefill = getMemberCheckoutPrefill(currentMember.value);
  form.recipientName = prefill.recipientName;
  form.phone = prefill.phone;
  Object.assign(form.address, prefill.address);
  clearFieldError("recipientName");
  clearFieldError("phone");
  clearFieldError("addressCity");
  clearFieldError("addressDistrict");
  clearFieldError("addressDetail");
}

function errorText(field) {
  const code = errorCodes.value[field];
  if (!code) return "";

  if (field === "phone") return t("checkout.errors.phone");
  if (field === "storeId") {
    return t(
      code === "required" ? "checkout.errors.storeRequired" : "checkout.errors.storeInvalid",
    );
  }
  if (field === "paymentMethodId") return t("checkout.errors.payment");
  if (field === "cardNumber") return t("checkout.errors.cardNumber");
  if (field === "expiry") {
    return t(code === "expired" ? "checkout.errors.expiryExpired" : "checkout.errors.expiry");
  }
  if (field === "securityCode") return t("checkout.errors.securityCode");
  return t("checkout.errors.required");
}

function clearFieldError(field) {
  if (!errorCodes.value[field]) return;
  const nextErrors = { ...errorCodes.value };
  delete nextErrors[field];
  errorCodes.value = nextErrors;
  formError.value = "";
}

function clearSensitiveFields() {
  form.card.cardNumber = "";
  form.card.expiryMonth = "";
  form.card.expiryYear = "";
  form.card.securityCode = "";
}

function paymentMethodChanged() {
  clearFieldError("paymentMethodId");
  if (form.paymentMethodId !== "credit-card") clearSensitiveFields();
}

async function focusFirstError() {
  await nextTick();
  checkoutFormElement.value?.querySelector('[aria-invalid="true"]')?.focus();
}

async function submitCheckout() {
  if (submitting.value || isPlacing.value) return;
  errorCodes.value = {};
  formError.value = "";
  submitting.value = true;

  const result = placeOrder({ form, cart });
  if (result.ok) {
    clearSensitiveFields();
    await router.replace({ name: "orderComplete" });
    return;
  }

  submitting.value = false;
  if (result.reason === "validation") {
    errorCodes.value = result.errors;
    await focusFirstError();
    return;
  }
  if (result.reason === "emptyCart") {
    await router.replace({
      name: "cart",
      query: { notice: EMPTY_CART_NOTICE_CODE },
    });
    return;
  }
  if (result.reason === "alreadyPlaced") {
    await router.replace({ name: "orderComplete" });
    return;
  }
  if (result.reason === "cartClearFailed") formError.value = t("checkout.storageError");
}

onBeforeUnmount(clearSensitiveFields);
</script>
