<template>
  <h1 class="text-center text-xl underline">amazing login page</h1>
  <div class="flex flex-col gap-4 items-center">
    <p>{{ signedIn ? `you are signed in as ${signedIn}` : "you aren't signed in" }}</p>
    <div class="flex flex-col gap-1">
      <button @click="userStore.anonToUser" v-if="!signedIn">CREATE ACCOUNT</button>
      <button @click="userStore.signIn" v-if="!signedIn">LOGIN</button>
      <button @click="userStore.signOut" v-if="signedIn">logout</button>
    </div>
    <details class="bg-slate-200 p-4 rounded-md w-4/5" v-if="!signedIn">
      <summary>What's the difference?</summary>
      <div class="border-t-2 mt-2 pt-2 border-black">
        <ul class="list-inside list-disc">
          <li>
            <span class="font-bold">Create account</span>: If you haven't signed in before, use this. Your current cart will be saved.
            <span class="underline">Do not use this option if you have signed in before.</span>
          </li>
          <li><span class="font-bold">Login</span>: If you have signed in before, use this. Your current cart will be lost.</li>
          <output
            >You currently have <span class="font-bold">{{ length }}</span> item{{ length === 1 ? "" : "s" }} in your cart.
          </output>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { Ref } from "vue";
import { useUserStore } from "../stores/user";
import { useCartStore } from "../stores/cart";
import type { UserResponse } from "@supabase/supabase-js";
const userStore = useUserStore();
const cartStore = useCartStore();
const signedIn = ref(false);
const length = ref(0);
const user: Ref<UserResponse | undefined> = ref();

onMounted(async () => {
  user.value = await userStore.user;
  if (user.value.data.user?.identities && user.value.data.user.identities[0]) {
    signedIn.value = user.value.data.user.identities[0].identity_data ? user.value.data.user.identities[0].identity_data.name : "Mario from Mario Bros.";
  }
  await cartStore.fetchCart(false);
  length.value = Object.keys(cartStore.shoppingCart()).length;
});
</script>

<style scoped></style>
