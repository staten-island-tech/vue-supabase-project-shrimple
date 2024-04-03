<template>
  <div>
    <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
    <p v-if="loaded">{{ cart }}</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>please wait...</p>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../../utils/supabase";
import { useCartStore } from "@/stores/cart";
import { ref, onMounted } from "vue";
const cartStore = useCartStore();

const loaded = ref(false);
const error = ref("");
const cart = ref();

onMounted(async () => {
  await cartStore.fetchCart();
  if (!cartStore.shoppingCart) {
    error.value = "Your cart exploded. Oho no";
    return;
  }
  cart.value = cartStore.shoppingCart;
  loaded.value = true;
});
</script>

<style scoped></style>
