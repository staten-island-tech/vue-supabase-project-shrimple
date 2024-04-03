<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "./stores/user";
const userStore = useUserStore();

const admin = ref(false);

onMounted(async () => {
  console.log(await userStore.user);
  // admin.value = ;
});
</script>

<template>
  <header class="w-full flex bg-slate-200 p-4 py-2 gap-4 items-center">
    <RouterLink to="/"><span class="font-bold text-xl">soap</span></RouterLink>
    <RouterLink to="/store"><span>store</span></RouterLink>
    <RouterLink to="/login"><span>account</span></RouterLink>
    <RouterLink to="/admin" v-if="admin"><span>admin</span></RouterLink>
  </header>
  <RouterView />
</template>

<style scoped>
span {
  @apply border-r-black border pr-4 font-serif last:border-none;
}
header:last-of-type(span) {
  color: red;
}
</style>
