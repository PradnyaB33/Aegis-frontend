import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useEmployee = (organisationId, page, debouncedSearchTerm) => {
  const authToken = useAuthToken();
  const getEmployees = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_API
        }/route/employee/get-paginated-emloyee/${organisationId}?page=${
          debouncedSearchTerm ? 1 : page
        }&nameSearch=${debouncedSearchTerm}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: employee,
    isLoading: employeeLoading,
    isFetching: empFetching,
  } = useQuery(
    ["employee-data", organisationId, page, debouncedSearchTerm],
    getEmployees
  );
  return { employee, employeeLoading, empFetching };
};

export default useEmployee;
