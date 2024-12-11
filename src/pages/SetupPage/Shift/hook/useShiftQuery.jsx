import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../../hooks/Token/useUser";
import { TestContext } from "../../../../State/Function/Main";

const useShiftQuery = () => {
  const { authToken } = useGetUser();
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const getShifts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["shifts", organisationId],
    queryFn: getShifts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const deleteRequest = async ({ id, onClose }) => {
    console.log(`🚀 ~ file: useShiftQuery.jsx:33 ~ { id, onClose }:`, {
      id,
      onClose,
    });
    await axios.delete(`${process.env.REACT_APP_API}/route/shifts/${id}`, {
      headers: {
        Authorization: authToken,
      },
    });
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteRequest,
    onSuccess: async (data, { onClose }) => {
      await queryClient.invalidateQueries(["shifts", organisationId]);
      handleAlert(true, "success", "Shift deleted successfully");
      onClose();
    },
    onError: () => {
      handleAlert(true, "error", "Failed to delete shift");
    },
  });

  const addShift = async ({ data, onClose }) => {
    await axios.post(`${process.env.REACT_APP_API}/route/shifts/create`, data, {
      headers: {
        Authorization: authToken,
      },
    });
  };

  const { mutate: addMutate } = useMutation({
    mutationFn: addShift,
    onSuccess: async (data, { onClose }) => {
      await queryClient.invalidateQueries(["shifts", organisationId]);
      handleAlert(true, "success", "Shift added successfully");
      onClose();
    },
    onError: (error) => {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to add shift"
      );
    },
  });

  const editShift = async ({ data, onClose }) => {
    await axios.patch(
      `${process.env.REACT_APP_API}/route/shifts/${data._id}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
  };

  const { mutate: editMutate } = useMutation({
    mutationFn: editShift,
    onSuccess: async (data, { onClose }) => {
      await queryClient.invalidateQueries(["shifts", organisationId]);
      handleAlert(true, "success", "Shift updated successfully");
      onClose();
    },
    onError: (error) => {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to update shift"
      );
    },
  });

  return { data, isLoading, deleteMutation, addMutate, editMutate };
};

export default useShiftQuery;
