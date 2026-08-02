<template>
  <div class="auth-page auth-page--login">
    <section class="auth-shell glass-surface">
      <aside class="auth-visual">
        <div class="auth-visual__copy">
          <p class="auth-eyebrow">{{ t("auth.eyebrow") }}</p>
          <span class="auth-badge">
            <ShieldCheck aria-hidden="true" />
            {{ t("auth.mockBadge") }}
          </span>
          <h1>{{ t("auth.loginTitle") }}</h1>
          <p>{{ t("auth.loginDescription") }}</p>
        </div>
        <img
          src="/img/img-login/TD.png"
          :alt="t('auth.loginVisualAlt')" />
      </aside>

      <div class="auth-panel">
        <header>
          <p class="auth-eyebrow">{{ t("route.login") }}</p>
          <h2>{{ t("auth.signInAction") }}</h2>
          <p>{{ t("auth.mockNotice") }}</p>
        </header>

        <p
          v-if="registrationComplete"
          class="auth-notice auth-notice--success"
          role="status">
          <CircleCheck aria-hidden="true" />
          {{ t("auth.registeredSuccess") }}
        </p>

        <form
          novalidate
          @submit.prevent="submitLogin">
          <BeInput
            v-model="identifier"
            type="text"
            autocomplete="username"
            :label="t('auth.identifierLabel')"
            :placeholder="t('auth.identifierPlaceholder')"
            :error="fieldError('identifier')"
            @input="clearLoginError('identifier')" />
          <BeInput
            v-model="password"
            type="password"
            autocomplete="current-password"
            :label="t('auth.passwordLabel')"
            :placeholder="t('auth.passwordPlaceholder')"
            :error="fieldError('password')"
            @input="clearLoginError('password')" />

          <p
            v-if="formError"
            class="auth-form-error"
            role="alert">
            <CircleAlert aria-hidden="true" />
            {{ t(`auth.${formError}`) }}
          </p>

          <BeBtn
            class="auth-submit"
            type="submit"
            size="l"
            :loading="submitting">
            <LogIn aria-hidden="true" />
            {{ t("auth.signInAction") }}
          </BeBtn>
        </form>

        <div class="auth-secondary-actions">
          <p>
            {{ t("auth.noAccount") }}
            <RouterLink :to="signupDestination">{{ t("auth.signUpLink") }}</RouterLink>
          </p>
          <button
            type="button"
            @click="forgotNoticeVisible = true">
            {{ t("auth.forgotPassword") }}
          </button>
        </div>

        <p
          v-if="forgotNoticeVisible"
          class="auth-notice"
          role="status">
          <Info aria-hidden="true" />
          {{ t("auth.forgotNotice") }}
        </p>

        <section
          class="auth-demo"
          :aria-label="t('auth.demoTitle')">
          <header>
            <KeyRound aria-hidden="true" />
            <div>
              <h3>{{ t("auth.demoTitle") }}</h3>
              <p>{{ t("auth.demoDescription") }}</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>{{ t("auth.demoAccount") }}</dt>
              <dd>
                <code>{{ demoMember.account }}</code>
              </dd>
            </div>
            <div>
              <dt>{{ t("auth.demoEmail") }}</dt>
              <dd>
                <code>{{ demoMember.email }}</code>
              </dd>
            </div>
            <div>
              <dt>{{ t("auth.demoPassword") }}</dt>
              <dd>
                <code>{{ demoMember.password }}</code>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { CircleAlert, CircleCheck, Info, KeyRound, LogIn, ShieldCheck } from "lucide-vue-next";

import BeBtn from "@/components/BeBtn.vue";
import BeInput from "@/components/BeInput.vue";
import { getResolvedAuthRedirect } from "@/router/authNavigation";
import { useMemberState } from "@/state/memberState";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { demoCredentials: demoMember, login } = useMemberState();

const identifier = ref(typeof route.query.account === "string" ? route.query.account : "");
const password = ref("");
const errorCodes = ref({});
const formError = ref("");
const forgotNoticeVisible = ref(false);
const submitting = ref(false);

const registrationComplete = computed(() => route.query.registered === "1");
const safeRedirect = computed(() => getResolvedAuthRedirect(router, route.query.redirect));
const signupDestination = computed(() => ({
  name: "signup",
  query: safeRedirect.value === "/" ? {} : { redirect: safeRedirect.value },
}));

function fieldError(field) {
  const code = errorCodes.value[field];
  return code ? t(`auth.errors.${code}`) : "";
}

function clearLoginError(field) {
  if (errorCodes.value[field]) {
    const nextErrors = { ...errorCodes.value };
    delete nextErrors[field];
    errorCodes.value = nextErrors;
  }
  formError.value = "";
}

async function submitLogin() {
  if (submitting.value) return;
  errorCodes.value = {};
  formError.value = "";

  if (!identifier.value.trim()) errorCodes.value.identifier = "required";
  if (!password.value) errorCodes.value.password = "required";
  if (Object.keys(errorCodes.value).length) return;

  submitting.value = true;
  const result = login(identifier.value, password.value);
  if (!result.ok) {
    formError.value = result.reason;
    password.value = "";
    submitting.value = false;
    return;
  }

  await router.replace(safeRedirect.value);
}
</script>
