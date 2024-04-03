import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";
import { useUserStore } from "./user";
const userStore = useUserStore();

export const useCartStore = defineStore("cart", () => {
  let cart: { [key: string]: number } = {};
  const shoppingCart = computed(() => cart);

  async function addToCart(id: string, amount: number) {
    console.log("add");
    await fetchCart();
    cart[id] ??= 0;
    cart[id] += amount;
    await saveCart();
  }

  async function createCart() {
    await supabase.from("carts").insert({ data: "" });
  }

  async function fetchCart() {
    console.log("STart");
    const user = await userStore.user;
    console.log(user);
    if (!user || !user.data.user) return;

    const dbCart = await supabase.from("carts").select("data").eq("id", user.data.user.id);

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
      alert("You are not signed in!! Anonymous carts maybe coming later...");
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

  return { shoppingCart, addToCart, fetchCart, saveCart };
});
