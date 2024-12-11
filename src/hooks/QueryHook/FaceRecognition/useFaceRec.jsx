import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as faceApi from "face-api.js";
import useAppFunction from "../../hooks/useAppFunction";

const useFaceRecModal = () => {
  const { handleAlert } = useAppFunction();
  const loadModels = async () => {
    await faceApi.nets.faceExpressionNet.loadFromUri("/models");
    await faceApi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceApi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceApi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceApi.nets.mtcnn.loadFromUri("/models");
    await faceApi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceApi.nets.faceLandmark68TinyNet.loadFromUri("/models");
    await faceApi.nets.ageGenderNet.loadFromUri("/models");
    return { message: "Models loaded successfully", success: true };
  };

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["load-model"],
    queryFn: loadModels,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const detectFaces = async ({ img, canvasId }) => {
    const faces = await faceApi
      .detectAllFaces(img, new faceApi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()
      .withAgeAndGender();

    return faces;
  };

  const { mutateAsync: detectFacesMutation } = useMutation({
    mutationFn: detectFaces,
    onSuccess: async (data, { canvasId }) => {
      if (data.length === 0) {
        handleAlert(true, "error", "No faces found in the image");
      } else if (data.length > 1) {
        handleAlert(true, "warning", "More than one face found in the image");
      } else {
        const faces = faceApi.resizeResults(data, { height: 300, width: 300 });
        faceApi.draw.drawDetections(document.getElementById(canvasId), faces);
      }
    },
    onError: (error) => {
      console.error("Error detecting faces", error);
      handleAlert(true, "error", error?.message);
    },
  });

  const matchFaces = async (face) => {
    let matchScore = 0.63;
    let secondImgElem = document.getElementById("second-img");
    let faces = await detectFacesMutation({
      img: secondImgElem,
      canvasId: "canvas2",
    });
    let labeledFace = new faceApi.LabeledFaceDescriptors("Face", [
      face.descriptor,
    ]);
    let faceMatcher = new faceApi.FaceMatcher(labeledFace, matchScore);
    let results = faceMatcher.findBestMatch(faces[0].descriptor);
    return results;
  };

  const { mutateAsync: matchFacesMutation } = useMutation({
    mutationFn: matchFaces,
    onSuccess: (data) => {
      if (data._label === "Face") {
        handleAlert(true, "success", "Face match found");
      } else {
        handleAlert(true, "error", "Face match not found");
      }
    },
    onError: (error) => {
      console.error("Error matching faces", error);
      handleAlert(true, "error", error?.message);
    },
  });

  const uploadImageToBackend = async ({ descriptor, label }) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      `/face/upload-face`,
      { descriptor, label },
      config
    );

    return response.data;
  };

  const { mutateAsync: uploadImageToBackendMutation } = useMutation({
    mutationFn: uploadImageToBackend,
    onSuccess: (data) => {
      console.log("Data uploaded successfully", data);
    },
    onError: (error) => {
      console.error("Error uploading image to backend", error);
    },
  });

  const getImageAndVerify = async ({ label }) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.get(`/face/get-face/${label}`, config);
    return response.data;
  };

  const { mutateAsync: getImageAndVerifyMutation } = useMutation({
    mutationFn: getImageAndVerify,
    onSuccess: async (data) => {
      console.log("Data fetched successfully", data);
      let matchScore = 0.63;
      let descriptorFloat32 = new Float32Array(data?.faceData?.descriptor);

      let secondImgElem = document.getElementById("second-img");
      let faces = await detectFacesMutation({
        img: secondImgElem,
        canvasId: "canvas2",
      });
      let labeledFace = new faceApi.LabeledFaceDescriptors("Face", [
        descriptorFloat32,
      ]);
      let faceMatcher = new faceApi.FaceMatcher(labeledFace, matchScore);
      let results = faceMatcher.findBestMatch(faces[0].descriptor);
      if (results._label === "Face") {
        handleAlert(true, "success", "Face match found");
      } else {
        handleAlert(true, "error", "Face match not found");
      }
    },
    onError: (error) => {
      console.error("Error fetching image from backend", error);
    },
  });

  return {
    data,
    isLoading,
    isFetched,
    detectFacesMutation,
    matchFacesMutation,
    uploadImageToBackendMutation,
    getImageAndVerifyMutation,
  };
};

export default useFaceRecModal;
