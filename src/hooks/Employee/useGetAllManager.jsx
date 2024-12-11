import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useGetAllManager = (organisationId) => {
  const authToken = useAuthToken();

  const { data } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const data = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return data;
    },
  });

  return data?.data;
};

export default useGetAllManager;
