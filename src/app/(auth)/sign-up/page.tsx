"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { signUpWithPassword } from "@/actions/auth";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({
    email,
    password,
    confirmPassword,
  }: SignUpFormValues) => {
    setIsLoading(true);

    try {
      const result = await signUpWithPassword(email, password, confirmPassword);

      if (result?.error) {
        toast.error(result.error || "Failed to sign in. Please try again.");
      } else if (result?.success) {
        toast.success(
          "Signed up successfully! Please check your email to verify your account.",
        );
        router.push("/");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-4 max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-stretch justify-center space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-xs text-zinc-500">
              By signing up or logging in, you consent to NexiaAI&apos;s Terms
              of Use and Privacy Policy.
            </span>
            <Button disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="flex justify-end">
          <Link href="/sign-in" className="text-xs underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
