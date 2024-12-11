import { zodResolver } from "@hookform/resolvers/zod";
import {
  BeachAccess,
  CalendarToday,
  Circle,
  HolidayVillage,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import usePublicHoliday from "./usePublicHoliday";

const MiniForm = ({ locations, data, onClose }) => {
  const formSchema = z.object({
    holidayName: z.string(),
    holidayDate: z.string(),
    holidayType: z.enum(["Optional", "Mandatory"]),
    holidayRegion: z.object({
      label: z.string(),
      value: z.string(),
    }),
  });

  const { addPublicHoliday } = usePublicHoliday();

  const { handleSubmit, control, formState } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { errors, isSubmitting } = formState;
  const onSubmit = async (data) => {
    console.log(data);
    const dataMain = {
      name: data.holidayName,
      date: data.holidayDate,
      type: data.holidayType,
      region: data?.holidayRegion?.value,
    };
    addPublicHoliday({ data: dataMain, onClose });
  };
  const isHoliday = (date) => {
    // Ensure date is a Date object
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate)) {
      console.error("Invalid date provided to isHoliday");
      return false;
    }

    // Convert the date to be checked to the start of the day in local time for accurate comparison
    // Adjust the holiday date to the start of the day in local time before comparison
    return data.some((holiday) => {
      const holidayDateLocal = new Date(holiday.date).toLocaleDateString();
      const dateLocal = validDate.toLocaleDateString();
      return holidayDateLocal === dateLocal;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthInputFiled
        name="holidayName"
        icon={HolidayVillage}
        control={control}
        type="text"
        placeholder="Holiday Name"
        label="Holiday Name *"
        errors={errors}
        error={errors.holidayName}
      />
      <AuthInputFiled
        name="holidayDate"
        icon={CalendarToday}
        control={control}
        type="date"
        placeholder="Holiday Date"
        label="Holiday Date *"
        errors={errors}
        error={errors.holidayDate}
        shouldDisableDate={isHoliday}
      />
      <AuthInputFiled
        name="holidayType"
        icon={BeachAccess}
        control={control}
        type="naresh-select"
        placeholder="Holiday Type"
        label="Holiday Type *"
        errors={errors}
        error={errors.holidayType}
        options={[
          { value: "Optional", label: "Optional" },
          { value: "Mandatory", label: "Mandatory" },
        ]}
      />
      <AuthInputFiled
        name="holidayRegion"
        icon={Circle}
        control={control}
        type="select"
        placeholder="Holiday Region"
        label="Holiday Region *"
        errors={errors}
        error={errors.holidayRegion}
        options={locations?.map((location) => ({
          value: location.shortName,
          label: location.shortName,
        }))}
      />
      <Button
        fullWidth
        disabled={isSubmitting}
        type="submit"
        variant="contained"
        color="primary"
      >
        Add Holiday
      </Button>
    </form>
  );
};

export default MiniForm;
