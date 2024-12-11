import React, { useContext, useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";
import { useQueryClient } from "react-query";
import ViewDocumentModal from "./ViewDocumentModal";

const AdvanceSalaryApproval = ({ employee }) => {
  // state
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const advanceSalaryId = employee._id;


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  // for approve and reject
  const handleApprovalReject = async (status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/accept/reject/advance-salary/${advanceSalaryId}`,
        {
          action: status === "ongoing" ? "ongoing" : "reject",
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      queryClient.invalidateQueries(["advanceSalary", advanceSalaryId]);
      if (status === "ongoing") {
        handleAlert(
          true,
          "success",
          `Approved the request for loan application of ${employee?.userId?.first_name}`
        );
      } else {
        handleAlert(
          true,
          "error",
          `Rejected the request for loan application of ${employee?.userId?.first_name}`
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error adding salary data:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  // for view the document
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [document, setDocument] = useState(null);
  const handleViewModalOpen = (data) => {
    console.log("data", data);
    setViewModalOpen(true);
    setDocument(data);
  };
  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setDocument(null);
  };
  console.log(document);

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Card
          variant="outlined"
          sx={{ width: "100%" }}
        >
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h4" component="div">
              {employee?.userId?.first_name || ""}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {employee?.userId?.first_name || ""} has raised a request for
              advance salary.
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
                Starting Date
              </Typography>
              <Typography gutterBottom component="div">
                {formatDate(employee?.advanceSalaryStartingDate) || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                No Of Month
              </Typography>
              <Typography gutterBottom component="div">
                {employee?.noOfMonth || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Ending Date
              </Typography>
              <Typography gutterBottom component="div">
                {formatDate(employee?.advanceSalaryEndingDate) || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Total Salary
              </Typography>
              <Typography gutterBottom component="div">
                {" "}
                {employee?.totalSalary || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Advance Salary Amount Taken
              </Typography>
              <Typography gutterBottom component="div">
                {" "}
                {employee?.advancedSalaryAmounts || ""}
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
                onClick={() => handleViewModalOpen(employee)}
                sx={{ textTransform: "none" }}
              >
                View
              </Button>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <div className="flex justify-center gap-10">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApprovalReject("ongoing")}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApprovalReject("reject")}
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
          document={document}
        />
      </div>
    </>
  );
};

export default AdvanceSalaryApproval;
