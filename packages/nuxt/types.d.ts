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

// Auto-imports exposed by the module
declare module "#imports" {
  type AnalyticsPrimitive = string | boolean | number | Date;
  type AnalyticsMetadata = Record<string, AnalyticsPrimitive> | undefined;

  interface IgnoredMetrics {
    utm?: boolean | undefined;
    timezone?: boolean | undefined;
    userAgent?: boolean | undefined;
    viewportSize?: boolean | undefined;
    language?: boolean | undefined;
  }

  interface TrackingOptions {
    hostname?: string | undefined;
    enhancedBotDetection?: boolean | undefined;
    strictUtm?: boolean | undefined;
    ignoreMetrics?: IgnoredMetrics | undefined;
    collectDnt?: boolean | undefined;
    metadata?: AnalyticsMetadata;
  }

  type HeaderOnlyContext = { headers: Headers };
  type ServerContextWithRequest = { request: Request };
  type ServerContextWithPath = {
    path: string;
    headers: Headers;
    searchParams?: Record<string, string | string[] | undefined>;
  };
  type ServerContext = ServerContextWithRequest | ServerContextWithPath;
  type NitroContext = { event: import("h3").H3Event };

  // trackEvent overloads (SSR and Nitro)
  export function trackEvent(
    eventName: string,
    options?: TrackingOptions & (ServerContext | HeaderOnlyContext)
  ): Promise<void>;
  export function trackEvent(
    eventName: string,
    options: TrackingOptions & NitroContext
  ): Promise<void>;

  // trackPageview overloads (SSR and Nitro)
  export function trackPageview(options?: TrackingOptions): Promise<void>;
  export function trackPageview(
    options: TrackingOptions & NitroContext
  ): Promise<void>;
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
