// import { Stop } from "@mui/icons-material";
// import { Button, Dialog, DialogContent, Fab } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import useStartRemotePunch from "./useStartRemotePunch";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// // import useLocationMutation from "./useLocationMutation";
// import useGetUser from "../../../hooks/Token/useUser"; // to get authToken
// import { getDistance } from 'geolib'; // Import geolib to calculate the distance

// const calculateTotalDistance = (locationArray) => {
//     let totalDistance = 0;

//     // Loop through the locationArray to calculate distance between consecutive points
//     for (let i = 0; i < locationArray.length - 1; i++) {
//         const start = {
//             latitude: locationArray[i]?.latitude,
//             longitude: locationArray[i]?.longitude
//         };
//         const end = {
//             latitude: locationArray[i + 1]?.latitude,
//             longitude: locationArray[i + 1]?.longitude
//         };

//         totalDistance += getDistance(start, end); // Adds the distance between consecutive points
//     }

//     return totalDistance; // Return the total distance in meters
// };

// const StopRemotePunching = ({ setStart }) => {
//     // const { getImageUrl } = useLocationMutation();
//     // state
//     const [open, setOpen] = useState(false);

//     const { refetch } = useStartRemotePunch();
//     const { punchObjectId, temporaryArray, id, setEndTime } = useSelfieStore();
//     const { authToken } = useGetUser(); // get authToken

//     useEffect(() => {
//         refetch();
//     }, [refetch]);

//     // Function to handle the stop remote punching and make the API call
//     const stopRemotePunching = async () => {
//         try {
//             const distance = calculateTotalDistance(temporaryArray);
//             // Making the PATCH API call to stop remote punching
//             await axios.patch(
//                 `${process.env.REACT_APP_API}/route/punch`,
//                 {
//                     temporaryArray,
//                     punchObjectId,
//                     stopNotificationCount: 1,
//                     stopEndTime: "stop",
//                     distance
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
//                 variant="extended"
//                 className="!absolute bottom-12 right-12 !bg-primary !text-white"
//                 onClick={() => setOpen(true)}
//             >
//                 <Stop sx={{ mr: 1 }} className="animate-pulse text-white" />
//                 Stop Remote Punching
//             </Fab>
//             <Dialog open={open} onClose={() => setOpen(false)}>
//                 <DialogContent>
//                     <div className="w-full text-center text-red-500">
//                         <h1 className="font-semibold text-3xl">Confirm Action</h1>
//                     </div>
//                     <h1 className="text-lg mt-2">
//                         Are you sure you want to stop remote access?
//                     </h1>
//                     <div className="flex gap-4 mt-4">
//                         <Button
//                             onClick={stopRemotePunching}
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

// export default StopRemotePunching;

import { Stop } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useStartRemotePunch from "./useStartRemotePunch";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// import useLocationMutation from "./useLocationMutation";
import useGetUser from "../../../hooks/Token/useUser"; // to get authToken

const StopRemotePunching = ({ setStart }) => {
    // const { getImageUrl } = useLocationMutation();
    // state
    const [open, setOpen] = useState(false);

    const { refetch } = useStartRemotePunch();
    const { punchObjectId, temporaryArray, id, setEndTime, distance } = useSelfieStore();
    const { authToken } = useGetUser(); // get authToken

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Function to handle the stop remote punching and make the API call
    const stopRemotePunching = async () => {
        try {

            // Making the PATCH API call to stop remote punching
            await axios.patch(
                `${process.env.REACT_APP_API}/route/punch`,
                {
                    temporaryArray,
                    punchObjectId,
                    stopNotificationCount: 1,
                    stopEndTime: "stop",
                    distance
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

            // Reload the page after 1 second to refresh the state
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (error) {
            console.error("Error stopping remote punching:", error);
            // Handle the error (alert or display error message)
        }
    };

    return (
        <>
            <Fab
                variant="extended"
                className="!absolute bottom-12 right-12 !bg-primary !text-white"
                onClick={() => setOpen(true)}
            >
                <Stop sx={{ mr: 1 }} className="animate-pulse text-white" />
                Stop Remote Punching
            </Fab>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <div className="w-full text-center text-red-500">
                        <h1 className="font-semibold text-3xl">Confirm Action</h1>
                    </div>
                    <h1 className="text-lg mt-2">
                        Are you sure you want to stop remote access?
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <Button
                            onClick={stopRemotePunching}
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

export default StopRemotePunching;

