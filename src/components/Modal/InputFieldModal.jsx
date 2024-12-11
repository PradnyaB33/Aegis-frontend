import { zodResolver } from "@hookform/resolvers/zod";
import {
  Checklist,
  DataArray,
  DriveFileRenameOutlineOutlined,
  LabelOutlined,
  TitleOutlined,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import useAuthToken from "../../hooks/Token/useAuth";
import AuthInputFiled from "../InputFileds/AuthInputFiled";

const InputFieldModal = ({ handleClose, open, id, empTypeId }) => {
  const authToken = useAuthToken();

  const inputFieldSchema = z.object({
    name: z.string().min(3, { message: "Minimum three character required" }),
    label: z.string().min(3, { message: "Minimum three character required" }),
    placeholder: z.string(),
    type: z.string(),
    mandatory: z.boolean(),
    options: z.string().array().optional(),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      name: undefined,
      label: undefined,
      placeholder: undefined,
      type: undefined,
      mandatory: false,
      options: undefined,
    },
    resolver: zodResolver(inputFieldSchema),
  });

  const isTypeSelect = watch("type");
  const { errors } = formState;

  const { data } = useQuery(
    ["empType", empTypeId],
    async () => {
      if (open && empTypeId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employment-types/${empTypeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      }
    },
    {
      enabled: open && empTypeId !== null && empTypeId !== undefined,
    }
  );

  const [titleEmpType, setTitleEmpType] = useState("");

  const queryClient = useQueryClient();

  const AddInputFields = useMutation(
    async (data) =>
      await axios.post(
        `${process.env.REACT_APP_API}/route/inputfield/create/${id}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["inputFieldsData"] });
        handleClose();
        setTitleEmpType("");
      },
      onError: (error) => {
        console.error("error");
      },
    }
  );

  const EditEmployeeType = useMutation(
    async (data) =>
      await axios.put(
        `${process.env.REACT_APP_API}/route/employment-types/${empTypeId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empTypes"] });
        handleClose();
      },
      onError: (error) => {
        console.error("An error occurred while creating a neemppTypet");
      },
    }
  );

  useEffect(() => {
    if (data?.empType) {
      setTitleEmpType(data?.empType?.title || "");
    }
  }, [data]);

  const TypesOptions = [
    {
      label: "text",
      value: "text",
    },
    {
      label: "email",
      value: "email",
    },
    {
      label: "date",
      value: "date",
    },
    {
      label: "select",
      value: "select",
    },
    {
      label: "textarea",
      value: "textarea",
    },
  ];

  const onsubmit = async (data) => {
    try {
      if (empTypeId) {
        await EditEmployeeType.mutate(data);
      } else {
        await AddInputFields.mutate(data);
      }
      // Reset form state
    } catch (error) {
      console.error(error);
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const data = {
  //         title: titleEmpType,
  //       };

  //       if (titleEmpType.length <= 0) {
  //         setError("Title field is Mandatory");
  //         return false;
  //       }

  //       if (empTypeId) {
  //         await EditEmployeeType.mutateAsync(data);
  //       } else {
  //         // Use the AddInputFields function from React Query
  //         await AddInputFields.mutateAsync(data);
  //       }
  //       // Reset form state
  //     } catch (error) {
  //       console.error(error);
  //       setError("An error occurred while creating a neemppTypet");
  //     }
  //   };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

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
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            {empTypeId
              ? "Edit Employment Types"
              : "Add input field for employee onboarding"}
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-2">
            <AuthInputFiled
              name={"name"}
              placeholder={"Enter input field name"}
              label={"name"}
              icon={DriveFileRenameOutlineOutlined}
              control={control}
              type="text"
              errors={errors}
              error={errors.name}
            />

            <div className="grid grid-cols-2 w-full gap-3">
              <AuthInputFiled
                name={"label"}
                placeholder={"Enter input field label"}
                label={"label"}
                icon={LabelOutlined}
                control={control}
                type="text"
                errors={errors}
                error={errors.label}
              />
              <AuthInputFiled
                name={"placeholder"}
                placeholder={"Enter input field placeholder"}
                label={"placeholder"}
                icon={DataArray}
                control={control}
                type="text"
                errors={errors}
                error={errors.placeholder}
              />
            </div>

            <AuthInputFiled
              name={"type"}
              placeholder={"select input field type"}
              label={"type"}
              icon={TitleOutlined}
              control={control}
              type="select"
              options={TypesOptions}
              errors={errors}
              error={errors.type}
            />
            {isTypeSelect === "select" && (
              <AuthInputFiled
                name={"options"}
                placeholder={"options"}
                label={"Create options"}
                icon={Checklist}
                control={control}
                type="autocomplete"
                errors={errors}
                error={errors.options}
              />
            )}
            <AuthInputFiled
              name={"mandatory"}
              placeholder={"Manadatory"}
              label={"Manadatory"}
              control={control}
              type="checkbox"
              errors={errors}
              error={errors.mandatory}
            />

            <div className="flex gap-4  mt-4 justify-end">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              {empTypeId ? (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={EditEmployeeType.isLoading}
                >
                  {EditEmployeeType.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Apply"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={AddInputFields.isLoading}
                >
                  {AddInputFields.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default InputFieldModal;
