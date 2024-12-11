import { useContext } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";

const useAdvanceSalaryQuery = (organisationId) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //for  Get Query to total salary
  const { data: getTotalSalaryEmployee } = useQuery(
    ["totalSalary", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/total-salary`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const totalSalary = response.data.totalSalary;
      return totalSalary;
    }
  );

  //for  Get Query to get department
  const { data: getDepartment } = useQuery(
    ["department", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.department;
    }
  );

  return {
    getTotalSalaryEmployee,
    getDepartment,
  };
};

export default useAdvanceSalaryQuery;
