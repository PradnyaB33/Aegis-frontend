

import { useQuery } from "react-query";
import axios from "axios";
import useGetUser from "../../Token/useUser";

const useOrgList = () => {
  const { authToken } = useGetUser();
  const { data, isLoading, refetch } = useQuery(
    "orglist",
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/get`,
          {
            headers: {
              Authorization: authToken, 
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rethrow the error to be caught by React Query
      }
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );
  return { data, isLoading, refetch }; 
};

export default useOrgList;
