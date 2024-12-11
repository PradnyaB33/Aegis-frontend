import { useContext } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";

const useGetCurrentLocation = () => {
  const { handleAlert } = useContext(TestContext);
  const getLocation = async () => {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude } = position.coords;
    return { lat: latitude, lng: longitude };
  };
  const { data = { lat: 0, lng: 0 } } = useQuery({
    queryKey: ["location"],
    queryFn: getLocation,
    onError: (error) => {
      console.error("Error getting location", error);
      handleAlert("error", "Error getting location");
    },
  });
  return { data };
};

export default useGetCurrentLocation;
