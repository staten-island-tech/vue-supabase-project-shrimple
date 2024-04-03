<template>
  <div>
    <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
    <p v-if="loaded">welcome to the admin page</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>please wait...</p>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../../utils/supabase";
import { useUserStore } from "@/stores/user";
import { ref, onMounted } from "vue";
const userStore = useUserStore();

const loaded = ref(false);
const error = ref("");

onMounted(async () => {
  const admin = await userStore.isAdmin();
  if (!admin) {
    error.value = "You're not supposed to be here.";
    return;
  }
  loaded.value = true;
});
</script>

<style scoped></style>
../../../utils/supabase
