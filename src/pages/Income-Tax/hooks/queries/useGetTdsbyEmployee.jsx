import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import useFunctions from "../useFunctions";

const useGetTdsbyEmployee = (empId) => {
  const authToken = useAuthToken();
  const { fySelect } = useFunctions();
  const getTdsForEmployee = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getTDSDetails/${empId}/${fySelect.value}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: tdsForEmployee, isFetching } = useQuery({
    queryKey: ["tdsDetails", empId, fySelect],
    queryFn: getTdsForEmployee,
    refetchOnMount: false,
  });

  return { tdsForEmployee, isFetching };
};

export default useGetTdsbyEmployee;
