import { create } from "zustand";

const SkillsMatrixOrg = create((set) => {
  return {
    // Organization details
    orgName: process.env.REACT_APP_orgName ?? undefined,
    foundation_date: process.env.REACT_APP_foundation_date ?? undefined,
    web_url: process.env.REACT_APP_web_url ?? undefined,
    industry_type: process.env.REACT_APP_industry_type ?? undefined,
    email: process.env.REACT_APP_email ?? undefined,
    organization_linkedin_url:
      process.env.REACT_APP_organization_linkedin_url ?? undefined,
    location: {
      address: process.env.REACT_APP_location_address ?? undefined,
      position: {
        lat: process.env.REACT_APP_location_position_lat ?? undefined,
        lng: process.env.REACT_APP_location_position_lng ?? undefined,
      },
    },
    contact_number: process.env.REACT_APP_contact_number ?? undefined,
    description: process.env.REACT_APP_description ?? undefined,
    verfiedToken: undefined,
    creator: process.env.REACT_APP_creator ?? undefined,
    isTrial: Boolean(process.env.REACT_APP_isTrial) ?? false,
    packageInfo: process.env.REACT_APP_packageInfo ?? undefined,
    count: process.env.REACT_APP_count ?? undefined,
    cycleCount: process.env.REACT_APP_cycleCount ?? "1",
    paymentType: process.env.REACT_APP_paymentType ?? undefined,
    packages: undefined,
    coupan: undefined,

    // **Skills Matrix State**
    skillsMatrix: {
      selectedPlan: undefined, // Selected plan name (e.g., "Alliance", "SM No Cost")
      plans: [], // List of available plans for the Skills Matrix package
    },

    // Setter functions
    setStep2Data: (packageInfo) => {
      set({ packageInfo });
    },
    setStep1Data: async (orgName) => {
      await set({
        ...orgName,
      });
    },
    setStep3Data: (data) => {
      set({
        count: data.count,
        cycleCount: data.cycleCount,
        paymentType: data?.paymentType,
        packages: data?.packages,
        coupan: data?.coupan,
      });
    },
    setVerifyToken: (data) => {
      set({ verifyToken: data });
    },
    setCreator: (creator) => set({ creator: creator.user._id }),

 
    setSkillsMatrixPlans: (plans) => {
      set((state) => ({
        skillsMatrix: {
          ...state.skillsMatrix,
          plans,
        },
      }));
    },
    setSkillsMatrixSelectedPlan: (planName) => {
      set((state) => ({
        skillsMatrix: {
          ...state.skillsMatrix,
          selectedPlan: planName,
        },
      }));
    },

    // Utility to log current store state
    logData: () => {
      const currentState = set(); // Access the current state
      console.log("Store Data", currentState);
    },
  };
});

export default SkillsMatrixOrg;
