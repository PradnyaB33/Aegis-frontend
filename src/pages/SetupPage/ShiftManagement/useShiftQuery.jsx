import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";

const useShiftQuery = () => {
  const { authToken } = useGetUser();
  const { organisationId: orgId } = useParams();
  const getAllOrgShifts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shifts/${orgId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };
  const { data: shifts } = useQuery({
    queryFn: getAllOrgShifts,
    queryKey: [`shifts-${orgId}`],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return { shifts };
};

export default useShiftQuery;
