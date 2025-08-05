<script setup lang="ts">
if (import.meta.server) {
  await trackPageview();
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
