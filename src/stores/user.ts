import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";

export const useUserStore = defineStore("user", () => {
  async function signIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    window.location.reload();
  }

  async function getSession() {
    return await supabase.auth.getSession();
  }

  return { signIn, signOut, getSession };
});
