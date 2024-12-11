import React from "react";

const useGetRemainingLeave = () => {
  const { data, isLoading, isError } = useQuery("remainingLeaves", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getRemainingLeaves`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading data</p>;
  }
  return <div>useGetRemainingLeave</div>;
};

export default useGetRemainingLeave;
