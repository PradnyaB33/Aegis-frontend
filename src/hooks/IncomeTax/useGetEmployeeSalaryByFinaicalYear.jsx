import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useGetEmployeeSalaryByFinaicalYear = () => {
  function getFinancialCurrentYear() {
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

    console.log(`🚀 ~ start, end:`, financialYearStart, financialYearEnd);

    return { start: financialYearStart, end: financialYearEnd };
  }

  const authToken = useAuthToken();
  const { start, end } = getFinancialCurrentYear();

  const { data: usersalary, isFetching } = useQuery({
    queryKey: ["finacialYearData", start],
    queryFn: async () => {
      try {
        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=${start}&toDate=${end}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log(`🚀 ~ start, end:`, start, end);

        return salaryData.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return { usersalary, getFinancialCurrentYear, isFetching };
};

export default useGetEmployeeSalaryByFinaicalYear;
