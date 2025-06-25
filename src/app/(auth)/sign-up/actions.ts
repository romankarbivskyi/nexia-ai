"use server";

import { signUpSchema } from "@/schemas/auth";
import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export const signUpWithPassword = async (
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const supabase = await createClient();

  const result = signUpSchema.safeParse({
    email,
    password,
    confirmPassword,
  });

  if (!result.success) {
    return new AuthError("Invalid input");
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.log(error);
  }

  return { data, error };
};
