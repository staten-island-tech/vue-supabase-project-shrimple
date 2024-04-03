<template>
  <h1 class="text-center text-xl underline">amazing login page</h1>
  <p class="text-center">{{ display }}</p>
  <div class="flex flex-col gap-2 items-center" v-if="session">
    <button @click="userStore.signIn" v-if="!session.data.session">login</button>
    <button @click="userStore.signOut" v-if="session.data.session">logout</button>
  </div>
  <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();
const display = ref("");
const session = ref();

onMounted(async () => {
  session.value = await userStore.getSession();
  display.value = session.value.data.session ? `you are signed in as ${session.value.data.session.user.user_metadata.name}` : "you aren't signed in";
});
</script>

<style scoped></style>
