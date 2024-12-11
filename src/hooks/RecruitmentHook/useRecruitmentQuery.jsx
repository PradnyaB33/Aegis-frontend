import { useContext } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../UserData/useUser";

const useRecruitmentQuery = (organisationId) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  //for  Get Query to get job position
  const { data: getJobPosition } = useQuery(
    ["get-job-position", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-job-position/${role}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  //for  Get Query to get open job role
  const { data: getOpenJobRole } = useQuery(
    ["get-job-open-position", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-open-job-position`,
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
    getJobPosition,
    getOpenJobRole,
  };
};

export default useRecruitmentQuery;
