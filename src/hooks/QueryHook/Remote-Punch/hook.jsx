import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";

const useEmpConfirmation = () => {
  const { authToken, decodedToken } = useGetUser();
  const { data, isLoading } = useQuery(
    `remote-punching-${decodedToken?.user?._id}`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/punch`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        // throw error; // Rethrow the error to be caught by React Query
      }
    }
  );
  return { data, isLoading };
};

export default useEmpConfirmation;
