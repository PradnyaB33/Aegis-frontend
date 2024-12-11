import { Business, CheckCircle, Person } from "@mui/icons-material";
import React from "react";
import useMultiStepForm from "../../hooks/useStepForm";
import StepFormWrapper from "../../components/step-form/wrapper";
import Test1 from "./components/Test1";
import Test2 from "./components/Test2";
import Test3 from "./components/Test3";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const CreateJobPosition = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(3);

  const stepper = [
    {
      label: "Job Details",
      icon: Person,
    },
    {
      label: "Additional Info",
      icon: Business,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Test1 {...{ nextStep }} />;
      case 2:
        return <Test2 {...{ nextStep, prevStep }} />;
      case 3:
        return <Test3 {...{ nextStep, prevStep }} />;

      default:
        return null;
    }
  };
  return (
    <BoxComponent>
      <HeadingOneLineInfo heading="Create Job Position" info="Here you can create the job position." />
      <StepFormWrapper
        {...{
          goToStep,
          totalSteps,
          step,
          isFirstStep,
          nextStep,
          prevStep,
          isLastStep,
          stepper,
        }}
      >
        {useSwitch(step)}
      </StepFormWrapper>
    </BoxComponent >
  );
};

export default CreateJobPosition;
