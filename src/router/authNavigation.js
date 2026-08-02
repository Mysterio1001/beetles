const AUTH_ROUTE_NAMES = new Set(["login", "signup"]);

export function getSafeAuthRedirect(value, fallback = "/") {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== "string" || !candidate.startsWith("/")) return fallback;
  if (candidate.startsWith("//")) return fallback;

  const path = candidate.split(/[?#]/, 1)[0];
  if (path === "/login" || path === "/signup") return fallback;
  return candidate;
}

export function getAuthSourceRedirect(route, fallback = "/") {
  const routeName = typeof route?.name === "string" ? route.name : "";
  if (!routeName || routeName === "notFound" || AUTH_ROUTE_NAMES.has(routeName)) return fallback;
  return getSafeAuthRedirect(route.fullPath, fallback);
}

export function getResolvedAuthRedirect(router, value, fallback = "/") {
  const candidate = getSafeAuthRedirect(value, fallback);
  if (candidate === fallback || typeof router?.resolve !== "function") return fallback;

  try {
    const resolvedRouteName = router.resolve(candidate)?.name;
    if (
      typeof resolvedRouteName !== "string" ||
      resolvedRouteName === "notFound" ||
      AUTH_ROUTE_NAMES.has(resolvedRouteName)
    ) {
      return fallback;
    }
  } catch {
    return fallback;
  }

  return candidate;
}
