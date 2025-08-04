import type { AnalyticsEvent, TrackingOptions } from "./lib/interfaces";
import {
  isProduction,
  isDoNotTrackEnabled,
  isEnhancedBotDetectionEnabled,
} from "./lib/utils";
import { parseHeaders } from "./lib/headers";
import { useRequestEvent, useRuntimeConfig } from "nuxt/app";

export async function trackEvent(eventName: string, options?: TrackingOptions) {
  if (!isProduction()) {
    return;
  }

  const hostname =
    options?.hostname ?? useRuntimeConfig().public.simpleAnalytics.hostname;

  if (!hostname) {
    console.warn("No hostname provided for Simple Analytics");
    return;
  }

  const headers = useRequestEvent()?.headers;

  if (!headers) {
    return;
  }

  if (isDoNotTrackEnabled(headers) && !options?.collectDnt) {
    return;
  }

  const payload: AnalyticsEvent = {
    type: "event",
    hostname,
    event: eventName,
    metadata: options?.metadata,
    ...parseHeaders(headers, options?.ignoreMetrics),
  };

  const response = await fetch("https://queue.simpleanalyticscdn.com/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers.has("X-Forwarded-For") &&
        options &&
        isEnhancedBotDetectionEnabled(options) && {
          "X-Forwarded-For": headers.get("X-Forwarded-For")!,
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
