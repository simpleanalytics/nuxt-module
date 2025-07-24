export interface SimpleAnalyticsOptions {
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
}

export function parseOptions(options: SimpleAnalyticsOptions) {
  const metrics = options.ignoreMetrics
    ? Object.entries(options.ignoreMetrics)
        .filter(([_, value]) => value)
        .map(([key]) => `${key}`)
        .join(",")
    : undefined;

  return {
    "data-auto-collect": options.autoCollect,
    "data-collect-dnt": options.collectDnt,
    "data-hostname":
      options.hostname ?? process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_HOSTNAME,
    "data-mode": options.mode,
    "data-ignore-metrics": metrics === "" ? undefined : metrics,
    "data-ignore-pages": options.ignorePages?.join(","),
    "data-allow-params": options.allowParams?.join(","),
    "data-non-unique-params": options.nonUniqueParams?.join(","),
    "data-strict-utm": options.strictUtm,
  };
}
