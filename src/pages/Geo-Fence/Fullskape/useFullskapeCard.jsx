import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient} from "react-query";
import { TestContext } from "../../../State/Function/Main";

const useFullskapeMutation = () => {
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  // Delete Fullskape Card
  const deleteFullskapeCard = async ({ zoneId }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/fullskape/zone/${zoneId}`
    );
    return response.data;
  };

  const { mutate: deleteFullskapeMutate } = useMutation(deleteFullskapeCard, {
    onSuccess: (data) => {
      handleAlert(true, "success", data?.message);
      queryClient.invalidateQueries("fullskape-areas");
    },
  });

  // Add Employee to Fullskape Circle
  const addEmployeeToFullskapeCircle = async ({
    zoneId,
    employeeId,
    onClose,
  }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/employee`,
      { employeeId }
    );
    return response.data;
  };

  const { mutate: addEmployeeToFullskapeMutate } = useMutation(
    addEmployeeToFullskapeCircle,
    {
      onSuccess: (data, { onClose }) => {
        queryClient.invalidateQueries("employee-get-org");
        queryClient.invalidateQueries("fullskape-areas");
        handleAlert(true, "success", data?.message);
        onClose();
      },
    }
  );

  // Remove Employee from Fullskape Circle
  const removeEmployeeFromFullskapeCircle = async ({
    zoneId,
    employeeId,
    onClose,
  }) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/employee`,
      { employeeId }
    );
    return response.data;
  };

  const { mutate: removeEmployeeFromFullskapeMutate } = useMutation(
    removeEmployeeFromFullskapeCircle,
    {
      onSuccess: (data, { onClose }) => {
        queryClient.invalidateQueries("employee-get-org");
        queryClient.invalidateQueries("fullskape-areas");
        handleAlert(true, "success", data?.message);
        onClose();
      },
    }
  );

  return {
    deleteFullskapeMutate,
    addEmployeeToFullskapeMutate,
    removeEmployeeFromFullskapeMutate,
  };
  
};

export default useFullskapeMutation;
