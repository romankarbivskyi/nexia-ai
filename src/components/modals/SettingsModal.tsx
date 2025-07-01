"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useModalStore } from "@/store/useModalStore";
import { deleteAccount } from "@/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAllChats } from "@/actions/chat";
import { useChatsStore } from "@/store/useChatsStore";
import { createClient } from "@/utils/supabase/client";

interface SettingsModalProps {
  defaultTab?: "general" | "profile";
}

export default function SettingsModal({
  defaultTab = "general",
}: SettingsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, clearUser } = useUserStore();
  const { openModal, closeModal } = useModalStore();
  const { refreshChats } = useChatsStore();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone and will delete all your data including chats and messages.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (result.success) {
        toast.success("Account deleted successfully");
        clearUser();
        closeModal();
        router.push("/sign-in");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch {
      toast.error("An error occurred while deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllChats = async () => {
    if (
      !confirm(
        "Are you sure you want to delete all your chats? This action cannot be undone and will delete all your messages.",
      )
    ) {
      return;
    }

    try {
      const result = await deleteAllChats();

      if (result.success) {
        router.replace("/");
        const supabase = createClient();
        if (user?.id) {
          refreshChats(supabase, user.id);
        }
        closeModal();
        toast.success("All chats deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete chats");
      }
    } catch {
      toast.error("An error occurred while deleting chats");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="profile" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Name</span>
            <span className="text-sm font-medium">
              {user?.user_metadata.full_name || user?.email?.split("@")[0]}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">Email</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">Password change</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal("change_password")}
            >
              Change
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">Delete all chats</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAllChats}
            >
              Delete all
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">Delete account</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
