import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";

const useRemoteCount = (organisationId) => {
  const authToken = useAuthToken();
  const getRemoteEmployeeCount = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/punch/getTodayRemoteEmp/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const { data: remoteEmployeeCount } = useQuery({
    queryKey: ["remoteEmployee"],
    queryFn: getRemoteEmployeeCount,
  });

  return { remoteEmployeeCount };
};

export default useRemoteCount;
