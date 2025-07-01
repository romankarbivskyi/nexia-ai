/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signInSchema, signUpSchema } from "@/schemas/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface AuthResult {
  message?: string;
  success: boolean;
  data?: any;
  error?: string;
}

export const signInWithPassword = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const supabase = await createClient();

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid input",
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    redirect("/");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const signUpWithPassword = async (
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthResult> => {
  try {
    const supabase = await createClient();

    const result = signUpSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid input",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/sing-in");
};
