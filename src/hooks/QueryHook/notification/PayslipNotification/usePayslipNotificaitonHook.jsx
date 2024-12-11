import axios from "axios";
import { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";
import UserProfile from "../../../UserData/useUser";

const usePayslipNotificationHook = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const { setNotificationCount } = useNotificationCount();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;
  const userId = user?._id;
  const queryClient = useQueryClient();

  const getPaySlipNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${userId}/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.salaryDetails;
  };

  const {
    data: PayslipNotification,
    isLoading,
    isError,
  } = useQuery("payslip-notification", getPaySlipNotification, {
    onSuccess: (data) => {
      setNotificationCount(data?.length ?? 0);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const getPaySlipNotificationCount = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/notification/${userId}/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.salaryDetails;
  };

  const {
    data: PayslipNotificationCount,
    isLoading: isCountLoading,
    isError: isCountError,
  } = useQuery("payslip-notification-count", getPaySlipNotificationCount, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("payslip-notification");
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    PayslipNotification,
    PayslipNotificationCount,
    isLoading,
    isCountLoading,
    isError,
    isCountError,
  };
};

export default usePayslipNotificationHook;

