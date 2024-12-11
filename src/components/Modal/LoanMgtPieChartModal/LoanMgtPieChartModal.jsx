import React from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoanManagementPieChart from "../../../pages/LoanManagement/LoanManagementPieChart";

const LoanMgtPieChartModal = ({
  totalPaidAmount,
  totalPendingAmount,
  open,
  handleClose,
}) => {
  return (
    <>
      <Dialog
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "800px!important",
            height: "100%",
            maxHeight: "50vh!important",
          },
        }}
        open={open}
        onClose={handleClose}
        className="w-full"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex w-full justify-between py-4 items-center px-4">
          <div className=" flex gap-96 ">
            <h1 className="text-xl pl-2 font-semibold font-sans flex items-center">
              Here View About Your Loan Application{" "}
            </h1>
            <div>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  ml: "auto",
                  color: "gray",
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
          <div className=" px-60 mt-10">
            <LoanManagementPieChart
              totalPaidAmount={totalPaidAmount}
              totalPendingAmount={totalPendingAmount}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanMgtPieChartModal;
