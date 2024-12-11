import { create } from "zustand";

const useAdvanceSalaryState = create((set) => {
  return {
    employee_name: undefined,
    employeeId: undefined,
    designation: undefined,
    dept_name: undefined,
    noOfMonth: undefined,
    advanceSalaryStartingDate: undefined,
    advanceSalaryEndingDate: undefined,
    advanceSalaryAmount: undefined,

    setEmployeeName: (employee_name) => set({ employee_name }),
    setEmployeeId: (employeeId) => set({ employeeId }),
    setDesignation: (designation) => set({ designation }),
    setDeptName: (ldept_name) => set({ ldept_name }),
    setNoOfMonth: (noOfMonth) => set({ noOfMonth }),
    setAdvanceSalaryStartingDate: (advanceSalaryStartingDate) =>
      set({ advanceSalaryStartingDate }),
    setAdvanceSalaryEndingDate: (advanceSalaryEndingDate) =>
      set({ advanceSalaryEndingDate }),
    setAdvanceSalaryAmount: (advanceSalaryAmount) =>
      set({ advanceSalaryAmount }),
  };
});

export default useAdvanceSalaryState;
