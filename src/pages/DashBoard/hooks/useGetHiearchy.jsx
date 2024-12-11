import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";

const useGetHiearchy = () => {
  const authToken = useAuthToken();
  const fetchHiearchy = async () => {
    const apiUrl = `${process.env.REACT_APP_API}/route/employee/hiearchy`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data;
  };

  const { data: hiearchyData, isLoading } = useQuery({
    queryKey: ["hiearchy"],
    queryFn: fetchHiearchy,
  });

  return { hiearchyData, isLoading };
};

export default useGetHiearchy;
