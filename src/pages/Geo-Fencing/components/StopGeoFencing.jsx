// import { Stop } from "@mui/icons-material";
// import { Button, Dialog, DialogContent, Fab } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import useStartGeoFencing from "./useStartGeoFencing";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// import axios from "axios";
// import useGetUser from "../../../hooks/Token/useUser";

// const StopGeoFencing = ({ setStart, geoFencing,isInGeoFence }) => {
//     //state
//     const [open, setOpen] = useState(false);

//     const { refetch } = useStartGeoFencing();

//     const { punchObjectId, temporaryArray, id, setEndTime } = useSelfieStore();

//     const { authToken } = useGetUser();

//     useEffect(() => {
//         refetch();
//     }, [refetch]);

//     // const stopRemotePunching = () => {
//     //     setStart(false);
//     //     navigator.geolocation.clearWatch(id);
//     //     setEndTime();
//     //     // clear location after 5 seconds
//     //     setTimeout(() => {
//     //         window.location.reload();
//     //     }, 5000);
//     // };

//     const stopGeoFence = async () => {
//         try {
//             await axios.patch(
//                 `${process.env.REACT_APP_API}/route/punch`,
//                 {
//                     temporaryArray,
//                     punchObjectId,
//                     stopNotificationCount: 1,
//                     stopEndTime: "stop"
//                 }, // Payload
//                 {
//                     headers: {
//                         Authorization: authToken, // Authentication header
//                     },
//                 }
//             );

//             // Clearing location tracking and stopping punch
//             setStart(false);
//             navigator.geolocation.clearWatch(id);
//             setEndTime();

//             // Reload the page after 1 second to refresh the state
//             // setTimeout(() => {
//             //     window.location.reload();
//             // }, 1000);
//         } catch (error) {
//             console.error("Error stopping remote punching:", error);
//             // Handle the error (alert or display error message)
//         }
//     };

//     return (
//         <>
//             <Fab
//              disabled={!isInGeoFence}
//                 variant="extended"
//                 className="!absolute bottom-12 right-12 !bg-primary !text-white"
//                 onClick={() => setOpen(true)}
//             >
//                 <Stop sx={{ mr: 1 }} className={`animate-pulse text-white`} />
//                 Stop Geo Fencing
//             </Fab>
//             <Dialog open={open} onClose={() => setOpen(false)}>
//                 <DialogContent>
//                     <div className="w-full text-center text-red-500">
//                         <h1 className="font-semibold text-3xl">Confirm Action</h1>
//                     </div>
//                     <h1 className="text-lg mt-2">
//                         {geoFencing === "geoFencing" ? "Are you sure you want to stop geo access?" : "Are you sure you want to stop remote access?"}
//                     </h1>
//                     <div className="flex gap-4 mt-4">
//                         <Button
//                             onClick={stopGeoFence}
//                             size="small"
//                             variant="contained"
//                         >
//                             Yes
//                         </Button>
//                         <Button
//                             onClick={() => setOpen(false)}
//                             variant="contained"
//                             color="error"
//                             size="small"
//                         >
//                             No
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default StopGeoFencing;


import { Stop } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import useStartGeoFencing from "./useStartGeoFencing";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import axios from "axios";
import useGetUser from "../../../hooks/Token/useUser";

const StopGeoFencing = ({ setStart, geoFencing, isInGeoFence }) => {
    // state
    const [open, setOpen] = useState(false);

    const { refetch } = useStartGeoFencing();

    const { punchObjectId, temporaryArray, id, setEndTime } = useSelfieStore();

    const { authToken } = useGetUser();

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Memoizing stopGeoFence to prevent it from being redefined on each render
    const stopGeoFence = useCallback(async () => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API}/route/punch`,
                {
                    temporaryArray,
                    punchObjectId,
                    stopNotificationCount: 1,
                    stopEndTime: "stop"
                }, // Payload
                {
                    headers: {
                        Authorization: authToken, // Authentication header
                    },
                }
            );

            // Clearing location tracking and stopping punch
            setStart(false);
            navigator.geolocation.clearWatch(id);
            setEndTime();

        } catch (error) {
            console.error("Error stopping remote punching:", error);
            // Handle the error (alert or display error message)
        }
    }, [authToken, id, punchObjectId, setEndTime, setStart, temporaryArray]);

    // Automatically stop geo-fencing when outside the geo-fenced area
    useEffect(() => {
        if (!isInGeoFence) {
            stopGeoFence();
        }
    }, [isInGeoFence, stopGeoFence]);

    return (
        <>
            <Fab
                disabled={!isInGeoFence}
                variant="extended"
                className="!absolute bottom-12 right-12 !bg-primary !text-white"
                onClick={() => setOpen(true)}
            >
                <Stop sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                Stop Geo Fencing
            </Fab>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <div className="w-full text-center text-red-500">
                        <h1 className="font-semibold text-3xl">Confirm Action</h1>
                    </div>
                    <h1 className="text-lg mt-2">
                        {geoFencing === "geoFencing" ? "Are you sure you want to stop geo access?" : "Are you sure you want to stop remote access?"}
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <Button
                            onClick={stopGeoFence}
                            size="small"
                            variant="contained"
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="contained"
                            color="error"
                            size="small"
                        >
                            No
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default StopGeoFencing;
