import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";
import UserProfile from "../../../UserData/useUser";
import { useParams } from "react-router-dom";

const useShiftNotification = () => {
  const { organisationId } = useParams();
  const { authToken } = useGetUser();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [notificationCount, setNotificationCount] = useState(0);
  const [accData, setAccData] = useState();
  console.log("accData", accData);

  const getShiftNotification = async () => {
    let url;
    if (role === "Accountant") {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForAccountant/${organisationId}`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });

      return response.data.requests;
    } else {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForManager`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      const data = response.data.requests.filter(
        (item) => item.status === "Pending"
      );
      return data;
    }
  };
  const getCount = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shiftApply/getCount/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    setAccData(response.data.newReq)
    return response.data.newReq;
  };

  const { data, isLoading, isFetching } = useQuery(
    ["shift-request", role],
    getShiftNotification,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: async (data) => {
        setNotificationCount(data?.length ?? 0);
      },
    }
  );

  const { data: count } = useQuery("shift-count", getCount);

  return {
    accData,
    data,
    count,
    isLoading,
    isFetching,
    notificationCount,
  };
};

export default useShiftNotification;
