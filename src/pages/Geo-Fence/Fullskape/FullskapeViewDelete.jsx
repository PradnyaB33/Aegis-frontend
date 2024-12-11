
// import {
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//   } from "@mui/material";
//   import axios from "axios";
//   import React, { useState } from "react";
//   import { useForm } from "react-hook-form";
//   import { useQuery, useQueryClient } from "react-query";
//   import useGeoMutation from "../Mutation/useGeoCard";
//   import FullskapeTableComponent from "./FullskapeTable";
//   import useStudentListStore from "./useStudentListStore";
//   import useAuthToken from "../../../hooks/Token/useAuth";
//   import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
//   import { z } from "zod";
//   import { zodResolver } from "@hookform/resolvers/zod";
//   import FilterStudentForm from "./fullskapeinputform";
  

//   const StudentSchema = z.object({
//     name: z
//       .string()
//       .min(1, "Student Name is required")
//       .max(50, "Student Name cannot exceed 50 characters"),
//     parentPhoneNumber: z
//       .string()
//       .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
//     parentEmail: z
//       .string()
//       .email("Enter a valid email address"),
//     division: z
//       .string()
//       .min(1, "Division is required")
//       .max(10, "Division cannot exceed 10 characters"),
//     PRN: z
//       .string()
//       .regex(/^[A-Za-z0-9]{5,15}$/, "Enter a valid PRN (5-15 alphanumeric characters)"),
//     studentPhoneNumber: z
//       .string()
//       .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
//     class: z
//       .string()
//       .min(1, "Class is required")
//       .max(10, "Class cannot exceed 10 characters"),
//   });
    
//   // Fetch added employee in geofence area
//   const fetchAddedStudents = async (zoneId) => {
//     const { data } = await axios.get(
//       `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
//     );
//     console.log("fetchAddedEmployee", data);
//     return data?.data;
//   };
  
//   const FullskapeViewDelete = ({ onClose, zoneId }) => {
//     const { register, setValue, watch } = useForm();
//     const { addEmployeeToCircleMutate } = useGeoMutation();
//     const { incrementPage, decrementPage, employeeList, page } = useStudentListStore();
  
//     const [openStudentModal, setOpenStudentModal] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [localStudents, setLocalStudents] = useState([]);
   
//     const queryClient = useQueryClient();


  
//     const onSubmit = (data) => {
//       const selected = Object.entries(data).reduce((acc, [key, value]) => {
//         if (value !== false) {
//           acc[key] = value;
//         }
//         return acc;
//       }, {});
//       const selectedId = Object.keys(selected).filter((key) => key !== "selectAll");
//       addEmployeeToCircleMutate({ zoneId, employeeId: selectedId, onClose });
//     };
  
//     // Handle file change for image upload
//     const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setSelectedImage(URL.createObjectURL(file)); // Create a preview URL for the uploaded image
//       }
//     };

//     const authToken = useAuthToken();


//     // use useForm
//     const {
//       control,
//       handleSubmit,
//       formState: { errors },
//       reset,
//     } = useForm({
//       defaultValues: {
//         name: "",
//         parentPhoneNumber: "",
//         parentEmail: "",
//         studentPhoneNumber: "",
//         class: "",
//         division: "",
//         PRN: "",
//       },
//       resolver: zodResolver(StudentSchema),
//     });

//     const uploadStudentImage = async (file) => {
//         if (!file) {
//           throw new Error("No file provided for upload.");
//         }
      
//         try {
//           // Step 1: Fetch signed URL from the backend
//           const { data: { url } } = await axios.get(
//             `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: authToken,
//               },
//             }
//           );
      
//           // Step 2: Upload file to S3 using the signed URL
//           await axios.put(url, file, {
//             headers: {
//               "Content-Type": file.type,
//             },
//           });
      
//           // Step 3: Extract and return the image URL (without query parameters)
//           return url.split("?")[0];
//         } catch (error) {
//           console.error("Image upload failed:", error.message);
//           throw new Error("Failed to upload the image.");
//         }
//       };
      
//       const handleAddStudent = async (formData) => {
//         try {
//           let imageUrl = null;
//           if (selectedImage) {
//             const file = document.querySelector('input[type="file"]').files[0];
//             imageUrl = await uploadStudentImage(file);
//           }
//           const payload = { ...formData, imageUrl };
//           const response = await axios.post(
//             `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
//             payload,
//             { headers: { Authorization: authToken } }
//           );
      
//           if (response.data.success) {
//             reset(); // Reset form fields
//             setSelectedImage(null); // Clear image preview
//             setOpenStudentModal(false); // Close modal
      
//             // Update local state
//             setLocalStudents((prev) => [...prev, response.data.student]);
      
//             // Update the React Query cache
//             queryClient.setQueryData(["addedStudents", zoneId], (oldData) => {
//               return [...(oldData || []), response.data.student];
//             });
//           } else {
//             throw new Error(response.data.message);
//           }
//         } catch (error) {
//           console.error("Failed to add student:", error.message);
//         }
//       };
      
  
//     const { data: addedEmployee } = useQuery(
//       ["addedStudents", zoneId],
//       () => fetchAddedStudents(zoneId),
//       {
//         enabled: !!zoneId,
//         onSuccess: (data) => console.log("Fetched addedStudents:", data),
//       }
//     );

//     const combinedStudents = [...(addedEmployee || []), ...localStudents];
  
//     return (
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex gap-4 flex-col overflow-scroll"
//       >
//         <FilterStudentForm zoneId={zoneId} />
//         <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
//           <FullskapeTableComponent
//             register={register}
//             setValue={setValue}
//             watch={watch}
//             addedEmployee={combinedStudents}
//             zoneId={zoneId}
//           />
//         </div>
//         <div className="flex justify-between items-center">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setOpenStudentModal(true)}
//           >
//             Add Student
//           </Button>
//           <div className="flex flex-row-reverse gap-4">
//             <Button
//               type="button"
//               onClick={incrementPage}
//               disabled={employeeList?.length < 10}
//               variant="outlined"
//               className="!py-1 !w-[20px]"
//             >
//               Next
//             </Button>
//             <Button
//               onClick={decrementPage}
//               disabled={page <= 0}
//               type="button"
//               variant="outlined"
//               className="!py-1 !w-[20px]"
//             >
//               Pre
//             </Button>
//           </div>
//         </div>
//         <Button type="submit" variant="contained">
//           Save
//         </Button>
  
//         {/* Add Student Modal */}
//         <Dialog
//         open={openStudentModal}
//         onClose={() => setOpenStudentModal(false)}
//       >
//         <DialogTitle>Add Student</DialogTitle>
//         <form onSubmit={handleSubmit(handleAddStudent)}>
//           <DialogContent>
//             <AuthInputFiled
//               name="name"
//               control={control}
//               type="text"
//               placeholder="Student Name"
//               label="Student Name *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="parentPhoneNumber"
//               control={control}
//               type="text"
//               placeholder="Parent's Contact Number"
//               label="Parent's Contact Number *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="parentEmail"
//               control={control}
//               type="email"
//               placeholder="Parent's Email"
//               label="Parent's Email *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="studentPhoneNumber"
//               control={control}
//               type="text"
//               placeholder="Student's Contact Number"
//               label="Student's Contact Number *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="class"
//               control={control}
//               type="text"
//               placeholder="Class"
//               label="Class *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="division"
//               control={control}
//               type="text"
//               placeholder="Division"
//               label="Division *"
//               errors={errors}
//             />
//             <AuthInputFiled
//               name="PRN"
//               control={control}
//               type="text"
//               placeholder="PRN"
//               label="PRN *"
//               errors={errors}
//             />
//             <div>
//               <label>Upload Student Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//               {selectedImage && (
//                 <img
//                   src={selectedImage}
//                   alt="Preview"
//                   style={{ maxWidth: "100%", maxHeight: "150px" }}
//                 />
//               )}
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenStudentModal(false)}>Cancel</Button>
//             <Button type="submit" variant="contained">Add</Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       </form>
//     );
//   };
  
//   export default FullskapeViewDelete;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import useGeoMutation from "../Mutation/useGeoCard";
import FullskapeTableComponent from "./FullskapeTable";
// import useStudentListStore from "./useStudentListStore";
import useAuthToken from "../../../hooks/Token/useAuth";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const StudentSchema = z.object({
  name: z
    .string()
    .min(1, "Student Name is required")
    .max(50, "Student Name cannot exceed 50 characters"),
  parentPhoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  parentEmail: z.string().email("Enter a valid email address"),
  division: z
    .string()
    .min(1, "Division is required")
    .max(10, "Division cannot exceed 10 characters"),
  PRN: z
    .string()
    .regex(/^[A-Za-z0-9]{5,15}$/, "Enter a valid PRN (5-15 alphanumeric characters)"),
  studentPhoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  class: z
    .string()
    .min(1, "Class is required")
    .max(10, "Class cannot exceed 10 characters"),
});

// Fetch added employee in geofence area
const fetchAddedStudents = async (zoneId) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
  );
  console.log("fetchAddedEmployee", data);
  return data?.data;
};

const FullskapeViewDelete = ({ onClose, zoneId }) => {
  const { register, setValue, watch } = useForm();
  const { addEmployeeToCircleMutate } = useGeoMutation();
  // const { incrementPage, decrementPage, employeeList, page } = useStudentListStore();

  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [localStudents, setLocalStudents] = useState([]);

  const queryClient = useQueryClient();

  const onSubmit = (data) => {
    const selected = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const selectedId = Object.keys(selected).filter((key) => key !== "selectAll");
    addEmployeeToCircleMutate({ zoneId, employeeId: selectedId, onClose });
  };

  // Handle file change for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Create a preview URL for the uploaded image
    }
  };

  const authToken = useAuthToken();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      parentPhoneNumber: "",
      parentEmail: "",
      studentPhoneNumber: "",
      class: "",
      division: "",
      PRN: "",
    },
    resolver: zodResolver(StudentSchema),
  });

  const uploadStudentImage = async (file) => {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    try {
      const { data: { url } } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return url.split("?")[0];
    } catch (error) {
      console.error("Image upload failed:", error.message);
      throw new Error("Failed to upload the image.");
    }
  };

  const handleAddStudent = async (formData) => {
    try {
      let imageUrl = null;
      if (selectedImage) {
        const file = document.querySelector('input[type="file"]').files[0];
        imageUrl = await uploadStudentImage(file);
      }
      const payload = { ...formData, imageUrl };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
        payload,
        { headers: { Authorization: authToken } }
      );

      if (response.data.success) {
        reset();
        setSelectedImage(null);
        setOpenStudentModal(false);
        setLocalStudents((prev) => [...prev, response.data.student]);
        queryClient.setQueryData(["addedStudents", zoneId], (oldData) => {
          return [...(oldData || []), response.data.student];
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to add student:", error.message);
    }
  };

  const { data: addedEmployee } = useQuery(
    ["addedStudents", zoneId],
    () => fetchAddedStudents(zoneId),
    {
      enabled: !!zoneId,
      onSuccess: (data) => console.log("Fetched addedStudents:", data),
    }
  );

  const combinedStudents = [...(addedEmployee || []), ...localStudents];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 flex-col overflow-scroll"
    >
      <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
        <FullskapeTableComponent
          register={register}
          setValue={setValue}
          watch={watch}
          addedEmployee={combinedStudents}
          zoneId={zoneId}
        />
      </div>
      <div className="flex flex-row-reverse items-center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenStudentModal(true)}
        >
          Add Student
        </Button>
        {/* <div className="flex flex-row-reverse gap-4">
          <Button
            type="button"
            onClick={incrementPage}
            disabled={employeeList?.length < 10}
            variant="outlined"
            className="!py-1 !w-[20px]"
          >
            Next
          </Button>
          <Button
            onClick={decrementPage}
            disabled={page <= 0}
            type="button"
            variant="outlined"
            className="!py-1 !w-[20px]"
          >
            Pre
          </Button>
        </div> */}
      </div>
      

      <Dialog
        open={openStudentModal}
        onClose={() => setOpenStudentModal(false)}
      >
        <DialogTitle>Add Student</DialogTitle>
        <form onSubmit={handleSubmit(handleAddStudent)}>
          <DialogContent>
            <AuthInputFiled
              name="name"
              control={control}
              type="text"
              placeholder="Student Name"
              label="Student Name *"
              errors={errors}
            />
            <AuthInputFiled
              name="parentPhoneNumber"
              control={control}
              type="text"
              placeholder="Parent's Contact Number"
              label="Parent's Contact Number *"
              errors={errors}
            />
            <AuthInputFiled
              name="parentEmail"
              control={control}
              type="email"
              placeholder="Parent's Email"
              label="Parent's Email *"
              errors={errors}
            />
            <AuthInputFiled
              name="studentPhoneNumber"
              control={control}
              type="text"
              placeholder="Student's Contact Number"
              label="Student's Contact Number *"
              errors={errors}
            />
            <AuthInputFiled
              name="class"
              control={control}
              type="text"
              placeholder="Class"
              label="Class *"
              errors={errors}
            />
            <AuthInputFiled
              name="division"
              control={control}
              type="text"
              placeholder="Division"
              label="Division *"
              errors={errors}
            />
            <AuthInputFiled
              name="PRN"
              control={control}
              type="text"
              placeholder="PRN"
              label="PRN *"
              errors={errors}
            />
            <div>
              <label>Upload Student Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "150px" }}
                />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStudentModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </form>
  );
};

export default FullskapeViewDelete;
