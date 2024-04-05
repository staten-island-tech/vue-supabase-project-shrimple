import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";
import { useUserStore } from "./user";
import type { Cart } from "@/types/interface";
const userStore = useUserStore();

export const useCartStore = defineStore("cart", () => {
  const cart: Ref<Cart> = ref({});

  async function createCart() {
    const user = await userStore.user;
    if (!user.data.user) return;
    console.log("creating cart");
    // if id already has a cart this won't error. cool!
    await supabase.from("carts").insert({ id: user.data.user.id });
  }

  async function addToCart(id: string, amount: number) {
    console.log("add");
    await fetchCart();
    cart.value[id] ??= 0;
    cart.value[id] += amount;
    await saveCart();
  }
  async function fetchCart() {
    const user = await userStore.user;
    if (!user || !user.data.user) return;

    const dbCart = await supabase.from("carts").select("data");

    if (!dbCart.data || dbCart.data.length === 0) {
      await createCart();
      cart.value = {};
    } else {
      cart.value = JSON.parse(dbCart.data[0].data);
    }

    console.log("fetched", cart.value);
  }

  async function saveCart() {
    console.log("saving", cart.value);
    const user = await userStore.user;
    if (!user || user.data.user?.aud !== "authenticated") {
      alert("You are not signed in somehow??");
      return;
    }

    for (const [key, value] of Object.entries(cart.value)) {
      if (value === 0) {
        delete cart.value[key];
      }
    }

    await supabase.from("carts").update({ data: JSON.stringify(cart.value) });
    console.log("just saved", cart.value);
  }

  return { cart, addToCart, fetchCart, saveCart };
});
