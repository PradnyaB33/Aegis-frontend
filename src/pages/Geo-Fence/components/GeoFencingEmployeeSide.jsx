import { Chip } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import React, { useEffect } from "react";
import SelfieForm from "../../../components/Modal/Selfi-Image/Selfie";
import useLocationMutation from "../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import MapComponent from "./Map-Component";
import SpeedDialEmployee from "./Speed-dial-employee";

const GeoFencingEmployeeSide = () => {
  const { getUserLocation } = useLocationMutation();

  const { data, mutate } = getUserLocation;

  useEffect(() => {
    mutate();
  }, [mutate]);

  const { locationArray, startTime, endTime } = useSelfieStore();

  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,

    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div className="w-full h-full bg-slate-200">
      <div className="flex  items-center justify-center h-[92vh]">
        {data ? (
          <MapComponent {...{ isLoaded, data, locationArray }} />
        ) : (
          "Loading"
        )}
        <div className="top-12 right-12 rounded-xl absolute gap-4 p-10 flex flex-col items-end justify-center">
          <Chip
            label={`Please do not connect to any wi-fi till your location is fetching`}
            className="!text-md"
            onClick={(e) => console.log(e)}
            variant="filled"
            color="error"
          />
          <Chip
            label={`Latitude is ${data?.latitude}`}
            className="!bg-white !text-md"
            onClick={(e) => console.log(e)}
            variant="filled"
          />
          {startTime && (
            <>
              <Chip
                label={`Started at ${moment(startTime).format("hh:mm:ss")}`}
                className="!bg-white !text-md"
                onClick={(e) => console.log(e)}
                variant="filled"
              />
              <Chip
                label={`Ended at ${endTime
                  ? moment(endTime).format("hh:mm:ss")
                  : moment().format("hh:mm:ss")
                  }`}
                className="!bg-white !text-md"
                onClick={(e) => console.log(e)}
                variant="filled"
              />
            </>
          )}
          <Chip
            label={`Longitude is ${data?.longitude}`}
            className="!bg-white !text-md"
            onClick={(e) => console.log(e)}
            variant="filled"
          />
        </div>
        <SpeedDialEmployee />
        <SelfieForm />
      </div>
    </div>
  );
};

export default GeoFencingEmployeeSide;
