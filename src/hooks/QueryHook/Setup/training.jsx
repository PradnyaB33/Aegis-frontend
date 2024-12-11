import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useSetupTraining = (organisationId) => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const { data, isLoading, isFetching } = useQuery(
    `training-fetch-${organisationId ?? decodedToken?.user?.organizationId}`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/setup/training/${
            organisationId ?? decodedToken?.user?.organizationId
          }`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data;
      } catch (err) {
        console.error(err.message);
      }
    },
    {
      onSuccess: (data) => {
        console.info(`🚀 ~ file: remote-punching.jsx:29 ~ data:`, data);
      },
      onError: (error) => {
        console.error(`🚀 ~ file: remote-punching.jsx:29 ~ error:`, error);
      },
    }
  );
  const updateRemotePunching = async (data) => {
    await axios.put(
      `${process.env.REACT_APP_API}/route/setup/training/${organisationId}`,
      data,
      {
        headers: { Authorization: authToken },
      }
    );
  };
  const { mutate } = useMutation(updateRemotePunching, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(`training-fetch-${organisationId}`);
      handleAlert(true, "success", "Changes Updated Successfully");
    },
    onError: (error) => {
      console.error(`🚀 ~ file: remote-punching.jsx:29 ~ error:`, error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });
  return { data, isLoading, mutate, isFetching };
};

export default useSetupTraining;
