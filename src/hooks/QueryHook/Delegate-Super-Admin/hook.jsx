import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useGetDelegateSuperAdmin = () => {
  const { authToken, decodedToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);
  const { data, isLoading, isFetching } = useQuery(
    `delegate-super-admin-${decodedToken?.user?._id}`,
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/delegate`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },

    {
      retry: false,
      onError: (error) => {
        console.error("Error fetching data:", error?.response?.data?.message);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      },
    }
  );
  return { data, isLoading, isFetching };
};

export default useGetDelegateSuperAdmin;
