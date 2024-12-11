import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import useTrainingStore from "./stepper/components/zustand-store";
import Stepper from "./stepper/page";

const Header = () => {
  const { open, setOpen, reset } = useTrainingStore();
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className=" font-bold text-2xl">Training</h1>
        <p className="text-sm text-Brand-neutrals/brand-neutrals-3">
          Click on add new button to create trainings
        </p>
      </div>
      <Button
        onClick={async () => {
          await reset();
        }}
        size="large"
        className="h-fit "
        variant="contained"
      >
        <Add />
        New Training
      </Button>
      <Stepper open={open} setOpen={setOpen} />
    </div>
  );
};

export default Header;
