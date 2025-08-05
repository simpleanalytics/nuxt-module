// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  // modules: ["@simpleanalytics/nuxt"],
  simpleAnalytics: {
    hostname: "test.example.com", // Replace with your actual domain
  },
});
