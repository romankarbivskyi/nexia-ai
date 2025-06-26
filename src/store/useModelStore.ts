import { Model } from "@/types/model";
import { create } from "zustand";

interface ModelState {
  model: Model | null;
  setModel: (model: Model | null) => void;
}

export const useModelStore = create<ModelState>()((set) => ({
  model: null,
  setModel: (model) => set(() => ({ model })),
}));
