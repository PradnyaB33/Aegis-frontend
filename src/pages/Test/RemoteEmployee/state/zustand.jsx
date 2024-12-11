import { create } from "zustand";

const useMissPunchData = create((set) => ({
  endLocation: {
    address: "",
    position: {
      lat: "",
      lng: "",
    },
  },
  startLocation: {
    address: "",
    position: {
      lat: "",
      lng: "",
    },
  },
  start: "",
  end: "",
  distance: "",
}));

export default useMissPunchData;
