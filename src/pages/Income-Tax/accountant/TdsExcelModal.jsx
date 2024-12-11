import React from "react";
import ReusableModal from "../../../components/Modal/component";

const TdsExcel = ({ open, handleClose }) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    years.push({
      label: `${startYear}-${endYear}`,
      value: `${startYear}-${endYear}`,
    });
  }

  return (
    <ReusableModal
      heading={"Generate TDS Report"}
      open={open}
      onClose={handleClose}
    ></ReusableModal>
  );
};

export default TdsExcel;
