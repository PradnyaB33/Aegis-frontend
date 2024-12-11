import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../../hooks/Token/useUser";
import UserProfile from "../../../../hooks/UserData/useUser";

const useAssignTraining = () => {
  const { authToken } = useGetUser();
  const role = UserProfile().useGetCurrentRole();

  const { organisationId } = useParams();
  const getAllEmployee = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/trainings/employees?organizationId=${organisationId}&role=${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { data: employees, isLoading: employeeFetching } = useQuery(
    "getAllEmployeeByRole",
    getAllEmployee
  );

  return { employees: employees?.employees, employeeFetching };
};

export default useAssignTraining;
