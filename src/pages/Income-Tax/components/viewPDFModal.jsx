import React from "react";
import ReusableModal from "../../../components/Modal/component";
import useFunctions from "../hooks/useFunctions";

const ViewPDFModal = () => {
  const { pdf, setPdf } = useFunctions();
  return (
    <ReusableModal open={!!pdf} onClose={() => setPdf(null)} heading={"PDF"}>
      <div className="scrollt ">
        <object
          type="application/pdf"
          data={pdf}
          alt="none"
          aria-label="pdfSalary"
          className="min-h-[60vh] w-full "
        />
      </div>
    </ReusableModal>
  );
};

export default ViewPDFModal;
