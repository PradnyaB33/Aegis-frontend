import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";

const useDepartmentNotification = () => {
  const { authToken } = useGetUser();

  const getDepartmentNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/punch-notification/notification-user`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.punchNotification;
  };

  const { data, isLoading, isFetching } = useQuery(
    "punch-request",
    getDepartmentNotification
  );

  const { data: getDepartmnetData } = useQuery(["get-department"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/getDepartment/toApproval`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  });
  console.log("get department", getDepartmnetData);

  const { data: getDeptNotificationToEmp } = useQuery(
    ["get-departments"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/sendNotficationToEmp`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("getNotification of dept", getDeptNotificationToEmp);

  return {
    data,
    getDepartmnetData,
    getDeptNotificationToEmp,
    isLoading,
    isFetching,
  };
};

export default useDepartmentNotification;
