import { create } from "zustand";

const usePerformance = create((set) => ({
  goalSettingLoading: false,
  setGoalSettingLoading: (loading) => set({ loading }),
}));

export default usePerformance;
