import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";

const useGetCommunicationPermission = (organisationId) => {
  const { authToken } = useGetUser();
  const [surveyPermission, setSurveyPermission] = useState(false);

  const { data, isLoading, isFetching } = useQuery(
    [`survey-permission`],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-employee-survey-permission`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },

    {
      enabled: !!organisationId ,
    }
  );
  return { data, isLoading, isFetching, surveyPermission, setSurveyPermission };
};

export default useGetCommunicationPermission;
