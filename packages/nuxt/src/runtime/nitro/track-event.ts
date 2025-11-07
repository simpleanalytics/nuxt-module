import type { AnalyticsEvent } from "../server/lib/interfaces";
import {
  isProduction,
  isDoNotTrackEnabled,
} from "../server/lib/utils";
import { parseHeaders } from "../server/lib/headers";
import { useRuntimeConfig } from "#imports";
import type { H3Event } from "h3";

export async function trackEvent(
  event: H3Event,
  eventName: string,
  metadata?: Record<string, string | boolean | number | Date>
) {
  if (!isProduction()) {
    return;
  }

  const config = useRuntimeConfig().public.simpleAnalytics;
  const hostname = config.hostname;

  if (!hostname) {
    console.warn("No hostname provided for Simple Analytics");
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
