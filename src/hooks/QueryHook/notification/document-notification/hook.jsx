import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";

const useDocNotification = () => {
  const { authToken } = useGetUser();
  const getUserDocNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocsmanager`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response;
  };

  const { data, isLoading, isFetching } = useQuery(
    "doc-requests",
    getUserDocNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useDocNotification;
