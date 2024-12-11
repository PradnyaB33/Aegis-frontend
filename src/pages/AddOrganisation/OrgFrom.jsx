import { 
  Business,
  Check,
  InventorySharp,
  PlusOneOutlined,
} from "@mui/icons-material";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Step1 from "./components/step-1";
import Step2 from "./components/step-2";
import Step3 from "./components/step-3";
import Step4 from "./components/step-4";

const NewOrganisationForm = () => {
  const {
    step,
    nextStep,
    prevStep, 
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);
  
  // Function to switch between steps
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep} />;
      case 2:
        return <Step2 nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3 nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4 prevStep={prevStep} />;
      default:
        return null;
    }
  };

  // Define the stepper
  const stepper = [
    {
      label: "Organisation Details",
      icon: Business,
    },
    {
      label: "Package Info",
      icon: InventorySharp,
    },
    {
      label: "Member Count",
      icon: PlusOneOutlined,
    },
    {
      label: "All Done",
      icon: Check,
    },
  ];

  return (
    <div className="pt-10">
      <div className="m-4 2xl:w-[1200px] xl:w-[90%] lg:w-[90%] w-auto md:m-auto border-gray-400 border p-4 rounded-lg">
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
          {/* Back Button Logic */}
          {/* <div className="flex justify-between mt-4">
            {!isFirstStep && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Back
              </button>
            )}
            {!isLastStep && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            )}
          </div> */}
        </StepFormWrapper>
      </div>
    </div>
  );
};

export default NewOrganisationForm;




// import {
//   Business,
//   Check,
//   InventorySharp,
//   PlusOneOutlined,
// } from "@mui/icons-material";
// import StepFormWrapper from "../../components/step-form/wrapper";
// import useMultiStepForm from "../../hooks/useStepForm";
// import Step1 from "./components/step-1";
// import Step2 from "./components/step-2";
// import Step3 from "./components/step-3";
// import Step4 from "./components/step-4";
// const NewOranisationForm = () => {
//   const {
//     step, 
//     nextStep,
//     prevStep,
//     isFirstStep,
//     isLastStep,
//     totalSteps,
//     goToStep,
//   } = useMultiStepForm(4);
  
//   // switch the component using next and prev button
//   const useSwitch = (step) => {
//     switch (step) {
//       case 1:
//         return <Step1 {...{ nextStep }} />;
//       case 2:
//         return <Step2 {...{ nextStep }} />;
//       case 3:
//         return <Step3 {...{ nextStep }} />;
//       case 4:
//         return <Step4 {...{ nextStep }} />;
//       default:
//         return null;
//     }
//   };

//   // define the steppar
//   const stepper = [
//     {
//       label: "Organisation Details",
//       icon: Business,
//     },
//     {
//       label: "Package Info",
//       icon: InventorySharp,
//     },
//     {
//       label: "Member Count",
//       icon: PlusOneOutlined,
//     },
//     {
//       label: "All Done",
//       icon: Check,
//     },
//   ];

//   return (
//     <div className="pt-10">
//       <div className="m-4 2xl:w-[1200px] xl:w-[90%] lg:w-[90%] w-auto md:m-auto border-gray-400 border p-4 rounded-lg">
//         <StepFormWrapper
//           {...{
//             goToStep,
//             totalSteps,
//             step,
//             isFirstStep,
//             isLastStep,
//             nextStep,
//             prevStep,
//             stepper,
//           }}
//         >
//           {useSwitch(step)}
//         </StepFormWrapper>
//       </div>
//     </div>
//   );
// };

// export default NewOranisationForm;