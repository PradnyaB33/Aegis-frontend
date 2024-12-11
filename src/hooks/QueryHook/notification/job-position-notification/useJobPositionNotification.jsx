import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";

const useJobPositionNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { setNotificationCount } = useNotificationCount();

  // get job position to mgr for approve and reject
  const {
    data: getJobPositionToMgr,
    isFetching,
    isLoading,
  } = useQuery(
    ["job-position"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-job-position-to-manager`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: (data) => {
        setNotificationCount(data?.length ?? 0);
      },
    }
  );

  const { data: getNotificationToEmp } = useQuery(
    ["job-positionss"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-notification-to-emp`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  return {
    getJobPositionToMgr,
    getNotificationToEmp,
    isLoading,
    isFetching,
  };
};

export default useJobPositionNotification;
