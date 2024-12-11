import { create } from "zustand";

const useMyTrainingStore = create((set) => ({
  trainingName: undefined,
  trainingDepartment: undefined,
  trainingType: undefined,

  setTrainingName: (data) => {
    set({
      trainingName: data,
    });
  },
  setTrainingDepartment: (data) => {
    set({
      trainingDepartment: data,
    });
  },
  setTrainingType: (data) => {
    set({
      trainingType: data,
    });
  },
}));
export default useMyTrainingStore;
