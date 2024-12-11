import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";

const useLoanNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { setNotificationCount } = useNotificationCount();

  // get the employee whose raised a request for loan applicaiton
  const {
    data: getEmployeeRequestLoanApplication,
    isFetching,
    isLoading,
  } = useQuery(
    ["empLoanApplyRequest"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/pendingLoans`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: (data) => {
        setNotificationCount(data?.length ?? 0);
      },
    }
  );

  //for get loan data
  const { data: getLoanEmployee } = useQuery(
    ["getLoanEmployee"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-loan-to-employee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  return {
    getEmployeeRequestLoanApplication,
    isLoading,
    isFetching,
    getLoanEmployee
  };
};

export default useLoanNotification;
