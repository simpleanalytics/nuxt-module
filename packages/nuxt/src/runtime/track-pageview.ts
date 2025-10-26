import type { TrackingOptions } from "./server/lib/interfaces";
import { trackPageview as trackPageviewServer } from "./server/track-pageview";

type SAPageview = (s: string, params?: Record<string, string | boolean | number | Date>) => void;

export async function trackPageview(options?: TrackingOptions) {
  if (import.meta.client) {
    (window.sa_pageview as SAPageview)?.("pageview", options?.metadata);
  }

  await trackPageviewServer(options);
}
