import React from "react";
import ReportForm from "./components/MiniForm";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const ReportingMis = () => {
  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Generate Report"} info={"Generate the excel report for attendence salary like data"} />
      <ReportForm /> </BoxComponent>
  );
};

export default ReportingMis;
