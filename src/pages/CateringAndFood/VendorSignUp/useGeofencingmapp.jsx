
import { useContext, useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";

const useGeoFencingmapp = ({ watch, onClose }) => {
  const mapRef = useRef();
  const { setLatitude, setLongitude } = useVendorState.getState();
  const circleRef = useRef();
  const [circle, setCircle] = useState(null);
//   const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);

  const centerLocation = watch("location")?.position || undefined;

  useEffect(() => {
    if (centerLocation !== undefined && mapRef.current !== undefined) {
      mapRef.current.setCenter(centerLocation);
      mapRef.current.panTo(centerLocation);
    }
  }, [centerLocation]);

  const circleComplete = (circle) => {
    const lat = circle.center.lat();
    const lng = circle.center.lng();

    setCircle({
      center: { lat, lng },
      radius: circle.radius,
    });
    setLatitude(lat);
    setLongitude(lng);
    
    circle.setMap(null);
    
    // Optionally show an alert that the circle is added
    handleAlert(true, "success", "location added successfully");

    // Close the modal immediately
    onClose();
  };

  return {
    mapRef,
    circleRef,
    circleComplete,
    drawingRef: useRef(), // If needed later
    circle,
  };
};

export default useGeoFencingmapp;
