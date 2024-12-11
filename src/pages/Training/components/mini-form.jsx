import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import useSearchTrainingZustandStore from "./zustand-store";

const MiniForm = () => {
  const { setTrainingName } = useSearchTrainingZustandStore();

  return (
    <div className="flex gap-4 w-full">
      <TextField
        fullWidth
        id="outlined-basic"
        label="  Search Training"
        variant="outlined"
        size="small"
        InputProps={{
          className: "!rounded-full",
        }}
        className="!w-[80%]"
        onChange={(e) => setTrainingName(e.target.value)}
      />
      <Button className="!w-[20%]" variant="contained">
        Generate Report
      </Button>
    </div>
  );
};

export default MiniForm;
