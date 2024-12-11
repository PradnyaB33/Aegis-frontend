import { zodResolver } from "@hookform/resolvers/zod";
import { Business } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const Form1 = ({ nextStep, isLastStep }) => {
  const organisationId = useParams();

  const ApplyJobRoleSchema = z.object({
    email: z.string().email(),
    empId: z
      .string()
      .min(1, { message: "Employee code is required" })
      .max(25, { message: "Employee code is not greater than 25 character" }),
    isChecked: z.boolean().refine((value) => value === true, {
      message: "Do you agree the terms and conditions set by organisation.",
    }),
  });

  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {},
    resolver: zodResolver(ApplyJobRoleSchema),
  });

  const { errors } = formState;
  console.log(errors);
  const onSubmit = async (data) => {
    console.log(`🚀 ~ data:`, data);
    console.log(getValues());
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Basic Information</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInputFiled
            name="empId"
            icon={Business}
            control={control}
            type="text"
            placeholder="Employee Id"
            label="Employee Id*"
            errors={errors}
            error={errors.empId}
          />
          <AuthInputFiled
            name="email"
            icon={Email}
            control={control}
            type="text"
            placeholder="Employee Email"
            label="Employee  Email *"
            errors={errors}
            error={errors.email}
          />
        </div>

        <div className="flex items-center ">
          <div className="w-max">
            <AuthInputFiled
              name="isChecked"
              control={control}
              type="checkbox"
              label={`I accept the`}
              errors={errors}
              error={errors.isChecked}
            />
          </div>
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
    </div>
  );
};

export default Form1;
