<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "./stores/user";
import { supabase } from "../utils/supabase";
const userStore = useUserStore();

import type { Ref } from "vue";
const admin = ref(false);
const theme: Ref<string> = ref("");

onMounted(async () => {
  let dark = localStorage.getItem("dark");
  if (!dark) dark = "default";
  theme.value = dark;
  updateTheme();

  const user = await userStore.fetchUser();
  if (!user) return;

  const admins = await supabase.from("admins").select();
  if (!admins.data) return;
  admin.value = admins.data.length > 0;
});

function updateTheme() {
  localStorage.setItem("dark", theme.value);
  if (theme.value === "default") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches.toString() === "true") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    return;
  }
  localStorage.setItem("dark", theme.value.toString());
  if (theme.value.toString() === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}
</script>

<template>
  <header
    class="w-full flex py-2 px-4 items-center sticky top-0 bg-gradient-to-r mb-4 from-slate-200 to-slate-100 border-b-2 border-black dark:border-white dark:from-black dark:to-slate-800 dark:text-white"
  >
    <nav class="dark-border">
      <span class="font-bold text-xl"><RouterLink to="/">soap</RouterLink></span>
      <span><RouterLink to="/store">store</RouterLink></span>
      <span><RouterLink to="/cart">cart</RouterLink></span>
      <span><RouterLink to="/login">account</RouterLink></span>
      <span v-if="admin"><RouterLink to="/admin">admin</RouterLink></span>
    </nav>
    <span class="flex-grow"></span>
    <span class="w-min">
      theme:
      <select
        class="dark:bg-slate-700 border dark:border-white"
        @change="updateTheme"
        v-model="theme"
      >
        <option>light</option>
        <option>dark</option>
        <option>default</option>
      </select>
    </span>
  </header>
  <RouterView />
  <footer class="text-center mt-10 mb-5">
    <hr class="mb-5" />
    <p>this site brought to you by chronic procrastination</p>
  </footer>
</template>

<style scoped>
header {
  z-index: 500;
}
header * {
  @apply font-serif;
}

nav {
  @apply flex flex-row items-center gap-1 sm:gap-2 md:gap-4;
}
nav span {
  @apply border-r pr-1 sm:pr-2 md:pr-4 h-full;
}

nav span:last-of-type {
  @apply border-none pr-0;
}
</style>
