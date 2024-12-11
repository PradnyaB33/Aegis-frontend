import React, { useContext, useState } from "react";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TestContext } from "../../State/Function/Main";
import { useQuery, useQueryClient } from "react-query";
import ViewDocumentModal from "./ViewDocumentModal";
import Button from "@mui/material/Button";
const LoanMgtApproval = ({ employee }) => {
  // to define the state , hook , import other function
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  let loanId = employee?._id;

  //for get loan data
  const { data: getEmployeeLoanInfo } = useQuery(
    ["empLoanInfo", loanId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/loans/${loanId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empLoanApplyRequest"] });
      }
    }
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  // to define the funcitn for approved the loan data
  const handleApproval = async (status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/accept/reject/loans/${loanId}`,
        {
          action: status === "ongoing" ? "ongoing" : "reject",
        },
        {
          headers: {
            Authorization: authToken,
          },
        },
      );

      console.log(response);

      // Invalidate the query to force refetch
      queryClient.invalidateQueries(["empLoanInfo", loanId]);
      // Display appropriate alert message based on action
      if (status === "ongoing") {
        handleAlert(
          true,
          "success",
          `Approved the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
        );
      } else {
        handleAlert(
          true,
          "error",
          `Rejected the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("Error adding salary data:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  // for view the loan data
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userUploadDocumnet, setUserUploadDocumnet] = useState(null);
  const handleViewModalOpen = () => {
    setViewModalOpen(true);
    setUserUploadDocumnet(getEmployeeLoanInfo);
  };
  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setUserUploadDocumnet(null);
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Card
          variant="outlined"
          sx={{ width: "100%" }}
        >
          <Box sx={{ px: 2 }}>
            <Typography gutterBottom variant="h4" component="div">
              {getEmployeeLoanInfo?.userId?.first_name || ""}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {getEmployeeLoanInfo?.userId?.first_name || ""} has raised a
              request for loan application
            </Typography>
          </Box>
          <Divider />
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
                {getEmployeeLoanInfo?.loanType?.loanName || ""}
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
                {getEmployeeLoanInfo?.loanAmount || ""}
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
                {getEmployeeLoanInfo?.rateOfIntereset || ""}
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
                {formatDate(getEmployeeLoanInfo?.loanDisbursementDate) || ""}
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
                {formatDate(getEmployeeLoanInfo?.loanCompletedDate) || ""}
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
                {getEmployeeLoanInfo?.noOfEmi || ""}
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
                {getEmployeeLoanInfo?.totalDeduction || ""}
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
                {getEmployeeLoanInfo?.totalDeductionWithSi || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Document
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewModalOpen}
                sx={{ textTransform: "none" }}
              >
                View
              </Button>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <div className="flex justify-center gap-10">
              {/* Accept button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("ongoing")}
              >
                Accept
              </button>
              {/* Reject button */}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("reject")}
              >
                Reject
              </button>
            </div>
          </Box>
        </Card>
        {/* for view */}
        <ViewDocumentModal
          handleClose={handleViewModalClose}
          open={viewModalOpen}
          userUploadDocumnet={userUploadDocumnet}
        />
      </div >
    </>
  );
};

export default LoanMgtApproval;
