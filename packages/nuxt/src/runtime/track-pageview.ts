import { trackPageview as trackPageviewServer } from "./server/track-pageview";

type SAPageviewFn = (s: string, metadata?: Record<string, string | boolean | number | Date>) => void;

export async function trackPageview(metadata?: Record<string, string | boolean | number | Date>) {
  if (import.meta.client) {
    (window.sa_pageview as SAPageviewFn)?.("pageview", metadata);

    return;
  }

  await trackPageviewServer(metadata);
}
