import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useDelegateSuperAdmin = () => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const createDelegate = async (data) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/employee/delegate`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const addDelegateMutation = useMutation({
    mutationFn: createDelegate,
    onSuccess: async (data) => {
      console.log(data);
      handleAlert(true, "success", "Delegate super admin updated successfully");
      await queryClient.invalidateQueries({
        queryKey: [`delegate-super-admin-${decodedToken?.user?._id}`],
      });
    },
    onError: (data) => {
      console.error(`🚀 ~ file: mutation.jsx:37 ~ data:`, data);
      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const deleteDelegate = async ({ id, reset }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/employee/delegate?employeeId=${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const deleteDelegateMutation = useMutation({
    mutationFn: deleteDelegate,
    onSuccess: async (data, variables) => {
      handleAlert(true, "success", "Delegate super admin deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: [`delegate-super-admin-${decodedToken?.user?._id}`],
      });
      window.location.reload(false);
    },
    onError: (data, variables, context) => {
      console.log(data);
    },
  });

  return {
    addDelegateMutation,
    deleteDelegateMutation,
  };
};

export default useDelegateSuperAdmin;
