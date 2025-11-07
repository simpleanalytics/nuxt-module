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
  },
});
```

## Usage

Adding the module will automatically enable client-side page view collection though the Simple Analytics script.

### Server-side Pageview Tracking

Track pageviews automatically on the server:

```vue
<script setup>
// This will run on the server and track the pageview
if (import.meta.server) {
  await trackPageview({
    some_extra_metadata: "homepage"
  });
}
</script>
```

### Server-side Event Tracking

Track custom events from API routes or server-side code:

```ts
// In a (Nitro) server API route
export default defineEventHandler(async (event) => {
  await trackEvent(event, "user_signup", {
    source: "registration_form",
    user_type: "new",
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

      // Use vendor specific timezone headers to the determine the visitors location (server only)
      timezone: false
    },

    // Ignore specific pages
    ignorePages: ["/admin", "/private"],

    // Allow specific URL parameters
    allowParams: ["ref", "source"],

    // Non-unique parameters
    nonUniqueParams: ["utm_source"],

    // Strict UTM parameter parsing
    strictUtm: true,

    // Enable enhanced bot detection during server tracking (server only)
    enhancedBotDetection: false
  },
});
```

### Environment Variables

```bash
# Required: Your Simple Analytics hostname
SIMPLE_ANALYTICS_HOSTNAME=your-domain.com
```

## API Reference (Nuxt)

### `trackPageview(options)`

Track a pageview on the server.

**Parameters:**

- `metadata` (object): Additional metadata to track (optional)

### `trackEvent(eventName, options)`

Track a custom event on the server.

**Parameters:**

- `eventName` (string): Name of the event to track
- `metadata` (object): Additional metadata to track (optional)

## API Reference (Nitro)

### `trackPageview(event, options)`

Track a pageview on the server.

**Parameters:**

- `event` (H3Event): Nitro request event
- `metadata` (object): Additional metadata to track (optional)

### `trackEvent(event, eventName, options)`

Track a custom event on the server.

**Parameters:**

- `event` (H3Event): Nitro request event
- `eventName` (string): Name of the event to track
- `metadata` (object): Additional metadata to track (optional)

## License

MIT License - see the [LICENSE](LICENSE) file for details.
