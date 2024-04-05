<template>
  <div>
    <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
    <div v-if="loaded" class="flex flex-col items-center">
      <h1 class="font-bold text-lg">welcome to the admin page</h1>
      <RouterLink to="/admin/edit"><p>edit listings</p></RouterLink>
    </div>
    <p v-else>please wait...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const loaded = ref(false);

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
onMounted(async () => {
  const admin = await userStore.isAdmin;
  if (!admin) {
    alert("You're not supposed to be here...");
    window.location.href = window.location.origin;
    return;
  }
  loaded.value = true;
});
</script>

<style scoped></style>
../../../utils/supabase
