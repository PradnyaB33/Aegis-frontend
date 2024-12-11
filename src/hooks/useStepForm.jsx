// useMultiStepForm.ts
import { useState } from "react";

const useMultiStepForm = (totalSteps) => {
  const [step, setStep] = useState(1);

  const goToStep = (newStep) => {
    setStep((prevStep) => Math.min(Math.max(newStep, 1), totalSteps));
  };

  const nextStep = () => {
    console.log("nextStep");
    goToStep(step + 1);
  };

  const prevStep = () => {
    goToStep(step - 1);
  };

  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  return {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep, // Add the goToStep function
    setStep,
  };
};

export default useMultiStepForm;
