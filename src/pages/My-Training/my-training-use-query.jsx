import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";
import useMyTrainingStore from "./components/my-training-zustand";

const useTrainingFormEmployee = () => {
  const [page, setPage] = React.useState(1);
  const { trainingName, trainingDepartment, trainingType } =
    useMyTrainingStore();
  const { decodedToken, authToken } = useGetUser();

  const getEmployee = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-recent-training/${decodedToken?.user?.organizationId}?page=${page}&trainingName=${trainingName}&trainingDepartment=${trainingDepartment?.value}&trainingType=${trainingType?.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [
      `get-employee-data`,
      page,
      trainingName,
      trainingDepartment?.value,
      trainingType?.value,
    ],
    queryFn: getEmployee,
    onSuccess: (data) => {
      console.log("onSuccess", data);
    },
  });
  return { data, isLoading, error, setPage, page };
};

export default useTrainingFormEmployee;
