<template>
  <div>
    <RouterLink to="/"><p class="text-center">go home</p></RouterLink>
    <div v-if="loaded">
      <!-- https://github.com/supabase/auth-js/pull/871 -->
      <!-- supabase stop LYING to me. is_anonymous is REAL -->
      <p class="text-red-500" v-if="user?.data.user?.is_anonymous">you aren't signed in; your cart may be lost FOREVER!</p>
      <p>
        {{ cart }}
      </p>
    </div>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>please wait...</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import type { UserResponse } from "@supabase/supabase-js";
const userStore = useUserStore();
const cartStore = useCartStore();

const loaded = ref(false);
const error = ref("");
const cart = ref();
const user: Ref<UserResponse | undefined> = ref(undefined);

onMounted(async () => {
  user.value = (await userStore.user) as UserResponse;
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
