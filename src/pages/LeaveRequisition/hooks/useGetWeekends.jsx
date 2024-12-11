import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";

const useGetWeekends = () => {
  const authToken = useAuthToken();
  const { data: weekends } = useQuery(
    ["employee-disable-weekend"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    { refecthonMount: false, refetchOnWindowFocus: false }
  );

  return { weekends };
};

export default useGetWeekends;
