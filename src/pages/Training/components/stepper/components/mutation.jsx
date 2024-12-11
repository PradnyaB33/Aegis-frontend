import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../../../State/Function/Main";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import useTrainingStore from "./zustand-store";

const useTrainingCreationMutation = () => {
  const authToken = useAuthToken();
  const { setOpen } = useTrainingStore();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const { organisationId } = useParams();
  const getTrainingImageUrl = async (fullObject) => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/training-banner`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    await axios.put(result?.data?.url, fullObject?.trainingImage, {
      headers: {
        "Content-Type": fullObject?.trainingImage?.type,
      },
    });
    fullObject.trainingImage = result?.data?.url?.split("?")[0];
    return fullObject;
  };

  const createTrainingObject = async (data) => {
    await axios.post(
      `${process.env.REACT_APP_API}/route/training/${organisationId}/create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
  };
  const { mutate: createTraining, isLoading: isCreateTrainingLoading } =
    useMutation(createTrainingObject, {
      onSuccess: async () => {
        setOpen(false);
        await queryClient?.invalidateQueries({
          queryKey: [`getTrainingDetailsWithNameLimit10WithCreatorId`],
          exact: false,
        });
        handleAlert(true, "success", "Training Created Successfully");
      },
      onError: (error) => {
        console.error("onError", error);
      },
    });

  const { mutate, isLoading } = useMutation(getTrainingImageUrl, {
    onSuccess: async (data) => {
      createTraining(data);
    },
    onError: (error) => {
      console.error("onError", error);
    },
  });
  const updateTrainingData = async (data) => {
    if (typeof data.trainingImage === "object" && data.trainingImage !== null) {
      const result = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/training-banner`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      await axios.put(result?.data?.url, data?.trainingImage, {
        headers: {
          "Content-Type": data?.trainingImage?.type,
        },
      });
      data.trainingImage = result?.data?.url?.split("?")[0];
      return data;
    } else {
      return data;
    }
  };
  const { mutate: updateTraining, isLoading: isUpdateTrainingLoading } =
    useMutation(updateTrainingData, {
      onSuccess: async (data) => {
        await axios.put(
          `${process.env.REACT_APP_API}/route/training/${data.trainingId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          }
        );
        setOpen(false);
        handleAlert(true, "success", "Training Updated Successfully");
        await queryClient?.invalidateQueries({
          queryKey: ["getTrainingDetailsWithNameLimit10WithCreatorId"],
          exact: false,
        });
      },
      onError: (error) => {
        console.error("onError", error);
      },
    });

  return {
    mutate,
    isCreateTrainingLoading,
    isLoading,
    updateTraining,
    isUpdateTrainingLoading,
  };
};

export default useTrainingCreationMutation;
