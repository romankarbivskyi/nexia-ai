"use server";

import { signInSchema } from "@/schemas/auth";
import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const signInWithPassword = async (email: string, password: string) => {
  const supabase = await createClient();

  const result = signInSchema.safeParse({
    email,
    password,
  });

  if (!result.success) {
    return {
      data: {
        user: null,
        session: null,
      },
      error: new AuthError("Invalid input"),
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return error;
  }

  if (data) {
    await redirect("/");
  }
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.log(error);
    return error;
  }

  if (data.url) {
    redirect(data.url);
  }
};
