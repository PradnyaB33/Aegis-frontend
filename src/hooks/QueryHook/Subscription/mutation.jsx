import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useSubscriptionMutation = () => {
  const { authToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const updateSubscription = async ({ subscriptionId, data, handleClose }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/subscription-status/${subscriptionId}`,
      { data },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    response.data.handleClose = handleClose;
    return response.data;
  };

  const updateSubscriptionMutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [`subscription-${data.organisation._id}`],
      });
      handleAlert(true, "success", `Subscription updated successfully`);
      data.handleClose();
    },
    onError: (data) => {
      console.log(data);
      handleAlert(true, "error", `Subscription not updated successfully`);
    },
  });

  return {
    updateSubscriptionMutation,
  };
};

export default useSubscriptionMutation;
