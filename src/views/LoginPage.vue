<template>
  <h1 class="text-center text-xl underline">amazing login page</h1>
  <div>
    <p class="text-center">{{ signedIn ? `you are signed in as ${user.data.user.user_metadata.name}` : "you aren't signed in" }}</p>
    <div class="flex flex-col gap-2 items-center">
      <button @click="userStore.signIn" v-if="!signedIn">login</button>
      <button @click="userStore.signOut" v-if="signedIn">logout</button>
    </div>
  </div>
  <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "../stores/user";
const userStore = useUserStore();
const signedIn = ref(false);
const user = ref();

onMounted(async () => {
  user.value = await userStore.user;
  console.log(user.value);
  signedIn.value = user.value.data.user.user_metadata.name;
});
</script>

<style scoped></style>
