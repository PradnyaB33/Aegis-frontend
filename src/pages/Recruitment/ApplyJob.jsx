import {
  AddCircle,
  Business,
  CheckCircle,
  Person,
  West,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Form1 from "./components/Form1";
import Form2 from "./components/Form2";
import Form3 from "./components/Form3";
import Form4 from "./components/Form4";

const ApplyJob = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);
  const navigate = useNavigate();

  const stepper = [
    {
      label: "Basic Information",
      icon: Person,
    },
    {
      label: "Upload Resume",
      icon: Business,
    },
    {
      label: "Additional Information",
      icon: AddCircle,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];

  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Form1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 2:
        return <Form2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 3:
        return <Form3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 4:
        return <Form4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;

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
            <h1 className="text-xl font-bold">Apply For Job</h1>
            <p className="text-sm text-gray-600">
              Here you can apply for open job role position.
            </p>
          </div>
        </div>
      </header>

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

export default ApplyJob;
