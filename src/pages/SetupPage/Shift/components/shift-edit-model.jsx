import { zodResolver } from "@hookform/resolvers/zod";
import { Abc, AccessTime, Work } from "@mui/icons-material";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";

const EditShiftModal = ({ open, handleClose, editMutate, items: data }) => {
  console.log(`🚀 ~ file: shift-edit-model.jsx:12 ~ data:`, data);
  let startTime, endTime;

  const refineFunction = (value) => {
    const startDate = new Date(`1970-01-01T${startTime}:00Z`);
    const endDate = new Date(`1970-01-01T${endTime}:00Z`);
    const diffInHours = Math.abs(endDate - startDate) / 1000 / 60 / 60;
    return diffInHours >= 9;
  };
  const ShiftSchema = z.object({
    startDateTime: z
      .string()
      .min(1, "Start time is required")
      .refine(refineFunction, {
        message:
          "The difference between start time and end time must be at least 9 hours",
      }),
    endDateTime: z
      .string()
      .min(1, "End time is required")
      .refine(refineFunction, {
        message:
          "The difference between start time and end time must be at least 9 hours",
      }),
    shiftName: z.string().min(1, "Shift name is required"),
    selectedDays: z
      .array(
        z.enum([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ])
      )
      .nonempty("Please select at least one day"),
    workingFrom: z.enum(["office", "remote"]),
    allowance: z.string().min((value) => {
      let allowance = Number(value);
      return allowance > 0 && allowance < 1000000;
    }, "Allowance must be greater than 0 and less than 10,00,000"),
    organizationId: z.string().optional("Organization Id is required"),
    _id: z.string().optional("Shift Id is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },

    watch,
  } = useForm({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      startDateTime: dayjs(`1970-01-01T${data?.startTime}:00`).format("HH:mm"),
      endDateTime: dayjs(`1970-01-01T${data?.endTime}:00`).format("HH:mm"),
      allowance: `${data?.allowance}`,
      organizationId: data?.organizationId,
      selectedDays: data?.selectedDays,
      shiftName: data?.shiftName,
      workingFrom: data?.workingFrom,
      _id: data?._id,
    },
  });

  startTime = watch("startDateTime");
  endTime = watch("endDateTime");

  const daysOfWeek = [
    { label: "Mon", value: "Monday" },
    { label: "Tue", value: "Tuesday" },
    { label: "Wed", value: "Wednesday" },
    { label: "Thur", value: "Thursday" },
    { label: "Fri", value: "Friday" },
    { label: "Sat", value: "Saturday" },
    { label: "Sun", value: "Sunday" },
  ];

  const onClose = () => {
    reset();
    handleClose();
  };

  const onSubmit = async (data) => {
    console.log(`🚀 ~ file: shift-add-model.jsx:90 ~ data:`, data);

    let updatedData = {
      allowance: Number(data?.allowance),
      shiftName: data?.shiftName,
      workingFrom: data?.workingFrom,
      startTime: data?.startDateTime,
      endTime: data?.endDateTime,
      selectedDays: data?.selectedDays,
      organizationId: data?.organizationId,
      _id: data?._id,
    };
    editMutate({ data: updatedData, onClose });
  };

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      heading={"Edit Shift"}
      subHeading={
        "Create multiple types of shifts applicable to all employees. Ex: morning, afternoon."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <AuthInputFiled
          name="workingFrom"
          control={control}
          type="naresh-select"
          icon={Work}
          placeholder="Shift Type"
          label="Enter Shift Type *"
          readOnly={false}
          maxLimit={15}
          options={[
            {
              label: "remote",
              value: "remote",
            },
            {
              label: "office",
              value: "office",
            },
          ]}
          errors={errors}
          error={errors?.workingFrom}
        />
        <AuthInputFiled
          name="shiftName"
          icon={Abc}
          control={control}
          type="text"
          placeholder="Shift"
          label="Enter Shift Name *"
          readOnly={false}
          maxLimit={15}
          errors={errors}
          error={errors?.shiftName}
        />
        <AuthInputFiled
          name="allowance"
          icon={Abc}
          control={control}
          type="number"
          placeholder="Allowance"
          label="Enter Allowance *"
          readOnly={false}
          maxLimit={15}
          errors={errors}
          error={errors?.allowance}
        />
        <AuthInputFiled
          name="startDateTime"
          icon={AccessTime}
          control={control}
          type="time"
          placeholder="Start Time"
          label="Enter Start Time *"
          readOnly={false}
          maxLimit={15}
          errors={errors}
          error={errors?.startDateTime}
        />
        <AuthInputFiled
          name="endDateTime"
          icon={AccessTime}
          control={control}
          type="time"
          placeholder="End Time"
          label="Enter End Time *"
          readOnly={false}
          maxLimit={15}
          errors={errors}
          error={errors?.endDateTime}
        />

        <AuthInputFiled
          name="selectedDays"
          control={control}
          type="week-input"
          label="Select Week Days *"
          errors={errors}
          error={errors?.selectedDays}
          optionlist={daysOfWeek}
        />

        <Button
          disabled={!isDirty}
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
        >
          Edit Shift
        </Button>
      </form>
    </ReusableModal>
  );
};

export default EditShiftModal;
