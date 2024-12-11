import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Person } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEditDepartmentState from "../../../hooks/DepartmentHook/useEditDepartmentState";
import useDeptOption from "../../../hooks/DepartmentHook/useDeptOption";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { CircularProgress } from "@mui/material";

const Step1 = ({ nextStep, isLastStep }) => {
  // state
  const { organisationId, deptId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const {
    DepartmentLocationOptions,
    DepartmentHeadOptions,
    DelegateDepartmentHeadOptions,
  } = useDeptOption({ organisationId });

  const {
    setStep1Data,
    dept_name,
    dept_description,
    dept_location,
    dept_head_name,
    dept_delegate_head_name,
  } = useEditDepartmentState();

  // to define the schema using zod
  const DepartmentSchema = z.object({
    dept_name: z
      .string()
      .min(2, { message: "Minimum two characters required" }),
    dept_description: z.string().optional(),
    dept_location: z.object({
      label: z.string(),
      value: z.string(),
    }),
    dept_head_name: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    dept_delegate_head_name: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
  });

  // use useForm
  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      dept_name: dept_name,
      dept_description: dept_description,
      dept_location: dept_location,
      dept_head_name: dept_head_name,
      dept_delegate_head_name: dept_delegate_head_name,
    },
    resolver: zodResolver(DepartmentSchema),
  });
  const { errors } = formState;

  // for getting the  existing data and set the value
  const { isLoading } = useQuery(
    ["department", deptId],
    async () => {
      if (deptId !== null && deptId !== undefined) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/get-department/${organisationId}/${deptId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return response.data.data;
      }
    },
    {
      onSuccess: (data) => {
        console.log("data", data);
        if (data) {
          setValue("dept_name", data.departmentName || "");
          setValue("dept_description", data.departmentDescription || "");
          setValue("dept_location", {
            label: data.departmentLocation?.city || "",
            value: data.departmentLocation?._id || "",
          });
          setValue("dept_head_name", {
            label: data.departmentHeadName?.first_name || "",
            value: data.departmentHeadName?._id || "",
          });
          setValue("dept_delegate_head_name", {
            label: data.departmentHeadDelegateName?.first_name || "",
            value: data.departmentHeadDelegateName?._id || "",
          });
        }
      },
    }
  );

  // to define the onSubmit funciton
  const onSubmit = async (data) => {
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Department Details</h1>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="dept_name"
                icon={Business}
                control={control}
                type="text"
                placeholder="Department Name"
                label="Department Name *"
                errors={errors}
                error={errors.dept_name}
              />
              <AuthInputFiled
                name="dept_location"
                value={dept_location}
                icon={LocationOnIcon}
                control={control}
                type="select"
                placeholder="Department Location"
                label="Select Department Location*"
                errors={errors}
                error={errors.dept_location}
                options={DepartmentLocationOptions}
              />
            </div>

            <AuthInputFiled
              name="dept_description"
              icon={NotesIcon}
              control={control}
              type="textarea"
              placeholder="Department Description"
              label="Department Description"
              errors={errors}
              error={errors.dept_description}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="dept_head_name"
                value={dept_head_name}
                icon={Person}
                control={control}
                type="select"
                placeholder="Department Head"
                label="Select Department Head"
                errors={errors}
                error={errors.dept_head_name}
                options={DepartmentHeadOptions}
              />
              <AuthInputFiled
                name="dept_delegate_head_name"
                value={dept_delegate_head_name}
                icon={Person}
                control={control}
                type="select"
                placeholder="Delegate Department Head"
                label="Select Delegate Department Head"
                errors={errors}
                error={errors.dept_delegate_head_name}
                options={DelegateDepartmentHeadOptions}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLastStep}
                className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
              >
                Next
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Step1;
