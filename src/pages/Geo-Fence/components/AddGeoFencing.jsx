import { zodResolver } from "@hookform/resolvers/zod";
import { LocationOn } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import LocationRelated from "./LocationRelated";
import axios from "axios";
import { useQuery } from "react-query";
import { Typography } from "@mui/material";

//get added geofencing zone
const fetchGeoFencingCircle = async (circleId) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API}/route/geo-fence/area/${circleId}`);
  return data?.data;
};

//get added fullskape zone circle
const fetchZoneCircle = async (zoneId) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API}/route/fullskape/zone/${zoneId}`);
   return data?.data; 
};

const AddGeoFencing = ({ onClose, data, circleId ,zoneId}) => {
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

  //useQuery for get added geofencing zone
  const { data: circleData } = useQuery(
    ["geoFencingCircle", circleId],
    () => fetchGeoFencingCircle(circleId),
    {
      enabled: !!circleId,
    }
  );

    // useQuery for Fullskape zone
    const { data: zoneData } = useQuery(
      ["fullskapeZone", zoneId],
      () => fetchZoneCircle(zoneId),
      {
        enabled: !!zoneId,
      }
    );
       
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" overflow-scroll "
      >
      {
        circleId ?
       <>
        <span className="text-md font-semibold text-gray-500">Note:</span>
        <Typography variant="body2">1. To add the geofencing zone, type the address into the input field.<br />2. Select the geofencing zone by using the circle option on the map.
        </Typography>
        </> : null
      }  
  <div className="w-full">
          <AuthInputFiled
            className="w-full"
            name="location"
            icon={LocationOn}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.location}
            value={watch("location")}
          />
        </div>
        <LocationRelated watch={watch} data={data} onClose={onClose} circleId={circleId} circleData={circleData} zoneId={zoneId} zoneData={zoneData}/>
      </form >
    </>
  );
};

export default AddGeoFencing;
