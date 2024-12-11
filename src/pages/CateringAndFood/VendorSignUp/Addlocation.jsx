import { zodResolver } from "@hookform/resolvers/zod";
import { LocationOn } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import LocationRelatedd from "./Locationrelatedd";



const Addlocation = ({ onClose, data, circleId }) => {
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
    console.log("location",data);
  };



  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4 overflow-scroll lg:h-[80vh] md:h-[120vh] sm:h-[200vh] xs:h-[250vh]"
      >
        <div>
          Note:
          <span className="text-xs text-gray-600 ">
            1. To add the Vendor Location, type the address into the input
            field.
            <br />
            2. Select the  Vendor Location by using the circle option on the map.
          </span>
        </div>
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
        <LocationRelatedd
          watch={watch}
          data={data}
          onClose={onClose}
          circleId={circleId}
        //  circleData={circleData}
        />
      </form>
    </>
  );
};

export default Addlocation;

