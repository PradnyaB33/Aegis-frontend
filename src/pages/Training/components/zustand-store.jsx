import { create } from "zustand";

const useSearchTrainingZustandStore = create((set) => ({
  page: 1,
  trainingData: [],
  trainingName: "",
  totalResult: 0,
  setTrainingData: (data) => {
    set({
      trainingData: data,
    });
  },
  setTrainingName: (data) => {
    set({
      trainingName: data,
    });
  },
  setTotalResult: (data) => {
    set({
      totalResult: data,
    });
  },
  incrementPage: () => {
    set((state) => ({
      page: state.page + 1,
    }));
  },
  decrementPage: () => {
    set((state) => ({
      page: state.page - 1,
    }));
  },
}));

export default useSearchTrainingZustandStore;
