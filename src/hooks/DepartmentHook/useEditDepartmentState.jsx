import { create } from "zustand";

const useEditDepartmentState = create((set) => {
  return {
    dept_name: undefined,
    dept_description: undefined,
    dept_location: undefined,
    dept_cost_center_name: undefined,
    dept_cost_center_description: undefined,
    dept_id: undefined,
    dept_cost_center_id: undefined,
    dept_head_name: undefined,
    dept_delegate_head_name: undefined,
    data: undefined,

    setStep1Data: (data) => {
      set((state) => ({
        ...state,
        dept_name: data.dept_name,
        dept_description: data.dept_description,
        dept_location: data.dept_location,
        dept_head_name: data.dept_head_name,
        dept_delegate_head_name: data.dept_delegate_head_name,
      }));
    },
    setStep2Data: (data) => {
      set((state) => ({
        ...state,
        dept_cost_center_name: data.dept_cost_center_name,
        dept_cost_center_description: data.dept_cost_center_description,
        dept_id: data.dept_id,
        dept_cost_center_id: data.dept_cost_center_id,
      }));
    },
    setStep3Data: (data) => {
      set((state) => ({
        ...state,
        data: { ...data },
      }));
    },
    emptyState: () => {
      set({
        dept_name: undefined,
        dept_description: undefined,
        dept_location: undefined,
        dept_cost_center_name: undefined,
        dept_cost_center_description: undefined,
        dept_id: undefined,
        dept_cost_center_id: undefined,
        dept_head_name: undefined,
        dept_delegate_head_name: undefined,
        data: undefined,
      });
    },
  };
});

export default useEditDepartmentState;
