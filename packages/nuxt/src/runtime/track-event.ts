import type { TrackingOptions } from "./server/lib/interfaces";
import { trackEvent as trackEventServer } from "./server/track-event";

type SAEvent = (s: string, params?: Record<string, string | boolean | number | Date>) => void;

export async function trackEvent(eventName: string, options?: TrackingOptions) {
  if (import.meta.client) {
    (window.sa_event as SAEvent)?.(eventName, options?.metadata);
  }

  await trackEventServer(eventName, options);
}
