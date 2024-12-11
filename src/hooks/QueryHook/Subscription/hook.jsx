import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useSubscriptionGet = ({ organisationId }) => {
  const { authToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);

  const getSubscription = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/subscription/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`subscription`, organisationId],
    queryFn: getSubscription,
    onSuccess: (data) => {
      if (
        data &&
        data?.organisation?.subscriptionDetails?.status === "Pending" &&
        moment(data?.organisation?.createdAt)
          .add(7, "days")
          .diff(moment(), "days") > 0 &&
        moment(data?.organisation?.createdAt)
          .add(7, "days")
          .diff(moment(), "days") < 7
      ) {
        // Your logic here
        console.log("Your logic here");
        handleAlert(
          true,
          "warning",
          `Your subscription is about to expire after ${moment(
            data?.organisation?.createdAt
          )
            .add(7, "days")
            .diff(moment(), "days")} days.`
        );
      } else {
        console.log("Your logic here2");
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled:
      organisationId !== undefined &&
      organisationId !== "" &&
      organisationId !== null,
  });
  return { data, isLoading };
};

export default useSubscriptionGet;
