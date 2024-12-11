import axios from "axios";
import { useQuery } from "react-query";
import UserProfile from "../../../UserData/useUser";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useContext } from "react";

const useMissedPunchNotificationCount = () => {
  // to define the state , hook , import other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;

  // to get the missed punch data
  const getMissedPunchNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-unavaialble-record`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.data;
  };

  const {
    data: missPunchData,
    isLoading,
    isFetching,
  } = useQuery("employee-missed-punch", getMissedPunchNotification);

  //update notification api
  const getUpdateMissedPunchNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/missed-punch-update-notification-to-employee`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.data;
  };

  const {
    data: updateNotiMissPunch,
  } = useQuery("employee-missed-punch-update", getUpdateMissedPunchNotification);

  //to get the missed punch data of all employee
  const { data: getMissedPunchData } = useQuery(
    ["getMissedPunchData"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/missed-punch-notification-to-employee`,
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
    missPunchData,
    updateNotiMissPunch,
    getMissedPunchData,
    isLoading,
    isFetching,
  };
};

export default useMissedPunchNotificationCount;
