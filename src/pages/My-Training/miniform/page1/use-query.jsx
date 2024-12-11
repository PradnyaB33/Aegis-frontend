import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../../hooks/Token/useUser";

const useGetUpcomingTrainings = () => {
  const { decodedToken, authToken } = useGetUser();
  const [page, setPage] = React.useState(1);

  const getUpcomingTrainings = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-upcoming-trainings/${decodedToken?.user?._id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`get-upcoming-training`],
    queryFn: getUpcomingTrainings,
    refetchOnMount: false,
  });

  return { data, isLoading, error, setPage, page };
};

export default useGetUpcomingTrainings;
