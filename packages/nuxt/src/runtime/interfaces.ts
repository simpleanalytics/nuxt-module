export type AnalyticsMetadata =
  | Record<string, string | boolean | number | Date>
  | undefined;

export interface SimpleAnalyticsOptions {
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
}
