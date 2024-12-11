import { Box, Button, Modal } from "@mui/material";
import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const ViewLoanDataNotificationModal = ({ handleClose, open, loanData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[100%] lg:!w-[60%] md:!w-[100%] shadow-md outline-none rounded-md"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: "20px",
          }}
        >
          <div>
            <h1 className="!text-xl">Loan Management</h1>
            <p className="text-xs text-gray-600">See your loan data here.</p>
          </div>
          <Button onClick={handleClose} sx={{ p: 1 }}>
            <ClearIcon color="black" />
          </Button>
        </div>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Loan Type
            </Typography>
            <Typography gutterBottom component="div">
              {loanData?.loanType?.loanName || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Loan Amount
            </Typography>
            <Typography gutterBottom component="div">
              {loanData?.loanAmount || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Rate Of Interest (%)
            </Typography>
            <Typography gutterBottom component="div">
              {loanData?.rateOfIntereset || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Loan Disbursement Date
            </Typography>
            <Typography gutterBottom component="div">
              {formatDate(loanData?.loanDisbursementDate) || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Loan Completed Date
            </Typography>
            <Typography gutterBottom component="div">
              {formatDate(loanData?.loanCompletedDate) || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              No Of EMI
            </Typography>
            <Typography gutterBottom component="div">
              {loanData?.noOfEmi || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Total Deduction
            </Typography>
            <Typography gutterBottom component="div">
              {loanData?.totalDeduction || ""}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h6" component="div">
              Total Deduction With Simple Interest
            </Typography>
            <Typography gutterBottom component="div">
              {loanData?.totalDeductionWithSi || ""}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewLoanDataNotificationModal;
