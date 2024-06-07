<template>
  <!-- <h1 class="text-xl underline text-center">as shrimple as that</h1> -->
  <div class="flex flex-col justify-center w-full">
    <div class="text-center">
      <h1 class="bold underline text-2xl">all our soaps</h1>
      <h2 v-if="loaded" class="mb-4">(all {{ stock }} of them)</h2>
    </div>
    <div
      class="flex flex-wrap gap-8 px-4"
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
const stock = ref(0);

async function getItems() {
  { 
    const { data } = await supabase.from("items").select("name, id, stock, price, image").order("name");
    items.value = data?.filter((item) => item.stock>0) as Array<Item>;
  }

  {  
    const {data} = await supabase.from("items").select("stock.sum()")
    // console.log(data)
    // @ts-ignore that is literally how you use aggregate functions. go away typescript
    if (data) stock.value = data[0].sum;
  }
  loaded.value = true;
}

const loaded = ref(false);

onMounted(() => {
  getItems();
});
</script>

<style scoped></style>
