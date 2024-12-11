import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import useCustomStates from "./useCustomStates";

const useDeleteLeave = ({ id }) => {
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const { employee, setSelectedLeave } = useCustomStates();
  const queryClient = useQueryClient();
  const role = UserProfile().useGetCurrentRole();

  const deleteLeaveMutation = useMutation(
    async (data) => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/delete/${id}?empId=${employee}&role=${role}`,

        {
          deleteReason: data?.deleteReason,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async (data, variable) => {
        setSelectedLeave({});
        variable?.onClose();
        await queryClient.invalidateQueries("manager-employee-leave");
        await queryClient.invalidateQueries("employee-leave-status");
        handleAlert(true, "success", "Leave deleted successfully");
      },
      onError: (error) => {
        console.log(error);
        handleAlert(true, "error", "Failed to delete leave");
      },
    }
  );

  return { deleteLeaveMutation };
};

export default useDeleteLeave;
