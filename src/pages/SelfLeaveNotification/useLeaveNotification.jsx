import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import useNotificationCount from "../../components/app-layout/notification-zustand";
import useGetUser from "../../hooks/Token/useUser";

const useLeaveNotification = () => {
  const [status, setStatus] = useState("");
  const [leaveTypeDetailsId, setLeaveTypeDetailsId] = useState("");
  const [minDate, setMinDate] = useState(moment().startOf("month"));
  const [maxDate, setMaxDate] = useState(moment().endOf("month"));
  const [firstTime, setFirstTime] = useState(false);
  const [skip, setSkip] = useState(0);
  const { setNotificationCount } = useNotificationCount();

  const { authToken, decodedToken } = useGetUser();
  const getLeaveNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get-leave-notification/${decodedToken?.user?._id}?status=${status}&leaveTypeDetailsId=${leaveTypeDetailsId}&minDate=${minDate}&maxDate=${maxDate}&skip=${skip}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: [
      "leave-notification",
      status,
      minDate,
      maxDate,
      leaveTypeDetailsId,
      skip,
    ],
    queryFn: getLeaveNotification,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onSuccess: async (data) => {
      if (!firstTime) {
        setFirstTime(true);
        setNotificationCount(data.leaveRequests?.length ?? 0);
      }
    },
  });

  return {
    data,
    refetch,
    status,
    setStatus,
    leaveTypeDetailsId,
    setLeaveTypeDetailsId,
    minDate,
    setMinDate,
    maxDate,
    setMaxDate,
    skip,
    setSkip,
    isLoading,
    isFetching,
  };
};

export default useLeaveNotification;
