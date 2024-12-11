import React, { useEffect } from "react";
import { Chip } from "@mui/material";
import MapComponent from "./components/MapComponent";
import useLocationMutation from "./components/useLocationMutation";
import useSelfieStore from "../../hooks/QueryHook/Location/zustand-store";
import { useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import StartGeoFencing from "./components/StartGeoFencing";
import PhotoCaptureCamera from "./components/PhotoCaptureCamera";

const EmployeeSideGeoFencing = () => {
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
                    <MapComponent  {...{ isLoaded, data, locationArray }} />
                ) : (
                    "Loading"
                )}
                <div className="top-7  sm:right-12 absolute px-10 pt-20 flex flex-col items-end justify-center">
                    <Chip
                        label={`Please do not connect to any wi-fi till your location is fetching`}
                        variant="filled"
                        color="error"
                        sx={{ width: { sm: "auto", xs: "350px" }, mb: "10px" }}
                    />
                    <Chip
                        label={`Latitude is ${data?.latitude}`}
                        className="!bg-white"
                        variant="filled"
                        sx={{ mb: "10px" }}
                    />
                    {startTime && (
                        <>
                            <Chip
                                label={`Started at ${moment(startTime).format("hh:mm:ss")}`}
                                className="!bg-white"
                                variant="filled"
                                sx={{ mb: "10px" }}
                            />
                            <Chip
                                label={`Ended at ${endTime
                                    ? moment(endTime).format("hh:mm:ss")
                                    : moment().format("hh:mm:ss")
                                    }`}
                                className="!bg-white"
                                variant="filled"
                                sx={{ mb: "10px" }}
                            />
                        </>
                    )}
                    <Chip
                        label={`Longitude is ${data?.longitude}`}
                        className="!bg-white"
                        variant="filled"
                    />
                </div>
                <StartGeoFencing />
                <PhotoCaptureCamera />
            </div>
        </div>
    );
};

export default EmployeeSideGeoFencing;
