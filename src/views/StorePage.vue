<template>
  <h1 class="text-xl underline text-center">as shrimple as that</h1>
  <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
  <div class="flex items-center justify-around" v-if="loaded">
    <ItemCard v-for="item in items" :item="item" :key="item.id" />
  </div>
  <p v-else class="text-align">please wait...</p>
  <RouterLink to="/cart"><p class="text-center">view cart</p></RouterLink>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { supabase } from "../../utils/supabase";
import ItemCard from "../components/ItemCard.vue";
import type { Item } from "../types/interface";
const items: Ref<Array<Item>> = ref([]);

async function getItems() {
  const { data } = await supabase.from("items").select();
  items.value = data as Array<Item>;
  loaded.value = true;
}

const loaded = ref(false);

onMounted(() => {
  getItems();
});
</script>

<style scoped></style>
