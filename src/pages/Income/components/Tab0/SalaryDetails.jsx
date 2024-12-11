import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const SalaryDetails = () => {
  const authToken = useAuthToken();
  const createTDSArray = (data) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (data && data.length > 0) {
      return data.map((item) => ({
        month: item.formattedDate,
        HRA: Number(item.hraSalary),
        DA: item.daSalary,
        Basic: item.basicSalary,
        GrossSalary: Number(item.totalGrossSalary),
        PF: 0,
        NetSalary: item.totalNetSalary,
      }));
    }

    // If data is not available, return default TDS array
    return months.map((month) => ({
      month: month + " " + 2023,
      HRA: 0,
      DA: 0,
      Basic: 0,
      GrossSalary: 0,
      PF: 0,
      NetSalary: 0,
    }));
  };

  // const [year, setYear] = useState();

  const {
    data: financialData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["salaryFinacialYear"],
    queryFn: async () => {
      try {
        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=5-2023&toDate=3-2024`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setTDSData(createTDSArray(salaryData.data));
        return salaryData;
      } catch (error) {
        console.log(error);
      }
    },
  });

  console.log(financialData);
  const [tdsData, setTDSData] = useState(createTDSArray(financialData));

  const totalHRA = tdsData.reduce((total, i) => total + Number(i.HRA), 0);
  const totalGrossSalary = tdsData.reduce(
    (total, i) => total + Number(i.GrossSalary),
    0
  );

  const totalBasic = tdsData.reduce((total, i) => total + Number(i.Basic), 0);
  const totalNetSalary = tdsData.reduce(
    (total, i) => total + Number(i.NetSalary),
    0
  );
  const totalDA = tdsData.reduce((total, i) => total + Number(i.DA), 0);

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <table className="table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="px-3 py-3 border">
                  Salary Breakup
                </th>
                <th scope="col" className="py-3 px-2 border">
                  Total
                </th>
                {tdsData.map((item) => (
                  <th scope="col" className="py-3 px-2 border">
                    {item.month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="!font-medium h-14 border-b ">
                <td className="py-4 px-4 leading-7 text-[16px] w-max border">
                  BASIC
                </td>
                <td className="leading-7 px-2 text-[16px] w-max border">
                  {totalBasic.toFixed(2)}
                </td>
                {tdsData.map((item) => (
                  <td className="leading-7 px-2 text-[16px] w-max border">
                    {item.Basic}
                  </td>
                ))}
              </tr>

              <tr className="!font-medium leading-7 text-[16px] h-14 border">
                <td className="py-4 px-4 leading-7 text-[16px]  border">HRA</td>
                <td className="leading-7 px-2 text-[16px]  border">
                  {totalHRA.toFixed(2)}
                </td>

                {tdsData.map((item) => (
                  <td className="leading-7 px-2 text-[16px]  border">
                    {item?.HRA?.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="!font-medium  h-14 border-b">
                <td className="py-4 px-4 leading-7 text-[16px]  border">DA</td>
                <td className="leading-7 text-[16px] px-2 border">
                  {totalDA?.toFixed(2) ?? 0.0}
                </td>
                {tdsData.map((item) => (
                  <td className="leading-7 text-[16px] px-2  border">
                    {item?.DA}
                  </td>
                ))}
              </tr>

              <tr className="!font-medium  h-14 leading-7 text-[16px]  border  border-b">
                <td className="py-4 px-4 leading-7 text-[16px] px-2  border">
                  PF
                </td>
                <td className="pr-4 leading-7 text-[16px] px-2  border">
                  0.00
                </td>
                {tdsData.map((item) => (
                  <td className="leading-7 text-[16px] px-2 border">
                    {item.PF.toFixed(2)}
                  </td>
                ))}
              </tr>

              <tr className="!font-medium h-14 border-b leading-7 text-[16px]  border">
                <td className="py-4 px-4 font-bold leading-7 text-[16px]  border">
                  Gross Salary
                </td>
                <td className="font-bold leading-7 px-2 text-[16px]  border">
                  {" "}
                  {totalGrossSalary.toFixed(2)}
                </td>
                {tdsData.map((item) => (
                  <td className="font-bold leading-7 px-2 text-[16px]  border">
                    {item?.GrossSalary?.toFixed(2)}
                  </td>
                ))}
              </tr>

              <tr className="!font-medium   h-14 border-b">
                <td className="py-4 px-4 font-bold leading-7 text-[16px]  border">
                  NetSalary
                </td>
                <td className="font-bold leading-7 px-2 text-[16px]  border">
                  {totalNetSalary.toFixed(2)}
                </td>
                {tdsData.map((item) => (
                  <td className="font-bold leading-7 px-2 text-[16px]  border">
                    {item.NetSalary}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default SalaryDetails;
