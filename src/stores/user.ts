import { computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";
import type { UserResponse } from "@supabase/supabase-js";

export const useUserStore = defineStore("user", () => {
  let dbUser: UserResponse;

  const user = computed(async () => {
    // if not signed in, use anonymous user (for cart to work)
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      console.log("NO SESSION");
      const response = await supabase.auth.getUser();
      if (!response.data.user || response.error) {
        console.log("creating anonymous user...");
        await supabase.auth.signInAnonymously();
      } else {
        dbUser = response;
      }
    }
    if (!dbUser) dbUser = await supabase.auth.getUser();
    return dbUser;
  });

  const isAdmin = computed(async () => {
    if (!dbUser) dbUser = await supabase.auth.getUser();
    if (dbUser.data.user?.aud !== "authenticated") {
      return false;
    }
    const response = await supabase.from("admins").select();
    if (!response.data) return false;
    return response.data.length > 0;
  });

  async function anonToUser() {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (data && !error) dbUser = await supabase.auth.getUser();
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (data && !error) dbUser = await supabase.auth.getUser();
  }

  async function signOut() {
    await supabase.auth.signOut({ scope: "local" });
    localStorage.clear();
    window.location.reload();
  }

  return { user, anonToUser, signIn, signOut, isAdmin };
});
