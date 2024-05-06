<template>
  <div class="w-full flex flex-col items-center p-2">
    <CartCard
      v-for="[id, qty] in Object.entries(cart)"
      :key="id"
      :item_id="id"
      :quantity="qty"
      @explode="(id) => delete cart[id]"
    />
  </div>
</template>

<script setup lang="ts">
import CartCard from "./CartCard.vue";

import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import type { Cart } from "@/types/interface";
const cart: Ref<Cart> = ref({});
const props = defineProps({
  user_id: String,
});
import { supabase } from "../../utils/supabase";

onMounted(async () => {
  const response = await supabase.from("carts").select().eq("user_id", props.user_id);
  if (!response.data) return;
  cart.value = response.data[0].data;
  console.log(cart.value);
});
</script>

<style scoped></style>
