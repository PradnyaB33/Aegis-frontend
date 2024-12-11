import axios from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useGetUser from "../../../../hooks/Token/useUser";

const useCardQuery = ({ trainingId }) => {
  const [open, setOpen] = React.useState(false);

  const { authToken } = useGetUser();
  const queryClient = useQueryClient();
  const getEmployeeTrainingInfo = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-employee-training-info/${trainingId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`get-employee-training-info-${trainingId}`],
    queryFn: getEmployeeTrainingInfo,
    onSuccess: (data) => {
      //   console.log("onSuccess", data);
    },
    refetchOnMount: false,
  });
  const createTrainingEmployee = async (data) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/training/complete-training-and-create-feedback/${trainingId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { mutate, isLoading: isFetching } = useMutation(
    createTrainingEmployee,
    {
      onSuccess: async () => {
        console.log("onSuccess");
        setOpen(false);
        await queryClient.invalidateQueries({
          queryKey: [`get-employee-training-info-${trainingId}`],
        });
      },
      onError: (error) => {
        console.error("onError", error);
      },
    }
  );
  const getProofOfSubmissionUrl = async (fullObject) => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/training-proof-of-submission-${fullObject?.employeeTrainingId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    await axios.put(result?.data?.url, fullObject?.trainingImage, {
      headers: {
        "Content-Type": fullObject?.proofOfSubmissionUrl?.type,
      },
    });
    fullObject.proofOfSubmissionUrl = result?.data?.url?.split("?")[0];
    return fullObject;
  };

  const { mutate: getProofMutate } = useMutation(getProofOfSubmissionUrl, {
    onSuccess: async (data) => {
      completeTrainingAndCreateFeedbackMutate(data);
    },
    onError: (error) => {
      console.error("onError", error);
    },
  });
  const completeTrainingAndCreateFeedbackFunction = async (data) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/training/complete-training-and-create-feedback/${data?.employeeTrainingId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { mutate: completeTrainingAndCreateFeedbackMutate } = useMutation(
    completeTrainingAndCreateFeedbackFunction,
    {
      onSuccess: async () => {
        console.log("onSuccess");
        setOpen(false);

        await queryClient.invalidateQueries({
          queryKey: [`get-overdue-training`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-upcoming-training`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-completed-training`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-training-employee`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-training-employee-info`],
        });
        await queryClient.invalidateQueries(`get-ongoing-training`);
      },
      onError: (error) => {
        console.error("onError", error);
      },
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
    isFetching,
    open,
    setOpen,
    getProofMutate,
  };
};

export default useCardQuery;
