<template>
  <div
    v-if="loaded"
    class="flex flex-col items-center p-2 gap-2 w-full"
  >
  <h1 class="bold underline text-2xl">all soaps</h1>
    <EditCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      class="w-full"
      @update="updateItem"
      @del="deleteItem"
    />
    <button @click="add">ADD ITEM</button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../../../utils/supabase";
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import type { Item } from "@/types/interface";
import EditCard from "../../components/admin/EditCard.vue";
let items: Ref<Array<Item>> = ref([]);

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
  const data = await supabase.from("items").select().order("name");
  items.value = data.data as Item[];
  loaded.value = true;
});

async function updateItem(oldid: string, newid: string) {
  const data = await supabase.from("items").select().eq("id", newid);
  if (!data.data) {
    alert("something went wrong :(");
    return;
  }
  items.value[items.value.findIndex((item) => item.id === oldid)] = data.data[0] as Item;
  loaded.value = true;
}

function add() {
  if (!items.value) return;
  console.log("adding item");
  items.value.push({
    // placeholder id for :key. supabase will generate its own
    id: "UNSAVED " + Date.now(),
    name: "New Item",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  console.log(items.value);
}

async function deleteItem(id: string) {
  const prompt = confirm(`you're sure you want to delete ${items.value.filter((item) => item.id === id)[0].name}?`);
  if (!prompt) return;
  items.value = items.value.filter((item) => item.id !== id);
  if (!id.startsWith("UNSAVED")) {
    const { error } = await supabase.from("items").delete().eq("id", id);
    console.log(error);
    if (error) {
      alert("something went wrong??");
    }
  }
}
</script>

<style scoped></style>
