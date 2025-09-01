import {
  defineNuxtModule,
  createResolver,
  addServerHandler,
  addImports,
  addServerImports,
  addPlugin,
} from "@nuxt/kit";
import type { SimpleAnalyticsOptions } from "./runtime/server/lib/options";

export interface ModuleOptions extends SimpleAnalyticsOptions {
  enabled?: boolean;
  proxy?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "simple-analytics",
    configKey: "simpleAnalytics",
  },
  defaults: {
    proxy: true,
  },
  setup(options, nuxt) {
    if (options.enabled === false) {
      return;
    }

    const resolver = createResolver(import.meta.url);

    // Ensure proxy has a default value if not provided
    const configOptions = {
      ...options,
      hostname: options.hostname ?? process.env.SIMPLE_ANALYTICS_HOSTNAME,
      proxy: options.proxy ?? true,
    };

    nuxt.options.runtimeConfig.public.simpleAnalytics = configOptions;

    addPlugin(resolver.resolve("./runtime/plugin"));

    addImports([
      {
        name: "trackEvent",
        from: resolver.resolve("./runtime/track-event"),
        meta: {
          description: "Track a custom event with Simple Analytics",
        },
      },
      {
        name: "trackPageview",
        from: resolver.resolve("./runtime/track-pageview"),
        meta: {
          description: "Track a pageview with Simple Analytics",
        },
      },
    ]);

    addServerImports([
      {
        name: "trackEvent",
        from: resolver.resolve("./runtime/nitro/track-event"),
        meta: {
          description: "Track a custom event with Simple Analytics",
        },
      },
      {
        name: "trackPageview",
        from: resolver.resolve("./runtime/nitro/track-pageview"),
        meta: {
          description: "Track a pageview with Simple Analytics",
        },
      },
    ]);

    if (options.proxy !== false) {
      addServerHandler({
        route: "/proxy.js",
        handler: resolver.resolve("./runtime/server/proxy-handler"),
      });

      addServerHandler({
        route: "/auto-events.js",
        handler: resolver.resolve("./runtime/server/proxy-handler"),
      });

      addServerHandler({
        route: "/simple/**",
        handler: resolver.resolve("./runtime/server/proxy-handler"),
      });
    }
  },
});
