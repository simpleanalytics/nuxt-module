# Simple Analytics Nuxt Module

A Nuxt module for integrating Simple Analytics with server-side tracking capabilities.

## Quick Setup

Install the module to your Nuxt application:

```bash
npm install @simpleanalytics/nuxt
```

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["@simpleanalytics/nuxt"],
  simpleAnalytics: {
    hostname: "your-domain.com",
    enabled: true,
    proxy: true,
  },
});
```

## Usage

### Server-side Pageview Tracking

Track pageviews automatically on the server:

```vue
<script setup>
// This will run on the server and track the pageview
if (import.meta.server) {
  await trackPageview({
    hostname: "your-domain.com",
    metadata: {
      source: "homepage",
    },
  });
}
</script>
```

### Server-side Event Tracking

Track custom events from API routes or server-side code:

```ts
// In a server API route
export default defineEventHandler(async (event) => {
  await trackEvent("user_signup", {
    event,
    metadata: {
      source: "registration_form",
      user_type: "new",
    },
  });

  return { success: true };
});
```

## Configuration

### Module Options

```ts
export default defineNuxtConfig({
  simpleAnalytics: {
    // Your Simple Analytics hostname
    hostname: "your-domain.com",

    // Enable/disable the module
    enabled: true,

    // Enable/disable proxy
    proxy: true,

    // Auto-collect events
    autoCollect: true,

    // Collect data even when DNT is enabled
    collectDnt: false,

    // Dashboard mode
    mode: "dash",

    // Ignore specific metrics
    ignoreMetrics: {
      referrer: false,
      utm: false,
      country: false,
      session: false,
      timeonpage: false,
      scrolled: false,
      useragent: false,
      screensize: false,
      viewportsize: false,
      language: false,
    },

    // Ignore specific pages
    ignorePages: ["/admin", "/private"],

    // Allow specific URL parameters
    allowParams: ["ref", "source"],

    // Non-unique parameters
    nonUniqueParams: ["utm_source"],

    // Strict UTM parameter parsing
    strictUtm: true,
  },
});
```

### Environment Variables

```bash
# Required: Your Simple Analytics hostname
SIMPLE_ANALYTICS_HOSTNAME=your-domain.com
```

## API Reference

### `trackPageview(options)`

Track a pageview on the server.

**Parameters:**

- `options` (object):
  - `hostname` (string): Your Simple Analytics hostname
  - `metadata` (object): Additional metadata to track
  - `ignoreMetrics` (object): Metrics to ignore for this pageview
  - `collectDnt` (boolean): Whether to collect data when DNT is enabled
  - `strictUtm` (boolean): Whether to use strict UTM parameter parsing

### `trackEvent(eventName, options)`

Track a custom event on the server.

**Parameters:**

- `eventName` (string): Name of the event to track
- `options` (object):
  - `headers` (Headers): Request headers
  - `hostname` (string): Your Simple Analytics hostname
  - `metadata` (object): Additional metadata to track
  - `ignoreMetrics` (object): Metrics to ignore for this event
  - `collectDnt` (boolean): Whether to collect data when DNT is enabled

## License

MIT License - see the [LICENSE](LICENSE) file for details.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@simpleanalytics/nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@simpleanalytics/nuxt
[npm-downloads-src]: https://img.shields.io/npm/dm/@simpleanalytics/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@simpleanalytics/nuxt
[license-src]: https://img.shields.io/npm/l/@simpleanalytics/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@simpleanalytics/nuxt
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
