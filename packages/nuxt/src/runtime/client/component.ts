/* globals document */
import type { App, Plugin, InjectionKey } from 'vue'

export const saEventKey: InjectionKey<(event: string) => void> = Symbol('saEvent');

declare global {
  interface Window {
    sa_event?(
      s: string,
      params?: Record<string, string | boolean | number | Date>,
    ): void;
  }
}

export interface SimpleAnalyticsOptions {
  skip?: boolean | (() => boolean) | Promise<boolean>;
  domain?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPromise = (subject: any): subject is Promise<boolean> =>
  subject && typeof subject === 'object' && 'then' in subject && typeof (subject as { then: unknown }).then === "function";

const warn = (message: string): void => {
  if (console && console.warn)
    console.warn("Simple Analytics: " + message || "Something goes wrong.");
};

const injectScript = (app: App, domain: string): void => {
  if (typeof document === "undefined") return warn("No document defined.");
  if (document.getElementById("sa-script")) return; // Script already loaded
  const el = document.createElement("script");
  el.id = "sa-script";
  el.type = "text/javascript";
  el.async = true;
  el.src = "https://" + domain + "/latest.js";
  document.head.appendChild(el);

  // Add a global 'saEvent' method when the script has been loaded
  el.onload = () => {
    // Handle event tracking on localhost, we won't send events,
    // but we need to capture them to prevent errors
    if (
      window.location.hostname.includes(".") === false ||
      /^\d+$/.test(window.location.hostname.replace(/\./g, ""))
    ) {
      handleSkipOrLocalhost(app);
    } else {
      app.provide("saEvent", window.sa_event);
    }
  };
};

const handleSkipOrLocalhost = (app: App): void => {
  // when skip===true or script is running on localhost
  // we need a function that logs events that would have been sent
  app.provide("saEvent", function(event: string) {
    warn(`${event} event captured but not sent due to skip or localhost`);
  });
};

const SimpleAnalytics: Plugin = {
  install(app: App, { skip = false, domain = "scripts.simpleanalyticscdn.com" }: SimpleAnalyticsOptions = {}) {
    if (skip === false) return injectScript(app, domain);

    // If skip is promise, resolve first. With failure always inject script
    if (isPromise(skip))
      return skip
        .then((value: boolean) => {
          if (value !== true) return injectScript(app, domain);
          else return warn("Not sending requests because skip is active.");
        })
        .catch(() => injectScript(app, domain));

    // If skip function, execute and inject when not skipping
    if (typeof skip === "function" && skip() !== true)
      return injectScript(app, domain);

    // Add event catching function to Vue prototype
    if (skip) handleSkipOrLocalhost(app);

    // Otherwise skip
    return warn("Not sending requests because skip is active.");
  },
};

export { SimpleAnalytics };
