import { zodResolver } from "@hookform/resolvers/zod";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NotesIcon from "@mui/icons-material/Notes";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEditDepartmentState from "../../../hooks/DepartmentHook/useEditDepartmentState";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import { CircularProgress } from "@mui/material";

const Step2 = ({ isLastStep, nextStep, prevStep }) => {
  // to define the state
  const { organisationId, deptId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const {
    dept_cost_center_name,
    dept_cost_center_description,
    dept_id,
    dept_cost_center_id,
    setStep2Data,
  } = useEditDepartmentState();

  // to define the schema using zod
  const DepartmentSchema = z.object({
    dept_cost_center_name: z.string().optional(),
    dept_cost_center_description: z.string().optional(),
    dept_id: z.string(),
    dept_cost_center_id: z.string(),
  });

  // to define the useForm from react-hook-form
  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      dept_cost_center_name: dept_cost_center_name,
      dept_cost_center_description: dept_cost_center_description,
      dept_id: dept_id,
      dept_cost_center_id: dept_cost_center_id,
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
          setValue("dept_cost_center_name", data.costCenterName || "");
          setValue(
            "dept_cost_center_description",
            data.costCenterDescription || ""
          );
          setValue("dept_id", data.departmentId || "");
          setValue("dept_cost_center_id", data.dept_cost_center_id || "");
        }
      },
    }
  );

  // to define the onSubmit funciton
  const onsubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Cost Center Info</h1>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="w-full flex flex-col space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="dept_cost_center_name"
                icon={MonetizationOnIcon}
                control={control}
                type="text"
                placeholder="Department Cost Center Name"
                label="Department Cost Center Name"
                errors={errors}
                error={errors.dept_cost_center_name}
              />
              <AuthInputFiled
                name="dept_cost_center_description"
                icon={NotesIcon}
                control={control}
                type="text"
                placeholder="Department Cost Center Description"
                label="Department Cost Center Description"
                errors={errors}
                error={errors.dept_cost_center_description}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AuthInputFiled
                name="dept_id"
                icon={FormatListNumberedIcon}
                control={control}
                type="text"
                placeholder="Department ID"
                label="Department ID *"
                errors={errors}
                error={errors.dept_id}
              />
              <AuthInputFiled
                name="dept_cost_center_id"
                icon={FormatListNumberedIcon}
                control={control}
                type="text"
                placeholder="Department Cost Center Id"
                label="Department Cost Center ID *"
                errors={errors}
                error={errors.dept_cost_center_id}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  prevStep();
                }}
                className="w-full sm:w-auto flex justify-center px-4 py-2 rounded-md text-md font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
              >
                Prev
              </button>
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

export default Step2;
