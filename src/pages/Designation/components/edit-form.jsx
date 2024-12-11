import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, DriveFileRenameOutline } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";

const EditDesignation = ({
  open,
  handleClose,
  updateDesignation,
  defaultValues,
}) => {
  console.log(`🚀 ~ file: edit-form.jsx:16 ~ defaultValues:`, defaultValues);
  const designationSchema = z.object({
    designationName: z
      .string()
      .min(2, "Designation Name must be atleast 2 characters")
      .max(50, "Designation Name must be less than 50 characters"),
    designationId: z
      .string()
      .max(24, "Designation Id must be between 4 to 24 characters")
      .min(4, "Designation Id must be between 4 to 24 characters"),
    organizationId: z.string(),
  });

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      organizationId: defaultValues?.organizationId,
      designationName: defaultValues?.designationName,
      designationId: defaultValues?.designationId,
    },
  });
  const onClose = () => {
    handleClose();
    reset();
  };

  const { errors, isDirty } = formState;

  const onSubmit = async (data) => {
    console.log(data);
    updateDesignation({ onClose, designationId: defaultValues?._id, data });
  };

  return (
    <ReusableModal
      heading="Update Designation"
      subHeading={"Update the designation in your organisation"}
      open={open}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <AuthInputFiled
          name="designationName"
          icon={DriveFileRenameOutline}
          control={control}
          type="text"
          placeholder="eg. Senior Manager"
          label="Designation Name *"
          errors={errors}
          error={errors.designationName}
        />
        <AuthInputFiled
          name="designationId"
          icon={Badge}
          control={control}
          type="text"
          placeholder="AGS-001"
          label="Designation Id *"
          errors={errors}
          error={errors.designationId}
        />
        <Button
          type="submit"
          disabled={!isDirty}
          fullWidth
          variant="contained"
          className="mt-4"
        >
          Update Designation
        </Button>
      </form>
    </ReusableModal>
  );
};

export default EditDesignation;
