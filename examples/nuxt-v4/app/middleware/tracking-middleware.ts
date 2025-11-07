export default defineNuxtRouteMiddleware(async (to) => {
  // We track pageviews on the server only
  if (import.meta.client) {
    return;
  }

  await trackPageview();
});
