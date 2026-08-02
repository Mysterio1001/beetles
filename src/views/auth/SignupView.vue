<template>
  <div class="auth-page auth-page--signup">
    <section class="signup-shell glass-surface">
      <header class="signup-hero">
        <div>
          <p class="auth-eyebrow">{{ t("auth.eyebrow") }}</p>
          <span class="auth-badge">
            <Sparkles aria-hidden="true" />
            {{ t("auth.mockBadge") }}
          </span>
          <h1>{{ t("auth.signupTitle") }}</h1>
          <p>{{ t("auth.signupDescription") }}</p>
        </div>
        <img
          src="/img/img-login/DHH.png"
          :alt="t('auth.signupVisualAlt')" />
      </header>

      <form
        class="signup-form"
        novalidate
        @submit.prevent="submitRegistration">
        <p class="auth-privacy-note">
          <ShieldCheck aria-hidden="true" />
          {{ t("auth.mockNotice") }}
        </p>

        <div class="signup-form__grid">
          <fieldset class="signup-section glass-surface">
            <legend>{{ t("auth.accountSection") }}</legend>
            <BeInput
              v-model="form.account"
              autocomplete="username"
              :label="t('auth.accountLabel')"
              :placeholder="t('auth.accountPlaceholder')"
              :error="fieldError('account')"
              @input="clearFieldError('account')" />
            <BeInput
              v-model="form.email"
              type="email"
              autocomplete="email"
              :label="t('auth.emailLabel')"
              :placeholder="t('auth.emailPlaceholder')"
              :error="fieldError('email')"
              @input="clearFieldError('email')" />
            <BeInput
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              :label="t('auth.passwordLabel')"
              :placeholder="t('auth.passwordPlaceholder')"
              :error="fieldError('password')"
              @input="clearFieldError('password')" />
            <p class="signup-hint">{{ t("auth.passwordHint") }}</p>
            <BeInput
              v-model="form.passwordConfirm"
              type="password"
              autocomplete="new-password"
              :label="t('auth.passwordConfirmLabel')"
              :placeholder="t('auth.passwordConfirmPlaceholder')"
              :error="fieldError('passwordConfirm')"
              @input="clearFieldError('passwordConfirm')" />
          </fieldset>

          <fieldset class="signup-section glass-surface">
            <legend>{{ t("auth.profileSection") }}</legend>
            <BeInput
              v-model="form.name"
              autocomplete="name"
              :label="t('auth.nameLabel')"
              :placeholder="t('auth.namePlaceholder')"
              :error="fieldError('name')"
              @input="clearFieldError('name')" />
            <BeInput
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              inputmode="numeric"
              :maxlength="10"
              :label="t('auth.phoneLabel')"
              :placeholder="t('auth.phonePlaceholder')"
              :error="fieldError('phone')"
              @input="clearFieldError('phone')" />

            <div class="signup-birthday">
              <div>
                <span>{{ t("auth.birthdayLabel") }}</span>
                <small>{{ t("auth.birthdayHint") }}</small>
              </div>
              <div class="signup-birthday__selects">
                <label>
                  <span class="sr-only">{{ t("auth.yearPlaceholder") }}</span>
                  <select
                    v-model="form.birthday.year"
                    :aria-invalid="Boolean(errorCodes.birthday)"
                    :aria-describedby="errorCodes.birthday ? 'birthday-error' : undefined"
                    @change="clearFieldError('birthday')">
                    <option value="">{{ t("auth.yearPlaceholder") }}</option>
                    <option
                      v-for="year in yearOptions"
                      :key="year"
                      :value="year">
                      {{ year }}
                    </option>
                  </select>
                </label>
                <label>
                  <span class="sr-only">{{ t("auth.monthPlaceholder") }}</span>
                  <select
                    v-model="form.birthday.month"
                    :aria-invalid="Boolean(errorCodes.birthday)"
                    :aria-describedby="errorCodes.birthday ? 'birthday-error' : undefined"
                    @change="clearFieldError('birthday')">
                    <option value="">{{ t("auth.monthPlaceholder") }}</option>
                    <option
                      v-for="month in monthOptions"
                      :key="month"
                      :value="month">
                      {{ month }}
                    </option>
                  </select>
                </label>
                <label>
                  <span class="sr-only">{{ t("auth.dayPlaceholder") }}</span>
                  <select
                    v-model="form.birthday.day"
                    :disabled="!dayOptions.length"
                    :aria-invalid="Boolean(errorCodes.birthday)"
                    :aria-describedby="errorCodes.birthday ? 'birthday-error' : undefined"
                    @change="clearFieldError('birthday')">
                    <option value="">{{ t("auth.dayPlaceholder") }}</option>
                    <option
                      v-for="day in dayOptions"
                      :key="day"
                      :value="day">
                      {{ day }}
                    </option>
                  </select>
                </label>
              </div>
              <p
                v-if="errorCodes.birthday"
                id="birthday-error"
                class="signup-field-error">
                {{ fieldError("birthday") }}
              </p>
            </div>
          </fieldset>

          <fieldset class="signup-section signup-section--address glass-surface">
            <legend>{{ t("auth.addressSection") }}</legend>
            <BeInput
              v-model="form.address.city"
              autocomplete="address-level1"
              :label="t('auth.cityLabel')"
              :placeholder="t('auth.cityPlaceholder')" />
            <BeInput
              v-model="form.address.district"
              autocomplete="address-level2"
              :label="t('auth.districtLabel')"
              :placeholder="t('auth.districtPlaceholder')" />
            <BeInput
              v-model="form.address.detail"
              autocomplete="street-address"
              :label="t('auth.addressDetailLabel')"
              :placeholder="t('auth.addressDetailPlaceholder')" />
          </fieldset>
        </div>

        <p
          v-if="formError"
          class="auth-form-error signup-form__error"
          role="alert">
          <CircleAlert aria-hidden="true" />
          {{ t(`auth.${formError}`) }}
        </p>

        <footer class="signup-form__footer">
          <p>
            {{ t("auth.haveAccount") }}
            <RouterLink :to="loginDestination">{{ t("auth.signInLink") }}</RouterLink>
          </p>
          <BeBtn
            type="submit"
            size="l"
            :loading="submitting">
            <UserPlus aria-hidden="true" />
            {{ t("auth.signUpAction") }}
          </BeBtn>
        </footer>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { CircleAlert, ShieldCheck, Sparkles, UserPlus } from "lucide-vue-next";

import BeBtn from "@/components/BeBtn.vue";
import BeInput from "@/components/BeInput.vue";
import { getResolvedAuthRedirect } from "@/router/authNavigation";
import { getBirthYearOptions, getDaysInMonth } from "@/services/memberService";
import { useMemberState } from "@/state/memberState";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { register } = useMemberState();

const form = reactive({
  account: "",
  email: "",
  password: "",
  passwordConfirm: "",
  name: "",
  phone: "",
  birthday: { year: "", month: "", day: "" },
  address: { city: "", district: "", detail: "" },
});
const errorCodes = ref({});
const formError = ref("");
const submitting = ref(false);
const yearOptions = getBirthYearOptions();
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const dayOptions = computed(() => {
  const dayCount = getDaysInMonth(form.birthday.year, form.birthday.month);
  return Array.from({ length: dayCount }, (_, index) => index + 1);
});
const safeRedirect = computed(() => getResolvedAuthRedirect(router, route.query.redirect));
const loginDestination = computed(() => ({
  name: "login",
  query: safeRedirect.value === "/" ? {} : { redirect: safeRedirect.value },
}));

watch(dayOptions, (days) => {
  if (form.birthday.day && !days.includes(Number(form.birthday.day))) {
    form.birthday.day = "";
  }
});

function fieldError(field) {
  const code = errorCodes.value[field];
  return code ? t(`auth.errors.${code}`) : "";
}

function clearFieldError(field) {
  if (!errorCodes.value[field]) return;
  const nextErrors = { ...errorCodes.value };
  delete nextErrors[field];
  errorCodes.value = nextErrors;
  if (!Object.keys(nextErrors).length) formError.value = "";
}

async function submitRegistration() {
  if (submitting.value) return;
  errorCodes.value = {};
  formError.value = "";
  submitting.value = true;

  const result = register(form);
  if (!result.ok) {
    errorCodes.value = result.errors ?? {};
    formError.value = result.reason ?? "registrationFailed";
    submitting.value = false;
    return;
  }

  const query = { registered: "1", account: result.member.account };
  if (safeRedirect.value !== "/") query.redirect = safeRedirect.value;
  await router.replace({ name: "login", query });
}
</script>
