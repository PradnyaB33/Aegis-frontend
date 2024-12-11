import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import TestTab from "./components/TestTab";

const Performance = () => {
  return (
    <BoxComponent>
      {/* <PerformanceTab /> */}
      <HeadingOneLineInfo
        heading="Performance Management"
        info={"Here, you can manage your performance management effectively."}
      />
      <TestTab />
    </BoxComponent>
  );
};

export default Performance;
