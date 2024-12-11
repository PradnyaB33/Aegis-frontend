import { CircularProgress } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../../peformance/components/Card";
import CalculationComponent from "../components/CalculationComponent";
import useGetTdsbyEmployee from "../hooks/queries/useGetTdsbyEmployee";

const CalculationTab = () => {
  const { empId } = useParams(undefined);
  const employeeId = empId ? empId : UserProfile()?.getCurrentUser()?._id;
  const { tdsForEmployee, isFetching } = useGetTdsbyEmployee(
    employeeId,
    "2024-2025"
  );

  let salaryComponents = [
    {
      name: "Gross Salary",
      sectionname: "Salary",
      amountAccepted: isNaN(Number(tdsForEmployee?.salary))
        ? 0
        : Number(tdsForEmployee?.salary),
    },
    ...(tdsForEmployee?.investment ?? []),
    {
      name: "Less:Standard Deduction",
      sectionname: "Salary",
      amountAccepted: tdsForEmployee?.regime === "Old Regime" ? 50000 : 75000,
    },
  ];

  return (
    <section>
      <article className=" rounded-md">
        {isFetching ? (
          <>
            <CircularProgress />
          </>
        ) : (
          <>
            <div className="flex flex-wrap flex-1 pb-4  gap-8">
              <Card
                title={"Quarter 1"}
                data={tdsForEmployee?.q1 ? `₹ ${tdsForEmployee?.q1}` : "-"}
              />
              <Card
                title={"Quarter 2"}
                data={tdsForEmployee?.q2 ? ` ₹ ${tdsForEmployee?.q2} ` : "-"}
              />
              <Card
                title={"Quarter 3"}
                data={tdsForEmployee?.q3 ? ` ${tdsForEmployee?.q3}` : "-"}
              />
              <Card
                title={"Quarter 4"}
                data={tdsForEmployee?.q4 ? `${tdsForEmployee?.q4}` : "-"}
              />
            </div>
            <article className="bg-white border rounded-md">
              <CalculationComponent
                investments={salaryComponents}
                section="Salary"
                amount={
                  isNaN(
                    tdsForEmployee?.salary + tdsForEmployee?.salaryDeclaration
                  )
                    ? 0
                    : tdsForEmployee?.salary +
                      tdsForEmployee?.salaryDeclaration -
                      (tdsForEmployee?.regime === "Old Regime" ? 50000 : 75000)
                }
                heading={"Salary components"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="House"
                amount={tdsForEmployee?.houseDeclaration ?? 0}
                heading={"Income From House Property"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="House"
                amount={tdsForEmployee?.houseDeclaration ?? 0}
                heading={"Income From House Property"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="Otherincome"
                amount={tdsForEmployee?.otherDeclaration ?? 0}
                heading={"Income From Other Sources"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="SectionDeduction"
                amount={tdsForEmployee?.sectionDeclaration ?? 0}
                heading={"Less : Deduction under chapter VI A"}
              />

              <div className="flex w-full  gap-2 py-3 px-4  justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Taxable Income
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  ₹ {tdsForEmployee?.totalTaxableIncome ?? 0}
                </h1>
              </div>

              <div className="flex w-full  gap-2 py-3 px-4  justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Tax
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  ₹ {tdsForEmployee?.regularTaxAmount ?? 0}
                </h1>
              </div>
              <div className="flex w-full  gap-2 py-3 px-4  justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Cess
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  ₹ {tdsForEmployee?.cess ?? 0}
                </h1>
              </div>

              <div className="flex w-full bg-blue-100   gap-2 p-4 justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Tax Amount
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  ₹{" "}
                  {isNaN(
                    tdsForEmployee?.regularTaxAmount + tdsForEmployee?.cess
                  )
                    ? 0
                    : tdsForEmployee?.regularTaxAmount + tdsForEmployee?.cess}
                </h1>
              </div>
            </article>
          </>
        )}
      </article>
    </section>
  );
};

export default CalculationTab;
