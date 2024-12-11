import { create } from "zustand";

const useMissedJustifyState = create((set) => {
  return {
    recordDate: undefined,
    punchInTime: undefined,
    punchOutTime: undefined,
    status: undefined,
    totalHours: undefined,
    justify: undefined,
    leave: undefined,
    shift: undefined,

    setJustify: (justify) => set({ justify }),
    setLeave: (leave) => set({ leave }),
    setShift: (shift) => set({ shift }),
  };
});

export default useMissedJustifyState;
