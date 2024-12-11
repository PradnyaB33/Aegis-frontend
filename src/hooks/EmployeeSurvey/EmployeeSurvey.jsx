import { create } from "zustand";

const useCreateEmployeeSurveyState = create((set) => {
    return {
        title: undefined,
        description: undefined,
        to: undefined,
        from: undefined,
        subject: undefined,
        body: undefined,
        employeeSurveyStartingDate: null,
        employeeSurveyEndDate: null,
        setEmployeeSurveyStartingDate: (date) => set({ employeeSurveyStartingDate: date }),
        setEmployeeSurveyEndDate: (date) => set({ employeeSurveyEndDate: date }),
    }
});

export default useCreateEmployeeSurveyState;
