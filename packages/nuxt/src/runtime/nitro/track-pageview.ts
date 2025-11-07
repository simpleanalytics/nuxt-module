import type {
  AnalyticsPageview,
} from "../server/lib/interfaces";
import {
  isProduction,
  isDoNotTrackEnabled,
} from "../server/lib/utils";
import { parseHeaders } from "../server/lib/headers";
import { parseUtmParameters } from "../server/lib/utm";
import { useRuntimeConfig } from "#imports";
import type { H3Event } from "h3";

// eslint-disable-next-line regexp/no-unused-capturing-group
const PROXY_PATHS = /^\/(proxy\.js|auto-events\.js|simple\/.*)$/;

export async function trackPageview(event: H3Event, metadata?: Record<string, string | boolean | number | Date>) {
  if (!isProduction()) {
    return;
  }

  const config = useRuntimeConfig().public.simpleAnalytics;
  const hostname = config.hostname;

  if (!hostname) {
    console.warn("No hostname provided for Simple Analytics");
    return;
  }

  // We don't record non-GET requests
  if (event.method !== "GET") {
    return;
  }

  const { path, query } = event.context.route;

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
    ...(query && !config.ignoreMetrics?.utm
      ? parseUtmParameters(query, {
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
