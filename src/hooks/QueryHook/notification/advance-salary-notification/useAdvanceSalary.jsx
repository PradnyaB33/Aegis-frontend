import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";

const useAdvanceSalaryData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const {
    data: getAdvanceSalary,
  } = useQuery(["getAdvanceSalary"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/advance-salary-data`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  });

  const { data: advanceSalaryNotificationEmp } = useQuery(
    ["advance-salary-notification"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/advance-salary-notification-to-emp`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  return {
    getAdvanceSalary,
    advanceSalaryNotificationEmp
  };
};

export default useAdvanceSalaryData;
