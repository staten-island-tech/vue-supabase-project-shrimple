<template>
  <h1 class="text-xl underline text-center">as shrimple as that</h1>
  <div class="flex justify-center w-full">
    <div
      class="flex flex-wrap justify-around gap-4 w-11/12"
      v-if="loaded"
    >
      <ItemCard
        v-for="item in items"
        :item="item"
        :key="item.id"
        class="flex-grow"
      />
    </div>
    <p v-else>please wait...</p>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { supabase } from "../../utils/supabase";
import ItemCard from "../components/ItemCard.vue";
import type { Item } from "../types/interface";
const items: Ref<Array<Item>> = ref([]);

async function getItems() {
  const { data } = await supabase.from("items").select("name, id, price, stock, image");
  items.value = data as Array<Item>;
  loaded.value = true;
}

const loaded = ref(false);

onMounted(() => {
  getItems();
});
</script>

<style scoped></style>
