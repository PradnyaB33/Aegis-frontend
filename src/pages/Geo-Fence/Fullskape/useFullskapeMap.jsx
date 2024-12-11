import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const useFullskapeMap = ({ watch, onClose }) => {
  const mapRef = useRef();
  const circleRef = useRef();
  const [circle, setCircle] = useState(null);
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const drawingRef = useRef();

  const centerLocation = watch("location")?.position || undefined;
  useEffect(() => {
    if (centerLocation && mapRef.current) {
      mapRef.current.setCenter(centerLocation);
      mapRef.current.panTo(centerLocation);
    }
  }, [centerLocation]);

  const circleComplete = (circle) => {
    setCircle({
      center: {
        lat: circle.center.lat(),
        lng: circle.center.lng(),
      },
      radius: circle.radius,
    });
    circle.setMap(null);
  };

  const addCircle = async () => {
    const result = await axios.post(
      `${process.env.REACT_APP_API}/route/fullskape/${organisationId}`,
      { ...circle.center, radius: circle.radius },
      {
        headers: {
          Authorization: authToken, // Add the Authorization header with Bearer token
        },
      }
    );
    return result.data;
  };
  

  const { mutate: addCircleMutate } = useMutation(addCircle, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["fullskape-zones", organisationId]);
      handleAlert(true, "success", data?.message || "Fullskape zone added successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Error adding Fullskape zone:", error);
      // handleAlert(true, "error", error?.response?.data?.message || "Error");
    },
  });

  return {
    mapRef,
    circleRef,
    circleComplete,
    drawingRef,
    circle,
    addCircleMutate,
  };
};

export default useFullskapeMap;
