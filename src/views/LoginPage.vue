<template>
  <div class="flex flex-col gap-2 items-center">
    <button @click="userStore.signIn">login</button>
    <button @click="userStore.signOut">logout</button>
    <RouterLink to="/">go back</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();
</script>

<style scoped></style>
