export {};

declare module "@nuxt/schema" {
  interface RuntimeConfig {
    // Private runtime config (server-side only)
  }
  interface PublicRuntimeConfig {
    simpleAnalytics: {
      autoCollect?: boolean;
      collectDnt?: boolean;
      hostname?: string;
      mode?: "dash";
      ignoreMetrics?: {
        referrer?: boolean;
        utm?: boolean;
        country?: boolean;
        session?: boolean;
        timeonpage?: boolean;
        scrolled?: boolean;
        useragent?: boolean;
        screensize?: boolean;
        viewportsize?: boolean;
        language?: boolean;
      };
      ignorePages?: string[];
      allowParams?: string[];
      nonUniqueParams?: string[];
      strictUtm?: boolean;
      enabled?: boolean;
      proxy?: boolean;
    };
  }
}

declare module "#app" {
  interface NuxtApp {
    $simpleAnalytics: {
      trackEvent: typeof import("./src/lib/server/simple-analytics").trackEvent;
      trackPageview: typeof import("./src/lib/server/simple-analytics").trackPageview;
    };
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $simpleAnalytics: {
      trackEvent: typeof import("./src/lib/server/simple-analytics").trackEvent;
      trackPageview: typeof import("./src/lib/server/simple-analytics").trackPageview;
    };
  }
}

declare global {
  interface Window {
    sa_event?(
      s: string,
      params?: Record<string, string | boolean | number | Date>
    ): void;
    sa_pageview?(
      s: string,
      params?: Record<string, string | boolean | number | Date>
    ): void;
  }
}
