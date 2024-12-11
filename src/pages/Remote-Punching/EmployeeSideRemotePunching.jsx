import React, { useContext, useEffect } from "react";
import { Chip } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import useSelfieStore from "../../hooks/QueryHook/Location/zustand-store";
import { TestContext } from "../../State/Function/Main";
import StartRemotePunch from "./components/StartRemotePunch";
import AddVisitDetails from "../Remote-Punching-Employee/components/AddVisitDetails";
import TaskListEmployee from "../Remote-Punching-Employee/components/TaskListEmployee";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import PhotoCaptureCamera from "./components/PhotoCaptureCamera";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const EmployeeSideRemotePunching = () => {
    //handle Alert
    const { handleAlert } = useContext(TestContext);

    //get organisationId
    const { organisationId } = useParams();

    //get subscription data for plan fetch
    const { data: subscription } = useSubscriptionGet({
        organisationId: organisationId,
    });

    //get live location data
    const fetchLocationData = async () => {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        });
        const { latitude, longitude, speed, accuracy } = position.coords;
        return {
            latitude,
            longitude,
            speed,
            accuracy,
        };
    };

    const getUserLocation = useMutation({
        mutationFn: fetchLocationData,
        onSuccess: (data) => {
            console.info('location data', data);
        },
        onError: (data) => {
            handleAlert(true, "error", data.message);
        },
    });

    const { data, mutate } = getUserLocation;

    useEffect(() => {
        mutate();
    }, [mutate]);

    //get exact location and start and end time data
    const { locationArray, startTime, endTime } = useSelfieStore();
    const distance = useSelfieStore(state => state.distance);
    //google map loaded
    const { isLoaded } = useJsApiLoader({
        id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,

        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    return (
        <BoxComponent>
            <div className="w-full h-full bg-slate-200">
                <div className="flex  items-center justify-center h-[92vh]">
                    {data ? (
                        <MapComponent {...{ isLoaded, data, locationArray }} />
                    ) : (
                        "Loading"
                    )}
                    <div className="top-7  sm:right-12 absolute px-10 pt-20 flex flex-col items-end justify-center">
                        <Chip
                            label={`Don't connect to wi-fi till your location is fetch`}
                            variant="filled"
                            color="error"
                            sx={{ m: "10px" }}
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
                            sx={{ mb: "10px" }}
                        />
                        <Chip
                            label={`Distance Covered: ${distance?.toFixed(2)} km`}
                            className="!bg-white"
                            variant="filled"
                        />
                    </div>
                    {subscription?.organisation?.packageInfo === "Enterprise Plan" ? <> <TaskListEmployee />
                        <AddVisitDetails /></> : null}
                    <StartRemotePunch />
                    <PhotoCaptureCamera />
                </div>
            </div></BoxComponent>
    )
}

export default EmployeeSideRemotePunching


