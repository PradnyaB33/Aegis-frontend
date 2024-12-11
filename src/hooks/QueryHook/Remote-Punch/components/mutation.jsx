import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../Token/useUser";

const useNotificationRemotePunching = () => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const notifyToManager = async (punchId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/punch/manager/${punchId}`,
      { status: "Pending" },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const notifyManagerMutation = useMutation({
    mutationFn: notifyToManager,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: [`remote-punching-${decodedToken?.user?._id}`],
      });
      handleAlert(true, "success", `Request approved successfully`);
      queryClient.invalidateQueries("punch-request");
      queryClient.invalidateQueries("EmpDataPunch");
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", `Subscription not updated successfully`);
    },
  });
  const notifyToAccountant = async (punchId) => {
    let role = "manager";
    if (decodedToken.user.profile.includes("Accountant")) {
      role = "accountant";
    } else if (decodedToken.user.profile.includes("Manager")) {
      role = "manager";
    }
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/punch/${role}/accept/${punchId}`,
      { status: "A-Approved" },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const notifyAccountantMutation = useMutation({
    mutationFn: notifyToAccountant,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: [`punch-request`],
      });
      handleAlert(true, "success", `Request approved successfully`);
      queryClient.invalidateQueries("punch-request");
      queryClient.invalidateQueries("EmpDataPunch");
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", `Subscription not updated successfully`);
    },
  });

  const handleRejectManager = async (punchId) => {
    try {
      console.log("reason", punchId);
      let role = "manager";
      if (decodedToken.user.profile.includes("Accountant")) {
        role = "accountant";
      } else if (decodedToken.user.profile.includes("Manager")) {
        role = "manager";
      }
      const resp = await axios.patch(
        `${process.env.REACT_APP_API}/route/punch/${role}/reject/${punchId.id}`,
        {
          mReason: punchId.mReason,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return resp.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const RejectManagerMutation = useMutation({
    mutationFn: handleRejectManager,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: [`punch-request`],
      });
      handleAlert(true, "success", `Request Rejected Successfully`);
      queryClient.invalidateQueries("punch-request");
      queryClient.invalidateQueries("EmpDataPunch");
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", `Request Not Rejected Successfully`);
    },
  });

  const handleRejectAccountant = async (punchId) => {
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_API}/route/punch/accoutant/reject/:punchId`,
        {
          status: "A-Rejected",
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return resp.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const RejectAccountantMutation = useMutation({
    mutationFn: handleRejectAccountant,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: [`punch-request`],
      });
      handleAlert(true, "success", `Request Rejected Successfully`);
      queryClient.invalidateQueries("punch-request");
      queryClient.invalidateQueries("EmpDataPunch");
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", `Request Not Rejected Successfully`);
    },
  });

  return {
    notifyManagerMutation,
    notifyAccountantMutation,
    RejectManagerMutation,
    RejectAccountantMutation,
  };
};

export default useNotificationRemotePunching;
