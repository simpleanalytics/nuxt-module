export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },
  simpleAnalytics: {
    hostname: "playground.example.com",
  },
});
