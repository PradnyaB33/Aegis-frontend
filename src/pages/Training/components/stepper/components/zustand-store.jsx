import { format } from "date-fns";
import { create } from "zustand";

const useTrainingStore = create((set) => ({
  isDepartmentalTraining: false,
  trainingDepartment: [],
  trainingId: undefined,
  trainingName: undefined,
  trainingType: undefined,
  trainingDescription: undefined,
  trainingStartDate: undefined,
  trainingEndDate: undefined,
  trainingLink: undefined,
  trainingImage: undefined,
  trainingLocation: undefined,
  trainingPoints: "0",
  trainingDownCasted: false,
  trainingDuration: undefined,
  open: false,
  proofSubmissionRequired: true,

  setStep1: (data) => {
    set({
      trainingName: data.trainingName,
      trainingDescription: data.trainingDescription,
      trainingImage: data.trainingImage,
    });
  },
  setStep2: (data) => {
    set({
      trainingStartDate: data.trainingStartDate,
      trainingEndDate: data.trainingEndDate,
      trainingLocation: data.trainingLocation,
      trainingLink: data.trainingLink,
      trainingPoints: data.trainingPoints,
      trainingDownCasted: data.trainingDownCasted,
      trainingType: data.trainingType,
      trainingDuration: data.trainingDuration,
      trainingDepartment: data.trainingDepartment,
      isDepartmentalTraining: data.isDepartmentalTraining,
      proofSubmissionRequired: data.proofSubmissionRequired,
    });
  },
  setOpen: (data) => {
    set({
      open: data,
    });
  },
  setTrainingData: (data) => {
    set({
      trainingName: data.trainingName,
      trainingDescription: data.trainingDescription,
      trainingImage: data.trainingLogo,
      trainingStartDate: format(new Date(data.trainingStartDate), "yyyy-MM-dd"),
      trainingEndDate: format(new Date(data.trainingEndDate), "yyyy-MM-dd"),
      trainingLocation: data.trainingLocation,
      trainingLink: data.trainingLink,
      trainingPoints: `${data.trainingPoints}`,
      trainingDownCasted: data.trainingDownCasted,
      trainingType: data.trainingType,
      trainingDuration: data.trainingDuration,
      trainingId: data._id,
      proofSubmissionRequired: data.proofSubmissionRequired,
    });
  },
  reset: async () => {
    set({
      isDepartmentalTraining: false,
      trainingDepartment: [],
      trainingId: undefined,
      trainingName: undefined,
      trainingType: undefined,
      trainingDescription: undefined,
      trainingStartDate: undefined,
      trainingEndDate: undefined,
      trainingLink: undefined,
      trainingImage: undefined,
      trainingLocation: {
        address: undefined,
        position: {
          lat: 0,
          lng: 0,
        },
        placeId: undefined,
      },
      trainingPoints: "0",
      trainingDownCasted: false,
      trainingDuration: undefined,
      open: true,
      proofSubmissionRequired: true,
    });
  },
}));

export default useTrainingStore;
