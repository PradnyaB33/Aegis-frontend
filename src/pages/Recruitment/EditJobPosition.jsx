import { Business, CheckCircle, Person, West } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import useMultiStepForm from "../../hooks/useStepForm";
import StepFormWrapper from "../../components/step-form/wrapper";
import EditTest1 from "./components/EditTest1";
import EditTest2 from "./components/EditTest2";
import EditTest3 from "./components/EditTest3";

const EditJobPosition = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(3);
  const navigate = useNavigate();

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
        return <EditTest1 {...{ nextStep }} />;
      case 2:
        return <EditTest2 {...{ nextStep, prevStep }} />;
      case 3:
        return <EditTest3 {...{ nextStep, prevStep }} />;

      default:
        return null;
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen h-auto">
      <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4">
        {/* Back Button */}
        <div className="flex-shrink-0">
          <IconButton onClick={() => navigate(-1)}>
            <West className="text-xl" />
          </IconButton>
        </div>

        {/* Main Header Content */}
        <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
          <div className="mb-2 md:mb-0 md:mr-4">
            <h1 className="text-xl font-bold">Create Job Position</h1>
            <p className="text-sm text-gray-600">
              Here you can create the job position.
            </p>
          </div>
        </div>
      </header>

      {/* Stepper form Content */}
      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-lg bg-white">
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
  );
};

export default EditJobPosition;
