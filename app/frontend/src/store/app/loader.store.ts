import { create } from "zustand";

interface LoaderState {
  loader: Record<string, boolean>;

  isLoading: (key: string) => boolean;
  startLoader: (key: string) => void;
  stopLoader: (key: string) => void;
}

export const useLoaderStore = create<LoaderState>((set, get) => ({
  loader: {},

  isLoading: (key: string) => {
    return !!get().loader[key];
  },

  startLoader: (key: string) => {
    set((state) => ({
      loader: {
        ...state.loader,
        [key]: true,
      },
    }));
  },

  stopLoader: (key: string) => {
    set((state) => ({
      loader: {
        ...state.loader,
        [key]: false,
      },
    }));
  },
}));
