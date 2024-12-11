import { create } from "zustand";

//initialize state for remote puching
const useSelfieStore = create((set) => ({
  geoFencingArea: false,
  open: false,
  media: null,
  punchObjectId: null,
  start: false,
  count: 0,
  locationArray: [],
  temporaryArray: [],
  id: null,
  startTime: null,
  endTime: null,
  distance: 0,
  setDistance: (distance) => set({ distance }),
  setGeoFencingArea: (geoFencingArea) => {
    set({ geoFencingArea });
  },
  setOpen: (open) => {
    set({ open });
  },
  setMedia: (media) => {
    set({ media });
  },
  setStartTime: () => {
    set({ startTime: new Date() });
  },
  setEndTime: () => {
    set({ endTime: new Date() });
  },
  setPunchObjectId: (punchObjectId) => {
    set({ punchObjectId });
  },
  setStart: (start) => {
    set({ start });
  },
  setCount: (count) => {
    set((state) => ({ count: state.count + count }));
  },
  setLocation: (locationObject) => {
    set((state) => ({
      locationArray: [...state.locationArray, locationObject],
    }));
  },
  clearLocation: () => {
    set({ locationArray: [] });
  },
  setTemporaryArray: ({ latitude, longitude }) => {
    set((state) => ({
      temporaryArray: [
        ...state.temporaryArray,
        { lat: latitude, lng: longitude, time: new Date() },
      ],
    }));
  },
  clearTemporaryArray: () => {
    set({ temporaryArray: [] });
  },
  setId: (id) => set({ id }),
}));

export default useSelfieStore;
