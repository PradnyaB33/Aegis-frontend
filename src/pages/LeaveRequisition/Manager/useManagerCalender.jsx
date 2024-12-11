import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const useManagerCalender = ({ employee, organisationId }) => {
  const authToken = useAuthToken();
  const role = UserProfile().useGetCurrentRole();

  const {
    data: EmployeeLeaves,
    isLoading,
    isFetching,
  } = useQuery(
    ["manager-employee-leave", employee],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getOrgEmployeeYearLeave/${employee}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      enabled: !!employee, // Only run the query if employee is truthy
    }
  );

  const { data: leaveTableData } = useQuery(
    ["employee-leave-status", employee],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getLeaveTableForEmployee/${employee}/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    {
      enabled: !!employee, // Only run the query if employee is truthy
    }
  );

  const { data: employeeData } = useQuery(
    ["employee-under", role],
    async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/getEmployeesUnderForLeaves/${role}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    }
  );

  return {
    EmployeeLeaves,
    leaveTableData,
    employeeData,
    isFetching,
    isLoading,
  };
};

export default useManagerCalender;
