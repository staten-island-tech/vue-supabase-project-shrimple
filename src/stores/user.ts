import { computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";
import type { UserResponse } from "@supabase/supabase-js";

export const useUserStore = defineStore("user", () => {
  let dbUser: UserResponse;

  const user = computed(async () => {
    // if not signed in, use anonymous user (for cart to work)
    if (!dbUser) {
      dbUser = await supabase.auth.getUser();
      if (!dbUser) {
        console.log("creating anonymous user...");
        await supabase.auth.signInAnonymously();
        dbUser = await supabase.auth.getUser();
      }
    }
    return dbUser;
  });

  const isAdmin = computed(async () => {
    if (dbUser.data.user?.aud !== "authenticated") {
      return false;
    }
    const response = await supabase.from("admins").select().eq("id", dbUser.data.user.id);
    if (!response.data) return false;
    return response.data.length > 0;
  });

  async function signIn() {
    // async function oauth() {
    //   const { data, error } = await supabase.auth.signInWithOAuth({
    //     provider: "google",
    //     options: {
    //       redirectTo: window.location.href,
    //     },
    //   });
    // }
    // if (!dbUser) {
    //   await oauth();
    // }
    // if (dbUser.data.user. )

    dbUser = await supabase.auth.getUser();
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    localStorage.clear();
    window.location.reload();
  }

  return { user, signIn, signOut, isAdmin };
});
