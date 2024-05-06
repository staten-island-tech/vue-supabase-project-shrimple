<template>
  <div>
    <div
      v-if="loaded"
      class="flex flex-col items-center"
    >
      <EditCart :user_id="user!.id"></EditCart>
      <!-- https://github.com/supabase/auth-js/pull/871 -->
      <!-- supabase stop LYING to me. is_anonymous is REAL -->
      <p
        class="text-red-500"
        v-if="user?.is_anonymous"
      >
        you aren't signed in; your cart may be lost FOREVER! (A really long time!)
      </p>
      <button
        :disabled="Object.keys(cart).length < 1"
        :title="Object.keys(cart).length < 1 ? 'your cart is empty...' : ''"
        @click="cartStore.placeOrder"
      >
        place order
      </button>
    </div>
    <p v-else>{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const cartStore = useCartStore();

const loaded = ref(false);
const error = ref("please wait...");
const { cart } = storeToRefs(cartStore);
import type { User } from "@supabase/supabase-js";
const user: Ref<User | undefined> = ref(undefined);

onMounted(async () => {
  user.value = await userStore.fetchUser();
  await cartStore.fetchCart();
  if (!cart.value || !user.value?.id) {
    error.value = "please wait a little longer...";
    if (!cart.value) alert("your cart exploded!!! oh dear.");
    return;
  }
  loaded.value = true;
});

import EditCart from "@/components/EditCart.vue";
</script>

<style scoped></style>
