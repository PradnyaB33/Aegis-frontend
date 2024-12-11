import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";

const useGeoMutation = () => {
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const deleteGeoCard = async ({ id }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/geo-fence/area/${id}`
    );
    return response.data;
  };
  const { mutate } = useMutation(deleteGeoCard, {
    onSuccess: (data) => {
      handleAlert(true, "success", data?.message);
      queryClient.invalidateQueries("geo-fenced-areas");
    },
  });

  const addEmployeeToCircle = async ({ circleId, employeeId, onClose }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/geo-fence/${circleId}/employee`,
      { employeeId }
    );
    return response.data;
  };

  const { mutate: addEmployeeToCircleMutate } = useMutation(
    addEmployeeToCircle,
    {
      onSuccess: (data, { onClose }) => {
        queryClient.invalidateQueries(`employee-get-org`);
        queryClient.invalidateQueries(`geo-fenced-areas`);
        handleAlert(true, "success", data?.message);
        onClose();
      },
    }
  );

  const removeEmployeeToCircle = async ({ circleId, employeeId, onClose }) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/geo-fence/${circleId}/employee/`,
      { employeeId }
    );
    return response.data;
  };

  const { mutate: removeEmployeeToCircleMutate } = useMutation(
    removeEmployeeToCircle,
    {
      onSuccess: (data, { onClose }) => {
        queryClient.invalidateQueries(`employee-get-org`);
        queryClient.invalidateQueries(`geo-fenced-areas`);
        handleAlert(true, "success", data?.message);
        onClose();
      },
    }
  );

  return { mutate, addEmployeeToCircleMutate, removeEmployeeToCircleMutate };
};

export default useGeoMutation;
