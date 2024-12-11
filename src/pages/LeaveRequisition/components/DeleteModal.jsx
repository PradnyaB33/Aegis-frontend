import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDeleteLeave from "../hooks/useDeleteLeave";

const DeleteModal = ({
  open,
  handleClose,
  title = "Confirm Deletion",
  subtitle,
}) => {
  const { deleteLeaveMutation } = useDeleteLeave({ id: open });

  const formSchema = z.object({
    deleteReason: z
      .string()
      .min(4, { message: "Minimum 4 characters required" }),
  });

  const { handleSubmit, control, formState } = useForm({
    defaultValues: {
      deleteReason: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = async (data) => {
    console.log(`🚀 ~ data:`, data);
    deleteLeaveMutation.mutate({ ...data, onClose: handleClose });
    // mutate({ ...data, onClose });
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open !== null}
        onClose={handleClose}
      >
        <DialogTitle className="space-y-1">
          <h1 className="text-2xl leading-none text-gray-700   font-semibold  tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6">
          <AuthInputFiled
            name={"deleteReason"}
            label="Enter Reason for delete the attendance requst"
            type={"text"}
            placeholder="Enter the reason for deletion"
            errors={errors}
            error={errors.deleteReason}
            control={control}
          />
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="text"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              type="submit"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DeleteModal;
