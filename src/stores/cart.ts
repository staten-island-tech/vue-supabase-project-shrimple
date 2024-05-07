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
    const user = await userStore.fetchUser();
    if (!user) return;
    console.log("creating cart");
    // if id already has a cart this won't error. cool!
    await supabase.from("carts").insert({ user_id: user.id });
  }

  async function addToCart(id: string, amount: number) {
    console.log("add");
    await fetchCart();
    cart.value[id] ??= 0;
    cart.value[id] += amount;
    await saveCart();
  }

  async function fetchCart() {
    let user = await userStore.fetchUser();
    if (!user) {
      await userStore.createAnonymousUser();
      console.log("done1");
      user = await userStore.fetchUser();
      console.log("done2", user);
    }
    console.log((await supabase.auth.getSession()).data.session?.user);

    // eq needed because admins can see everyone's cart
    const dbCart = await supabase.from("carts").select("data").eq("user_id", user?.id);

    if (!dbCart.data || dbCart.data.length === 0) {
      await createCart();
      cart.value = {};
    } else {
      cart.value = dbCart.data[0].data;
    }

    console.log("fetched", cart.value);
  }

  async function saveCart() {
    console.log("saving", cart.value);
    const user = await userStore.fetchUser();
    if (!user || user.aud !== "authenticated") {
      alert("You don't exist??");
      return;
    }

    for (const [key, value] of Object.entries(cart.value)) {
      if (value < 1) {
        delete cart.value[key];
      }
    }

    await supabase.from("carts").update({ data: cart.value }).eq("user_id", user.id);
    console.log("just saved", cart.value);
  }

  async function placeOrder() {
    console.log(cart.value);
    const user = await userStore.fetchUser();
    if (!user) return;
    if (user?.is_anonymous) {
      alert("you must be signed in to place an order!!!");
      return;
    }

    if (Object.keys(cart.value).length < 1) {
      alert("bro you don't even have anything...");
      return;
    }

    const { error } = await supabase.from("orders").insert({ user_id: user.id, data: cart.value });
    if (!error) {
      cart.value = {};
      await saveCart();
      alert("your order was placed!!");
    }
  }

  return { cart, addToCart, fetchCart, saveCart, placeOrder };
});
