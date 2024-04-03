import { computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";

export const useUserStore = defineStore("user", () => {
  let dbUser;

  const user = computed(() => dbUser);

  const isAdmin = computed(async () => {
    if (!dbUser || dbUser.data.user.aud !== "authenticated") {
      return false;
    }
    const response = await supabase.from("admins").select().eq("id", dbUser.data.user.id);
    if (!response.data) return false;
    return response.data.length > 0;
  });

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    dbUser ??= await supabase.auth.getUser();
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    localStorage.clear();
    window.location.reload();
  }

  return { user, signIn, signOut, isAdmin };
});
