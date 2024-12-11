import { create } from "zustand";

const useVendorState = create((set) => {
  return {
    first_name: undefined,
    last_name: undefined,
    date_of_birth: undefined,
    email: undefined,
    phone_number: undefined,
    address: undefined,
    gender: undefined,
    citizenship: undefined,
    adhar_card_number: undefined,
    pan_card_number: undefined,
    companyname:undefined,
    bank_account_no: undefined,
    selectedFrequency:undefined,
    password: undefined,
    confirmPassword: undefined,
    payment_info:undefined,
    
    empId: undefined,
    mgrempid: undefined,

    createModalOpen: false,  // Initialize with false
  setCreateModalOpen: (open) => set({ createModalOpen: open }),  // Add setter function

  // GeoLocation properties
  latitude: undefined,
  longitude: undefined,
   
    
    data: undefined,
    pwd: false,
    uanNo: undefined,
    esicNo: undefined,
    document:undefined,



setDocument: (doc) => {
  set({ document: doc });
},    doc:[],
    setDoc:(doc) => doc,

    // Setter function for updating multiple properties at once
    setStep2Data: (remotePunching) => {
      set({ ...remotePunching });
    },

    setStep3Data: (data) => {
      console.log(`🚀 ~ data:`, data);
      set({ data: { ...data } });
    },
    setStep1Data: (orgName) => {
      set({
        ...orgName,
      });
    },

    updateField: (fieldName, value) => {
      set((state) => ({
        ...state,
        [fieldName]: value,
      }));
    },


    setLatitude: (lat) => set({ latitude: lat }),
    setLongitude: (lng) => set({ longitude: lng }),
  
    emptyState: () => {
      set({
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        phone_number: undefined,
        address: undefined,
        companyname:undefined,
        citizenship: undefined,
        adhar_card_number: undefined,
        pan_card_number: undefined,
        gender: undefined,
        bank_account_no: undefined,
        date_of_birth: undefined,
        selectedFrequency:undefined,
        password: undefined,
        confirmPassword: undefined,
        payment_info:undefined,
        
        empId: undefined,
        mgrempid: undefined,
        // joining_date: undefined,
        // salarystructure: undefined,
        // dept_cost_center_no: undefined,
      
        document:undefined,
        data: undefined,
        pwd: false,
        uanNo: undefined,
        esicNo: undefined,

        latitude: undefined,
        longitude: undefined,
      });
    },
  };
});

export default useVendorState;
