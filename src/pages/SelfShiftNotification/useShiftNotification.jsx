import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";

const useShiftNotification = () => {
  const [status, setStatus] = useState("");
  const [minDate, setMinDate] = useState(moment().startOf("month"));
  const [maxDate, setMaxDate] = useState(moment().endOf("month"));
  const [skip, setSkip] = useState(0);

  const { authToken } = useGetUser();
  const getShiftNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shiftApply/get?status=${status}&minDate=${minDate}&maxDate=${maxDate}&skip=${skip}`,
      {
        headers: { Authorization: authToken },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["emp-shift-notification", status, skip, minDate, maxDate],
    queryFn: getShiftNotification,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    refetch,
    status,
    setStatus,
    setMinDate,
    setMaxDate,
    skip,
    setSkip,
    isLoading,
    isFetching,
  };
};

export default useShiftNotification;
