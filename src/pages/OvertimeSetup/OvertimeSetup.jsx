/* eslint-disable no-unused-vars */
// import React, { useState, useContext } from "react";
// import {
//   Checkbox,
//   TextField,
//   FormControlLabel,
//   FormGroup,
//   FormControl,
//   RadioGroup,
//   Radio,
//   FormLabel,
//   Tooltip,
//   Grid,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import axios from "axios";
// import Setup from "../SetUpOrganization/Setup";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useQuery } from "react-query";
// import { TestContext } from "../../State/Function/Main";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BasicButton from "../../components/BasicButton";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";

// const OvertimeSetup = () => {
//   // hook
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId } = useParams();

//   //state
//   const [overtimeAllowed, setOvertimeAllowed] = useState(false);
//   const [minimumOvertimeHours, setMinimumOvertimeHours] = useState("");
//   const [overtimeAllowanceRequired, setOvertimeAllowanceRequired] =
//     useState(false);
//   const [allowanceParameter, setAllowanceParameter] = useState("perHour");
//   const [allowanceAmount, setAllowanceAmount] = useState("");

//   // get query
//   useQuery(
//     ["overtimeSettings", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data || {};
//     },
//     {
//       onSuccess: (settings) => {
//         console.log("settiogn", settings)
//         setOvertimeAllowed(settings.overtimeAllowed || false);
//         setMinimumOvertimeHours(settings.minimumOvertimeHours || "");
//         setOvertimeAllowanceRequired(
//           settings.overtimeAllowanceRequired || false
//         );
//         setAllowanceParameter(settings.allowanceParameter || "perHour");
//         setAllowanceAmount(settings.allowanceAmount || "");
//       },
//       onError: () => { },
//     }
//   );

//   const handleInputChange = (setter) => (event) => {
//     setter(event.target.value);
//   };

//   const handleCheckboxChange = (setter) => (event) => {
//     setter(event.target.checked);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       // Validate the form inputs
//       if (!overtimeAllowed) {
//         handleAlert(
//           true,
//           "error",
//           "Please check 'Overtime Allowed' before proceeding."
//         );
//         return;
//       }

//       if (!overtimeAllowanceRequired) {
//         handleAlert(
//           true,
//           "error",
//           "Please check 'Overtime allowance' before proceeding."
//         );
//         return;
//       }

//       if (overtimeAllowed) {
//         const minHours = Number(minimumOvertimeHours);

//         if (isNaN(minHours) || minHours <= 0 || minHours > 24) {
//           handleAlert(
//             true,
//             "error",
//             "Number of Hours Allowed for Overtime must be greater than 0 and less than or equal to 24."
//           );
//           return;
//         }
//       }

//       const laskh = 1000000;

//       if (overtimeAllowanceRequired) {
//         const allowance = Number(allowanceAmount);

//         if (isNaN(allowance) || allowance <= 0 || allowance > laskh) {
//           handleAlert(
//             true,
//             "error",
//             `Overtime Allowances Amount is required, and less than or equal to ${laskh}.`
//           );
//           return;
//         }
//       }

//       // Proceed with form submission if validation passes
//       const overtimeSettings = {
//         overtimeAllowed,
//         minimumOvertimeHours: Number(minimumOvertimeHours),
//         overtimeAllowanceRequired,
//         allowanceParameter,
//         allowanceAmount: Number(allowanceAmount),
//         organizationId: organisationId,
//       };

//       await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/overtime`,
//         overtimeSettings,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );

//       handleAlert(true, "success", "Overtime setup successfully.");
//     } catch (error) {
//       console.log(error);
//       handleAlert(
//         true,
//         "error",
//         "Error occurred while setting up the overtime."
//       );
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center ">
//             <HeadingOneLineInfo
//               className="!my-3"
//               heading="Overtime"
//               info="Configure overtime allowance settings" 
//             />
//           </div>
//           <form onSubmit={handleSubmit}>
//             <FormGroup>
//               {/* <Tooltip */}
//               {/* title="Enable or disable overtime for employees"
//                       arrow
//                       //  placement="left"
//                     > */}
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={overtimeAllowed}
//                     onChange={handleCheckboxChange(setOvertimeAllowed)}
//                   />
//                 }
//                 label="Overtime Allowed"
//               />
//               {/* </Tooltip> */}
//               {overtimeAllowed && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 //  placement="left"
//                 >
//                   <Grid container spacing={2} className="mb-4">
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         label="Number of Hours Allowed for Overtime"
//                         type="number"
//                         value={minimumOvertimeHours}
//                         onChange={handleInputChange(
//                           setMinimumOvertimeHours
//                         )}
//                         inputProps={{ min: 0, max: 24 }}
//                         fullWidth
//                       />
//                         <AuthInputFiled
//                         name="minimumOvertimeHours"
//                         type="number"
//                         placeholder="Enter Minimum Overtime Hours"
//                         label="Number of Hours Allowed for Overtime"
//                         value={minimumOvertimeHours}
//                         onChange={handleInputChange(setMinimumOvertimeHours)}
//                         inputProps={{ min: 0, max: 24 }}
//                       />
//                     </Grid>
//                   </Grid>
//                   <Tooltip
//                     title="Specify if overtime allowances are required"
//                     arrow
//                   >
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={overtimeAllowanceRequired}
//                           onChange={handleCheckboxChange(
//                             setOvertimeAllowanceRequired
//                           )}
//                         />
//                       }
//                       label="Overtime Allowances Required"
//                     />
//                   </Tooltip>
//                   {overtimeAllowanceRequired && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       <FormControl component="fieldset" className="mb-4">
//                         <FormLabel component="legend">
//                           Overtime Allowances Amount Parameter
//                         </FormLabel>
//                         <RadioGroup
//                           row
//                           value={allowanceParameter}
//                           onChange={handleInputChange(
//                             setAllowanceParameter
//                           )}
//                         >
//                           <FormControlLabel
//                             value="perHour"
//                             control={<Radio />}
//                             label="Per Hour"
//                           />
//                           <FormControlLabel
//                             value="perDay"
//                             control={<Radio />}
//                             label="Per Day"
//                           />
//                         </RadioGroup>
//                       </FormControl>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             label="Overtime Allowances Amount"
//                             type="number"
//                             value={allowanceAmount}
//                             onChange={handleInputChange(
//                               setAllowanceAmount
//                             )}
//                             inputProps={{ min: 0 }}
//                             fullWidth
//                           />
//                           <AuthInputFiled
//                             name="allowanceAmount"
//                             type="number"
//                             placeholder="Enter Allowance Amount"
//                             label="Overtime Allowances Amount"
//                             value={allowanceAmount}
//                             onChange={handleInputChange(setAllowanceAmount)}
//                             inputProps={{ min: 0 }}
//                           />
//                         </Grid>
//                       </Grid>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               )}
//             </FormGroup>
//             <br />
//             <BasicButton type="submit" title="Save" />
//           </form></div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default OvertimeSetup;



// import React, { useState, useContext } from "react";
// import {
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   FormControl,
//   RadioGroup,
//   Radio,
//   FormLabel,
//   Tooltip,
//   Grid,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import axios from "axios";
// import Setup from "../SetUpOrganization/Setup";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useQuery } from "react-query";
// import { TestContext } from "../../State/Function/Main";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BasicButton from "../../components/BasicButton";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import { useForm, FormProvider, Controller } from 'react-hook-form';
// const OvertimeSetup = () => {
//   const { control, formState: { errors } } = useForm();
//   // Context hooks
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId } = useParams();

//   // State
//   const [overtimeAllowed, setOvertimeAllowed] = useState(false);
//   const [minimumOvertimeHours, setMinimumOvertimeHours] = useState("");
//   const [overtimeAllowanceRequired, setOvertimeAllowanceRequired] =
//     useState(false);
//   const [allowanceParameter, setAllowanceParameter] = useState("perHour");
//   const [allowanceAmount, setAllowanceAmount] = useState("");


  
//   // Fetch initial settings
//   useQuery(
//     ["overtimeSettings", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       return response.data.data || {};
//     },
//     {
//       onSuccess: (settings) => {
//         setOvertimeAllowed(settings.overtimeAllowed || false);
//         setMinimumOvertimeHours(settings.minimumOvertimeHours || "");
//         setOvertimeAllowanceRequired(settings.overtimeAllowanceRequired || false);
//         setAllowanceParameter(settings.allowanceParameter || "perHour");
//         setAllowanceAmount(settings.allowanceAmount || "");
//       },
//       onError: () => {
//         handleAlert(true, "error", "Failed to fetch overtime settings.");
//       },
//     }
//   );

//   // Input Handlers
//   const handleInputChange = (setter) => (event) => {
//     setter(event.target.value);
//   };

//   const handleCheckboxChange = (setter) => (event) => {
//     setter(event.target.checked);
//   };

//   // Form Submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       if (!overtimeAllowed || !overtimeAllowanceRequired) {
//         handleAlert(
//           true,
//           "error",
//           "Please enable the required options before proceeding."
//         );
//         return;
//       }

//       const minHours = Number(minimumOvertimeHours);
//       const allowance = Number(allowanceAmount);

//       if (minHours <= 0 || minHours > 24) {
//         handleAlert(
//           true,
//           "error",
//           "Overtime hours must be greater than 0 and less than or equal to 24."
//         );
//         return;
//       }

//       if (allowance <= 0 || allowance > 1000000) {
//         handleAlert(
//           true,
//           "error",
//           "Allowance amount must be greater than 0 and less than or equal to 1,000,000."
//         );
//         return;
//       }

//       const overtimeSettings = {
//         overtimeAllowed,
//         minimumOvertimeHours: minHours,
//         overtimeAllowanceRequired,
//         allowanceParameter,
//         allowanceAmount: allowance,
//         organizationId: organisationId,
//       };

//       await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/overtime`,
//         overtimeSettings,
//         {
//           headers: { Authorization: authToken },
//         }
//       );

//       handleAlert(true, "success", "Overtime setup saved successfully.");
//     } catch (error) {
//       handleAlert(true, "error", "Error occurred while saving the setup.");
//     }
//   };

//   // JSX
//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <HeadingOneLineInfo
//             className="!my-3"
//             heading="Overtime"
//             info="Configure overtime allowance settings"
//           />
//           <form onSubmit={handleSubmit}>
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={overtimeAllowed}
//                     onChange={handleCheckboxChange(setOvertimeAllowed)}
//                   />
//                 }
//                 label="Overtime Allowed"
//               />
//               {overtimeAllowed && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <AuthInputFiled
//                         name="minimumOvertimeHours"
//                         type="number"
//                         control={control}
//                         errors={errors}
//                         error={errors.loanName}
//                         placeholder="Enter Minimum Overtime Hours"
//                         label="Number of Hours Allowed for Overtime"
//                         value={minimumOvertimeHours}
//                         onChange={handleInputChange(setMinimumOvertimeHours)}
//                         inputProps={{ min: 0, max: 24 }}
//                       />
//                     </Grid>
//                   </Grid>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={overtimeAllowanceRequired}
//                         onChange={handleCheckboxChange(
//                           setOvertimeAllowanceRequired
//                         )}
//                       />
//                     }
//                     label="Overtime Allowances Required"
//                   />
//                   {overtimeAllowanceRequired && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                       <FormControl component="fieldset">
//                         <FormLabel>Allowance Parameter</FormLabel>
//                         <RadioGroup
//                           row
//                           value={allowanceParameter}
//                           onChange={handleInputChange(setAllowanceParameter)}
//                         >
//                           <FormControlLabel
//                             value="perHour"
//                             control={<Radio />}
//                             label="Per Hour"
//                           />
//                           <FormControlLabel
//                             value="perDay"
//                             control={<Radio />}
//                             label="Per Day"
//                           />
//                         </RadioGroup>
//                       </FormControl>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <AuthInputFiled
//                             name="allowanceAmount"
//                             type="number"
//                             control={control}
//                             errors={errors}
//                             error={errors.loanName}
//                             placeholder="Enter Allowance Amount"
//                             label="Allowance Amount"
//                             value={allowanceAmount}
//                             onChange={handleInputChange(setAllowanceAmount)}
//                             inputProps={{ min: 0 }}
//                           />
//                         </Grid>
//                       </Grid>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               )}
//             </FormGroup>
//             <BasicButton type="submit" title="Save" />
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default OvertimeSetup;



import React, { useState, useContext } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Tooltip,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import Setup from "../SetUpOrganization/Setup";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import { useForm, FormProvider, Controller } from 'react-hook-form';

const OvertimeSetup = () => {
  const methods = useForm(); // Initialize useForm and get all methods
  const { control, formState: { errors } } = methods;

  // Context hooks
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  // State
  const [overtimeAllowed, setOvertimeAllowed] = useState(false);
  const [minimumOvertimeHours, setMinimumOvertimeHours] = useState("");
  const [overtimeAllowanceRequired, setOvertimeAllowanceRequired] =
    useState(false);
  const [allowanceParameter, setAllowanceParameter] = useState("perHour");
  const [allowanceAmount, setAllowanceAmount] = useState("");

  // Fetch initial settings
  useQuery(
    ["overtimeSettings", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data || {};
    },
    {
      onSuccess: (settings) => {
        setOvertimeAllowed(settings.overtimeAllowed || false);
        setMinimumOvertimeHours(settings.minimumOvertimeHours || "");
        setOvertimeAllowanceRequired(settings.overtimeAllowanceRequired || false);
        setAllowanceParameter(settings.allowanceParameter || "perHour");
        setAllowanceAmount(settings.allowanceAmount || "");
      },
      onError: () => {
        handleAlert(true, "error", "Failed to fetch overtime settings.");
      },
    }
  );

  // Input Handlers
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  // Form Submission
  const handleSubmit = async (data) => {
    try {
      const minHours = Number(data.minimumOvertimeHours);
      const allowance = Number(data.allowanceAmount);

      if (minHours <= 0 || minHours > 24) {
        handleAlert(
          true,
          "error",
          "Overtime hours must be greater than 0 and less than or equal to 24."
        );
        return;
      }

      if (allowance <= 0 || allowance > 1000000) {
        handleAlert(
          true,
          "error",
          "Allowance amount must be greater than 0 and less than or equal to 1,000,000."
        );
        return;
      }

      const overtimeSettings = {
        overtimeAllowed,
        minimumOvertimeHours: minHours,
        overtimeAllowanceRequired,
        allowanceParameter,
        allowanceAmount: allowance,
        organizationId: organisationId,
      };

      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/overtime`,
        overtimeSettings,
        {
          headers: { Authorization: authToken },
        }
      );

      handleAlert(true, "success", "Overtime setup saved successfully.");
    } catch (error) {
      handleAlert(true, "error", "Error occurred while saving the setup.");
    }
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[80vh] overflow-y-auto scroll px-3">
          <HeadingOneLineInfo
            className="!my-3"
            heading="Overtime"
            info="Configure overtime allowance settings"
          />
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={overtimeAllowed}
                      onChange={handleCheckboxChange(setOvertimeAllowed)}
                    />
                  }
                  label="Overtime Allowed"
                />
                {overtimeAllowed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <AuthInputFiled
                          name="minimumOvertimeHours"
                          type="number"
                          control={control}
                          errors={errors}
                          placeholder="Enter Minimum Overtime Hours"
                          label="Number of Hours Allowed for Overtime"
                          value={minimumOvertimeHours}
                          onChange={handleInputChange(setMinimumOvertimeHours)}
                          inputProps={{ min: 0, max: 24 }}
                        />
                      </Grid>
                    </Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={overtimeAllowanceRequired}
                          onChange={handleCheckboxChange(
                            setOvertimeAllowanceRequired
                          )}
                        />
                      }
                      label="Overtime Allowances Required"
                    />
                    {overtimeAllowanceRequired && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <FormControl component="fieldset">
                          <FormLabel>Allowance Parameter</FormLabel>
                          <RadioGroup
                            row
                            value={allowanceParameter}
                            onChange={handleInputChange(setAllowanceParameter)}
                          >
                            <FormControlLabel
                              value="perHour"
                              control={<Radio />}
                              label="Per Hour"
                            />
                            <FormControlLabel
                              value="perDay"
                              control={<Radio />}
                              label="Per Day"
                            />
                          </RadioGroup>
                        </FormControl>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <AuthInputFiled
                              name="allowanceAmount"
                              type="number"
                              control={control}
                              errors={errors}
                              placeholder="Enter Allowance Amount"
                              label="Allowance Amount"
                              value={allowanceAmount}
                              onChange={handleInputChange(setAllowanceAmount)}
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                        </Grid>
                      </motion.div>
                    )}
                    
                  </motion.div>
                  
                )}
                <BasicButton type="submit" title="Save" />
              </FormGroup>
              {/* <BasicButton type="submit" title="Save" /> */}
            </form>
          </FormProvider>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default OvertimeSetup;
