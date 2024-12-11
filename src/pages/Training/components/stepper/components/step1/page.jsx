import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOutlined, DescriptionOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../../../components/InputFileds/AuthInputFiled";
import ImageInput from "../../../../../AddOrganisation/components/image-input";
import useTrainingStore from "../zustand-store";

const Step1 = ({ nextStep }) => {
  const {
    trainingName,
    trainingType,
    trainingDescription,
    trainingStartDate,
    trainingLink,
    trainingImage,
    trainingLocation,
    trainingEndDate,
    setStep1,
    trainingPoints,
    trainingDownCasted,
  } = useTrainingStore();

  const trainingForm = z.object({
    trainingImage: z.any().refine(
      (file) => {
        if (typeof file === "string") {
          return true;
        }
        return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
      },
      { message: "Image size must be 5kb to 50kb" }
    ),
    trainingName: z.string(),

    trainingDescription: z.string(),
  });
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      trainingImage,
      trainingName,
      trainingType,
      trainingDescription,
      trainingStartDate,
      trainingLocation,
      trainingLink,
      trainingEndDate,
      trainingPoints,
      trainingDownCasted,
    },
    resolver: zodResolver(trainingForm),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    setStep1(data);
    nextStep();
  };

  return (
    <div>
      <form
        className=" items-center flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-1 w-full items-center flex flex-col ">
          <Controller
            control={control}
            name={"trainingImage"}
            render={({ field }) => {
              return (
                <ImageInput
                  className={
                    "!rounded-lg !w-full !object-cover !h-44 !bg-cover !bg-center"
                  }
                  field={field}
                />
              );
            }}
          />
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={"trainingImage"}
              render={({ message }) => {
                return <p className="text-sm text-red-500">{message}</p>;
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <AuthInputFiled
            name="trainingName"
            icon={BookOutlined}
            label={"Training Name *"}
            type="text"
            placeholder="Training Name"
            className="items-center"
            control={control}
            error={errors.trainingName}
            errors={errors}
          />

          <AuthInputFiled
            name="trainingDescription"
            icon={DescriptionOutlined}
            label={"Training Description *"}
            type="texteditor"
            placeholder="Training Description"
            className="items-center"
            control={control}
            error={errors.trainingDescription}
            errors={errors}
          />
        </div>

        <Button
          type="submit"
          size="large"
          className="!h-[40px] !w-[40px]"
          variant="contained"
        >
          Next
        </Button>
      </form>
    </div>
  );
};

export default Step1;
