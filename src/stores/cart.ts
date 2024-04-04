import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";
import { useUserStore } from "./user";
import type { cart } from "@/types/interface";
const userStore = useUserStore();

export const useCartStore = defineStore("cart", () => {
  let cart: cart = reactive({});
  function shoppingCart() {
    return cart;
  }

  async function createCart() {
    const user = await userStore.user;
    if (!user.data.user) return;
    console.log("creating cart");
    // if id already has a cart this won't error. cool!
    await supabase.from("carts").insert({ id: user.data.user.id });
  }

  async function addToCart(id: string, amount: number) {
    console.log("add");
    await fetchCart(true);
    cart[id] ??= 0;
    cart[id] += amount;
    await saveCart();
  }

  async function setCart(c: cart) {
    cart = c;
    await saveCart();
  }

  async function fetchCart(force: boolean) {
    const user = await userStore.user;
    if (!user || !user.data.user) return;

    // an attempt to cache the cart. stuff like loginpage should already have a fetched cart (you just signed in), so don't make another api call
    if (!force && Object.keys(cart).length > 0) return;

    const dbCart = await supabase.from("carts").select("data");
    console.log(dbCart);

    if (!dbCart.data || dbCart.data.length === 0) {
      await createCart();
      cart = {};
    } else {
      cart = JSON.parse(dbCart.data[0].data);
    }

    console.log("fetched", cart);
  }

  async function saveCart() {
    console.log("saving", cart);
    const user = await userStore.user;
    if (!user || user.data.user?.aud !== "authenticated") {
      alert("You are not signed in somehow??");
      return;
    }

    for (const [key, value] of Object.entries(cart)) {
      if (value === 0) {
        delete cart[key];
      }
    }

    await supabase
      .from("carts")
      .update({ data: JSON.stringify(cart) })
      .eq("id", user.data.user.id);
    console.log("just saved", cart);
  }

  return { shoppingCart, setCart, addToCart, fetchCart, saveCart };
});
