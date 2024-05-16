<template>
  <div
    v-if="loaded"
    class="flex flex-col items-center"
  >
    <div class="w-fit flex flex-col items-center p-2 gap-4">
      <CartCard
        v-for="[id, qty] in Object.entries(cart)"
        :key="id"
        :item_id="id"
        :quantity="qty"
        @explode="(id: string) => delete cart[id]"
      />
    </div>
    <!-- https://github.com/supabase/auth-js/pull/871 -->
    <!-- supabase stop LYING to me. is_anonymous is REAL -->
    <p
      class="text-red-500"
      v-if="user?.is_anonymous || !user"
    >
      you aren't signed in; your cart may be lost FOREVER! (A really long time!)
    </p>
    <button
      :disabled="Object.keys(cart).length < 1"
      :title="Object.keys(cart).length < 1 ? 'your cart is empty...' : ''"
      @click="order"
    >
      place order
    </button>
  </div>
  <p v-else>
    {{ error }}
  </p>
  <p v-if="orderStatus">
    {{ orderStatus }}
  </p>
</template>

<script setup lang="ts">
import CartCard from "../components/CartCard.vue";

import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const cartStore = useCartStore();

const loaded = ref(false);
const error = ref("please wait...");
const orderStatus = ref("");
const { cart } = storeToRefs(cartStore);
import type { User } from "@supabase/supabase-js";
const user: Ref<User | undefined> = ref(undefined);

import { supabase } from "@/../utils/supabase";
onMounted(async () => {
  // update dbUser before fetching cart
  user.value = await userStore.fetchUser();
  await cartStore.fetchCart();
  if (!cart.value) {
    // honestly. if it gets this bad just give up. no one's cart should ever be just gone
    alert("your cart exploded!!! oh dear.");
    return;
  }
  loaded.value = true;

  if (!user.value) return;
  const orders = (await supabase.from("orders").select("user_id,status").eq("user_id", user.value.id)).data;
  if (!orders) return;
  console.log(orders);
  if (orders.filter((item) => item.status !== "fulfilled").length > 0) {
    orderStatus.value = "you have an order already";
  }
  console.log(orderStatus.value);
});

async function order() {
  const prompt = confirm(
    "Are you sure you would like to place your order? You will not be able to make any more orders until your current order is fulfilled. You will also not be able to edit your order after it is placed."
  );
  if (!prompt) return;
  const order = await cartStore.placeOrder();
  switch (order) {
    case "yay":
      cart.value = {};
      alert("your order was placed!!");
      break;
    case "order already exists":
      alert("you've already placed an order!!");
      break;
    case "anon":
      alert("you must be signed in to place an order!!!");
      break;
    case "no contact":
      alert("please set your contact information on the account page!!");
      break;
    case "empty":
      alert("you don't have anything in your cart...");
      break;
    default:
      alert("there have been unforeseen consequences :(");
  }
}
</script>

<style scoped>
* {
  text-align: center;
}
</style>
