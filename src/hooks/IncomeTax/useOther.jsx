import { create } from "zustand";

const useOther = create((set) => ({
  totalHeads: 0,
  setTotalHeads: (newValue) => {
    set({ totalHeads: newValue });
  },
}));

export default useOther;
