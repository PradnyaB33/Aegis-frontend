import { create } from "zustand";

const useTDS = create((set) => ({
  grossTotal: 0,
  salaryTax: 0,
  salaryDeclaration: 0,

  declared: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,

  // House Property
  selfPropertyDeclaration: 0,
  propertyTax: 0,

  // Other Property
  otherIncomeTax: 0,

  // Section
  sectionTax: 0,

  // Tax
  taxableIncome: 0,
  tax: 0,

  setTax: (tax) => {
    set({ tax });
  },
  setSalaryTax: (salaryTax) => {
    set({ salaryTax });
  },
  setDeclared: (data) => {
    set({
      declared: data.declared,
      pending: data.pending,
      accepted: data.accepted,
      rejected: data.rejected,
    });
  },

  setSelfPropertyDeclaration: (selfPropertyDeclaration) => {
    set({ selfPropertyDeclaration });
  },
  setSalaryDeclaration: (salaryDeclaration) => {
    set({ salaryDeclaration });
  },
  setGrossTotal: (newValue) => {
    set({ grossTotal: newValue });
  },
  setPropertyTax: (propertyTax) => {
    set({ propertyTax });
  },
  setOtherIncomeTax: (otherIncomeTax) => {
    set({ otherIncomeTax });
  },
  setSectionTax: (sectionTax) => {
    set({ sectionTax });
  },

  setTaxableIncome: (taxableIncome) => {
    set({ taxableIncome });
  },
}));

export default useTDS;
