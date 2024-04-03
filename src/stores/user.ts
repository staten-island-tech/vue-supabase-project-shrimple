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

  async function isAdmin() {
    const session = await getSession();
    if (!session.data.session) return false;

    const response = await supabase.from("admins").select().eq("id", session.data.session.user.id);
    if (!response.data) return false;
    return response.data.length > 0;
  }

  return { signIn, signOut, getSession, isAdmin };
});
