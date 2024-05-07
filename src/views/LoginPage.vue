<template>
  <h1 class="text-center text-xl underline">amazing login page</h1>
  <div class="flex flex-col gap-4 items-center">
    <p>{{ signedIn ? `you are signed in as ${signedIn}` : "you aren't signed in" }}</p>
    <div class="flex flex-col gap-1 items-center">
      <button
        @click="userStore.anonToUser"
        v-if="!signedIn"
      >
        CREATE ACCOUNT
      </button>
      <button
        @click="signIn"
        v-if="!signedIn"
      >
        LOGIN
      </button>
      <div
        v-if="signedIn"
        class="flex flex-col items-center"
      >
        <button @click="userStore.signOut">logout</button>
        <label class="flex gap-2 items-center">
          Please enter your contact information; we will contact you ONLY to process your order:
          <input
            type="text"
            ref="contact"
            @change="save"
          />
        </label>
      </div>
    </div>
    <details
      class="bg-slate-200 p-4 rounded-md w-4/5"
      v-if="!signedIn"
    >
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
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { useUserStore } from "../stores/user";
import { useCartStore } from "../stores/cart";
import type { Cart } from "@/types/interface";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const cartStore = useCartStore();
const signedIn = ref(false);
const length = ref(0);
import type { User } from "@supabase/supabase-js";
const user: Ref<User | undefined> = ref();
const { cart } = storeToRefs(cartStore);

const contact: Ref<HTMLInputElement | null> = ref(null);

onMounted(async () => {
  user.value = await userStore.fetchUser();
  if (user.value?.identities && user.value?.identities[0]) {
    signedIn.value = user.value?.identities[0].identity_data ? user.value?.identities[0].identity_data.name : "Mario from Mario Bros.";
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;
  if (!signedIn.value && params.get("error_code") === "422") {
    // user failed sign in (anontouser instead of login)
    alert("your sign in failed... try logging in instead");
    window.location.assign(url.origin + url.pathname);
    return;
  }
  if (url.hash) {
    localStorage.clear();
    window.location.assign(url.origin + url.pathname);
  }

  if (!user.value) return;
  console.log(user.value);

  const { data } = await supabase.from("users").select().eq("user_id", user.value.id);
  if (data && contact.value) contact.value.value = data[0].contact;

  await cartStore.fetchCart();
  const storedCart = localStorage.getItem("cart");
  if (storedCart) localStorage.removeItem("cart");
  if (signedIn.value && storedCart) {
    const parsedCart = JSON.parse(storedCart) as Cart;
    await cartStore.fetchCart();
    const dbCart = cart.value;
    const length = Object.keys(parsedCart).length;
    if (length) {
      const prompt = confirm(
        `
        You had ${length} item${length === 1 ? "" : "s"} in your cart before signing in.
        Would you like to overwrite your current cart (${Object.keys(dbCart).length} item${Object.keys(dbCart).length === 1 ? "" : "s"}) with these items?
        `
      );
      if (prompt) {
        cart.value = parsedCart;
        await cartStore.saveCart();
      }
    }
  }
  length.value = Object.keys(cart.value).length;
});

async function signIn() {
  localStorage.setItem("cart", JSON.stringify(cart.value));
  await userStore.signIn();
}

import { supabase } from "../../utils/supabase";
async function save() {
  console.log("JOemama");
  const user = await userStore.fetchUser();
  if (!contact.value || !user) return;
  console.log(contact.value);
  await supabase.from("users").update({ contact: contact.value.value }).eq("user_id", user.id);
}
</script>

<style scoped></style>
