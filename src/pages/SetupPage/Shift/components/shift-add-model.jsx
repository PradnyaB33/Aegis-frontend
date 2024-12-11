import { zodResolver } from "@hookform/resolvers/zod";
import { Abc, AccessTime, Work } from "@mui/icons-material";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";

const AddShiftModal = ({ open, handleClose, addMutate }) => {
  let startTime, endTime;
  const { organisationId } = useParams();

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
    workingFrom: z.object(
      {
        label: z.string(),
        value: z.string(),
      },
      "Shift type is required"
    ),
    allowance: z.string().refine((value) => {
      let allowance = Number(value);
      console.log(`🚀 ~ file: shift-add-model.jsx:60 ~ allowance:`, allowance);
      return allowance >= 0 && allowance < 1000000;
    }, "Allowance must be greater than 0 and less than 10,00,000"),
    organizationId: z.string().optional("Organization Id is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ShiftSchema),
    defaultValues: {
      startDateTime: dayjs(new Date()).format("HH:mm"),
      endDateTime: dayjs(new Date()).add(9, "hour").format("HH:mm"),
      allowance: "0",
      organizationId: organisationId,
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
    let updatedData = {
      allowance: Number(data.allowance),
      shiftName: data.shiftName,
      workingFrom: data.workingFrom.value,
      startTime: data.startDateTime,
      endTime: data.endDateTime,
      selectedDays: data.selectedDays,
      organizationId: data.organizationId,
    };
    addMutate({ data: updatedData, onClose });
  };

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      heading={"Add Shift"}
      subHeading={
        "Create multiple types of shifts applicable to all employees. Ex: morning, afternoon."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <AuthInputFiled
          name="workingFrom"
          control={control}
          type="select"
          icon={Work}
          placeholder="Shift Type"
          label="Enter Shift Type *"
          readOnly={false}
          maxLimit={15}
          options={[
            {
              label: "Remote",
              value: "remote",
            },
            {
              label: "Office",
              value: "office",
            },
          ]}
          errors={errors}
          error={errors.workingFrom}
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
          error={errors.shiftName}
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
          error={errors.allowance}
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
          error={errors.startDateTime}
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
          error={errors.endDateTime}
        />

        <AuthInputFiled
          name="selectedDays"
          control={control}
          type="week-input"
          label="Select Week Days *"
          errors={errors}
          error={errors.selectedDays}
          optionlist={daysOfWeek}
        />

        <Button fullWidth type="submit" variant="contained" color="primary">
          Add Shift
        </Button>
      </form>
    </ReusableModal>
  );
};

export default AddShiftModal;
