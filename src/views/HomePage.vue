<template>
  <div class="flex flex-col items-center">
    <h1 class="text-xl underline">welcome to my awesome website</h1>
    <h2>here's what you can do to get started:</h2>
    <ul class="list-disc">
      <li>change the theme in the top right</li>
      <li><RouterLink to="/store" class="underline">visit the store</RouterLink></li>
      <li><RouterLink to="/login" class="underline">make an account</RouterLink></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped></style>
