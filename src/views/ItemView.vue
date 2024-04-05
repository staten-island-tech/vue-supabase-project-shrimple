<template>
  <div v-if="loaded && item" class="flex flex-col items-center gap-2">
    <h1 class="text-lg">{{ item.name }}</h1>
    <h2 class="font-mono">${{ item.price }}</h2>
    <img :src="item.image" />
    <pre class="font-sans bg-slate-200 w-min">{{ item.description }}</pre>
    <p>
      only <span class="font-bold">{{ item.stock }}</span> left in stock
    </p>
    <button @click="add">BUY!!</button>
  </div>
  <div v-if="error">
    <h1 class="text-red-500 text-3xl">Oho no</h1>
    <p>this item does NOT exist... are you lost?</p>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../../utils/supabase";
import type { Item } from "../types/interface";
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const loaded = ref(false);
const error = ref(false);

const item: Ref<Item | undefined> = ref();
onMounted(async () => {
  const { data } = await supabase.from("items").select().eq("id", props.id);
  if (data) {
    item.value = data[0] as Item;
    loaded.value = true;
  } else {
    error.value = true;
  }
});

import { useCartStore } from "@/stores/cart";
const cartStore = useCartStore();
function add() {
  const user = window.prompt("how many", "1");
  const count = user ? parseInt(user) : 0;
  if (isNaN(count)) {
    alert("try ordering a number 💀💀");
    return;
  }
  cartStore.addToCart(props.id, count);
}
</script>

<style lang="scss" scoped></style>
