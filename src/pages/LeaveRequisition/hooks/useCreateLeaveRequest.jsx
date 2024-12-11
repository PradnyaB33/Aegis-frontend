import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";
import useCustomStates from "./useCustomStates";

const useCreateLeaveRequest = (empId) => {
  const { newAppliedLeaveEvents, emptyAppliedLeaveEvents, setSelectedLeave } =
    useCustomStates();
  const role = UserProfile().useGetCurrentRole();
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const createLeaveRequest = async () => {
    newAppliedLeaveEvents.forEach(async (value) => {
      console.log(`🚀 ~ value:`, value);
      try {
        // if (value?.title === null || value?.title === undefined) {
        //   handleAlert(true, "error", "Please Provide all fileds");
        //   return false;
        // }

        await axios.post(
          `${process.env.REACT_APP_API}/route/leave/create?role=${role}&empId=${empId}`,
          value,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        await queryClient.invalidateQueries("manager-employee-leave");
        await queryClient.invalidateQueries("employee-leave-status");
        handleAlert(true, "success", "Leaves created succcesfully");
        emptyAppliedLeaveEvents();
      } catch (error) {
        console.error(`🚀 ~ error:`, error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Leaves not created succcesfully"
        );
      }
    });
    await queryClient.invalidateQueries("manager-employee-leave");
  };

  const leaveMutation = useMutation(createLeaveRequest);

  const updateLeaveMutation = useMutation(
    async (value) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API}/route/leave/create?role=${role}&empId=${empId}`,
          value,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } catch (error) {
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Leaves not created succcesfully"
        );
      }
    },
    {
      onSuccess: async () => {
        emptyAppliedLeaveEvents();
        await queryClient.invalidateQueries("manager-employee-leave");
        await queryClient.invalidateQueries("employee-leave-status");
        handleAlert(true, "success", "Leaves updated succcesfully");
        setSelectedLeave({});
      },
    }
  );

  return { leaveMutation, updateLeaveMutation };
};

export default useCreateLeaveRequest;
