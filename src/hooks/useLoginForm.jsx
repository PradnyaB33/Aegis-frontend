// path-to-your-zustand-store.js
import { create } from "zustand";

const useSignup = create((set) => ({
  email: "",
  password: "",
  confirmPassword: "",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
}));

export default useSignup;
