import { CheckCircle, West, Work } from "@mui/icons-material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import React from "react";
import { Link } from "react-router-dom";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Step1 from "./Components/Step1";
import Step2 from "./Components/Step2";
import Step3 from "./Components/Step3";

const EditDepartment = () => {
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
    <div className="bg-gray-50 min-h-screen h-auto">
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={"/organizationList"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Edit Department
      </header>

      <section className="px-8 flex space-x-2 py-6">
        <article className="w-full rounded-lg bg-white ">
          <div className=" w-full px-5 ">
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
          </div>
        </article>
      </section>
    </div>
  );
};

export default EditDepartment;
