<script setup lang="ts">
if (import.meta.server) {
  console.log('app.vue');
  await trackPageview();
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
