"use client";

import { useUserStore } from "@/store/useUserStore";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useModalStore } from "@/store/useModalStore";

interface SettingsModalProps {
  defaultTab?: "general" | "profile";
}

export default function SettingsModal({
  defaultTab = "general",
}: SettingsModalProps) {
  const { user } = useUserStore();
  const { openModal } = useModalStore();

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
            <Button variant="destructive" size="sm">
              Delete all
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">Delete account</span>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
