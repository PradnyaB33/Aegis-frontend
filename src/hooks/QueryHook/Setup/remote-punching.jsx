import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../Token/useAuth";

const useSetupRemotePunching = (organisationId) => {
  //hooks
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  //get token
  const authToken = useAuthToken();

  const { data, isLoading } = useQuery(
    `remote-fetch-${organisationId}`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
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
    try {
      console.log("Sending data to backend:", data); // Debug data
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
        data,
        {
          headers: { Authorization: authToken },
        }
      );
      console.log("API response:", response.data); // Log response
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error?.response?.data || error.message);
      throw error;
    }
  };
  

  const { mutate } = useMutation(updateRemotePunching, {
    onSuccess: async (data) => {
      console.log("Mutation successful, invalidating cache");
      await queryClient.invalidateQueries(`remote-fetch-${organisationId}`);
      handleAlert(true, "success", "Changes Updated Successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error?.response?.data || error.message);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });
  
  
  return { data, isLoading, mutate };
};

export default useSetupRemotePunching;
