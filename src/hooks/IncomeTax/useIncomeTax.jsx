import { create } from "zustand";

// Function to calculate the financial year
const calculateFinancialYear = () => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let nextYear = currentYear + 1;

  // If the current month is January (0) through March (2), subtract 1 from the current year and add 1 to the next year
  if (currentDate.getMonth() < 3) {
    currentYear -= 1;
    nextYear -= 1;
  }

  return `${currentYear}-${nextYear}`;
};

const useIncomeTax = create((set) => ({
  editStatus: {},
  taxAmount: 0,
  cess: 0,
  tax: 0,
  tableData: [],
  declarationData: {},
  deleteConfirmation: null,
  isLoading: false,
  pdf: null,
  setIsLoading: (status) => set({ isLoading: status }),
  financialYear: calculateFinancialYear(),

  setTaxAmount: (taxAmount) => set({ taxAmount: taxAmount }),
  setCess: (taxAmount) => set({ cess: taxAmount }),
  setTax: (taxAmount) => set({ tax: taxAmount }),

  setTableData: (newData) => set({ tableData: newData }),
  setEditStatus: (newStatus) => set({ editStatus: newStatus }),
  handleDeleteConfirmation: (id) => set({ deleteConfirmation: id }),
  handlePDF: (id) => set({ pdf: id }),
  handleClosePDF: () => set({ pdf: null }),
  handleEditClick: (itemIndex) =>
    set((state) => {
      const newData = [...state.tableData];
      return {
        editStatus: {
          [itemIndex]: !state.editStatus[itemIndex],
        },
        declarationData: {
          ...newData[itemIndex],
        },
      };
    }),

  getCurrentFinancialYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();

    let financialYearStart, financialYearEnd;

    if (currentMonth >= 4) {
      // If current month is April or later, financial year starts this year
      financialYearStart = `04-${currentYear}`;
      financialYearEnd = `03-${currentYear + 1}`;
    } else {
      // If current month is March or earlier, financial year started last year
      financialYearStart = `04-${currentYear - 1}`;
      financialYearEnd = `03-${currentYear}`;
    }

    return { financialYearStart, financialYearEnd };
  },

  handleAmountChange: (e, itemIndex, handleAlert) =>
    set((state) => {
      const newData = [...state.tableData];
      const { amount, proof, ...otherData } = newData[itemIndex];
      return {
        declarationData: {
          ...state.declarationData,
          ...otherData,
          amount: e.target.value,
        },
      };
    }),
  setProofEmpty: (itemIndex) =>
    set((state) => {
      const newData = [...state.tableData];
      const { amount, proof, ...otherData } = newData[itemIndex];
      console.log("cliked");
      return {
        declarationData: {
          ...state.declarationData,
          ...otherData,
          proof: undefined,
        },
      };
    }),
  handleProofChange: (e, itemIndex, handleAlert) =>
    set((state) => {
      const file = e.target.files[0];

      if (file?.type !== "application/pdf") {
        handleAlert(true, "error", "Only PDF format allowed");
        return state;
      }
      
      if (file?.size > 500 * 1024) {
        handleAlert(true, "error", "File size must be under 500kb");
        return state;
      }
      const newData = [...state.tableData];
      const { amount, proof, ...otherData } = newData[itemIndex];
      return {
        declarationData: {
          ...state.declarationData,
          ...otherData,
          proof: file,
        },
      };
    }),

  getFinancialCurrentYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed, so +1 to match natural numbering
    const currentYear = currentDate.getFullYear();

    let financialYearStart, financialYearEnd;

    if (currentMonth >= 4) {
      // If current month is April or later, financial year starts this year
      financialYearStart = `4-${currentYear}`;
      financialYearEnd = `3-${currentYear + 1}`;
    } else {
      // If current month is March or earlier, financial year started last year
      financialYearStart = `4-${currentYear - 1}`;
      financialYearEnd = `3-${currentYear}`;
    }

    return { start: financialYearStart, end: financialYearEnd };
  },
  handleClose: (index) =>
    set({
      editStatus: {
        [index]: null,
      },
      declarationData: {},
    }),

  handleCloseConfirmation: () => set({ deleteConfirmation: null }),
}));

export default useIncomeTax;
