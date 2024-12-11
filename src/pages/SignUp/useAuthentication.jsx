import { create } from "zustand";

const useAuthentication = create((set) => ({
  countryCode: "+91",
  setCountryCode: (code) => set({ countryCode: code }),
}));

export default useAuthentication;
