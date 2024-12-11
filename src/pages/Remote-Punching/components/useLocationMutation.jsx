import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../../hooks/Token/useUser";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const useLocationMutation = () => {
    //handle alert
    const { handleAlert } = useContext(TestContext);

    //auth token
    const { authToken } = useGetUser();

    //get state from useSelfieStore
    const { geoFencingArea, setOpen, setMedia, setPunchObjectId, media, setStart } =
        useSelfieStore();

    //get user current location data
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
            console.info(`🚀 ~ file: mutation.jsx:34 ~ data:`, data);
        },
        onError: (data) => {
            console.error("errorData", data);
            handleAlert(true, "error", data.message);
        },
    });

    //fetch user image 
    const fetchUserImage = async () => {
        const stream = await new Promise((resolve, reject) => {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: false })
                .then(resolve)
                .catch(reject);
        });

        return stream;
    };

    const getUserImage = useMutation({
        mutationFn: fetchUserImage,
        onSuccess: async (data) => {
            setOpen(true);
            setMedia(data);
        },
        onError: (data) => {
            console.error("timedata", data);
            setOpen(false);
            handleAlert(true, "error", data.message);
        },
    });

    //get image url
    const fetchUrl = async () => {
        const data1 = await getUserLocation?.mutateAsync();
        const data = await axios.get(
            `${process.env.REACT_APP_API}/route/punch-main/create-image-url?lat=${data1?.latitude}&lng=${data1?.longitude}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
            }
        );

        return data.data;
    };

    const getImageUrl = useMutation({
        mutationFn: fetchUrl,
        onSuccess: async (data) => {
            try {
                let photo = document.getElementById("client-photo");
                const blob = await new Promise((resolve) => photo.toBlob(resolve));
                const file = new File([blob], "captured_image.png", {
                    type: blob.type,
                });
                await axios.put(data.url, file, {
                    headers: {
                        "Content-Type": "image/jpeg",
                    },
                });

                getPunchObject.mutate(data?.url?.split("?")[0]);
            } catch (error) {

                console.error("Error uploading image:", error);
            }
        },
        onError: (data) => {
            console.log("error", data?.response?.data?.message);
            handleAlert(true, "error", data?.response?.data?.message);
        },
    });

    //get punch object id
    const fetchPunchObject = async (image) => {
        const data = await axios.post(
            `${process.env.REACT_APP_API}/route/punch`,
            { image, geoFencingArea },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
            }
        );

        return data.data;
    };

    const getPunchObject = useMutation({
        mutationFn: fetchPunchObject,
        onSuccess: async (data) => {
            handleAlert(
                true,
                "success",
                "Successfully Start Remote punch"
            );
            setPunchObjectId(data?.punchObjectId);
            const tracks = media.getTracks();
            tracks.forEach((track) => {
                track.stop(); // Stop each track in the media stream
            });
            setMedia(null);
            setOpen(false);
            setStart(true);
        },
        onError: (data) => {
            handleAlert(true, "error", data?.response?.data?.message);
        },
    });

    return {
        getUserLocation,
        getUserImage,
        getImageUrl
    };
};

export default useLocationMutation;
