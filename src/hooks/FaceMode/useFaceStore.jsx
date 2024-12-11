import { create } from "zustand";

// state for to store descriptor
export const useFaceStore = create((set) => ({
  descriptor: null,
  setDescriptor: (descriptor) =>
    set({
      descriptor,
    }),
  userDescriptor: null,
  setUserDescriptor: (userDescriptor) =>
    set({
      userDescriptor,
    }),
}));

export default useFaceStore;
