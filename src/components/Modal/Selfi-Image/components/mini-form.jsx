import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useLocationMutation from "../../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../../hooks/QueryHook/Location/zustand-store";
import useSelfieFaceDetect from "../useSelfieFaceDetect";
import Loader from "./Loader";

const MiniForm = () => {
  const { media } = useSelfieStore();
  const photoRef = useRef();
  const videoRef = useRef();

  //state
  const [imageCaptured, setImageCaptured] = useState(false);

  //get image url
  const { getImageUrl } = useLocationMutation();

  //get useSelfieFaceDetect data
  const {
    faceDetectedData,
    detectFaceOnlyMutation,
    matchFacesMutation,
    loading,
    setLoading,
    isLoading,
    isMutationLoading,
    isFaceDetectionLoading,
    isFetching,
    employeeOrgId,
    uploadBtnActive
  } = useSelfieFaceDetect();
  console.log("employeeOrgId", employeeOrgId?.employee?.faceRecognition);

  //useEffect
  useEffect(() => {
    let video = videoRef.current;
    video.srcObject = media;
  }, [media]);

  //take picture function
  const takePicture = async () => {
    setLoading(() => true);
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

    if (employeeOrgId?.employee?.faceRecognition === true) {
      const faces = await detectFaceOnlyMutation({
        img,
      });

      const descriptor = new Float32Array(faceDetectedData?.data?.descriptor);
      if (faces?.length !== 1) {
        setLoading(false);
        return setImageCaptured(false);
      }

      const response = await matchFacesMutation({
        currentDescriptor: faces[0]?.descriptor,
        descriptor,
      });

      if (response?._label === "unknown") {
        setLoading(false);
        return setImageCaptured(false);
      }
    } else {
      setLoading(false);
      return setImageCaptured(true);
    }
    setLoading(false);
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
        ></video>
        <Loader
          isLoading={
            loading ||
            isLoading ||
            isMutationLoading ||
            isFaceDetectionLoading ||
            isFetching
          }
        />

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
            !imageCaptured ||
            loading ||
            isLoading ||
            isMutationLoading ||
            isFaceDetectionLoading ||
            isFetching
          }
        >
          Clear
        </Button>
        <Button
          onClick={() => getImageUrl.mutate()}
          variant="contained"
          disabled={
            !imageCaptured ||
            loading ||
            isLoading ||
            isMutationLoading ||
            isFaceDetectionLoading ||
            isFetching ||
            (employeeOrgId?.employee?.faceRecognition === true && uploadBtnActive !== "Face match found")
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

export default MiniForm;
