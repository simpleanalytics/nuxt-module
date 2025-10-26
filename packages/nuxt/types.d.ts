export {};

declare module "@nuxt/schema" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RuntimeConfig {
    // Private runtime config (server-side only)
  }
  interface PublicRuntimeConfig {
    simpleAnalytics: {
      autoCollect?: boolean;
      collectDnt?: boolean;
      domain?: string;
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
        timezone?: boolean;
      };
      ignorePages?: string[];
      allowParams?: string[];
      nonUniqueParams?: string[];
      strictUtm?: boolean;
      enabled?: boolean;
      proxy?: boolean;
      enhancedBotDetection?: boolean;
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

declare module "@vue/runtime-core" {
  interface InjectionKeys {
    saEvent: (event: string) => void;
  }
}
