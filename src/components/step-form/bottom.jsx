import { Button } from "@mui/material";

const Bottom = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
  return (
    <div className="w-full flex justify-between">
      <Button variant={"contained"} onClick={prevStep} disabled={isFirstStep}>
        Previous
      </Button>

      <button
        onClick={nextStep}
        disabled={isLastStep}
        className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
      >
        Next
      </button>
    </div>
  );
};

export default Bottom;
