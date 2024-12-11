/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   Checkbox,
//   Typography,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import toast from "react-hot-toast";
// import { useParams } from "react-router";

// // SkillMatrixSetup Component
// const SkillMatrixSetup = () => {
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();

//   const fetchSkills = async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return response.data;
//   };

//   const {
//     data: skills,
//     isLoading,
//     isError,
//   } = useQuery(["skills"], fetchSkills);

//   // Skill Limit Logic Based on Package
//   const packageType = "no-cost"; // This can be dynamic based on user's package
//   const maxSkills = packageType === "no-cost" ? 5 : Infinity;

//   const [openPopup, setOpenPopup] = useState(false);
//   const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);

//   // Schema for Skill Form Validation
//   const skillSchema = z.object({
//     skillName: z
//       .string()
//       .min(1, "Skill name is required")
//       .max(15, "Max 50 characters")
//       .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//     skillDescription: z
//       .string()
//       .max(200, "Maximum 100 characters allowed")
//       .optional(),
//     groupName: z.string().min(1, "Group name is required"),
//     subGroupName: z.string().optional(),
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(skillSchema),
//   });

//   const addSkill = async (data) => {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//       data,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return response.data;
//   };

//   const mutation = useMutation(addSkill, {
//     onSuccess: () => {
//       // Invalidate the 'skills' query to refresh the list after adding a new skill
//       queryClient.invalidateQueries(["skills"]);
//       toast.success("Skill added successfully!");
//     },
//     onError: () => {
//       toast.error("Error adding the skill. Please try again.");
//     },
//   });

//   const onSubmit = (data) => {
//     if (skills?.length >= maxSkills) {
//       toast.error(
//         `You can only add up to ${maxSkills} skills in the ${packageType} package.`
//       );
//       return;
//     }

//     // Mutate the data to add a new skill
//     mutation.mutate(data);
//     setOpenPopup(false); // Close the popup after submission
//   };
//   const groupedSkills = skills.reduce((acc, skill) => {
//     const group = acc[skill.groupName] || {};
//     const subGroup = group[skill.subGroupName] || [];
//     return {
//       ...acc,
//       [skill.groupName]: {
//         ...group,
//         [skill.subGroupName]: [...subGroup, skill],
//       },
//     };
//   }, {});

//   return (
//     <BoxComponent sx={{ p: 0 }} className="p-4">
//       <div className="max-w-3xl mx-auto">
//         <HeadingOneLineInfo
//           className="my-3"
//           heading="Skill Matrix"
//           info="Setup Skill Matrix For Your Organisation."
//         />

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenPopup(true)}
//           disabled={skills?.length >= maxSkills}
//           className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
//         >
//           Add Skill
//         </Button>

//         <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//           <DialogTitle>Add Skill</DialogTitle>
//           <DialogContent className="space-y-4">
//             <Controller
//               control={control}
//               name="groupName"
//               render={({ field }) => (
//                 <TextField
//                   fullWidth
//                   label="Group Name"
//                   {...field}
//                   error={!!errors.groupName}
//                   helperText={errors.groupName?.message}
//                   margin="dense"
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name="subGroupName"
//               render={({ field }) => (
//                 <TextField
//                   fullWidth
//                   label="Sub-Group Name"
//                   {...field}
//                   error={!!errors.subGroupName}
//                   helperText={errors.subGroupName?.message}
//                   margin="dense"
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name="skillName"
//               render={({ field }) => (
//                 <TextField
//                   fullWidth
//                   label="Skill Name"
//                   {...field}
//                   error={!!errors.skillName}
//                   helperText={errors.skillName?.message}
//                   margin="dense"
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             />
//             {/* Skill Description Input */}
//             <Controller
//               control={control}
//               name="skillDescription"
//               render={({ field }) => (
//                 <TextField
//                   fullWidth
//                   label="Skill Description"
//                   {...field}
//                   error={!!errors.skillDescription}
//                   helperText={errors.skillDescription?.message}
//                   margin="dense"
//                   multiline
//                   rows={3}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setOpenPopup(false)}
//               color="secondary"
//               className="text-gray-600"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit(onSubmit)}
//               color="primary"
//               className="bg-blue-500 hover:bg-blue-700 text-white"
//             >
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <br />

//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isAssessmentEnabled}
//               onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
//               className="text-blue-600 mt-4 font-semibold"
//             />
//           }
//           label="Enable Assessments"
//           className="mt-4"
//         />

//         {isAssessmentEnabled && (
//           <Typography
//             variant="body2"
//             color="textSecondary"
//             className="mt-2 text-gray-600"
//           >
//             Managers can send assessment forms to employees reporting to them.
//           </Typography>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default SkillMatrixSetup;

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // FormControlLabel,
  // Checkbox,
  // Typography,
  // List,
  // ListItem,
  // ListItemText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../../hooks/Token/useAuth";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const SkillMatrixSetup = () => {
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const authToken = useAuthToken();

  // Fetch skills from API
  const fetchSkills = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log("datadata:", response.data);
    // return response.data;
    const data = response.data;
    return Array.isArray(data) ? data : []; // Ensure data is an array
  };

  const {
    data: skills = [],
    isLoading,
    isError,
  } = useQuery(["skills"], fetchSkills);

  const [openPopup, setOpenPopup] = useState(false);

  // Group and Sub-Group Skill Form Schema
  const skillSchema = z.object({
    skillName: z
      .string()
      .min(1, "Skill name is required")
      .max(50, "Max 50 characters allowed"),
    skillDescription: z
      .string()
      .max(200, "Maximum 200 characters allowed")
      .optional(),
    groupName: z.string().min(5, "Group name is required"),
    subGroupName: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
  });

  // Add Skill API
  const addSkill = async (data) => {
    console.log("Submitted Data:", data);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const mutation = useMutation(addSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries(["skills"]);
      toast.success("Skill added successfully!");
    },
    onError: () => {
      toast.error("Error adding the skill. Please try again.");
    },
  });

  const onSubmit = (data) => {
    console.log("Submitting skill data:", data);
    mutation.mutate({
      groupName: data.groupName, 
      subGroupName: data.subGroupName || '', 
      skillName: data.skillName,
      skillDescription: data.skillDescription || '', 
    });
    setOpenPopup(false); 
  };
  

  // Grouping logic for hierarchical display
  // const groupedSkills = Array.isArray(skills)
  // ? skills.reduce((acc, skill) => {
  //     if (!acc[skill.groupName]) acc[skill.groupName] = {};
  //     if (!acc[skill.groupName][skill.subGroupName])
  //       acc[skill.groupName][skill.subGroupName] = [];
  //     acc[skill.groupName][skill.subGroupName].push(skill.skillName);
  //     return acc;
  //   }, {})
  // : {};
  
  const groupedSkills = Array.isArray(skills)
    ? skills.reduce((acc, skill) => {
        if (!acc[skill.groupName]) acc[skill.groupName] = {};
        if (!acc[skill.groupName][skill.subGroupName])
          acc[skill.groupName][skill.subGroupName] = [];
        acc[skill.groupName][skill.subGroupName].push(skill.skillName);
        return acc;
      }, {})
    : {}; // Fallback to an empty object if skills is not an array

  return (
    <BoxComponent sx={{ p: 0 }} className="p-4">
      <div className="max-w-3xl mx-auto">
        <HeadingOneLineInfo
          className="my-3"
          heading="Skill Matrix"
          info="Setup Skill Matrix For Your Organisation."
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenPopup(true)}
          className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
        >
          Add Skill
        </Button>

        {/* Add Skill Dialog */}
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogContent className="space-y-4">
            <Controller
              control={control}
              name="groupName"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Group Name"
                  {...field}
                  error={!!errors.groupName}
                  helperText={errors.groupName?.message}
                  margin="dense"
                  className="border border-gray-300 rounded-md p-2"
                />
              )}
            />
            <Controller
              control={control}
              name="subGroupName"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Sub-Group Name"
                  {...field}
                  error={!!errors.subGroupName}
                  helperText={errors.subGroupName?.message}
                  margin="dense"
                  className="border border-gray-300 rounded-md p-2"
                />
              )}
            />
            <Controller
              control={control}
              name="skillName"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Skill Name"
                  {...field}
                  error={!!errors.skillName}
                  helperText={errors.skillName?.message}
                  margin="dense"
                  className="border border-gray-300 rounded-md p-2"
                />
              )}
            />

            <Controller
              control={control}
              name="skillDescription"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Skill Description"
                  {...field}
                  error={!!errors.skillDescription}
                  helperText={errors.skillDescription?.message}
                  margin="dense"
                  className="border border-gray-300 rounded-md p-2"
                />
              )}
            />

          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenPopup(false)}
              color="secondary"
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              color="primary"
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

     
      </div>
    </BoxComponent>
  );
};

export default SkillMatrixSetup;

// ___________________________
//based on pakages
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import React, { useState } from "react";

// const SkillMatrixSetup = () => {
//   // Module Configurations
//   const modules = {
//     "SM No Cost": {
//       maxEmployees: 10,
//       maxSkills: 250,
//       assessments: true,
//       features: [
//         "Skill Matrix Reports",
//         "The Skills Base Library",
//         "Skill Lookup Finder",
//       ],
//       price: "Free",
//     },
//     Alliance: {
//       maxEmployees: 1000,
//       maxSkills: "Unlimited",
//       assessments: true,
//       features: [
//         "Skill Matrix Reports",
//         "The Skills Base Library",
//         "People Finder",
//         "Skill Match",
//         "Skill Matrices",
//       ],
//       price: "₹80 per month/Employee",
//     },
//   };

//   // State for selected module
//   const [selectedModule, setSelectedModule] = useState("SM No Cost");
//   const currentModule = modules[selectedModule];

//   // Popup State
//   const [openPopup, setOpenPopup] = useState(false);

//   // Form State
//   const [skillName, setSkillName] = useState("");
//   const [skillDescription, setSkillDescription] = useState("");
//   const [skills, setSkills] = useState([]);

//   // Handle Add Skill
//   const handleAddSkill = () => {
//     if (
//       currentModule.maxSkills !== "Unlimited" &&
//       skills.length >= currentModule.maxSkills
//     ) {
//       alert(
//         `You can only add up to ${currentModule.maxSkills} skills in the ${selectedModule} module.`
//       );
//       return;
//     }

//     // Add skill to the list
//     setSkills((prev) => [
//       ...prev,
//       { name: skillName, description: skillDescription },
//     ]);
//     setSkillName(""); // Reset input
//     setSkillDescription("");
//     setOpenPopup(false); // Close popup
//   };

//   return (
//     <div className="p-6 bg-gray-50 h-screen">
//       {/* Heading */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">Skill Matrix Setup</h1>
//         <p className="text-gray-600">
//           Configure your skill matrix based on the selected module.
//         </p>
//       </div>

//       {/* Module Selector */}
//       <div className="mb-6">
//         <label className="block text-gray-700 font-medium mb-2">
//           Select Module:
//         </label>
//         <select
//           value={selectedModule}
//           onChange={(e) => setSelectedModule(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           {Object.keys(modules).map((module) => (
//             <option value={module} key={module}>
//               {module}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Module Details */}
//       <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
//         <h2 className="text-xl font-semibold mb-4">Module Details</h2>
//         <ul className="list-disc ml-6 mb-4 text-gray-700">
//           {currentModule.features.map((feature, index) => (
//             <li key={index}>{feature}</li>
//           ))}
//         </ul>
//         <p className="text-gray-700">
//           <strong>Price:</strong> {currentModule.price}
//         </p>
//         <p className="text-gray-700">
//           <strong>Max Employees:</strong> {currentModule.maxEmployees}
//         </p>
//         <p className="text-gray-700">
//           <strong>Max Skills:</strong> {currentModule.maxSkills}
//         </p>
//         <p className="text-gray-700">
//           <strong>Assessments Enabled:</strong>{" "}
//           {currentModule.assessments ? "Yes" : "No"}
//         </p>
//       </div>

//       {/* Add Skill Button */}
//       <button
//         onClick={() => setOpenPopup(true)}
//         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//         disabled={
//           currentModule.maxSkills !== "Unlimited" &&
//           skills.length >= currentModule.maxSkills
//         }
//       >
//         Add Skill
//       </button>

//       {/* Popup for Adding Skills */}
//       <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//         <DialogTitle>
//           <span className="text-xl font-semibold">Add Skill</span>
//         </DialogTitle>
//         <DialogContent>
//           <div className="flex flex-col space-y-4 mt-2">
//             <input
//               type="text"
//               value={skillName}
//               onChange={(e) => setSkillName(e.target.value)}
//               placeholder="Skill Name"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <textarea
//               value={skillDescription}
//               onChange={(e) => setSkillDescription(e.target.value)}
//               placeholder="Skill Description"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={3}
//             />
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <button
//             onClick={() => setOpenPopup(false)}
//             className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAddSkill}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </DialogActions>
//       </Dialog>

//       {/* Skill Hierarchy */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Skills Hierarchy</h2>
//         <ul className="space-y-2">
//           {skills.map((skill, index) => (
//             <li
//               key={index}
//               className="p-4 bg-white shadow-sm border rounded-lg"
//             >
//               <h3 className="font-medium text-gray-800">{skill.name}</h3>
//               <p className="text-gray-600">{skill.description}</p>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Enable Assessments */}
//       {currentModule.assessments && (
//         <div className="mt-6">
//           <label className="flex items-center space-x-2">
//             <input type="checkbox" className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-700">Enable Assessments</span>
//           </label>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SkillMatrixSetup;
