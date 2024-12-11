import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../../hooks/Token/useUser";

const useDesignation = () => {
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();

  const getDesignation = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
    );

    return response.data.designations;
  };
  const { data: designation, isFetching } = useQuery({
    queryKey: [`designation-list-${organisationId}`],
    queryFn: getDesignation,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!organisationId,
  });

  const addDesignation = async ({ data, onClose }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/designation/create`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: addDesignationMutation } = useMutation({
    mutationFn: addDesignation,
    onSuccess: async (data, { onClose }) => {
      console.log("Designation added successfully", data);
      onClose();
      await queryClient.invalidateQueries([
        `designation-list-${organisationId}`,
      ]);
      handleAlert(
        true,
        "success",
        data?.message || "Designation added successfully"
      );
    },
    onError: (error) => {
      console.error("Error adding designation", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error adding designation"
      );
    },
  });

  const deleteDesignation = async ({ designationId, onClose }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/designation/create/${designationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: deleteDesignationMutation } = useMutation({
    mutationFn: deleteDesignation,
    onSuccess: async (data, { onClose }) => {
      console.log("Designation deleted successfully", data);
      await queryClient.invalidateQueries([
        `designation-list-${organisationId}`,
      ]);
      onClose();
      handleAlert(true, "success", "Designation deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting designation", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error deleting designation"
      );
    },
  });

  const editDesignation = async ({ designationId, data, onClose }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/designation/create/${designationId}`,
      data
    );
    return response.data;
  };

  const { mutate: updateDesignationMutation } = useMutation({
    mutationFn: editDesignation,
    onSuccess: async (data, { onClose }) => {
      console.log("Designation edited successfully", data);
      onClose();
      await queryClient.invalidateQueries([
        `designation-list-${organisationId}`,
      ]);
      handleAlert(
        true,
        "success",
        data?.message || "Designation edited successfully"
      );
    },
    onError: (error) => {
      console.error("Error editing designation", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error editing designation"
      );
    },
  });

  return {
    designation,
    addDesignationMutation,
    deleteDesignationMutation,
    updateDesignationMutation,
    isFetching,
  };
};

export default useDesignation;
