import { trackEvent as trackEventServer } from "./server/track-event";

type SAEventFn = (s: string, metadata?: Record<string, string | boolean | number | Date>) => void;

export async function trackEvent(eventName: string, metadata?: Record<string, string | boolean | number | Date>) {
  if (import.meta.client) {
    (window.sa_event as SAEventFn)?.(eventName, metadata);

    return;
  }

  await trackEventServer(eventName, metadata);
}
