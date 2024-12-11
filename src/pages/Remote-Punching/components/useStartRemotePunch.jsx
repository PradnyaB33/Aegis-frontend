// import axios from "axios";
// import { useContext } from "react";
// import { useQuery, useMutation } from "react-query";
// import useGetUser from "../../../hooks/Token/useUser";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// import { TestContext } from "../../../State/Function/Main";

// const useStartRemotePunch = () => {
//     //get auth token
//     const { authToken } = useGetUser();
//     const { handleAlert } = useContext(TestContext);

//     //get state from useSelfieStore
//     const {
//         punchObjectId,
//         start,
//         setLocation,
//         setTemporaryArray,
//         temporaryArray,
//         setId,
//         clearTemporaryArray,
//     } = useSelfieStore();

//     //get location data
//     const fetchLocationData = async () => {
//         startGeoLocationWatch.mutate();

//         const payload = {
//             temporaryArray,
//             punchObjectId,
//         };

//         const response = await axios.patch(
//             `${process.env.REACT_APP_API}/route/punch`,
//             payload,
//             {
//                 headers: { Authorization: authToken },
//             }
//         );

//         return response.data;
//     };

//     const { data, refetch } = useQuery("location-push", fetchLocationData, {
//         refetchInterval: 60000,
//         enabled: start,
//         refetchIntervalInBackground: true,
//         onSuccess: (data) => {
//             clearTemporaryArray();
//         },
//         onError: (error) => {
//             console.error(error);
//             handleAlert(
//                 true,
//                 "error",
//                 error?.data || "Error in fetching location data"
//             );
//         },
//     });

//     const getNavigatorData = async () => {
//         const id = navigator.geolocation.watchPosition(
//             (positionCallback) => {
//                 const { latitude, longitude } = positionCallback.coords;
//                 setTemporaryArray({ latitude, longitude });
//                 setLocation({ lat: latitude, lng: longitude });
//             },
//         );
//         return id;
//     };

//     const startGeoLocationWatch = useMutation({
//         mutationFn: getNavigatorData,
//         onSuccess: (data) => {
//             setId(data);
//         },
//         onError: (data) => {
//             console.error(data);
//         },
//     });
//     return { data, refetch };
// };

// export default useStartRemotePunch;



import axios from "axios";
import { useContext } from "react";
import { useQuery, useMutation } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import { TestContext } from "../../../State/Function/Main";

const useStartRemotePunch = () => {
    // Get auth token
    const { authToken } = useGetUser();
    const { handleAlert } = useContext(TestContext);

    // Get state from useSelfieStore
    const {
        punchObjectId,
        start,
        setLocation,
        setTemporaryArray,
        temporaryArray,
        setId,
        clearTemporaryArray,
        distance,
        setDistance, // Assuming you have a setter for distance
    } = useSelfieStore();

    // Function to calculate distance between two points (using Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    // Get location data
    const fetchLocationData = async () => {
        startGeoLocationWatch.mutate();

        const payload = {
            temporaryArray,
            punchObjectId,
            distance,
        };

        const response = await axios.patch(
            `${process.env.REACT_APP_API}/route/punch`,
            payload,
            {
                headers: { Authorization: authToken },
            }
        );

        return response.data;
    };

    const { data, refetch } = useQuery("location-push", fetchLocationData, {
        refetchInterval: 60000,
        enabled: start,
        refetchIntervalInBackground: true,
        onSuccess: (data) => {
            clearTemporaryArray();
        },
        onError: (error) => {
            console.error(error);
            handleAlert(true, "error", error?.data || "Error in fetching location data");
        },
    });

    const getNavigatorData = async () => {
        const id = navigator.geolocation.watchPosition(
            (positionCallback) => {
                const { latitude, longitude } = positionCallback.coords;
                setTemporaryArray({ latitude, longitude });
                setLocation({ lat: latitude, lng: longitude });

                // Calculate distance only after the first position is available
                if (temporaryArray.latitude && temporaryArray.longitude) {
                    const newDistance = calculateDistance(
                        temporaryArray.latitude,
                        temporaryArray.longitude,
                        latitude,
                        longitude
                    );
                    setDistance(newDistance); // Update the live distance
                }
            },
        );
        return id;
    };

    const startGeoLocationWatch = useMutation({
        mutationFn: getNavigatorData,
        onSuccess: (data) => {
            setId(data);
        },
        onError: (data) => {
            console.error(data);
        },
    });

    return { data, refetch };
};

export default useStartRemotePunch;







