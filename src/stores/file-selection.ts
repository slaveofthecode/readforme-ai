"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileSelectionState {
  selectedFileIds: string[];
  toggleFile: (id: string) => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearAll: () => void;
  removeFiles: (ids: string[]) => void;
  isSelected: (id: string) => boolean;
}

export const useFileSelection = create<FileSelectionState>()(
  persist(
    (set, get) => ({
      selectedFileIds: [],
      toggleFile: (id) =>
        set((state) => ({
          selectedFileIds: state.selectedFileIds.includes(id)
            ? state.selectedFileIds.filter((fid) => fid !== id)
            : [...state.selectedFileIds, id],
        })),
      selectFile: (id) =>
        set((state) => ({
          selectedFileIds: state.selectedFileIds.includes(id)
            ? state.selectedFileIds
            : [...state.selectedFileIds, id],
        })),
      deselectFile: (id) =>
        set((state) => ({
          selectedFileIds: state.selectedFileIds.filter((fid) => fid !== id),
        })),
      selectAll: (ids) => set({ selectedFileIds: ids }),
      clearAll: () => set({ selectedFileIds: [] }),
      removeFiles: (ids) =>
        set((state) => ({
          selectedFileIds: state.selectedFileIds.filter(
            (fid) => !ids.includes(fid),
          ),
        })),
      isSelected: (id) => get().selectedFileIds.includes(id),
    }),
    {
      name: "readforme-file-selection",
      partialize: (state) => ({ selectedFileIds: state.selectedFileIds }),
    },
  ),
);
