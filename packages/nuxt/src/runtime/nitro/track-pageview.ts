import type {
  AnalyticsPageview,
  TrackingOptions,
} from "../server/lib/interfaces";
import {
  isProduction,
  isDoNotTrackEnabled,
  isEnhancedBotDetectionEnabled,
} from "../server/lib/utils";
import { parseHeaders } from "../server/lib/headers";
import { parseUtmParameters } from "../server/lib/utm";
import { useRuntimeConfig } from "#imports";
import type { NitroContext } from "./interface";

// eslint-disable-next-line regexp/no-unused-capturing-group
const PROXY_PATHS = /^\/(proxy\.js|auto-events\.js|simple\/.*)$/;

type TrackPageviewOptions = TrackingOptions & NitroContext;

export async function trackPageview(options: TrackPageviewOptions) {
  if (!isProduction()) {
    return;
  }

  const hostname =
    options?.hostname ?? useRuntimeConfig().public.simpleAnalytics.hostname;

  if (!hostname) {
    console.warn("No hostname provided for Simple Analytics");
    return;
  }

  // We don't record non-GET requests
  if (options.event.method !== "GET") {
    return;
  }

  const { headers } = options.event;
  const { path, query } = options.event.context.route;

  // We don't record non-navigation requests
  if (headers.get("Sec-Fetch-Mode") !== "navigate") {
    return;
  }

  if (isDoNotTrackEnabled(headers) && !options?.collectDnt) {
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
    ...parseHeaders(headers, options?.ignoreMetrics),
    ...(query && !options?.ignoreMetrics?.utm
      ? parseUtmParameters(query, {
          strictUtm: options?.strictUtm ?? true,
        })
      : {}),
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
        `Failed to track pageview: ${response.status}`,
        await response.json()
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(`Failed to track pageview: ${response.status}`);
    }
  }
}
