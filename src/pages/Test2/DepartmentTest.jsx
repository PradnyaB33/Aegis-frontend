import { CheckCircle, Work } from "@mui/icons-material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import React from "react";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Step1 from "./DepartmentComp/Step1";
import Step2 from "./DepartmentComp/Step2";
import Step3 from "./DepartmentComp/Step3";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
const DepartmentTest = () => {
  // hook
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(3);

  // steppar
  const stepper = [
    {
      label: "Department Details",
      icon: Work,
    },
    {
      label: "Cost Center info",
      icon: MonetizationOnIcon,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];

  // swtiching the component
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 {...{ nextStep }} />;
      case 2:
        return <Step2 {...{ nextStep, prevStep }} />;
      case 3:
        return <Step3 {...{ nextStep, prevStep }} />;

      default:
        return null;
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Add Department"} info={"Here you can add department"} />
      <StepFormWrapper
        {...{
          goToStep,
          totalSteps,
          step,
          isFirstStep,
          isLastStep,
          nextStep,
          prevStep,
          stepper,
        }}
      >
        {useSwitch(step)}
      </StepFormWrapper>
    </BoxComponent>
  );
};

export default DepartmentTest;
