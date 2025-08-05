import { useRuntimeConfig } from "#imports";
import { defineNuxtPlugin } from "nuxt/app";

import SimpleAnalytics from "simple-analytics-vue";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(SimpleAnalytics, {
    skip: !config.public.simpleAnalytics.enabled,
    domain: config.public.simpleAnalytics.domain,
  });
});
