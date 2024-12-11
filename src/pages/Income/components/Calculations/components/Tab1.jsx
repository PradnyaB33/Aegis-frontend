import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../../../../../hooks/Token/useAuth";

const Tab1 = () => {
  const authToken = useAuthToken();
  const [taxAmount, setTaxAmount] = useState(0);
  const [cess, setCess] = useState(0);
  const [rebate, setRebate] = useState(0);
  const [tax, setTax] = useState(0);
  const {
    data: salaryAmount,
    isFetching: salaryFetching,
    isLoading: salaryLoading,
  } = useQuery({
    queryKey: ["financialYearGross"],
    queryFn: async () => {
      try {
        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=5-2024&toDate=3-2025`,
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
    },
  });

  async function GetOldTax() {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/tds/getNewRegime/2024-2025/${salaryAmount?.TotalInvestInvestment}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["newRegime"],
    queryFn: GetOldTax,
    onSuccess: (res) => {
      let taxAmount = 0;
      console.log(`🚀 ~ taxAmount:`, taxAmount);
      let cess = 0;
      let tax = 0;

      if (res.salary <= 700000) {
        setTaxAmount(0);
        setTax(0);
        setCess(0);
        return false;
      }

      if (res.salary > 300000) {
        if (res.salary > 300000 && res.salary > 600000) {
          let currentTax = 15000;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 300000) * 0.05;
          taxAmount += currentTax;
        }
      }

      if (res.salary > 600001) {
        if (res.salary > 600001 && res.salary > 900000) {
          let currentTax = 30000;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 600000) * 0.1;
          taxAmount += currentTax;
        }
      }

      if (res.salary > 900001) {
        if (res.salary > 900001 && res.salary > 1200000) {
          let currentTax = 45000;
          console.log(`🚀 ~ currentTax:`, currentTax);
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 900000) * 0.15;
          taxAmount += currentTax;
        }
      }
      if (res.salary > 1200000) {
        // if (res.salary > 1200000) {
        //   let currentTax = 60000;
        //   console.log(`🚀 ~ currentTax:`, currentTax);
        //   taxAmount += currentTax;
        // } else {
        let currentTax = (res.salary - 1200000) * 0.2;
        taxAmount += currentTax;
        // }
      }

      let getRebate = res.salary - 700000;

      if (getRebate < taxAmount) {
        setRebate(getRebate);
        cess = getRebate * 0.04;
        tax = getRebate + cess;
      } else {
        cess = taxAmount * 0.04;
        tax = taxAmount + cess;
      }

      setTaxAmount(taxAmount);
      setCess(cess);
      setTax(tax);
      return { taxAmount, cess, tax };
    },
    enabled: !isNaN(salaryAmount?.TotalInvestInvestment),
  });

  return (
    <div className="overflow-auto !p-0 ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl "> New Regime Calculation</h1>
          <p>This calculation is done by using the government norms </p>
        </div>
      </div>

      {isLoading || salaryLoading || salaryFetching ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div className="px-4 items-center   flex  w-full">
          <div className="p-4 w-full border">
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Income under the head salaries</h1>
              <p className="text-lg">
                INR {salaryAmount?.TotalInvestInvestment?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Income under the head house property</h1>
              <p className="text-lg">
                INR {data?.houseDeclaration?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Income under the head other sources</h1>
              <p className="text-lg">
                INR {data?.otherDeclaration?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Deductions</h1>
              <p className="text-lg">
                {" "}
                INR {data?.sectionDeclaration?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="p-2 flex justify-between bg-gray-400">
              <h1 className="text-lg">Taxable income</h1>
              <p className="text-lg">INR {data?.salary?.toFixed(2) ?? 0}</p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Tax at normal rates</h1>
              <p className="text-lg">INR {taxAmount?.toFixed(2) ?? 0}</p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Less: Tax rebate u/s 87A</h1>
              <p className="text-lg">
                INR{" "}
                {parseFloat(taxAmount.toFixed(2) - rebate?.toFixed(2)).toFixed(
                  2
                ) ?? 0}
              </p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Net tax after rebate</h1>
              <p className="text-lg">INR {rebate?.toFixed(2) ?? 0}</p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Cess</h1>
              <p className="text-lg">INR {cess?.toFixed(2) ?? 0}</p>
            </div>

            <div className="p-2 flex justify-between bg-blue-400">
              <h1 className="text-lg">Tax amount under new regime</h1>
              <p className="text-lg">INR {tax.toFixed(2) ?? 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tab1;
