export default defineNuxtRouteMiddleware(async (to) => {
  // We track pageviews on the server only
  if (import.meta.client) {
    return;
  }

  if (to.path.startsWith("/api/")) {
    return;
  }

  await trackPageview();
});
