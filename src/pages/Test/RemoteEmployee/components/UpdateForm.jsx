import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";

const UpdateForm = ({ setArray, today, array, index, data, onClose }) => {
  const formSchema = z.object({
    startLocation: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    endLocation: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    start: z.string(),
    end: z.string(),
    distance: z.string(),
  });

  const { control, formState, reset, watch } = useForm({
    defaultValues: {
      startLocation: {
        address: data?.startLocation?.address,
        position: {
          lat: data?.startLocation?.position?.lat,
          lng: data?.startLocation?.position?.lng,
        },
      },
      endLocation: {
        address: data?.endLocation?.address,
        position: {
          lat: data?.endLocation?.position?.lat,
          lng: data?.endLocation?.position?.lng,
        },
      },
      start: data?.start?.format("HH:mm:ss"),
      end: data?.end?.format("HH:mm:ss"),
      distance: data?.distance,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = () => {
    const data = watch();

    const formattedData = {
      distance: data?.distance,
      startLocation: data?.startLocation,
      endLocation: data?.endLocation,
      start: moment(`${today} ${data?.start}`, "YYYY-MM-DD HH:mm"),
      end: moment(`${today} ${data?.end}`, "YYYY-MM-DD HH:mm"),
    };

    setArray((prev) => {
      const newArray = [...prev];
      newArray[index] = formattedData;
      return newArray;
    });
    onClose();
    reset();
  };

  return (
    <form className="relative">
      <div className="flex w-full justify-between mt-4 items-center flex-wrap gap-4">
        <AuthInputFiled
          className="w-full"
          name="startLocation"
          icon={FactoryOutlined}
          control={control}
          type="location-picker"
          label="Start Location *"
          errors={errors}
          error={errors.startLocation}
          descriptionText={
            watch("startLocation")?.address?.length > 0
              ? `You have selected ${
                  watch("startLocation")?.address
                } as start location`
              : ""
          }
        />
        <AuthInputFiled
          className="w-full"
          name="endLocation"
          icon={FactoryOutlined}
          control={control}
          type="location-picker"
          label="End Location *"
          errors={errors}
          error={errors.endLocation}
          descriptionText={
            watch("startLocation")?.address?.length > 0
              ? `You have selected ${
                  watch("endLocation")?.address
                } as end location`
              : ""
          }
        />
        <AuthInputFiled
          className="w-full"
          name="start"
          control={control}
          type="time"
          placeholder="Choose start time"
          label="Start Time *"
          errors={errors}
          wrapperMessage={"Note: Start time for missed punch"}
        />
        <AuthInputFiled
          className="w-full"
          name="end"
          control={control}
          type="time"
          placeholder="Choose end time"
          label="End Time *"
          errors={errors}
          wrapperMessage={"Note: End time for missed punch"}
        />
        <AuthInputFiled
          className="w-full"
          name="distance"
          control={control}
          type="number"
          placeholder="Enter the distance"
          label="Total Distance *"
          errors={errors}
          wrapperMessage={"Note: Total distance for missed punch"}
        />
      </div>
      <div className="w-full flex justify-center mt-4">
        <Button onClick={onSubmit} type="button" variant="contained" fullWidth>
          Update
        </Button>
      </div>
    </form>
  );
};

export default UpdateForm;
