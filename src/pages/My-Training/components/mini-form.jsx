import { zodResolver } from "@hookform/resolvers/zod";
import { DateRangeOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const MiniForm = ({ mutate }) => {
  const formSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      proofOfSubmissionUrl: undefined,
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold text-left w-full">Schedule Training</h1>
      <div className="grid grid-cols-2 gap-8">
        <AuthInputFiled
          name="startDate"
          label="Start Date"
          icon={DateRangeOutlined}
          control={control}
          type="date"
          placeholder="Start Date"
          error={errors.startDate}
          errors={errors}
          min={new Date().toISOString().split("T")[0]}
        />
        <AuthInputFiled
          name="endDate"
          icon={DateRangeOutlined}
          label="End Date"
          control={control}
          type="date"
          placeholder="End Date"
          error={errors.endDate}
          errors={errors}
          min={watch("startDate")}
        />
      </div>
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
