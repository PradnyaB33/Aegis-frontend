import { create } from "zustand";

export const useStudentListStore = create((set) => ({
  studentList: [], // Holds the current list of students
  setStudentList: (studentList) => set({ studentList }),

  addedStudentList: [], // Holds the list of already added students
  setAddedStudentList: (addedStudentList) => set({ addedStudentList }),

  page: 0, // Current pagination page
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
  decrementPage: () => set((state) => ({ page: state.page > 0 ? state.page - 1 : 0 })),

  // Function to add a new student to the list
  addStudent: (student) =>
    set((state) => ({ studentList: [...state.studentList, student] })),

  // Function to add a student to the "addedStudentList"
  markStudentAsAdded: (studentId) =>
    set((state) => ({
      addedStudentList: [...state.addedStudentList, studentId],
    })),

  // Function to remove a student from the "addedStudentList"
  unmarkStudentAsAdded: (studentId) =>
    set((state) => ({
      addedStudentList: state.addedStudentList.filter((id) => id !== studentId),
    })),
}));

export default useStudentListStore;
