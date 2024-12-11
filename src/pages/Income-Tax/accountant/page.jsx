// import { West } from "@mui/icons-material";
import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import EmployeeInvestmentTable from "./EmployeeTable";

const EmployeeInvestmentPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <BoxComponent>
        {loading && (
          <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10000000]">
            <CircularProgress />
          </div>
        )}
        <HeadingOneLineInfo
          heading={"  TDS Declarations done by individuals"}
          info={
            " Accountant can view and download the declaration document from here"
          }
        />

        <section className="justify-between  min-h-[85vh] bg-gray-50">
          <div className="pb-4  gap-8">
            <EmployeeInvestmentTable
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </section>
      </BoxComponent>
    </>
  );
};

export default EmployeeInvestmentPage;
