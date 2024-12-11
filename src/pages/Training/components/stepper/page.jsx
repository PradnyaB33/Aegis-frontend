import { Book, CheckCircleOutline, FitnessCenter } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import StepFormWrapper from "../../../../components/step-form/wrapper";
import useSetupTraining from "../../../../hooks/QueryHook/Setup/training";
import useMultiStepForm from "../../../../hooks/useStepForm";
import Step1 from "./components/step1/page";
import Step2 from "./components/step2/page";
import useGetDepartments from "./components/step2/step2-hook";
import Step3 from "./components/step3/page";

const Stepper = ({ setOpen, open }) => {
  const { organisationId } = useParams();
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
    setStep,
  } = useMultiStepForm(3);
  const { data } = useGetDepartments();
  const { data: trainingData } = useSetupTraining(organisationId);
  useEffect(() => {
    setStep(1);
    // eslint-disable-next-line
  }, [open]);
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 {...{ nextStep }} />;
      case 2:
        return (
          <Step2
            {...{
              nextStep,
              departments: data?.data,
              orgTrainingType: trainingData?.data?.trainingType,
            }}
          />
        );
      case 3:
        return <Step3 {...{ nextStep }} />;
      default:
        return null;
    }
  };
  const stepper = [
    {
      label: "Training Details",
      icon: Book,
    },
    {
      label: "Info",
      icon: FitnessCenter,
    },
    {
      label: "Confirmation",
      icon: CheckCircleOutline,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={false}
    >
      <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] h-[70vh] overflow-scroll z-10 p-4 bg-white">
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
      </Box>
    </Modal>
  );
};

export default Stepper;
