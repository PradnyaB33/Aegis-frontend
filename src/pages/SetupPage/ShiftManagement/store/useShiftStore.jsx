import { create } from "zustand";

const useShiftStore = create((set) => ({
  shiftName: "",
  setShiftName: (newShiftName) => set({ shiftName: newShiftName }),
}));

export default useShiftStore;
