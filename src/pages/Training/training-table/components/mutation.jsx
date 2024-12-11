import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../../hooks/Token/useUser";

const useTrainingDetailsMutation = () => {
  const { authToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const deleteTrainingFunction = async (id) => {
    console.log(
      `🚀 ~ file: mutation.jsx ~ line 6 ~ deleteTrainingFunction ~ id`,
      id
    );
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/training/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  // const {data,isLoading}=useQuery()
  const { mutate, isLoading } = useMutation(deleteTrainingFunction, {
    onSuccess: () => {
      handleAlert(true, "success", "Training Deleted Successfully");
      queryClient.invalidateQueries(
        "getTrainingDetailsWithNameLimit10WithCreatorId"
      );
    },
    onError: (error) => {
      console.error("onError", error);
      handleAlert(true, "error", error.response.data.message);
    },
  });

  const addEmployeeToTraining = async ({ data, trainingId, close }) => {
    console.log(
      `🚀 ~ file: mutation.jsx ~ line 31 ~ addEmployeeToTraining ~ data`,
      data
    );
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/training-employee/assign-training-employees/${trainingId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    response.data.close = close;
    return response.data;
  };

  const { mutate: assignEmployee, isLoading: assignEmployeeLoading } =
    useMutation(addEmployeeToTraining, {
      onSuccess: async (data) => {
        handleAlert(
          true,
          "success",
          "Training assigned to employee successfully"
        );
        data.close();
        await queryClient.invalidateQueries(
          "getTrainingDetailsWithNameLimit10WithCreatorId"
        );
        await queryClient.invalidateQueries(
          `getAllEmployee-${organisationId}-${data?.trainingId}`
        );
      },
      onError: (error) => {
        console.error("onError", error);
        handleAlert(true, "error", error.response.data.message);
      },
    });

  return { mutate, isLoading, assignEmployee, assignEmployeeLoading };
};

export default useTrainingDetailsMutation;
