import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const Form3 = ({ isLastStep, nextStep, prevStep }) => {
  const ApplyJobRoleSchema = z.object({
    durationOfCurrentRole: z
      .string()
      .regex(
        /^(0?[1-9]|[1-5][0-9]|6[0-9]) years (\d{1,2}) months$/,
        "Please provide valid duration in years and months"
      ),
    yearsOfExperience: z
      .string()
      .regex(
        /^(0?[1-9]|[1-5][0-9]|6[0-9]) years (\d{1,2}) months$/,
        "Please provide valid duration in years and months"
      ),
  });

  const { control, formState, handleSubmit } = useForm({
    resolver: zodResolver(ApplyJobRoleSchema),
  });

  const { errors } = formState;
  const onsubmit = (data) => {
    console.log(data);
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
      <h1 className="text-xl mb-4 font-bold">Additional Information</h1>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <AuthInputFiled
          name="durationOfCurrentRole"
          icon={Business}
          control={control}
          type="text"
          placeholder=""
          label="What is the duration of your current role? *"
          errors={errors}
          error={errors.durationOfCurrentRole}
        />
        <AuthInputFiled
          name="yearsOfExperience"
          icon={Business}
          control={control}
          type="text"
          placeholder=""
          label="How many years of experience do you have? *"
          errors={errors}
          error={errors.yearsOfExperience}
        />
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
    </div>
  );
};

export default Form3;
