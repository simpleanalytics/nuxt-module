<script setup lang="ts">
// Handle button click
const isLoading = ref(false)
const message = ref('')

const handleButtonClick = async () => {
  isLoading.value = true
  message.value = ''
  
  try {
    const response = await $fetch('/api/track-event', {
      method: 'POST'
    })
    message.value = 'API called successfully! '
  } catch (error) {
    message.value = 'Error calling API'
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Test Page</h1>
    <p>This page also tracks pageviews server-side.</p>
    
    <div style="margin: 20px 0;">
      <button 
        @click="handleButtonClick" 
        :disabled="isLoading"
        style="padding: 10px 20px; font-size: 16px; cursor: pointer;"
      >
        {{ isLoading ? 'Tracking...' : 'Click to Track Event' }}
      </button>
      
      <p v-if="message" style="margin-top: 10px; color: green;">
        {{ message }}
      </p>
    </div>
    
    <NuxtLink to="/">Back to Homepage</NuxtLink>
  </div>
</template> 