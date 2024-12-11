import axios from "axios";
import { useQuery } from "react-query";

import { UseContext } from "../../../../State/UseState/UseContext";
import { useContext } from "react";

const useForm16NotificationHook = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const getForm16Notification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/form16NotificationToEmp`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.data;
  };

  const {
    data: Form16Notification,
    isLoading,
    isFetching,
  } = useQuery("form16-notification", getForm16Notification);

  return {
    Form16Notification,
    isLoading,
    isFetching,
  };
};

export default useForm16NotificationHook;
