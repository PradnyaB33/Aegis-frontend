import { create } from "zustand";

const useHourHook = create((set) => ({
  justify: "",
  leave: "",
  shift: "",

  setJustify: (justify) => set({ justify }),
  setLeave: (leave) => set({ leave }),
  setShift: (shift) => set({ shift }),
}));

export default useHourHook;
