import { useQuery } from "react-query";
import useGetSinglePunchEntry from "../../hooks/QueryHook/Remote-Punch/components/get-sing-entry";
import MainMap from "./main-map";
import axios from "axios";
import useGetUser from "../../hooks/Token/useUser";
import useOrgGeo from "../Geo-Fence/useOrgGeo";

const MapComponent = ({ punchObjectId, isLoaded }) => {
  const { authToken } = useGetUser();
  const { data } = useGetSinglePunchEntry({ Id: punchObjectId });
  console.log("data in map", data?.relatedTasks);

  const { data: dataForCircleId } = useOrgGeo();

  const matchedArea = dataForCircleId?.area?.find(area =>
    area?.employee.includes(data?.punchData.employeeId)
  );

  // If a match is found, retrieve the _id
  const areaId = matchedArea ? matchedArea._id : null;

  const circleId = areaId;
  const { data: geofencingCircleData } = useQuery(
    `geofencingCircleData`,
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/geo-fence/area/${circleId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response?.data?.data;
    },
    {
      enabled: !!circleId,
    }
  );

  return (
    data?.punchData?.data?.length > 0 && (
      <MainMap isLoaded={isLoaded} punchData={data?.punchData} geofencingCircleData={geofencingCircleData} taskData={data?.relatedTasks} />
    )
  );
};

export default MapComponent;
