/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modal: "settings" | "change_password" | null;
  modalProps: Record<string, any>;
  openModal: (
    modal: "settings" | "change_password",
    props?: Record<string, any>,
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  modal: null,
  modalProps: {},
  openModal: (modal, props = {}) =>
    set({ isOpen: true, modal, modalProps: props }),
  closeModal: () => set({ isOpen: false, modal: null, modalProps: {} }),
}));
