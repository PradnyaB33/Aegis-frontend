import { zodResolver } from "@hookform/resolvers/zod";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NotesIcon from "@mui/icons-material/Notes";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import { Button } from "@mui/material";
import BasicButton from "../../../components/BasicButton";

const Step2 = ({ isLastStep, nextStep, prevStep }) => {
  const {
    dept_cost_center_name,
    dept_cost_center_description,
    dept_id,
    dept_cost_center_id,
    setStep2Data,
  } = useDepartmentState();


  // to define the schema using zod
  const DepartmentSchema = z.object({
    dept_cost_center_name: z.string().optional(),
    dept_cost_center_description: z.string().optional(),
    dept_id: z.string(),
    dept_cost_center_id: z.string(),
  });

  // to define the useForm from react-hook-form
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      dept_cost_center_name: dept_cost_center_name,
      dept_cost_center_description: dept_cost_center_description,
      dept_id: dept_id,
      dept_cost_center_id: dept_cost_center_id,
    },
    resolver: zodResolver(DepartmentSchema),
  });

  const { errors } = formState;

  // to define the onSubmit funciton
  const onsubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="item-center flex flex-col"
      >
        <div className="grid md:grid-cols-2 md:gap-4 gap-0 px-4 grid-cols-1">
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
        <div className="grid md:grid-cols-2 md:gap-4 gap-0 px-4 grid-cols-1">
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
        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => {
              prevStep();
            }}
            type="button"
            variant="outlined"
            className="!w-max"
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
          <BasicButton type="submit" title={"Next"} disabled={isLastStep} />
        </div>
      </form>
    </div>
  );
};

export default Step2;
