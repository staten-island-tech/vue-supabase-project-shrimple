<template>
  <div class="flex flex-col items-center">
    <h1 class="text-xl underline">welcome to my awesome website</h1>
    <RouterLink to="store">go to the store</RouterLink>
    <RouterLink to="login">account</RouterLink>
    <RouterLink to="admin" v-if="admin">admin</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const admin = ref(false);

onMounted(async () => {
  admin.value = await userStore.isAdmin();
});
</script>

<style scoped></style>
