import { useRuntimeConfig } from "#imports";
import { defineNuxtPlugin } from "nuxt/app";

/* @ts-expect-error -- force ES module import */
import SimpleAnalytics from "simple-analytics-vue/dist/index.mjs";
import type { SimpleAnalyticsOptions } from "simple-analytics-vue";
import type { App, Plugin } from "vue";

type SimpleAnalyticsPlugin = Plugin & {
  install(app: App, options?: SimpleAnalyticsOptions): void;
};

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // We have to cast the plugin here because the forced .mjs import
  nuxtApp.vueApp.use(SimpleAnalytics as SimpleAnalyticsPlugin, {
    skip: config.public.simpleAnalytics.enabled === false,
    domain: config.public.simpleAnalytics.domain,
  });
});
