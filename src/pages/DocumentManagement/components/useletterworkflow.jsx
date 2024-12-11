import create from 'zustand';

// Create Zustand store
const useLetterWorkflowStore = create((set) => ({
  letterWorkflow: {
    "Employment Offer Letter": { workflow: true },
    "Appointment Letter": { workflow: true },
    "Promotion Letter": { workflow: true },
    "Transfer Letter": { workflow: true },
    "Termination Letter": { workflow: true },
    "Resignation Acceptance Letter": { workflow: false },
    "Confirmation Letter": { workflow: false },
    "Performance Appraisal Letter": { workflow: false },
    "Warning Letter": { workflow: false },
    "Salary Increment Letter": { workflow: false },
    "Training Invitation Letter": { workflow: false },
    "Employee Recognition Letter": { workflow: false },
  },

  // Function to set the workflow status for a specific letter type
  setLetterWorkflow: (letterType, workflow) =>
    set((state) => ({
      letterWorkflow: {
        ...state.letterWorkflow,
        [letterType]: { workflow },
      },
    })),
}));

export default useLetterWorkflowStore;
