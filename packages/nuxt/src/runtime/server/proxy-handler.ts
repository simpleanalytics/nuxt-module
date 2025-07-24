import { useRuntimeConfig } from '#imports'
import { defineEventHandler, getRequestIP, getRequestURL, proxyRequest, type H3Event } from 'h3'

function proxy(event: H3Event, url: string) {
  return proxyRequest(event, url, {
    headers: {
      'X-Forwarded-For': getRequestIP(event, { xForwardedFor: true }),
    },
   })
}

export default defineEventHandler((event) => {
  const hostname = useRuntimeConfig(event).public.simpleAnalytics.hostname;
  const url = getRequestURL(event)
  const path = url.pathname

  // Handle different proxy paths based on the request
  if (path === '/proxy.js') {
    return proxy(event, `https://simpleanalyticsexternal.com/proxy.js?hostname=${hostname}&path=/simple`)
  }

  if (path === '/auto-events.js') {
    return proxy(event, 'https://scripts.simpleanalyticscdn.com/auto-events.js')
  }

  if (path.startsWith('/simple/')) {
    const matchPath = path.replace('/simple/', '')
    const searchParams = url.searchParams
    const target = `https://queue.simpleanalyticscdn.com/${matchPath}?${searchParams.toString()}`
    return proxy(event, target);
  }
})

