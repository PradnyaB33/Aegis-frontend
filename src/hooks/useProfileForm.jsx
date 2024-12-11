import { create } from "zustand";

const useProfileForm = create((set) => ({
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  phone_number: "",
  emergency_contact: "",
  address: "",
  joining_date: "",
  firstNameError: "",
  lastNameError: "",
  emailError: "",
  passwordError: "",

  setFirstName: (first_name) => set({ first_name }),
  setMiddalName: (middle_name) => set({ middle_name }),
  setLastName: (last_name) => set({ last_name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setPhoneNumber: (phone_number) => set({ phone_number }),
  setEmergencyContact: (emergency_contact) => set({ emergency_contact }),
  setAddress: (address) => set({ address }),
  setJoiningDate: (joining_date) => set({ joining_date }),
  setFirstNameError: (error) => set({ firstNameError: error }),
  setLastNameError: (error) => set({ lastNameError: error }),
  setEmailError: (error) => set({ emailError: error }),
  setPasswordError: (error) => set({ passwordError: error }),
}));

export default useProfileForm;
