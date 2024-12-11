import React, { useContext } from "react";
import AdvanceSalaryCard from "./employee-salary-card";
import AdvanceSalaryLoader from "./employee-salary-loader";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const InputForm = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  const { data: advanceSalaryNotification, isLoading, isFetching } = useQuery(
    ["emp-advance-salary-notification"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/send-notification-to-emp`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["advance-salary-notification"] });
      }
    }
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {(isLoading || isFetching) &&
        [1, 2].map((item) => <AdvanceSalaryLoader key={item} />)}
      {advanceSalaryNotification?.map((item, index) => (
        <AdvanceSalaryCard key={index} items={item} />
      ))}
      {advanceSalaryNotification < 1 && <h1>Sorry, no request found</h1>}
    </div>
  );
};

export default InputForm;
