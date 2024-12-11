import { create } from "zustand";

const useApplyJobPositionState = create((set) => ({
    // State variables based on the Mongoose schema
    jobId: undefined,
    applicationStatus: "Applied", // Default value for application status
    resume: {
        fileName: undefined,
        filePath: undefined,
    },
    coverLetter: undefined,
    skills: [],
    experience: undefined,
    education: undefined,
    certifications: [],
    // State updater functions
    setJobId: (jobId) => set({ jobId }),
    setApplicationStatus: (status) => set({ applicationStatus: status }),
    setResume: (fileName, filePath) => set({ resume: { fileName, filePath } }),
    setCoverLetter: (coverLetter) => set({ coverLetter }),
    setSkills: (skills) => set({ skills }),
    setExperience: (experience) => set({ experience }),
    setEducation: (education) => set({ education }),
    setCertifications: (certifications) => set({ certifications }),

    // Reset function to clear all fields
    resetForm: () =>
        set({
            jobId: undefined,
            applicationStatus: "Applied", // Reset to default
            resume: { fileName: undefined, filePath: undefined },
            coverLetter: undefined,
            skills: [],
            experience: undefined,
            education: undefined,
            certifications: [],
        }),
}));

export default useApplyJobPositionState;
