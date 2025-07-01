/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { changePasswordSchema } from "@/schemas/user";
import { ActionResult } from "@/types/action";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult<User>> => {
  try {
    const supabase = await createClient();

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid input",
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: "Current password is incorrect" };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getCurrentUser = async (): Promise<ActionResult> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data.user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteAccount = async (): Promise<ActionResult> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error: rpcError } = await supabase.rpc("delete_user_account", {
      input_user_id: user.id,
    });

    if (rpcError) {
      return { success: false, error: rpcError.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
