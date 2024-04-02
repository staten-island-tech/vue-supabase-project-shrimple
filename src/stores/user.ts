import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";

export const useUserStore = defineStore("user", () => {
  async function signIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.log(data);
    console.log(error);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  async function getUser() {
    const user = await supabase.auth.getUser();
    return user;
  }

  async function getCart() {}

  return { signIn, signOut, getUser };
});
