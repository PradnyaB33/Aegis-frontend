import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../Token/useAuth";
import UserProfile from "../../UserData/useUser";

const useLeaveRequesationHook = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user.organizationId;
  const authToken = useAuthToken();

  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeLeaveTable`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    {
      onSuccess: async (data) => {},
    }
  );

  // to get the comp off from organisation
  const { data: compOff } = useQuery("comp-off", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/comp-off`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.compOff;
  });

  const { data: publicHoliday } = useQuery("publicHoliday", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.holidays;
  });

  const { data: weekendDay } = useQuery("weekendDay", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/weekend/get`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.days.days;
  });

  return {
    data,
    isLoading,
    isError,
    error,
    compOff,
    publicHoliday,
    weekendDay,
  };
};

export default useLeaveRequesationHook;
