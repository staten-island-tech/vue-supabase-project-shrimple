import { computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../utils/supabase";
import type { User } from "@supabase/supabase-js";

export const useUserStore = defineStore("user", () => {
  let dbUser: User | undefined | null;

  async function fetchUser() {
    dbUser = (await supabase.auth.getSession()).data.session?.user;
    return dbUser;
  }

  const isAdmin = computed(async () => {
    console.log("checking for admin");
    if (!dbUser) dbUser = (await supabase.auth.getUser()).data.user;
    if (dbUser?.aud !== "authenticated") {
      return false;
    }
    const response = await supabase.from("admins").select();
    if (!response.data) return false;
    return response.data.length > 0;
  });

  async function anonToUser() {
    if (dbUser && dbUser.is_anonymous) {
      console.log("anonymous user");
      const { data, error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      });
      if (data && !error) dbUser = (await supabase.auth.getUser()).data.user;
    } else {
      console.log("no user at all");
      await signIn();
    }
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (data && !error) dbUser = (await supabase.auth.getUser()).data.user;
  }

  async function signOut() {
    await supabase.auth.signOut({ scope: "local" });
    window.location.reload();
  }

  async function createAnonymousUser() {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      console.log("NO SESSION");
      const response = await supabase.auth.getUser();
      if (!response.data.user || response.error) {
        console.log("creating anonymous user...");
        await supabase.auth.signInAnonymously();
      }
    }
    dbUser = (await supabase.auth.getUser()).data.user;
    console.log(dbUser);
  }

  return { fetchUser, anonToUser, signIn, signOut, createAnonymousUser, isAdmin };
});
