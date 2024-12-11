import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";

const useLeaveData = () => {
  const { authToken } = useGetUser();
  const queryClient = useQueryClient();
  const { mutate: acceptDeleteLeaveMutation } = useMutation(
    async ({ id }) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave/delete-request-accept/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: async (data, varM) => {
        await queryClient?.invalidateQueries("employee-leave");
        await queryClient?.invalidateQueries("EmpDataLeave");
      },
    }
  );
  const { mutate: rejectDeleteLeaveMutation } = useMutation(
    ({ id }) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/leave/delete-request-reject/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employee-leave");
        queryClient.invalidateQueries("EmpDataLeave");
      },
    }
  );
  return { acceptDeleteLeaveMutation, rejectDeleteLeaveMutation };
};

export default useLeaveData;
