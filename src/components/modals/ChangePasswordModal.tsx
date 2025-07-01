import { useState } from "react";
import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { changePassword } from "@/actions/user";
import { useUserStore } from "@/store/useUserStore";
import { useModalStore } from "@/store/useModalStore";
import { changePasswordSchema } from "@/schemas/user";

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();
  const { closeModal } = useModalStore();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsLoading(true);

    try {
      const result = await changePassword(
        values.currentPassword,
        values.newPassword,
      );

      if (result.success) {
        if (result.data) {
          setUser(result.data);
        }
        toast.success("Password changed successfully.");
        form.reset();
        closeModal();
      } else {
        toast.error(result.error || "Failed to change password.");
      }
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while changing the password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Change Password</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    disabled={isLoading}
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
