import { create } from "zustand";

const useIncomeHouse = create((set) => ({
  totalHeads: 0,
  setTotalHeads: (newValue) => {
    set({ totalHeads: newValue });
  },
}));

export default useIncomeHouse;
