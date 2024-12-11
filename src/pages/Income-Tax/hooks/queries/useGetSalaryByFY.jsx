import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetSalaryByFY = (empId = "") => {
  function getFinancialCurrentYear() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let financialYearStart, financialYearEnd;
    financialYearStart = `${currentYear}`;
    financialYearEnd = `${currentYear + 1}`;
    return { start: financialYearStart, end: financialYearEnd };
  }

  function getFinancialCurrentMonthYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let financialYearStart, financialYearEnd;

    if (currentMonth >= 4) {
      financialYearStart = `4-${currentYear}`;
      financialYearEnd = `3-${currentYear + 1}`;
    } else {
      financialYearStart = `4-${currentYear - 1}`;
      financialYearEnd = `3-${currentYear}`;
    }

    return { start: financialYearStart, end: financialYearEnd };
  }

  const authToken = useAuthToken();
  const { start, end } = getFinancialCurrentMonthYear();

  const getFinancialYearData = async () => {
    try {
      const salaryData = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=${start}&toDate=${end}&empId=${empId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return salaryData.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: usersalary, isFetching } = useQuery({
    queryKey: ["finacialYearData", start, empId],
    queryFn: getFinancialYearData,
  });

  return {
    usersalary,
    getFinancialCurrentYear,
    getFinancialCurrentMonthYear,
    isFetching,
  };
};

export default useGetSalaryByFY;
