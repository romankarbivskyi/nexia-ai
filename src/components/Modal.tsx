"use client";

import { useModalStore } from "@/store/useModalStore";
import { Dialog, DialogContent } from "./ui/dialog";
import { lazy } from "react";

const SettingsModal = lazy(() => import("@/components/modals/SettingsModal"));
const ChangePassword = lazy(
  () => import("@/components/modals/ChangePasswordModal"),
);

export default function Modal() {
  const { isOpen, closeModal, modal, modalProps } = useModalStore();

  const renderModalContent = () => {
    switch (modal) {
      case "settings":
        return <SettingsModal {...modalProps} />;
      case "change_password":
        return <ChangePassword {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>{renderModalContent()}</DialogContent>
    </Dialog>
  );
}
