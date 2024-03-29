<template>
  <div class="flex flex-col items-center">
    <h1 class="font-serif">as shrimple as that</h1>
    <output class="font-mono">{{ counter }}</output>
    <div class="flex flex-wrap justify-around w-11/12 gap-1">
      <button
        v-for="i in counter"
        @click="counter++"
        class="bg-blue-200 p-2 rounded-xl hover:bg-blue-100 transition-colors duration-300 ring-2 ring-inset flex-grow"
      >
        shrimple
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const counter = ref(1);
</script>

<style scoped></style>
