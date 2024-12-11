import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../../../../hooks/Token/useUser";

const useGetDepartments = () => {
  const { authToken, decodedToken } = useGetUser();

  const { organisationId } = useParams();

  const getDepartments = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get-departments/${
        organisationId ?? decodedToken?.user?.organizationId
      }`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [`departments-${organisationId}`],
    queryFn: getDepartments,
    onSuccess: (data) => {
      console.log("onSuccess", data);
    },
  });

  return { data, isLoading, isFetching };
};

export default useGetDepartments;
