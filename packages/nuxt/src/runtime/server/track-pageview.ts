import type { AnalyticsPageview } from "./lib/interfaces";
import {
  isProduction,
  isDoNotTrackEnabled,
} from "./lib/utils";
import { parseHeaders } from "./lib/headers";
import { parseUtmParameters } from "./lib/utm";
import { useRequestEvent, useRoute, useRuntimeConfig } from "nuxt/app";

// eslint-disable-next-line regexp/no-unused-capturing-group
const PROXY_PATHS = /^\/(proxy\.js|auto-events\.js|simple\/.*)$/;

export async function trackPageview(metadata?: Record<string, string | boolean | number | Date>) {
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

  // We don't record non-GET requests
  if (!event || event.method !== "GET") {
    return;
  }

  const { path, query } = useRoute();
  const searchParams = query;

  // We don't record non-navigation requests
  if (event.headers.get("Sec-Fetch-Mode") !== "navigate") {
    return;
  }

  if (isDoNotTrackEnabled(event.headers) && !config.collectDnt) {
    return;
  }

  if (PROXY_PATHS.test(path)) {
    return;
  }

  const payload: AnalyticsPageview = {
    type: "pageview",
    hostname,
    event: "pageview",
    path,
    metadata,
    ...parseHeaders(event.headers, config.ignoreMetrics),
    ...(searchParams && !config.ignoreMetrics?.utm
      ? parseUtmParameters(searchParams, {
          strictUtm: config.strictUtm ?? true,
        })
      : {}),
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
        `Failed to track pageview: ${response.status}`,
        await response.json()
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(`Failed to track pageview: ${response.status}`);
    }
  }
}
