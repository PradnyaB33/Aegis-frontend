import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feedback, StarBorder } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../../components/InputFileds/AuthInputFiled";
import PdfInput from "../../../../AddOrganisation/components/pdf-input";

const MiniForm = ({ mutate, doc }) => {
  const formSchema = z.object({
    proofOfSubmissionUrl: z.any().refine(
      (file) => {
        return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
      },
      { message: "Document size maximum 50kb" }
    ),
    rating: z.number().int().min(1).max(5),
    feedback: z.string().min(10),
    employeeTrainingId: z.string(),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      proofOfSubmissionUrl: undefined,
      rating: undefined,
      feedback: undefined,
      employeeTrainingId: doc._id,
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
  };

  return (
    <form
      className="flex flex-col gap-4 items-center w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-bold text-left w-full">Complete Training</h1>
      <div className="gap-8 w-full">
        <div className="space-y-1 w-full items-center flex flex-col ">
          <Controller
            control={control}
            name={"proofOfSubmissionUrl"}
            render={({ field }) => {
              return <PdfInput field={field} />;
            }}
          />
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={"proofOfSubmissionUrl"}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>
        </div>
      </div>
      <AuthInputFiled
        name="rating"
        label="Rating"
        control={control}
        type="naresh-select"
        icon={StarBorder}
        placeholder="Rating"
        error={errors.rating}
        errors={errors}
        options={[
          { value: 1, label: 1 },
          { value: 2, label: 2 },
          { value: 3, label: 3 },
          { value: 4, label: 4 },
          { value: 5, label: 5 },
        ]}
      />
      <AuthInputFiled
        name="feedback"
        label="Feedback"
        icon={Feedback}
        control={control}
        type="text"
        placeholder="Feedback"
        error={errors.feedback}
        errors={errors}
        className={"w-full"}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="!w-fit"
      >
        Submit
      </Button>
    </form>
  );
};

export default MiniForm;
