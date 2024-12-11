import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";

const useGeoFencingNotification = () => {
  const { authToken } = useGetUser();
  const [organizationId, setOrganizationId] = useState();
  console.log(`🚀 ~ file: hook.jsx:9 ~ setOrganizationId:`, setOrganizationId);
  const getUserPunchNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/punch-notification/notification-user?organizationId=${organizationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };

  const { data, isLoading, isFetching } = useQuery(
    "punch-request",
    getUserPunchNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useGeoFencingNotification;
