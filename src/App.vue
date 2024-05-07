<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "./stores/user";
import { supabase } from "../utils/supabase";
const userStore = useUserStore();

const admin = ref(false);

onMounted(async () => {
  const user = await userStore.fetchUser();
  if (!user) return;

  const admins = await supabase.from("admins").select();
  if (!admins.data) return;
  admin.value = admins.data.length > 0;
});
</script>

<template>
  <header class="w-full flex p-4 py-2 gap-4 items-center sticky top-0 bg-gradient-to-r from-slate-200 to-slate-100 border-b-2 border-black">
    <span class="font-bold text-xl"><RouterLink to="/">soap</RouterLink></span>
    <span><RouterLink to="/store">store</RouterLink></span>
    <span><RouterLink to="/cart">cart</RouterLink></span>
    <span><RouterLink to="/login">account</RouterLink></span>
    <span v-if="admin"><RouterLink to="/admin">admin</RouterLink></span>
  </header>
  <RouterView />
  <footer class="text-center mt-10">
    <hr class="mb-4" />
    <p>this site brought to you by chronic procrastination</p>
  </footer>
</template>

<style scoped>
header {
  z-index: 500;
}

span {
  @apply border-r border-r-black pr-4 font-serif h-full;
}
span:hover {
  @apply drop-shadow-sm;
}
span:last-of-type {
  @apply border-none;
}
</style>
