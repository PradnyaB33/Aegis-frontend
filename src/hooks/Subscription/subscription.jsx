// useAuthToken.js

import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../Token/useUser";

const useSubscription = (organizationId) => {
  const { authToken } = useGetUser();

  const {
    data: subscriptionDetails,
    isFetching: subscriptionLoading,
    isLoading: subscriptionFetching,
  } = useQuery({
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/subscription/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    queryKey: [`subscription`, organizationId],

    onError: async (data) => {
      //   console.error(`🚀 ~ file: Organisation.jsx:144 ~ data:`, data);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return { subscriptionDetails, subscriptionLoading, subscriptionFetching };
};

export default useSubscription;
