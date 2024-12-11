import { zodResolver } from "@hookform/resolvers/zod";
import { Email, People } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useSearchEmployee from "../Mutation/useSearchEmployee";

const SmallInputForm = ({ circleId }) => {
  const formSchema = z.object({
    firstName: z.string().optional(),
    email: z.string().email().optional(),
  });
  const { control, handleSubmit, formState, watch } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { data } = useSearchEmployee({ watch, circleId });
  console.info(`🚀 ~ file: SmallInputForm.jsx:18 ~ data:`, data);

  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <form
      className="flex  gap-4 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInputFiled
        control={control}
        label="Name"
        placeholder="Name"
        type="text"
        name="firstName"
        errors={errors}
        error={errors.firstName}
        icon={People}
      />
      <AuthInputFiled
        control={control}
        label="Email"
        placeholder="Email"
        type="email"
        name="email"
        errors={errors}
        error={errors.email}
        icon={Email}
      />
    </form>
  );
};

export default SmallInputForm;
