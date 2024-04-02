<template>
  <div class="flex flex-col items-center">
    <h1 class="font-serif">as shrimple as that</h1>
    <code>{{ log }}</code>
    <output class="font-mono">{{ counter }}</output>
    <div class="flex flex-wrap justify-around w-11/12 gap-1">
      <button
        v-for="i in counter"
        @click="counter++"
        class="bg-blue-200 p-2 rounded-xl hover:bg-blue-100 transition-colors duration-300 ring-2 ring-inset flex-grow"
      >
        shrimple
      </button>
    </div>
    <p v-for="item in items">{{ items }}</p>
    <RouterLink to="/login">login</RouterLink>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
const counter = ref(1);
import { supabase } from "../../utils/supabase";
const items: Ref<Array<any> | null> = ref([]);

async function getItems() {
  const { data } = await supabase.from("items").select();
  items.value = data;
  console.log(data);
}

const log = ref("");
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

onMounted(async () => {
  const user = await userStore.getUser();
  console.log(user);
  log.value = user.data.user?.email ? user.data.user.email : "you aren't signed in";
  getItems();
});
</script>

<style scoped></style>
