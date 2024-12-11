import axios from "axios";
import { useQuery } from "react-query";

const useGetRevGeo = ({ lat, lng }) => {
  const getGeoCode = async () => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    );
    return response?.data?.results;
  };

  const { data } = useQuery({
    queryKey: ["map", lat, lng],
    queryFn: getGeoCode,
  });
  return { data };
};

export default useGetRevGeo;
