<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "./stores/user";
import { supabase } from "../utils/supabase";
const userStore = useUserStore();

const admin = ref(false);

onMounted(async () => {
  const user = await userStore.user;
  if (!user) return;

  const admins = await supabase.from("admins").select();
  if (!admins.data) return;
  admin.value = admins.data.length > 0;
});
</script>

<template>
  <header class="w-full flex bg-slate-200 p-4 py-2 gap-4 items-center">
    <span class="font-bold text-xl"><RouterLink to="/">soap</RouterLink></span>
    <span><RouterLink to="/store">store</RouterLink></span>
    <span><RouterLink to="/cart">cart</RouterLink></span>
    <span><RouterLink to="/login">account</RouterLink></span>
    <span v-if="admin"><RouterLink to="/admin">admin</RouterLink></span>
  </header>
  <RouterView />
</template>

<style scoped>
span {
  @apply border-r border-r-black pr-4 font-serif h-full;
}
span:last-of-type {
  @apply border-none;
}
</style>
