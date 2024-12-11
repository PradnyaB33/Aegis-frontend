import {
  AddCircle,
  Business,
  CheckCircle,
  Person,
} from "@mui/icons-material";
import React from "react";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Test1 from "./Component/Test1";
import Test2 from "./Component/Test2";
import Test3 from "./Component/Test3";
import Test4 from "./Component/Test4";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const EditEmployee = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);

  // to define the steppar
  const stepper = [
    {
      label: "Personal Details",
      icon: Person,
    },
    {
      label: "Company Info",
      icon: Business,
    },
    {
      label: "Additional Fields",
      icon: AddCircle,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];

  // swtiching the component based on Next and Prev button
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Test1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 2:
        return <Test2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 3:
        return <Test3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 4:
        return <Test4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;

      default:
        return null;
    }
  };

  return (
    <BoxComponent>
      <div className="flex flex-col  justify-between w-full md:ml-4">
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Edit Employee"}
            info={"Welcome your employees by editing their profiles here."}
          />
        </div>
        <section className="flex space-x-2 ">
          <article className="w-full rounded-lg">
            <div className="w-full md:px-5 px-1">
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
            </div>
          </article>
        </section>
      </div>
    </BoxComponent>
  );
};

export default EditEmployee;
