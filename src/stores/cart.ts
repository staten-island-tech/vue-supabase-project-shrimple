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
    // console.log("creating cart");
    // if id already has a cart this won't error. cool!
    await supabase.from("carts").insert({ user_id: user.id });
  }

  async function addToCart(id: string, amount: number) {
    // console.log("add");
    await fetchCart();
    cart.value[id] ??= 0;
    cart.value[id] += amount;
    await saveCart();
  }

  // get current user's cart
  async function fetchCart() {
    let user = await userStore.fetchUser();
    if (!user) {
      await userStore.createAnonymousUser();
      // console.log("done1");
      user = await userStore.fetchUser();
      // console.log("done2", user);
    }
    // console.log((await supabase.auth.getSession()).data.session?.user);

    // eq needed because admins can see everyone's cart
    const dbCart = await supabase.from("carts").select("data").eq("user_id", user?.id);

    if (!dbCart.data || dbCart.data.length === 0) {
      await createCart();
      cart.value = {};
    } else {
      cart.value = dbCart.data[0].data;
    }

    // console.log("fetched", cart.value);
  }

  async function saveCart() {
    // console.log("saving", cart.value);
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
    // console.log("just saved", cart.value);
  }

  async function placeOrder() {
    // console.log(cart.value);
    const user = await userStore.fetchUser();
    if (!user) return;
    // @ts-ignore
    if (user?.is_anonymous) {
      return "anon";
    }

    if (Object.keys(cart.value).length < 1) {
      return "empty";
    }

    // if someone already has unfulfilled order, don't let them order
    // there is also a function and trigger in place for this (RLS does not play nice when you refer to the table it's on)
    // console.log(user);
    const { data } = await supabase.from("orders").select("user_id, status").eq("user_id", user.id);
    if (!data) return;
    if (data.filter((order) => order.status !== "fulfilled").length > 0) {
      return "order already exists";
    }

    const contact = (await supabase.from("users").select("user_id, contact").eq("user_id", user.id)).data;
    if (!contact || (contact[0].contact as string).trim() === "") return "no contact";

    const { error } = await supabase.from("orders").insert({ user_id: user.id, data: cart.value });
    if (!error) {
      cart.value = {};
      await saveCart();

      return "yay";
    }
  }

  return { cart, addToCart, fetchCart, saveCart, placeOrder };
});
