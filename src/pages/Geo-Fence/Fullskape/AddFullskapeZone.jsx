import { zodResolver } from "@hookform/resolvers/zod";
import { LocationOn } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import axios from "axios";
import { useQuery } from "react-query";
import { Typography } from "@mui/material";
import LocationRelatedFullskape from "./LocationRelatedFullskape";

// Fetch the Fullskape zone
const fetchFullskapeZone = async (zoneId) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API}/route/fullskape/zone/${zoneId}`);
  return data?.data;
};

const AddFullskapeZone = ({ onClose, data, zoneId }) => {
  const formSchema = z.object({
    location: z
      .any({
        address: z.string(),
        position: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })
      .refine(
        (val) => {
          return (
            val.address !== ("" || undefined) &&
            val.position.lat !== 0 &&
            val.position.lng !== 0
          );
        },
        { message: "Location is required" }
      ),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: {
        address: "",
        position: {
          lat: data?.lat || 0,
          lng: data?.lng || 0,
        },
      },
    },
  });
  const { errors } = formState;

  const onSubmit = (data) => {
    console.log(data);
  };

  // Fetch the Fullskape zone
  const { data: zoneData } = useQuery(
    ["fullskapesetups", zoneId],
    () => fetchFullskapeZone(zoneId),
    {
      enabled: !!zoneId,
    }
  );

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-scroll"
      >
        <span className="text-md font-semibold text-gray-500">Note:</span>
        <Typography variant="body2">
          1. To add the Fullskape zone, type the address into the input field.
          <br />
          2. Select the Fullskape zone by using the circle option on the map.
        </Typography>

        <div className="w-full">
          <AuthInputFiled
            className="w-full"
            name="location"
            icon={LocationOn}
            control={control}
            placeholder="e.g., Maharashtra, India"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.location}
            value={watch("location")}
          />
        </div>
        <LocationRelatedFullskape watch={watch} data={data} onClose={onClose} zoneId={zoneId} zoneData={zoneData} />
      </form>
    </>
  );
};

export default AddFullskapeZone;
