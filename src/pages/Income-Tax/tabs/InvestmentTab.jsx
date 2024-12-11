import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../../peformance/components/Card";
import CreateModal from "../components/CreateModal";
import DeleteInvestmentModal from "../components/DeleteInvestmentModal";
import InvestmentTable from "../components/InvestmentTable";
import InvestmentTableSkeleton from "../components/InvestmentTableSkeleton";
import RegimeModal from "../components/RegimeModal";
import useGetInvestmentSection from "../hooks/queries/useGetInvestmentSection";
import useGetTdsbyEmployee from "../hooks/queries/useGetTdsbyEmployee";
import useFunctions from "../hooks/useFunctions";

const InvestmentTab = () => {
  // investment modal state
  const { search, page } = useFunctions();
  const { empId } = useParams(undefined);
  const employeeId = empId ? empId : UserProfile()?.getCurrentUser()?._id;
  const { investments, isFetching } = useGetInvestmentSection(
    search,
    page,
    employeeId
  );
  const { editOpen, setEditOpen, open, setOpen } = useFunctions();
  const { tdsForEmployee, isFetching: isLoading } = useGetTdsbyEmployee(
    employeeId,
    "2024-2025"
  );

  return (
    <section>
      <headers className="flex items-center justify-between ">
        <div class="flex items-center justify-between ">
          {/* <div class="space-y-1">
            <h2 class=" md:text-2xl  tracking-tight">Declaration</h2>
            <p class="text-sm text-muted-foreground">
              Here you can create your declaration
            </p>
          </div> */}
          {/* <HeadingOneLineInfo
            heading="Declaration"
            info={"Here you can create your declaration"}
          /> */}
        </div>
      </headers>

      {isLoading ? (
        <InvestmentTableSkeleton />
      ) : (
        <>
          <div className="flex flex-wrap flex-1 pb-4  gap-8">
            <Card
              title={"Taxable Income"}
              data={`₹ ${tdsForEmployee?.totalTaxableIncome ?? 0}`}
            />
            <Card
              title={"Total Tax"}
              data={` ₹ ${
                isNaN(tdsForEmployee?.regularTaxAmount + tdsForEmployee?.cess)
                  ? 0
                  : tdsForEmployee?.regularTaxAmount + tdsForEmployee?.cess
              }`}
            />
            <Card
              title={"Regime Select"}
              data={tdsForEmployee?.regime ?? "Not Selected yet"}
            />
          </div>

          <InvestmentTable
            setOpen={setOpen}
            investments={investments}
            isFetching={isFetching}
            empId={empId}
          />
        </>
      )}
      <CreateModal open={open} investments={investments} setOpen={setOpen} />
      <CreateModal
        open={editOpen}
        investments={investments}
        setOpen={setEditOpen}
      />
      <DeleteInvestmentModal />
      <RegimeModal />
    </section>
  );
};

export default InvestmentTab;
