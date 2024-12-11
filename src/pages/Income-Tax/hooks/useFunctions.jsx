import { create } from "zustand";

const useFunctions = create((set) => ({
  page: 1,
  setPage: (page) => set({ page }),
  fySelect: {
    label: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    value: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  },
  setFySelect: (fySelect) => set({ fySelect }),
  open: false,
  setOpen: (open) => set({ open }),
  search: "",
  setSearch: (search) => set({ search }),
  deleteConfirm: null,
  setDeleteConfirm: (deleteConfirm) => set({ deleteConfirm }),
  editOpen: null,
  setEditOpen: (editOpen) => set({ editOpen }),
  pdf: null,
  setPdf: (pdf) => set({ pdf }),
  openRegimeModal: false,
  setOpenRegimeModal: (openRegimeModal) => set({ openRegimeModal }),

  // Regime Modal selected items
  selected: false,
  setSelected: (selected) => set({ selected }),
  isOpenCalculation: [],
  setIsOpenCalculation: (section) =>
    set((state) => {
      if (state.isOpenCalculation.includes(section)) {
        return {
          isOpenCalculation: state.isOpenCalculation.filter(
            (item) => item !== section
          ),
        };
      } else {
        return {
          isOpenCalculation: [...state.isOpenCalculation, section],
        };
      }
    }),
}));

export default useFunctions;
