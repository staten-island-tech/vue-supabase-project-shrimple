<template>
  <div v-if="loaded" class="flex flex-col items-center p-2 gap-2">
    <EditCard v-for="item in items" :key="item.id" :item="item" class="max-w-screen-md" />
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../../../utils/supabase";
import { ref, reactive, onMounted } from "vue";
import type { Item } from "@/types/interface";
import EditCard from "../../components/EditCard.vue";
let items: Array<Item> | null = reactive([]);

const loaded = ref(false);

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
onMounted(async () => {
  const admin = await userStore.isAdmin;
  if (!admin) {
    alert("You're really not supposed to be here...");
    window.location.href = window.location.origin;
    return;
  }
  const data = await supabase.from("items").select();
  console.log(data);
  items = data.data;
  loaded.value = true;
});
</script>

<style scoped></style>
