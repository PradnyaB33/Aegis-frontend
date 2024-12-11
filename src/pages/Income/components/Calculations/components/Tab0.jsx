import { CircularProgress } from "@mui/material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetEmployeeSalaryByFinaicalYear from "../../../../../hooks/IncomeTax/useGetEmployeeSalaryByFinaicalYear";
import useIncomeTax from "../../../../../hooks/IncomeTax/useIncomeTax";
import useAuthToken from "../../../../../hooks/Token/useAuth";

const Tab0 = () => {
  const authToken = useAuthToken();
  // const [taxAmount, setTaxAmount] = useState(0);
  // const [cess, setCess] = useState(0);
  // const [tax, setTax] = useState(0);
  const { setTaxAmount, setCess, setTax, taxAmount, cess, tax } =
    useIncomeTax();
  const { usersalary: salaryAmount, isFetching } =
    useGetEmployeeSalaryByFinaicalYear();
  // const {
  //   data: salaryAmount,
  //   // isFetched: salaryFetch,
  //   // isFetching: salaryFetching,
  //   isLoading: salaryLoading,
  // } = useQuery({
  //   queryKey: ["financialYearGross"],
  //   queryFn: async () => {
  //     try {
  //       const { financialYearStart, financialYearEnd } =
  //         getCurrentFinancialYear();
  //       const salaryData = await axios.get(
  //         `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=${financialYearStart}&toDate=${financialYearEnd}`,
  //         {
  //           headers: {
  //             Authorization: authToken,
  //           },
  //         }
  //       );
  //       return salaryData.data;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // });

  async function GetOldTax() {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/tds/getMyDeclaration/2024-2025/${salaryAmount?.TotalInvestInvestment}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["oldRegime"],
    queryFn: GetOldTax,
    refetchOnMount: false,
    onSuccess: (res) => {
      let taxAmount = 0;
      let cess = 0;
      let tax = 0;
      if (res.age < 60) {
        if (res.salary <= 500000) {
          cess = 0;
          taxAmount = 0;
          tax = 0;
          return;
        }

        if (res.salary > 250000 && res.salary > 500000) {
          let currentTax = 12500;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 250000) * 0.05;
          taxAmount += currentTax;
        }

        if (res.salary > 500000 && res.salary > 1000000) {
          let currentTax = 100000;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 500000) * 0.2;
          taxAmount += currentTax;
        }
        if (res.salary > 1000000) {
          let currentTax = (res.salary - 1000000) * 0.3;
          taxAmount += currentTax;
        }

        cess = taxAmount * 0.04;
        tax = taxAmount + cess;
      }

      if (res.age > 60 && res.age <= 80) {
        if (res.salary <= 500000) {
          cess = 0;
          taxAmount = 0;
          tax = 0;
          return;
        }

        if (res.salary > 300001 && res.salary > 500000) {
          let currentTax = 10000;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 300001) * 0.05;
          taxAmount += currentTax;
        }

        if (res.salary > 500000 && res.salary > 1000000) {
          let currentTax = 100000;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 500000) * 0.2;
          taxAmount += currentTax;
        }
        if (res.salary > 1000000) {
          let currentTax = (res.salary - 1000000) * 0.3;
          taxAmount += currentTax;
        }

        cess = taxAmount * 0.04;
        tax = taxAmount + cess;
      }

      if (res.age > 80) {
        if (res.salary <= 500000) {
          cess = 0;
          taxAmount = 0;
          tax = 0;
          return;
        }

        if (res.salary > 500000 && res.salary > 1000000) {
          let currentTax = 100000;
          taxAmount += currentTax;
        } else {
          let currentTax = (res.salary - 500000) * 0.2;
          taxAmount += currentTax;
        }
        if (res.salary > 1000000) {
          let currentTax = (res.salary - 1000000) * 0.3;
          taxAmount += currentTax;
        }

        cess = taxAmount * 0.04;
        tax = taxAmount + cess;
      }

      setTaxAmount(taxAmount > 0 ? taxAmount : 0);
      setCess(cess);
      setTax(tax);
      console.log(taxAmount);
      return { taxAmount, cess, tax };
    },
    enabled: !isNaN(salaryAmount?.TotalInvestInvestment),
  });

  console.log(
    "Running it",
    salaryAmount?.TotalInvestInvestment,
    data?.salaryDeclaration
  );

  return (
    <div className="overflow-auto !p-0 ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl "> Old Regime Calculation</h1>
          <p>This calculation is done by using the government norms </p>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div className="px-4 items-center   flex  w-full">
          <div className="p-4 w-full border">
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Income under the head salaries</h1>
              <p className="text-lg">
                INR{" "}
                {isNaN(
                  salaryAmount?.TotalInvestInvestment + data?.salaryDeclaration
                )
                  ? 0
                  : salaryAmount?.TotalInvestInvestment +
                  data?.salaryDeclaration ?? 0}
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
            <div className="p-3 rounded-md flex justify-between bg-blue-200">
              <h1 className="text-xl">Taxable income</h1>
              <p className="text-xl">
                INR {data?.salary < 0 ? 0 : data?.salary?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Taxable amount</h1>
              <p className="text-lg">INR {taxAmount?.toFixed(2) ?? 0}</p>
            </div>

            <div className="p-2 flex justify-between">
              <h1 className="text-lg">Cess</h1>
              <p className="text-lg">INR {cess?.toFixed(2) ?? 0}</p>
            </div>

            <div className="p-3 flex justify-between rounded-md bg-blue-200">
              <h1 className="text-xl font-medium">
                Tax amount under old regime
              </h1>
              <p className="text-xl">INR {tax.toFixed(2) ?? 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tab0;
