import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useGetPfEsicSetup = ({ organisationId }) => {
  const authToken = useAuthToken();
  const {
    data: PfSetup,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getPFEFICSetup"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/PfEsic/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return data;
    },
  });

  return { PfSetup, isLoading, isFetching };
};

export default useGetPfEsicSetup;
