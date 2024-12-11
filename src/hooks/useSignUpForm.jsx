import { create } from "zustand";

const useSignupFormStore = create((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  orgnizationName: "",
  firstNameError: "",
  lastNameError: "",
  emailError: "",

  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setOrganizationName: (orgnizationName) => set({ orgnizationName }),
  setPasswordMatchError: (error) => set({ passwordMatchError: error }),
  setFirstNameError: (error) => set({ firstNameError: error }),
  setLastNameError: (error) => set({ lastNameError: error }),
  setEmailError: (error) => set({ emailError: error }),
  setPasswordError: (error) => set({ passwordError: error }),
}));

export default useSignupFormStore;
