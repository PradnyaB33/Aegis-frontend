// import { zodResolver } from "@hookform/resolvers/zod";
// import { AssignmentInd } from "@mui/icons-material";
// import { Box, Button, Modal } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "react-query";
// import { z } from "zod";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import AuthInputFiled from "../../InputFileds/AuthInputFiled";
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   p: 4,
// };

// const CreateEmpCodeModel = ({ handleClose, open, organisationId }) => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();
//   const [error, setError] = useState();

//   const EmpCodeSchema = z.object({
//     code: z.string(),
//   });

//   const {
//     control,
//     formState: { errors },
//     handleSubmit,
//   } = useForm({
//     defaultValues: {
//       code: undefined,
//     },
//     resolver: zodResolver(EmpCodeSchema),
//   });

//   const AddEmpCode = useMutation(
//     (data) =>
//       axios.post(
//         `${process.env.REACT_APP_API}/route/create/employee-code-generator/${organisationId}`,
//         data,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       ),

//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["empCode"] });
//         handleClose();
//         handleAlert(true, "success", "Employee code generated succssfully");
//       },
//       onError: () => {
//         setError("An error occurred while generating the employee code.");
//       },
//     }
//   );

//   const onSubmit = async (data) => {
//     try {
//       console.log(data);
//       await AddEmpCode.mutateAsync(data);
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred while generating the employee code.");
//     }
//   };
//   console.log(error);

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box
//         sx={style}
//         className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
//       >
//         <div className="flex justify-between py-4 items-center  px-4">
//           <h1 className="text-xl pl-2 font-semibold font-sans">
//             Generate Employee Code
//           </h1>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="px-5 space-y-4 mt-4">
//             <div className="space-y-2 ">
//               <AuthInputFiled
//                 name="code"
//                 icon={AssignmentInd}
//                 control={control}
//                 type="text"
//                 placeholder="code"
//                 label=" Employee Code *"
//                 errors={errors}
//                 error={errors.code}
//               />
//             </div>

//             <div className="flex gap-4  mt-4  justify-end">
//               <Button onClick={handleClose} color="error" variant="outlined">
//                 Cancel
//               </Button>

//               <Button type="submit" variant="contained" color="primary">
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default CreateEmpCodeModel;

import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentInd } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const CreateEmpCodeModel = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [error, setError] = useState();
  console.log(error);
  const EmpCodeSchema = z.object({
    code: z.string(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset, // Add reset here
  } = useForm({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(EmpCodeSchema),
  });

  const AddEmpCode = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/create/employee-code-generator/${organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empCode"] });
        handleClose();
        handleAlert(true, "success", "Employee code generated successfully");
      },
      onError: () => {
        setError("An error occurred while generating the employee code.");
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      console.log(data);
      await AddEmpCode.mutateAsync(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while generating the employee code.");
    }
  };

  useEffect(() => {
    if (open) {
      reset({ code: "" }); // Reset form values when the modal opens
    }
  }, [open, reset]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            Generate Employee Code
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2">
              <AuthInputFiled
                name="code"
                icon={AssignmentInd}
                control={control}
                type="text"
                placeholder="code"
                label="Employee Code *"
                errors={errors}
                error={errors.code}
              />
            </div>

            <div className="flex gap-4 mt-4 justify-end">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>

              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateEmpCodeModel;
