import { create } from "zustand";

export const useEmployeeListStore = create((set) => ({
  employeeList: [],
  setEmployeeList: (employeeList) => set({ employeeList }),
  addedEmployeeList: [],
  setAddedEmployeeList: (addedEmployeeList) => set({ addedEmployeeList }),
  page: 0,
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
  decrementPage: () => set((state) => ({ page: state.page - 1 })),
}));

export default useEmployeeListStore;
