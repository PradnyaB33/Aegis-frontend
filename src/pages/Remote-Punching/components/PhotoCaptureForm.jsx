import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useLocationMutation from "./useLocationMutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const PhotoCaptureForm = () => {
    const { media } = useSelfieStore();
    const photoRef = useRef();
    const videoRef = useRef();

    //state
    const [imageCaptured, setImageCaptured] = useState(false);

    //get image url
    const { getImageUrl } = useLocationMutation();

    //useEffect
    useEffect(() => {
        let video = videoRef.current;
        video.srcObject = media;
    }, [media]);

    //take picture function
    const takePicture = async () => {
        setImageCaptured(true);
        let width = 640;
        let height = 480;
        let photo = photoRef.current;
        let video = videoRef.current;
        photo.width = width;
        photo.height = height;
        let ctx = photo.getContext("2d");

        await ctx.drawImage(video, 0, 0, photo.width, photo.height);

        const dataUrl = photo.toDataURL("image/png");

        // Create a new Image object and set its src to the data URL
        const img = new Image();
        img.src = dataUrl;
    };

    //clear Image function
    const clearImage = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");
        ctx.clearRect(0, 0, photo.width, photo.height);
        setImageCaptured(false);
    };

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 w-full"
            noValidate
        >
            <div className="relative ">
                <video
                    ref={videoRef}
                    autoPlay={true}
                    className={`container rounded-lg ${imageCaptured && "!hidden"}`}
                    id="client-video"
                >
                </video>
                <canvas
                    ref={photoRef}
                    className={`container rounded-lg ${!imageCaptured && "!hidden"}`}
                    id="client-photo"
                />
            </div>
            <div className="flex w-full justify-between">
                <Button
                    onClick={clearImage}
                    variant="contained"
                    color="error"
                    disabled={
                        !imageCaptured
                    }
                >
                    Clear
                </Button>
                <Button
                    onClick={() => getImageUrl.mutate()}
                    variant="contained"
                    disabled={
                        !imageCaptured
                    }
                >
                    {getImageUrl.isLoading ? <CircularProgress size={20} /> : "Upload"}
                </Button>
                <Button
                    onClick={takePicture}
                    variant="contained"
                    disabled={imageCaptured}
                >
                    Capture
                </Button>
            </div>
        </form>
    );
};

export default PhotoCaptureForm;

