<template>
  <div>
    <h1>Simple Analytics Nuxt Module Playground</h1>
    <p>This page demonstrates server-side tracking functions.</p>

    <div style="margin: 20px 0;">
      <button
        @click="handleCustomEvent"
        style="padding: 10px 20px; font-size: 16px; cursor: pointer;"
      >
        Track Custom Event
      </button>

      <p v-if="message" style="margin-top: 10px; color: green;">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
// // Server-side pageview tracking
// if (import.meta.server) {
//   await trackPageview({
//     hostname: 'playground.example.com',
//     metadata: {
//       source: 'playground',
//       timestamp: new Date().toISOString()
//     }
//   })
// }

// Client-side event handling
const message = ref('')

const handleCustomEvent = async () => {
  try {
    const response = await $fetch('/api/track-event', {
      method: 'POST',
      body: {
        eventName: 'button_clicked',
        metadata: {
          source: 'playground',
          timestamp: new Date().toISOString()
        }
      }
    })
    message.value = 'Custom event tracked successfully!'
  } catch (error) {
    message.value = 'Error tracking event'
    console.error('Error:', error)
  }
}
</script>
