import { Model } from "@/types/model";
import { create } from "zustand";

interface ModelState {
  models: Model[] | null;
  activeModel: Model | null;
  setModels: (models: Model[] | null) => void;
  setActiveModel: (model: Model | null) => void;
}

export const useModelStore = create<ModelState>()((set) => ({
  models: null,
  activeModel: null,
  setModels: (models) => set({ models }),
  setActiveModel: (model) => set({ activeModel: model }),
}));
