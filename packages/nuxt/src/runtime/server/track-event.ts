import type { AnalyticsEvent } from "./lib/interfaces";
import {
  isProduction,
  isDoNotTrackEnabled,
} from "./lib/utils";
import { parseHeaders } from "./lib/headers";
import { useRequestEvent, useRuntimeConfig } from "nuxt/app";

export async function trackEvent(eventName: string, metadata?: Record<string, string | boolean | number | Date>) {
  if (!isProduction()) {
    return;
  }

  const config = useRuntimeConfig().public.simpleAnalytics;
  const hostname = config.hostname;

  if (!hostname) {
    console.warn("No hostname provided for Simple Analytics");
    return;
  }

  const event = useRequestEvent();

  if (!event) {
    return;
  }

  if (isDoNotTrackEnabled(event.headers) && !config.collectDnt) {
    return;
  }

  const payload: AnalyticsEvent = {
    type: "event",
    hostname,
    event: eventName,
    metadata,
    ...parseHeaders(event.headers, config.ignoreMetrics),
  };

  const response = await fetch("https://queue.simpleanalyticscdn.com/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(event.headers.has("X-Forwarded-For") &&
      config.enhancedBotDetection && {
        "X-Forwarded-For": event.headers.get("X-Forwarded-For")!,
      }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    try {
      console.error(
        `Failed to track event: ${response.status}`,
        await response.json()
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(`Failed to track event: ${response.status}`);
    }
  }
}
