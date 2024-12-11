import { zodResolver } from "@hookform/resolvers/zod";
import { DriveFileRenameOutlineOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const MiniForm = ({ id, mutate, onClose }) => {
  const formSchema = z.object({
    id: z.string(),
    deleteReason: z
      .string()
      .min(4, { message: "Minimum 4 characters required" }),
  });

  const { handleSubmit, control, formState } = useForm({
    defaultValues: {
      id,
      deleteReason: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = async (data) => {
    mutate({ ...data, onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <AuthInputFiled
          label="Delete Reason"
          type="text"
          name="deleteReason"
          placeholder="Enter the reason for deletion"
          errors={errors}
          icon={DriveFileRenameOutlineOutlined}
          error={errors.deleteReason}
          control={control}
        />
        <Button type="submit" variant="contained">
          Delete
        </Button>
      </div>
    </form>
  );
};

export default MiniForm;
